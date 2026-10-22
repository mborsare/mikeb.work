const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const END = new Date(2026, 9, 21, 16, 0).getTime();

function timerHarness(options = {}) {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const section = (start, end) => html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start)));
  const helpers = section("function formatTime", "function addTimer");
  const clock = section("function updateInputAssist", "function startFromInput");
  const state = section("function currentSeconds", "function destroy");
  const action = section('pauseButton.addEventListener("click"', 'removeButton.addEventListener("mousedown"');
  let now = END - 10000;
  const timeouts = new Map();
  const classes = new Set(["running"]);
  const actions = new Map();
  let nextId = 0;
  class Clock extends Date {
    static now() { return now; }
  }
  const button = {
    setAttribute(name, value) { this[name] = value; },
    addEventListener: (name, callback) => actions.set(name, callback)
  };
  const context = vm.createContext({
    Date: Clock,
    remainingSeconds: 10,
    initialSeconds: 10,
    endedAt: null,
    running: true,
    countingUp: false,
    hasStarted: true,
    deadline: END,
    timerId: null,
    disposableIfEmpty: false,
    showSeconds: true,
    tinyMode: false,
    document: { title: "Sand" },
    timer: {
      classList: {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name)
      },
      style: { setProperty() {} }
    },
    label: { value: "Focus" },
    command: { value: "", blur() {} },
    tinySummary: {},
    intentOptions: {},
    commitHint: {},
    runningHint: {},
    inputRender: {},
    runningRender: {},
    pauseButton: button,
    clockTargetLabel: () => null,
    syncAddButton() {},
    persistTimerState() {},
    updateDeleteButtons() {},
    setTimeout: callback => { timeouts.set(++nextId, callback); return nextId; },
    clearTimeout: id => timeouts.delete(id),
    ...options
  });
  vm.runInContext(helpers + "\n" + clock + "\n" + state + "\n" + action, context);
  return {
    context, classes, timeouts,
    at(timestamp) {
      now = timestamp;
      if (timeouts.size) {
        const [id, callback] = timeouts.entries().next().value;
        timeouts.delete(id);
        callback();
      } else context.tick();
    },
    click: () => actions.get("click")()
  };
}

test("a countdown passes through zero into overtime with its real end time and reset action", () => {
  const h = timerHarness();
  h.at(END - 1);
  assert.equal(h.context.remainingSeconds, 1);
  assert.equal(h.context.pauseButton.textContent, "pause");
  h.at(END);
  assert.equal(h.context.remainingSeconds, 0);
  assert.equal(h.context.countingUp, true);
  assert.equal(h.context.running, true);
  assert.equal(h.context.endedAt, END);
  assert.equal(h.context.runningRender.textContent, `ended at ${h.context.formatClockTime(END)}`);
  assert.equal(h.context.pauseButton.textContent, "reset");
  assert.equal(h.context.pauseButton.hidden, false);
  assert.ok(h.classes.has("counting-up"));
  h.at(END + 9500);
  assert.equal(h.context.remainingSeconds, 9);
  assert.equal(h.context.endedAt, END);
  assert.equal(h.context.command.value, "0:00:09");
  assert.equal(h.timeouts.size, 1);
});

test("a delayed tick measures overtime from the deadline, including time asleep", () => {
  const h = timerHarness();
  h.at(END + 65000);
  assert.equal(h.context.remainingSeconds, 65);
  assert.equal(h.context.endedAt, END);
  assert.equal(h.context.running, true);
});

test("reset restores the original countdown and label, then resume starts a fresh countdown", () => {
  const h = timerHarness();
  h.at(END + 65000);
  h.click();
  assert.equal(h.context.remainingSeconds, 10);
  assert.equal(h.context.label.value, "Focus");
  assert.equal(h.context.countingUp, false);
  assert.equal(h.context.endedAt, null);
  assert.equal(h.context.running, false);
  assert.equal(h.context.pauseButton.textContent, "resume");
  assert.equal(h.context.runningRender.textContent, "paused");
  assert.equal(h.timeouts.size, 0);
  h.click();
  assert.equal(h.context.deadline, END + 75000);
  h.at(END + 75000);
  assert.equal(h.context.endedAt, END + 75000);
  assert.equal(h.context.remainingSeconds, 0);
});

test("restoring a countdown that ended while closed counts from its original deadline", () => {
  const h = timerHarness();
  h.at(END + 187000);
  h.context.restore({
    label: "Restored", remainingSeconds: 45, initialSeconds: 120,
    running: true, countingUp: false, deadline: END
  });
  const saved = h.context.snapshot();
  assert.equal(saved.remainingSeconds, 187);
  assert.equal(saved.countingUp, true);
  assert.equal(saved.endedAt, END);
  assert.equal(saved.deadline, END);
  assert.equal(saved.initialSeconds, 120);
  h.click();
  assert.equal(h.context.remainingSeconds, 120);
  assert.equal(h.context.label.value, "Restored");
});

test("restoring an already overrun timer retains the ended-at byline", () => {
  const h = timerHarness();
  h.at(END + 90000);
  h.context.restore({
    label: "Overrun", remainingSeconds: 5, initialSeconds: 60,
    running: true, countingUp: true, endedAt: END, deadline: END
  });
  assert.equal(h.context.remainingSeconds, 90);
  assert.equal(h.context.runningRender.textContent, `ended at ${h.context.formatClockTime(END)}`);
  assert.equal(h.context.pauseButton.textContent, "reset");
});

test("an explicit count-up timer retains pause/resume and started-at behavior", () => {
  const h = timerHarness({ countingUp: true, deadline: END - 20000 });
  h.at(END);
  assert.equal(h.context.remainingSeconds, 20);
  assert.equal(h.context.endedAt, null);
  assert.match(h.context.runningRender.textContent, /^started at /);
  assert.equal(h.context.pauseButton.textContent, "pause");
});

test("paused countdowns stay paused instead of entering overtime", () => {
  const h = timerHarness({ running: false, remainingSeconds: 3 });
  assert.equal(h.context.currentSeconds(END + 60000), 3);
  assert.equal(h.context.countingUp, false);
  assert.equal(h.context.endedAt, null);
});

test("a merged overtime card becomes a fresh countdown with its combined label", () => {
  const h = timerHarness();
  h.at(END + 90000);
  h.context.setMergedSeconds(300, true, "Focus + Read");
  assert.equal(h.context.countingUp, false);
  assert.equal(h.context.endedAt, null);
  assert.equal(h.context.remainingSeconds, 300);
  assert.equal(h.context.initialSeconds, 300);
  assert.equal(h.context.label.value, "Focus + Read");
  assert.equal(h.context.pauseButton.textContent, "pause");
});
