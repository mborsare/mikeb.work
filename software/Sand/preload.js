const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("timerWindow", {
  getClockHour12: () => ipcRenderer.invoke("get-clock-hour12"),
  resizeToContent: (height, animate = false, anchor = "top-left") => ipcRenderer.invoke("resize-to-content", height, animate, anchor),
  loadTimerState: () => ipcRenderer.invoke("load-timer-state"),
  saveTimerState: state => ipcRenderer.send("save-timer-state", state)
});
