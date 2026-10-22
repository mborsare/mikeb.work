const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

test("Tab follows label, timer, Add, then toolbar right to left; Shift-Tab reverses it", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const start = html.lastIndexOf('    document.addEventListener("keydown"', html.indexOf('if (event.key !== "Tab"'));
  const end = html.indexOf("    function clearDropHints()", start);
  const elements = new Map();
  const document = { activeElement: null, addEventListener(type, callback) { this.onKey = callback; } };
  function element(name, visible = true) {
    const item = { name, tabIndex: 0, getClientRects: () => visible ? [{}] : [], focus() { document.activeElement = item; } };
    elements.set(name, item);
    return item;
  }
  const label = element("label"), command = element("timer"), remove = element("remove");
  const card = { querySelectorAll: selector => selector.includes("timer-label") ? [label, command] : [remove] };
  const context = vm.createContext({
    document, mergeDialog: { hidden: true }, tinyMode: false,
    timerList: { querySelectorAll: () => [card] },
    addButton: element("add"), clockToggleButton: element("clock"),
    themeSwatches: [element("system"), element("custom"), element("paper")],
    secondsToggleButton: element("seconds"), tinyModeButton: element("tiny"),
    mergeUndoButton: element("undo", false), mergeUndoDismiss: element("dismiss", false)
  });
  vm.runInContext(html.slice(start, end), context);
  const press = shiftKey => {
    let prevented = false;
    document.onKey({ key: "Tab", shiftKey, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    return document.activeElement.name;
  };
  const expected = ["label", "timer", "add", "clock", "paper", "custom", "system", "seconds", "tiny", "remove"];
  for (const name of expected) assert.equal(press(false), name);
  assert.equal(press(false), "label");
  for (const name of expected.toReversed()) assert.equal(press(true), name);
});
