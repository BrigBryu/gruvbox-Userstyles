const STYLUS_ID = "clngdbkpkpeebahjckkjfobafhncgmne";
const STYLUS_MANAGE_URL = `chrome-extension://${STYLUS_ID}/manage.html`;
const DEBUGGER_VERSION = "1.3";

const els = {
  preview: document.querySelector("#preview"),
  delete: document.querySelector("#delete"),
  includeLegacy: document.querySelector("#includeLegacy"),
  status: document.querySelector("#status"),
  results: document.querySelector("#results"),
};

let lastPreview = null;

els.preview.addEventListener("click", () => preview().catch(showError));
els.delete.addEventListener("click", () => removeMatched().catch(showError));
els.includeLegacy.addEventListener("change", () => {
  lastPreview = null;
  els.delete.disabled = true;
  els.results.textContent = "";
  setStatus("Preview again after changing legacy matching.");
});

async function preview() {
  setBusy(true);
  try {
    const tab = await getStylusManageTab();
    const result = await runInStylus(tab.id, "preview", {
      includeLegacy: els.includeLegacy.checked,
    });
    lastPreview = {
      tabId: tab.id,
      includeLegacy: els.includeLegacy.checked,
      rows: result.rows,
      ids: result.rows.map((row) => row.id),
    };
    renderRows(result.rows);
    els.delete.disabled = result.rows.length === 0;
    setStatus(
      result.rows.length
        ? `Found ${result.rows.length} matching style(s). Review the list, then delete.`
        : "No matching Gruvbox Userstyles entries found.",
      result.rows.length ? "" : "ok",
    );
  } finally {
    setBusy(false);
  }
}

async function removeMatched() {
  if (!lastPreview || !lastPreview.rows.length) return;
  const confirmed = confirm(
    `Delete ${lastPreview.rows.length} Gruvbox Userstyles style(s) from Stylus?\n\nA full Stylus backup will be downloaded first.`,
  );
  if (!confirmed) return;

  setBusy(true);
  try {
    const tab = await getStylusManageTab();
    const result = await runInStylus(tab.id, "delete", {
      includeLegacy: lastPreview.includeLegacy,
      expectedIds: lastPreview.ids,
    });
    lastPreview = null;
    els.delete.disabled = true;
    renderRows([]);
    setStatus(
      `Deleted ${result.deleted} style(s). Backup downloaded: ${
        result.backupDownloaded ? "yes" : "no"
      }.`,
      "ok",
    );
  } finally {
    setBusy(false);
  }
}

async function getStylusManageTab() {
  const tabs = await chrome.tabs.query({ url: `${STYLUS_MANAGE_URL}*` });
  const tab = tabs[0] ??
    await chrome.tabs.create({ url: STYLUS_MANAGE_URL, active: true });
  await chrome.tabs.update(tab.id, { active: true });
  if (tab.windowId != null) {
    await chrome.windows.update(tab.windowId, { focused: true });
  }
  await waitForTabComplete(tab.id);
  return await chrome.tabs.get(tab.id);
}

async function waitForTabComplete(tabId) {
  for (let i = 0; i < 50; i++) {
    const tab = await chrome.tabs.get(tabId);
    if (tab.status === "complete") return;
    await sleep(100);
  }
}

async function runInStylus(tabId, action, options) {
  await chrome.debugger.attach({ tabId }, DEBUGGER_VERSION);
  try {
    const response = await chrome.debugger.sendCommand(
      { tabId },
      "Runtime.evaluate",
      {
        expression: buildExpression(action, options),
        awaitPromise: true,
        returnByValue: true,
      },
    );
    if (response.exceptionDetails) {
      throw new Error(
        response.exceptionDetails.text || "Stylus cleanup evaluation failed.",
      );
    }
    const value = response.result?.value;
    if (!value?.ok) throw new Error(value?.error || "Stylus cleanup failed.");
    return value;
  } finally {
    await chrome.debugger.detach({ tabId }).catch(() => {});
  }
}

function buildExpression(action, options) {
  return `(${stylusCleanerRuntime.toString()})(${
    JSON.stringify({ action, ...options })
  })`;
}

async function stylusCleanerRuntime(options) {
  const REPO_URL = "https://github.com/BrigBryu/gruvbox-Userstyles";
  const REPO_SLUG = "BrigBryu/gruvbox-Userstyles";
  const STRICT_MARKER = "installed-from-id: brigbryu-gruvbox-userstyles";

  function displayName(style) {
    return style.customName || style.name || "(unnamed style)";
  }

  function strictMatch(style) {
    return style.sourceCode?.includes(STRICT_MARKER)
      ? { match: true, reason: "marker" }
      : { match: false, reason: "" };
  }

  function legacyMatch(style) {
    const signals = [];
    const metadata = style.usercssData || {};
    const source = style.sourceCode || "";
    if (style.url === REPO_URL) signals.push("url");
    if (metadata.homepageURL === REPO_URL) signals.push("homepageURL");
    if (metadata.namespace?.includes(REPO_SLUG)) signals.push("namespace");
    if (source.includes(REPO_SLUG)) signals.push("source");
    return signals.length >= 2
      ? { match: true, reason: `legacy ${signals.join("+")} match` }
      : { match: false, reason: "" };
  }

  function rowsFor(styles, includeLegacy) {
    const rows = [];
    for (const style of styles) {
      if (!Number.isInteger(style.id) || style.id <= 0) continue;
      const strict = strictMatch(style);
      if (strict.match) {
        rows.push({
          id: style.id,
          name: displayName(style),
          reason: strict.reason,
        });
        continue;
      }
      if (includeLegacy) {
        const legacy = legacyMatch(style);
        if (legacy.match) {
          rows.push({
            id: style.id,
            name: displayName(style),
            reason: legacy.reason,
          });
        }
      }
    }
    return rows;
  }

  function sameIds(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    const aa = [...a].sort((x, y) => x - y);
    const bb = [...b].sort((x, y) => x - y);
    return aa.every((id, index) => id === bb[index]);
  }

  function downloadBackup(styles) {
    if (!globalThis.document) return false;
    const stamp = new Date().toISOString().replaceAll(":", "-");
    const blob = new Blob([JSON.stringify(styles, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `stylus-backup-before-gruvbox-clear-${stamp}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    return true;
  }

  try {
    const api = globalThis.API || (await import("/js/msg-api.js")).API;
    if (!api?.styles?.getAll || !api?.styles?.removeMany) {
      throw new Error("Stylus API unavailable on this page.");
    }

    const styles = await api.styles.getAll();
    const rows = rowsFor(styles, !!options.includeLegacy);

    if (options.action === "preview") {
      return { ok: true, rows };
    }

    if (options.action !== "delete") {
      throw new Error(`Unknown action: ${options.action}`);
    }

    const ids = rows.map((row) => row.id);
    if (!sameIds(ids, options.expectedIds)) {
      throw new Error(
        `Matched styles changed since preview. Expected ${
          options.expectedIds?.length ?? 0
        }, found ${ids.length}. Preview again before deleting.`,
      );
    }

    const backupDownloaded = downloadBackup(styles);
    await api.styles.removeMany(ids);
    return { ok: true, deleted: ids.length, backupDownloaded };
  } catch (error) {
    return { ok: false, error: error?.message || String(error) };
  }
}

function renderRows(rows) {
  if (!rows.length) {
    els.results.innerHTML = '<div class="empty">No matching styles.</div>';
    return;
  }
  const body = rows
    .map((row) =>
      `<tr><td>#${escapeHtml(String(row.id))}</td><td>${
        escapeHtml(row.name)
      }</td><td>${escapeHtml(row.reason)}</td></tr>`
    )
    .join("");
  els.results.innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Reason</th></tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

function setBusy(busy) {
  els.preview.disabled = busy;
  els.delete.disabled = busy || !lastPreview?.rows.length;
  els.includeLegacy.disabled = busy;
  if (busy) setStatus("Working...");
}

function setStatus(message, type = "") {
  els.status.textContent = message;
  els.status.className = type;
}

function showError(error) {
  setBusy(false);
  setStatus(error?.message || String(error), "error");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
