const { app, BrowserWindow, Menu, ipcMain, screen } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { contentBounds } = require("./window-sizing");

let win;
let saveTimer;
let resizeAnimation;

const TRANSPARENT_BACKGROUND = "#00000000";

function cancelResizeAnimation() {
  if (!resizeAnimation) return;
  clearTimeout(resizeAnimation.timer);
  resizeAnimation.finish();
  resizeAnimation = null;
}

function resizeWindow(target, animate) {
  cancelResizeAnimation();
  const start = win.getBounds();
  if (!animate || (start.height === target.height && start.y === target.y)) {
    win.setBounds(target);
    return Promise.resolve();
  }
  return new Promise(resolve => {
    const animation = { finish: resolve, timer: null };
    resizeAnimation = animation;
    const started = performance.now();
    const duration = target.height > start.height ? 120 : 240;
    function frame() {
      if (!win || win.isDestroyed()) {
        cancelResizeAnimation();
        return;
      }
      const progress = Math.min(1, (performance.now() - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      win.setBounds({
        ...target,
        y: Math.round(start.y + (target.y - start.y) * eased),
        height: Math.round(start.height + (target.height - start.height) * eased)
      });
      if (progress < 1) animation.timer = setTimeout(frame, 16);
      else {
        resizeAnimation = null;
        resolve();
      }
    }
    frame();
  });
}

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
    ...saved
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
  win.on("will-resize", cancelResizeAnimation);
  win.on("will-move", cancelResizeAnimation);
  win.on("closed", cancelResizeAnimation);
}

ipcMain.handle("resize-to-content", (event, contentHeight, animate = false, anchor = "top-left") => {
  if (!win || win.isDestroyed() || !Number.isFinite(contentHeight)) return;
  const bounds = win.getBounds();
  const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });

  return resizeWindow(contentBounds(bounds, display.workArea, contentHeight, anchor), Boolean(animate));
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
app.on("activate", () => {
  if (win && !win.isDestroyed()) {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
});
