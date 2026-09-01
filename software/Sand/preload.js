const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("timerWindow", {
  resizeToContent: (height, animate = false, anchor = "top-left") => ipcRenderer.send("resize-to-content", height, animate, anchor),
  loadTimerState: () => ipcRenderer.invoke("load-timer-state"),
  saveTimerState: state => ipcRenderer.send("save-timer-state", state)
});
