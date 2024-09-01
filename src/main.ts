import {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  MenuItemConstructorOptions,
  shell
} from "electron";
import path, { join } from "path";
import os from "os";
import fs from "fs";
import resizeImg from 'resize-img'

// Determine platform and environment
const isMac: boolean = process.platform === "darwin";
const isDevMode: boolean = process.env.NODE_ENV !== "production";

// Create the main application window
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

  // Set the menu for the main window
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

// Create the About window
const createAboutWindow = (): void => {
  const aboutWindow = new BrowserWindow({
    title: "About App",
    width: 600,
    height: 600,
    resizable: false,
    modal: true,
  });

  aboutWindow.loadFile(path.join(__dirname, "renderer", "about.html"));

  // No menu for the About window
};

// Menu template for the main window
const mainMenuTemplate: MenuItemConstructorOptions[] = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: () => createAboutWindow(), // Open About window
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
        click: () => createAboutWindow(), // Open About window
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

// App is ready
app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    const openWindowsCount = BrowserWindow.getAllWindows().length;
    if (openWindowsCount === 0) {
      createMainWindow();
    }
  });
});
//respond to ipcRenderer
ipcMain.on("resize-image", (e, options) => {
  options.dest = path.join(os.homedir(), "imageResizer");
  resizeImage();
});

//Resize the image
const resizeImage = async ({width ,height,imagePath,dest })=>{
  try {
  const newPath = await resizeImg(fs.readFileSync(imagePath), {
    width : +width,
    height : +  height,
  });
  const fileName = path.basename(imagePath);

  //crrate dest folde if doesnt exists 

  if(!fs.existsSync(dest)){
    fs.mkdirSync(dest)

  }

  //write file to dest folder

  fs.writeFileSync(path.join(dest, fileName), newPath)

  //open the dest folder so that we can see image 

  } catch(e){
    console.log(e)
  }
}
// Handle all windows closed event
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
