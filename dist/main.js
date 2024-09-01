"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
// Determine platform and environment
const isMac = process.platform === "darwin";
const isDevMode = process.env.NODE_ENV !== "production";
// Create the main application window
const createMainWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        title: "Image Resizer App",
        width: isDevMode ? 1000 : 500,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path_1.default.join(__dirname, 'renderer', 'js', "preload.js"),
        },
    });
    if (isDevMode) {
        mainWindow.webContents.openDevTools();
    }
    console.log("Current directory:", __dirname);
    mainWindow.loadFile(path_1.default.join(__dirname, "renderer", "index.html"));
    // Set the menu for the main window
    const mainMenu = electron_1.Menu.buildFromTemplate(mainMenuTemplate);
    electron_1.Menu.setApplicationMenu(mainMenu);
};
// Create the About window
const createAboutWindow = () => {
    const aboutWindow = new electron_1.BrowserWindow({
        title: "About App",
        width: 600,
        height: 600,
        resizable: false,
        modal: true,
    });
    aboutWindow.loadFile(path_1.default.join(__dirname, "renderer", "about.html"));
    // No menu for the About window
};
// Menu template for the main window
const mainMenuTemplate = [
    ...(isMac
        ? [
            {
                label: electron_1.app.name,
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
                click: () => electron_1.app.quit(),
            },
        ],
    },
];
// App is ready
electron_1.app.whenReady().then(() => {
    createMainWindow();
    electron_1.app.on("activate", () => {
        const openWindowsCount = electron_1.BrowserWindow.getAllWindows().length;
        if (openWindowsCount === 0) {
            createMainWindow();
        }
    });
});
//respond to ipcRenderer
electron_1.ipcMain.on("resize-image", (e, options) => {
    console.log("options", options);
});
// Handle all windows closed event
electron_1.app.on("window-all-closed", () => {
    if (!isMac) {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map