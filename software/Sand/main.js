const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

let win;
let saveTimer;

const MIN_WIDTH = 420;
const SCREEN_EDGE_BUFFER = 24;
const TRANSPARENT_BACKGROUND = "#00000000";

function stateFile() {
  return path.join(app.getPath("userData"), "window-state.json");
}

function timerStateFile() {
  return path.join(app.getPath("userData"), "timer-state.json");
}

function loadState() {
  let saved = {};
  try {
    saved = JSON.parse(fs.readFileSync(stateFile(), "utf8"));
  } catch { }
  return {
    width: 760,
    height: 180,
    ...saved,
    width: Math.max(saved.width || 760, MIN_WIDTH)
  };
}

function saveState() {
  if (!win || win.isDestroyed()) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      fs.mkdirSync(path.dirname(stateFile()), { recursive: true });
      fs.writeFileSync(
        stateFile(),
        JSON.stringify(win.getBounds(), null, 2)
      );
    } catch { }
  }, 120);
}

function createWindow() {
  win = new BrowserWindow({
    ...loadState(),
    minWidth: MIN_WIDTH,
    frame: false,
    transparent: true,
    backgroundColor: TRANSPARENT_BACKGROUND,
    hasShadow: true,
    resizable: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  win.setAlwaysOnTop(true, "floating");
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile("index.html");
  win.once("ready-to-show", () => win.show());
  win.on("move", saveState);
  win.on("resize", saveState);
  win.on("close", saveState);
}

ipcMain.on("resize-to-content", (event, contentHeight, animate = false, anchor = "top-left") => {
  if (!win || win.isDestroyed()) return;
  const bounds = win.getBounds();
  const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });

  const maxHeight = display.workArea.height - SCREEN_EDGE_BUFFER;
  const nextHeight = Math.min(Math.round(contentHeight), maxHeight);

  if (nextHeight === bounds.height) return;
  const nextY = anchor === "bottom-left"
    ? bounds.y + bounds.height - nextHeight
    : bounds.y;
  // Electron animates bounds changes on macOS when requested. This keeps the
  // compact-to-full transition from feeling like the window has popped open.
  win.setBounds({ x: bounds.x, y: nextY, width: bounds.width, height: nextHeight }, Boolean(animate));
});

ipcMain.handle("load-timer-state", () => {
  try {
    return JSON.parse(fs.readFileSync(timerStateFile(), "utf8"));
  } catch {
    return null;
  }
});

ipcMain.on("save-timer-state", (event, state) => {
  try {
    if (!state) {
      fs.unlinkSync(timerStateFile());
      return;
    }

    fs.mkdirSync(path.dirname(timerStateFile()), { recursive: true });
    fs.writeFileSync(timerStateFile(), JSON.stringify(state));
  } catch { }
});

app.whenReady().then(() => {
  app.setName("Sand");
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: "Sand",
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    }
  ]));
  createWindow();
});

app.on("window-all-closed", () => app.quit());
