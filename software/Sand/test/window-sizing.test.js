const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const { contentBounds } = require("../window-sizing");

const area = { x: 0, y: 24, width: 1440, height: 876 };

test("tiny mode shrinks and expands around the same bottom edge", () => {
  const full = { x: 100, y: 400, width: 760, height: 300 };
  const tiny = contentBounds(full, area, 48, "bottom-left");
  assert.deepEqual(tiny, { x: 100, y: 652, width: 760, height: 48 });
  assert.deepEqual(contentBounds(tiny, area, 300, "bottom-left"), full);
});

test("expansion fits on screen, including a display above the primary one", () => {
  const bounds = { x: 100, y: 80, width: 760, height: 48 };
  assert.deepEqual(contentBounds(bounds, area, 2000, "bottom-left"), {
    x: 100, y: 36, width: 760, height: 852
  });
  const upper = { ...area, y: -900 };
  const target = contentBounds({ ...bounds, y: -880 }, upper, 300, "bottom-left");
  assert.equal(target.y, -888);
  assert.equal(target.height, 300);
});

function animationHarness() {
  let now = 0;
  let nextId = 0;
  const timers = new Map();
  const frames = [];
  let bounds = { x: 100, y: 400, width: 760, height: 300 };
  const window = {
    getBounds: () => ({ ...bounds }),
    isDestroyed: () => false,
    setBounds: next => { bounds = { ...next }; frames.push(bounds); }
  };
  const electron = {
    app: { whenReady: () => ({ then() {} }), on() {} },
    ipcMain: { handle() {}, on() {} }
  };
  const context = vm.createContext({
    testWindow: window,
    require: name => name === "electron" ? electron
      : name === "./window-sizing" ? { contentBounds } : require(name),
    performance: { now: () => now },
    setTimeout: callback => { timers.set(++nextId, callback); return nextId; },
    clearTimeout: id => timers.delete(id)
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "main.js"), "utf8"), context);
  vm.runInContext("win = testWindow", context);
  return {
    frames,
    resize: vm.runInContext("resizeWindow", context),
    cancel: vm.runInContext("cancelResizeAnimation", context),
    step() {
      now += 16;
      const callbacks = [...timers.values()];
      timers.clear();
      callbacks.forEach(callback => callback());
    },
    drain() { while (timers.size) this.step(); }
  };
}

test("animated resize keeps a stable bottom edge without reversing or overshooting", async () => {
  const h = animationHarness();
  const completed = h.resize({ x: 100, y: 652, width: 760, height: 48 }, true);
  h.drain();
  await completed;
  assert.ok(h.frames.length > 5);
  h.frames.forEach((frame, i) => {
    assert.equal(frame.y + frame.height, 700);
    assert.ok(frame.height >= 48 && frame.height <= 300);
    if (i) assert.ok(frame.height <= h.frames[i - 1].height);
  });
  assert.equal(h.frames.at(-1).height, 48);
});

test("interrupting a resize continues from the current size and settles both requests", async () => {
  const h = animationHarness();
  const first = h.resize({ x: 100, y: 652, width: 760, height: 48 }, true);
  h.step();
  h.step();
  const current = h.frames.at(-1);
  const second = h.resize({ x: 100, y: 400, width: 760, height: 300 }, true);
  assert.deepEqual(h.frames.at(-1), current);
  h.drain();
  await Promise.all([first, second]);
  assert.equal(h.frames.at(-1).height, 300);
  const third = h.resize({ x: 100, y: 652, width: 760, height: 48 }, true);
  h.cancel();
  const count = h.frames.length;
  h.drain();
  await third;
  assert.equal(h.frames.length, count);
});
