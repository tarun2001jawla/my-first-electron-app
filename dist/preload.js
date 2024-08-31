const { contextBridge } = require("electron");
const os = require("os");
const path = require("path");

// Expose some useful system information to the renderer process
contextBridge.exposeInMainWorld("os", {
  homedir: () => {
    return os.homedir();
  },
});

contextBridge.exposeInMainWorld("path", {
  join: (...args) => {
    return path.join(...args);
  },
});


