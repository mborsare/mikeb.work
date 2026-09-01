const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class FixedDate extends Date {
  constructor(...args) {
    super(...(args.length ? args : [2026, 7, 24, 12, 0, 0, 0]));
  }

  static now() {
    return new FixedDate().getTime();
  }
}

function loadTimerInputHelpers() {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const start = html.indexOf("function formatTime");
  const end = html.indexOf("function addTimer");

  assert.notEqual(start, -1, "formatting and parsing functions should exist");
  assert.notEqual(end, -1, "timer setup function should exist");

  const context = vm.createContext({ Date: FixedDate });
  vm.runInContext(`${html.slice(start, end)}; this.parseCommand = parseCommand; this.isCountUpCommand = isCountUpCommand;`, context);
  return context;
}

const { parseCommand, isCountUpCommand } = loadTimerInputHelpers();

test("recognizes + as a count-up timer command", () => {
  assert.equal(isCountUpCommand("+"), true);
  assert.equal(isCountUpCommand(" + "), true);
  assert.equal(isCountUpCommand("++"), false);
});

test("keeps existing duration formats working", () => {
  const examples = [
    ["30", 1800],
    ["90m", 5400],
    ["1.5h", 5400],
    ["45s", 45],
    [".8", 8],
    ["1:30", 5400],
    ["1:30:00", 5400]
  ];

  for (const [input, expected] of examples) {
    assert.equal(parseCommand(input), expected, input);
  }
});

test("keeps existing clock target formats working", () => {
  assert.equal(parseCommand("@14:00"), 7200);
  assert.equal(parseCommand("@2:00pm"), 7200);
  assert.equal(parseCommand("2:00pm"), 7200);
  assert.equal(parseCommand("@10:45"), 81900);
});

test("subtracts minutes from @ clock targets", () => {
  assert.equal(parseCommand("@14:00 - 15"), 6300);
  assert.equal(parseCommand("@14:00-15m"), 6300);
  assert.equal(parseCommand("@2:00pm - 15"), 6300);
  assert.equal(parseCommand("@00:10 - 15"), 42900);
});

test("accepts clock-target offset variants", () => {
  const examples = [
    "@16:00-15",
    "@16:00 - 15",
    "@16:00-15m",
    "@16:00 - 15 min",
    "@4:00pm-15",
    "@4:00pm - 15 minutes"
  ];

  for (const input of examples) {
    assert.equal(parseCommand(input), 13500, input);
  }
});

test("rejects malformed clock target subtraction", () => {
  assert.equal(parseCommand("@14:00 - nope"), null);
  assert.equal(parseCommand("@14:00 - 1.5"), null);
  assert.equal(parseCommand("@25:00 - 15"), null);
});
