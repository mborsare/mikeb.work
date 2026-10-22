const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function harness(sourceOptions = {}, targetOptions = {}) {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const helpers = html.slice(html.indexOf("function formatTime"), html.indexOf("function addTimer"));
  const start = html.indexOf("function closeMergeDialog");
  const mergeCode = html.slice(start, html.indexOf('    document.addEventListener("keydown"', start));
  const handlers = new Map();
  const intervals = new Map();
  const saves = [];
  const readings = [];
  const undoOffers = [];
  let now = 1000;
  function card(options) {
    const state = { label: "", seconds: 0, running: false, pauses: 0, ...options };
    const card = { isConnected: true, state };
    card.timerState = {
      currentSeconds: () => state.seconds,
      isRunning: () => state.running,
      snapshot: timestamp => {
        readings.push(timestamp);
        return { label: state.label, remainingSeconds: state.seconds };
      },
      pause: () => { state.running = false; state.pauses++; },
      setMergedSeconds: (seconds, shouldRun, label) => {
        state.seconds = seconds;
        state.running = shouldRun && seconds > 0;
        state.label = label;
      },
      destroy: () => { card.isConnected = false; }
    };
    return card;
  }
  const source = card({ label: "Writing", seconds: 1800, running: true, ...sourceOptions });
  const target = card({ label: "Reading", seconds: 3600, running: true, ...targetOptions });
  const dialog = {
    hidden: true,
    querySelector: () => ({ focus() {} }),
    addEventListener: (name, callback) => handlers.set(name, callback)
  };
  const message = { textContent: "" };
  const context = vm.createContext({
    Date: { now: () => now },
    mergeRequest: null,
    mergeRefreshTimer: null,
    showSeconds: true,
    mergeDialog: dialog,
    mergeMessage: message,
    startMergeUndo: (...args) => undoOffers.push(args),
    setInterval: callback => { intervals.set(1, callback); return 1; },
    clearInterval: id => intervals.delete(id),
    updateDeleteButtons() {},
    persistTimerState() {
      saves.push([source, target].filter(card => card.isConnected).map(card => ({ ...card.state })));
    }
  });
  vm.runInContext(helpers + "\n" + mergeCode, context);
  return {
    source, target, dialog, message, intervals, saves, readings, undoOffers,
    open: () => context.requestMerge(source, target),
    advance: () => { now += 63000; intervals.forEach(callback => callback()); },
    confirm: action => handlers.get("click")({ target: { dataset: { mergeAction: action } } })
  };
}

test("merge adds exact remaining seconds and both trimmed labels", () => {
  const h = harness({ label: " Writing ", seconds: 91 }, { label: " Reading ", seconds: 3599 });
  h.open();
  h.confirm("add");
  assert.equal(h.target.state.seconds, 3690);
  assert.equal(h.target.state.label, "Reading + Writing");
  assert.equal(h.target.state.running, true);
  assert.equal(h.source.isConnected, false);
  assert.equal(h.source.state.pauses, 1);
  assert.equal(h.intervals.size, 0);
  assert.equal(h.readings[0], h.readings[1]);
  assert.equal(h.saves.at(-1).length, 1);
  assert.equal(h.saves.at(-1)[0].label, "Reading + Writing");
  assert.equal(h.undoOffers.length, 1);
  assert.equal(h.undoOffers[0][2].remainingSeconds, 91);
  assert.equal(h.undoOffers[0][3].remainingSeconds, 3599);
});

test("confirmation uses live values, and the dialog follows running timers", () => {
  const h = harness();
  h.open();
  h.source.state.seconds = 1737;
  h.target.state.seconds = 3537;
  h.advance();
  assert.match(h.message.textContent, /0:28:57 into 0:58:57/);
  h.confirm("add");
  assert.equal(h.target.state.seconds, 5274);
  assert.equal(h.readings[0], 64000);
  assert.equal(h.readings[1], 64000);
});

test("subtract removes the source from the target and preserves both labels", () => {
  const h = harness({ running: false });
  h.open();
  h.target.state.seconds = 3537;
  h.advance();
  h.confirm("subtract");
  assert.equal(h.target.state.seconds, 1737);
  assert.equal(h.target.state.label, "Reading − Writing");
});

test("subtract clamps to zero and doesn't restart a completed timer", () => {
  const h = harness({ seconds: 3600 }, { seconds: 30 });
  h.open();
  h.confirm("subtract");
  assert.equal(h.target.state.seconds, 0);
  assert.equal(h.target.state.running, false);
});

test("merging into a paused timer keeps it paused, even if the source was running", () => {
  const h = harness({}, { running: false });
  h.open();
  h.confirm("add");
  assert.equal(h.target.state.seconds, 5400);
  assert.equal(h.target.state.running, false);
});

test("blank labels don't introduce empty separators", () => {
  for (const [source, target, expected] of [["", "Reading", "Reading"], ["Writing", " ", "Writing"], [" ", "", ""]]) {
    const h = harness({ label: source }, { label: target });
    h.open();
    h.confirm("add");
    assert.equal(h.target.state.label, expected);
  }
});

test("cancel and disconnected cards leave values and labels untouched", () => {
  for (const action of ["cancel", "disconnected"]) {
    const h = harness();
    h.open();
    if (action === "disconnected") h.source.isConnected = false;
    h.confirm(action === "cancel" ? "cancel" : "add");
    assert.equal(h.target.state.seconds, 3600);
    assert.equal(h.target.state.label, "Reading");
    assert.equal(h.source.state.pauses, 0);
    assert.deepEqual(h.saves, []);
    assert.equal(h.intervals.size, 0);
  }
});
