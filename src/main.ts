import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import path from "path";
import os from "os";
import fs from "fs";
import resizeImg from 'resize-img';

// Define an interface for the options passed to the resizeImage function
interface ResizeImageOptions {
  width: number;
  height: number;
  imagePath: string;
  dest: string;
}

// Determine the platform and environment mode
const isMac: boolean = process.platform === "darwin";
const isDevMode: boolean = process.env.NODE_ENV !== "production";

// I am creating the main application window
const createMainWindow = (): void => {
  const mainWindow = new BrowserWindow({
    title: "Image Resizer App",
    width: isDevMode ? 1000 : 500,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "renderer", "js", "preload.js"),
    },
  });

  if (isDevMode) {
    mainWindow.webContents.openDevTools();
  }

  console.log("Current directory:", __dirname);
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

// I am creating the About window
const createAboutWindow = (): void => {
  const aboutWindow = new BrowserWindow({
    title: "About App",
    width: 600,
    height: 600,
    resizable: false,
    modal: true,
  });

  aboutWindow.loadFile(path.join(__dirname, "renderer", "about.html"));
};

// I am defining the menu template for the main window
const mainMenuTemplate: MenuItemConstructorOptions[] = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: () => createAboutWindow(),
            },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [
      {
        label: "About",
        click: () => createAboutWindow(),
      },
      { type: "separator" },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+Q",
        click: () => app.quit(),
      },
    ],
  },
];

// I am initializing the app when it's ready
app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    const openWindowsCount = BrowserWindow.getAllWindows().length;
    if (openWindowsCount === 0) {
      createMainWindow();
    }
  });
});

// I am responding to IPC messages from the renderer process
ipcMain.on("resize-image", (e, options: ResizeImageOptions) => {
  options.dest = path.join(os.homedir(), "imageResizer");
  resizeImage(options);
});

// I am defining the function to resize the image
const resizeImage = async ({ width, height, imagePath, dest }: ResizeImageOptions): Promise<void> => {
  try {
    const newPath = await resizeImg(fs.readFileSync(imagePath), {
      width, 
      height, 
    });
    const fileName = path.basename(imagePath);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    fs.writeFileSync(path.join(dest, fileName), newPath);
    shell.openPath(dest);
  } catch (e) {
    console.log(e);
  }
};

// I am handling the event when all windows are closed
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
