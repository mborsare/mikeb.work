# Sand

No Xcode.

## Changes in this build

- Font family is fixed to the bundled **Comic Mono** (`fonts/ComicMono-Regular.woff`)
- Removed font-family picker / installed-font loader
- Typography settings now open as a floating internal sheet
- Opening settings no longer changes the timer area's layout
- The settings sheet scrolls internally instead of getting clipped at the bottom
- Timer size max still follows the current timer field and window size
- Timer still shrinks before it can clip

## Run

```bash
npm install
npm start
```

## Build app

```bash
npm run pack
```

## Install on this Mac

```bash
npm run install-app
```

Installs and opens `~/Applications/Sand.app`. Press **Command-Space**, type
**Sand**, then press **Return** to launch it. You can also open the app in Finder.
Run the install command again after changing the source to update the installed app.

For a keyboard shortcut, create a shortcut in the macOS **Shortcuts** app with
the **Open App** action set to **Sand**. Open the shortcut's details and use
**Add Keyboard Shortcut** to assign your preferred keys.

## Timer input

The small color swatches beside **＋** recolor the interface and remember your
choice. Tiny mode smoothly collapses the window; click a summary or press Escape
to return to the previous full height. The window stays within the screen.

Drop a card onto another card's center to merge. Addition uses both timers'
remaining seconds at confirmation and joins their labels (`Reading + Writing`).
Subtraction removes the dragged timer's seconds from the destination, clamps at
zero, and joins labels with `−`. The destination keeps its running/paused state.

When a countdown reaches zero, it keeps running upward as overtime and shows
`ended at [time]`. **Reset** restores the original duration, paused and ready to
resume, while keeping the label. Overtime includes time asleep or closed.

- `30`
- `90m`
- `1.5h`
- `45s`
- `1:30`
- `1:30:00`
- `@10:45`
- `1600` or `16:00` (until 4 PM; two-digit hours mean a clock time)
- `@14:00 - 15` (15 minutes before 14:00)
- `10:45am`
- `10:45pm`
