# Online Safety — Computing (Year 6)

An interactive, teacher-led online-safety lesson. Pupils work through branching
chat scenarios on Roblox, WhatsApp and Snapchat: read the situation, discuss,
vote as a class, then reveal the outcome of every choice.

## Running the app

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Built with React + TypeScript + Vite. Press the ⛶ button (top-right) for
full screen when presenting.

## Offline backup — `LESSON-SLIDES.html`

If the app can't run on the day, open **`LESSON-SLIDES.html`** in any browser.
It's a single self-contained file (no internet needed) with the whole lesson as
slides:

- Arrow keys / space to move, `F` for full screen, click the left/right edges.
- `Ctrl+P` → "Save as PDF" to keep a printable copy.
- Same scenarios, choices, outcomes and the "it's never your fault" message as
  the app, plus a short teacher note and the golden rules / Childline number.

## Lesson content

Scenario text lives in [`src/data/scenarios.ts`](src/data/scenarios.ts). The
slide deck mirrors it.
