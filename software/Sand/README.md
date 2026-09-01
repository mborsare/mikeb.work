# Sand

No Xcode.

## Changes in this build

- Font family is fixed to **Comic Shanns Mono**
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

## Timer input

- `30`
- `90m`
- `1.5h`
- `45s`
- `1:30`
- `1:30:00`
- `@10:45`
- `@14:00 - 15` (15 minutes before 14:00)
- `10:45am`
- `10:45pm`
