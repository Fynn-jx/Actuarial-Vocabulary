const DATA_URL = "./data/terms.json";
const STORAGE_KEY = "actuarial-vocabulary-feedback";
const INDEX_KEY = "actuarial-vocabulary-current-index";
const STATUS_META = {
  know: { label: "认识", className: "know" },
  unsure: { label: "模糊", className: "unsure" },
  unknown: { label: "不认识", className: "unknown" },
  unreviewed: { label: "未刷", className: "unreviewed" }
};

const elements = {
  meta: document.querySelector("#termMeta"),
  english: document.querySelector("#termEnglish"),
  chinese: document.querySelector("#termChinese"),
  symbol: document.querySelector("#termSymbol"),
  exampleEnglish: document.querySelector("#exampleEnglish"),
  exampleChinese: document.querySelector("#exampleChinese"),
  buttons: [...document.querySelectorAll("[data-rating]")],
  wordListToggle: document.querySelector("#wordListToggle"),
  wordPanel: document.querySelector("#wordPanel"),
  wordPanelClose: document.querySelector("#wordPanelClose"),
  wordPanelSummary: document.querySelector("#wordPanelSummary"),
  wordPanelStats: document.querySelector("#wordPanelStats"),
  wordList: document.querySelector("#wordList")
};

let terms = [];
let currentIndex = readNumber(INDEX_KEY, 0);
let feedback = readJson(STORAGE_KEY, {});

init();

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
    }

    const data = await response.json();
    terms = Array.isArray(data.terms) ? data.terms : [];

    if (terms.length === 0) {
      renderEmpty("词库为空", "请检查 data/terms.json。");
      return;
    }

    currentIndex = clampIndex(currentIndex);
    renderTerm();
    renderWordWidget();
    bindEvents();
  } catch (error) {
    renderEmpty("词库读取失败", "请通过本地服务器或 GitHub Pages 打开页面。");
    console.error(error);
  }
}

function bindEvents() {
  elements.buttons.forEach((button) => {
    button.addEventListener("click", () => rateCurrentTerm(button.dataset.rating));
  });

  elements.wordListToggle.addEventListener("click", () => {
    setWordPanelOpen(elements.wordPanel.hidden);
  });

  elements.wordPanelClose.addEventListener("click", () => {
    setWordPanelOpen(false);
    elements.wordListToggle.focus();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.wordPanel.hidden) {
      setWordPanelOpen(false);
      elements.wordListToggle.focus();
      return;
    }

    if (
      event.target instanceof HTMLButtonElement ||
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (event.key === "1") {
      rateCurrentTerm("know");
    } else if (event.key === "2") {
      rateCurrentTerm("unsure");
    } else if (event.key === "3") {
      rateCurrentTerm("unknown");
    } else if (event.code === "Space") {
      event.preventDefault();
      advance();
    }
  });
}

function rateCurrentTerm(rating) {
  const term = terms[currentIndex];
  if (!term) return;

  feedback[term.id] = {
    rating,
    updatedAt: new Date().toISOString()
  };
  writeJson(STORAGE_KEY, feedback);
  advance();
}

function advance() {
  currentIndex = (currentIndex + 1) % terms.length;
  writeNumber(INDEX_KEY, currentIndex);
  renderTerm();
  renderWordWidget();
}

function jumpToTerm(index) {
  currentIndex = clampIndex(index);
  writeNumber(INDEX_KEY, currentIndex);
  renderTerm();
  renderWordWidget();
  setWordPanelOpen(false);
}

function renderTerm() {
  const term = terms[currentIndex];
  const chapter = term.chapter ? `第${term.chapter}章` : "寿险精算";
  const module = term.module ? ` · ${term.module}` : "";

  elements.meta.textContent = `${chapter}${module}`;
  elements.english.textContent = term.en || "Untitled Term";
  elements.chinese.textContent = term.zh || "未命名术语";
  elements.exampleEnglish.textContent = term.example_en || "No example sentence available.";
  elements.exampleChinese.textContent = term.example_zh || "暂无中文含义。";

  const symbol = cleanSymbol(term.symbol);
  if (symbol) {
    elements.symbol.hidden = false;
    elements.symbol.textContent = symbol;
  } else {
    elements.symbol.hidden = true;
    elements.symbol.textContent = "";
  }
}

function setWordPanelOpen(open) {
  elements.wordPanel.hidden = !open;
  elements.wordListToggle.setAttribute("aria-expanded", String(open));

  if (open) {
    renderWordWidget();
  }
}

function renderWordWidget() {
  const total = terms.length;
  const counts = { know: 0, unsure: 0, unknown: 0 };

  terms.forEach((term) => {
    const rating = feedback[term.id]?.rating;
    if (rating === "know" || rating === "unsure" || rating === "unknown") {
      counts[rating] += 1;
    }
  });

  const reviewed = counts.know + counts.unsure + counts.unknown;
  elements.wordListToggle.textContent = `已刷 ${reviewed}/${total}`;
  elements.wordPanelSummary.textContent = `已刷 ${reviewed}/${total}`;

  renderStats([
    { label: "已刷", value: `${reviewed}/${total}` },
    { label: "认识", value: counts.know },
    { label: "模糊", value: counts.unsure },
    { label: "不认识", value: counts.unknown }
  ]);
  renderWordList();
}

function renderStats(stats) {
  const fragment = document.createDocumentFragment();

  stats.forEach((stat) => {
    const item = document.createElement("div");
    item.className = "word-stat";

    const value = document.createElement("strong");
    value.textContent = stat.value;

    const label = document.createElement("span");
    label.textContent = stat.label;

    item.append(value, label);
    fragment.appendChild(item);
  });

  elements.wordPanelStats.replaceChildren(fragment);
}

function renderWordList() {
  const fragment = document.createDocumentFragment();

  terms.forEach((term, index) => {
    const rating = feedback[term.id]?.rating || "unreviewed";
    const status = STATUS_META[rating] || STATUS_META.unreviewed;
    const row = document.createElement("button");
    row.type = "button";
    row.className = index === currentIndex ? "word-row current" : "word-row";
    row.addEventListener("click", () => jumpToTerm(index));

    const main = document.createElement("span");
    main.className = "word-row-main";

    const english = document.createElement("span");
    english.className = "word-row-en";
    english.textContent = term.en || "Untitled Term";

    const chinese = document.createElement("span");
    chinese.className = "word-row-zh";
    chinese.textContent = term.zh || "未命名术语";

    const badge = document.createElement("span");
    badge.className = `word-status ${status.className}`;
    badge.textContent = status.label;

    main.append(english, chinese);
    row.append(main, badge);
    fragment.appendChild(row);
  });

  elements.wordList.replaceChildren(fragment);
}

function renderEmpty(title, message) {
  elements.meta.textContent = "寿险精算词汇";
  elements.english.textContent = title;
  elements.chinese.textContent = message;
  elements.symbol.hidden = true;
  elements.exampleEnglish.textContent = "";
  elements.exampleChinese.textContent = "";
  elements.buttons.forEach((button) => {
    button.disabled = true;
  });
  elements.wordListToggle.disabled = true;
  elements.wordPanel.hidden = true;
  elements.wordPanelStats.replaceChildren();
  elements.wordList.replaceChildren();
}

function cleanSymbol(value) {
  if (!value) return "";
  return String(value)
    .replaceAll("$", "")
    .replaceAll("\\(", "")
    .replaceAll("\\)", "")
    .trim();
}

function clampIndex(index) {
  if (!Number.isInteger(index) || index < 0 || index >= terms.length) {
    return 0;
  }
  return index;
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage is an enhancement; the learning flow still works without it.
  }
}

function readNumber(key, fallback) {
  const value = Number(window.localStorage.getItem(key));
  return Number.isInteger(value) ? value : fallback;
}

function writeNumber(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Local storage is an enhancement; the learning flow still works without it.
  }
}
