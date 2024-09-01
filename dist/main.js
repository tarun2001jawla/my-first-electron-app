"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const resize_img_1 = __importDefault(require("resize-img"));
// Determine the platform and environment mode
const isMac = process.platform === "darwin";
const isDevMode = process.env.NODE_ENV !== "production";
// I am creating the main application window
const createMainWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        title: "Image Resizer App",
        width: isDevMode ? 1000 : 500,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path_1.default.join(__dirname, "renderer", "js", "preload.js"),
        },
    });
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }
    console.log("Current directory:", __dirname);
    mainWindow.loadFile(path_1.default.join(__dirname, "renderer", "index.html"));
    const mainMenu = electron_1.Menu.buildFromTemplate(mainMenuTemplate);
    electron_1.Menu.setApplicationMenu(mainMenu);
};
// I am creating the About window
const createAboutWindow = () => {
    const aboutWindow = new electron_1.BrowserWindow({
        title: "About App",
        width: 600,
        height: 600,
        resizable: false,
        modal: true,
    });
    aboutWindow.loadFile(path_1.default.join(__dirname, "renderer", "about.html"));
};
// I am defining the menu template for the main window
const mainMenuTemplate = [
    ...(isMac
        ? [
            {
                label: electron_1.app.name,
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
                click: () => electron_1.app.quit(),
            },
        ],
    },
];
// I am initializing the app when it's ready
electron_1.app.whenReady().then(() => {
    createMainWindow();
    electron_1.app.on("activate", () => {
        const openWindowsCount = electron_1.BrowserWindow.getAllWindows().length;
        if (openWindowsCount === 0) {
            createMainWindow();
        }
    });
});
// I am responding to IPC messages from the renderer process
electron_1.ipcMain.on("resize-image", (e, options) => {
    options.dest = path_1.default.join(os_1.default.homedir(), "imageResizer");
    resizeImage(options);
});
// I am defining the function to resize the image
const resizeImage = (_a) => __awaiter(void 0, [_a], void 0, function* ({ width, height, imagePath, dest }) {
    try {
        const newPath = yield (0, resize_img_1.default)(fs_1.default.readFileSync(imagePath), {
            width,
            height,
        });
        const fileName = path_1.default.basename(imagePath);
        if (!fs_1.default.existsSync(dest)) {
            fs_1.default.mkdirSync(dest);
        }
        fs_1.default.writeFileSync(path_1.default.join(dest, fileName), newPath);
        electron_1.shell.openPath(dest);
    }
    catch (e) {
        console.log(e);
    }
});
// I am handling the event when all windows are closed
electron_1.app.on("window-all-closed", () => {
    if (!isMac) {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map