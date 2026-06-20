# Actuarial Vocabulary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal responsive static vocabulary flashcard app for GitHub Pages.

**Architecture:** A dependency-free static app loads `data/terms.json`, renders one focused card, records local feedback status, and advances through terms. Styling is isolated in `styles.css`; data and state helpers stay in `app.js`.

**Tech Stack:** HTML, CSS, vanilla JavaScript, GitHub Pages static hosting.

---

## File Structure

- Create: `index.html` - semantic app shell, card placeholders, and action buttons.
- Create: `styles.css` - responsive visual system and button states.
- Create: `app.js` - data loading, render logic, local feedback state, keyboard shortcuts.
- Create: `data/terms.json` - vocabulary dataset copied from the generated chapter 1-5 JSON.
- Create: `.nojekyll` - GitHub Pages static file handling.
- Create: `README.md` - deployment and project notes.

### Task 1: Static Shell And Data

**Files:**
- Create: `index.html`
- Create: `data/terms.json`
- Create: `.nojekyll`
- Create: `README.md`

- [ ] **Step 1: Create the static HTML shell**

Use a single centered card with placeholders for chapter, English term, Chinese term, symbol, example sentence, Chinese meaning, and three buttons.

- [ ] **Step 2: Copy the generated vocabulary JSON**

Copy `F:\知识库\life_actuarial_terms_ch1_5.json` to `data/terms.json`.

- [ ] **Step 3: Add GitHub Pages metadata**

Add `.nojekyll` and a concise README describing the static deployment.

### Task 2: Responsive Styling

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Add design tokens**

Implement the approved cool white, ink, teal, amber, and coral palette.

- [ ] **Step 2: Style desktop layout**

Center one card with generous whitespace and keep the button row below the example content.

- [ ] **Step 3: Style mobile layout**

Use one column, full-height layout, no horizontal overflow, and large tap targets.

### Task 3: Learning Interaction

**Files:**
- Create: `app.js`
- Modify: `index.html`

- [ ] **Step 1: Load terms**

Fetch `data/terms.json`, read `terms`, and render the first term.

- [ ] **Step 2: Render a term card**

Use `en`, `zh`, `symbol`, `chapter`, `module`, `example_en`, and `example_zh`.

- [ ] **Step 3: Save feedback and advance**

On `认识`, `模糊`, or `不认识`, save status to local storage and advance to the next term.

- [ ] **Step 4: Add keyboard shortcuts**

Map `1`, `2`, `3`, and `Space` to the expected actions.

### Task 4: Verification

**Files:**
- Modify if needed: `index.html`, `styles.css`, `app.js`

- [ ] **Step 1: Validate JSON**

Run `python -m json.tool data/terms.json`.

- [ ] **Step 2: Serve locally**

Run a local static server and open the page.

- [ ] **Step 3: Verify desktop**

Check the desktop card, button states, and next-card interaction.

- [ ] **Step 4: Verify mobile**

Check a mobile viewport for readable text, no overflow, and large buttons.
