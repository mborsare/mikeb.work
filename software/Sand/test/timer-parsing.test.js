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
  vm.runInContext(`${html.slice(start, end)}; this.formatTime = formatTime; this.parseCommand = parseCommand; this.isCountUpCommand = isCountUpCommand;`, context);
  return context;
}

const { formatTime, parseCommand, isCountUpCommand } = loadTimerInputHelpers();

test("can omit seconds from timer displays", () => {
  assert.equal(formatTime(3723, false), "1:02");
  assert.equal(formatTime(3723), "1:02:03");
});

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

test("in followed by a number starts a duration in minutes", () => {
  for (const [input, expected] of [
    ["in15", 900],
    ["in 15", 900],
    [" IN 15 ", 900],
    ["in 5", 300],
    ["in 1.5", 90],
    ["in1600", 96000]
  ]) {
    assert.equal(parseCommand(input), expected, input);
    assert.equal(isCountUpCommand(input), false, input);
  }
  for (const input of ["in", "in n", "in -15", "in 15:00", "in Infinity", "in 999999999999999999"]) {
    assert.equal(parseCommand(input), null, input);
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

test("treats compact and colon-separated two-digit hours as clock targets", () => {
  for (const [compact, colon, expected] of [
    ["1600", "16:00", 14400],
    ["0930", "09:30", 77400],
    ["0000", "00:00", 43200],
    ["2359", "23:59", 43140]
  ]) {
    for (const input of [compact, colon, `@${compact}`, `@${colon}`]) {
      assert.equal(parseCommand(input), expected, input);
    }
  }
  assert.equal(parseCommand("1600 - 15"), 13500);
  assert.equal(parseCommand("16:00 - 15"), 13500);
  assert.equal(parseCommand("@1600 - 15"), 13500);
  assert.equal(parseCommand("1600m"), 96000);
  for (const input of ["2400", "24:00", "1660", "16:60"]) {
    assert.equal(parseCommand(input), null, input);
  }
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
