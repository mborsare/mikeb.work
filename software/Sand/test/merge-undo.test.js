const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

function harness() {
  let now = 1000;
  let sequence = 0;
  const intervals = new Map();
  const restored = [];
  const banner = { hidden: true, contains: () => false };
  const countdown = {};
  const context = vm.createContext({
    Date: { now: () => now },
    pendingMergeUndo: null, mergeUndoTimer: null,
    mergeUndoBanner: banner, mergeUndoCountdown: countdown,
    mergeUndoButton: { addEventListener() {} },
    mergeUndoDismiss: { addEventListener() {} },
    document: { activeElement: null }, addButton: { focus() {} },
    tinyMode: false,
    timerList: { insertBefore(source, before) { source.isConnected = true; restored.push(["insert", before]); } },
    setInputsForTinyMode() {}, updateDeleteButtons() {}, persistTimerState() {},
    setInterval(callback) { intervals.set(++sequence, callback); return sequence; },
    clearInterval(id) { intervals.delete(id); }
  });
  const start = html.indexOf("    function dismissMergeUndo()");
  vm.runInContext(html.slice(start, html.indexOf("    function closeMergeDialog()", start)), context);
  const card = name => ({
    isConnected: true,
    querySelector: () => ({ focus() {} }),
    timerState: {
      pause() { restored.push(["pause", name]); },
      restore(state) { restored.push([name, state]); }
    }
  });
  const source = card("source");
  source.isConnected = false;
  const target = card("target");
  const next = card("next");
  const sourceState = { label: "Writing", running: true, deadline: 91000, remainingSeconds: 90 };
  const targetState = { label: "Reading", running: false, remainingSeconds: 60 };
  return {
    context, source, target, next, sourceState, targetState, banner, countdown, intervals, restored,
    offer() { context.startMergeUndo(source, target, sourceState, targetState, next); },
    advance(ms) { now += ms; [...intervals.values()].forEach(callback => callback()); }
  };
}

test("merge undo has a live 30-second window and restores original states, deadlines, and order", () => {
  const h = harness();
  h.offer();
  assert.equal(h.banner.hidden, false);
  assert.equal(h.countdown.textContent, "30s");
  h.advance(10000);
  assert.equal(h.countdown.textContent, "20s");
  h.context.undoMerge();
  assert.equal(h.banner.hidden, true);
  assert.equal(h.intervals.size, 0);
  assert.equal(h.source.isConnected, true);
  assert.deepEqual(h.restored, [["pause", "target"], ["target", h.targetState], ["insert", h.next], ["source", h.sourceState]]);
});

test("undo expires after 30 seconds and cannot restore timers afterward", () => {
  const h = harness();
  h.offer();
  h.advance(30000);
  h.context.undoMerge();
  assert.equal(h.banner.hidden, true);
  assert.equal(h.intervals.size, 0);
  assert.deepEqual(h.restored, []);
});

test("dismissal or deleting the destination clears the undo offer", () => {
  for (const action of ["dismiss", "delete"]) {
    const h = harness();
    h.offer();
    if (action === "dismiss") h.context.dismissMergeUndo();
    else { h.target.isConnected = false; h.advance(250); }
    h.context.undoMerge();
    assert.equal(h.banner.hidden, true);
    assert.equal(h.intervals.size, 0);
    assert.deepEqual(h.restored, []);
  }
});

test("a new combination replaces the previous undo offer", () => {
  const h = harness();
  h.offer();
  h.advance(5000);
  h.offer();
  assert.equal(h.countdown.textContent, "30s");
  assert.equal(h.intervals.size, 1);
});
