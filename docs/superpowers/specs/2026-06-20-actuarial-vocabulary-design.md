# Actuarial Vocabulary Design

## Goal

Build a minimal GitHub Pages vocabulary app for life actuarial exam terminology. The app helps students focus on one term at a time with a sentence-level exam cue and three self-assessment buttons.

## Approved Direction

The interface is intentionally sparse:

- One centered study card on desktop and mobile.
- English term, Chinese term, actuarial symbol, and a light chapter label.
- One English exam-style example sentence.
- One Chinese meaning for the example sentence.
- Three primary actions: `认识`, `模糊`, `不认识`.
- No dashboard, sidebar, search, progress ring, mascot, chart, statistics panel, or decorative illustration.

## Visual System

Palette:

- Background: cool off-white `#f7f9fb`
- Card: white `#ffffff`
- Primary text: ink `#172126`
- Muted text: blue gray `#667782`
- Border: `#e5edf1`
- Know action: coordinated teal `#139a89`
- Unsure action: muted amber `#c8892d`
- Unknown action: soft coral `#d85d4f`

Shape and spacing:

- Card radius: `8px`
- Buttons radius: `8px`
- Thin borders and very soft shadows only.
- Desktop card width around 720px.
- Mobile card fills the viewport with comfortable margins and bottom actions.

Typography:

- Use system sans fonts for Chinese and English.
- English term is the largest text.
- Chinese term and symbol sit close to the term.
- Example sentence and Chinese meaning are readable, not tiny.

## Interaction

At load, the app reads terms from `data/terms.json`.

Each card shows one term. Clicking any of the three buttons:

- stores the selected status locally by term id;
- advances to the next term;
- wraps to the first term at the end.

Keyboard shortcuts:

- `1`: 认识
- `2`: 模糊
- `3`: 不认识
- `Space`: next card without changing status

Local storage is optional enhancement; if unavailable, the app still works for the current session.

## Data

Use the generated JSON from `life_actuarial_terms_ch1_5.json`. The app can consume the existing shape directly and only needs the `terms` array plus chapter metadata.

## Deployment

The repo is a static GitHub Pages site:

- `index.html`
- `styles.css`
- `app.js`
- `data/terms.json`
- `.nojekyll`
- `README.md`

No build step is required.
