(() => {
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

  async function getStylusAPI() {
    if (globalThis.API?.styles?.getAll) return globalThis.API;
    try {
      const module = await import("/js/msg-api.js");
      if (module.API?.styles?.getAll) return module.API;
    } catch {
      // Fall through to the error below.
    }
    throw new Error(
      "Stylus API not found. Open Stylus -> Manage, then run this script in that page's console.",
    );
  }

  function rowsFor(styles, matcher) {
    return styles
      .map((style) => ({ style, result: matcher(style) }))
      .filter(({ result }) => result.match)
      .map(({ style, result }) => ({
        id: style.id,
        name: displayName(style),
        reason: result.reason,
      }));
  }

  function downloadBackup(styles) {
    if (!globalThis.document) {
      console.warn(
        "No document object is available in this console context, so the helper cannot auto-download a backup. Export a Stylus backup manually first if you need one.",
      );
      return false;
    }
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

  async function clearGruvboxStyles(options = {}) {
    const api = await getStylusAPI();
    const styles = await api.styles.getAll();
    const strictRows = rowsFor(styles, strictMatch);
    const legacyRows = rowsFor(
      styles.filter((style) => !strictMatch(style).match),
      legacyMatch,
    );
    const rowsToDelete = options.legacy
      ? [...strictRows, ...legacyRows]
      : strictRows;

    console.log(
      `Gruvbox Userstyles clear preview: ${strictRows.length} strict marker match(es), ${legacyRows.length} legacy candidate(s).`,
    );
    if (strictRows.length) {
      console.log("Strict marker matches:");
      console.table(strictRows);
    }
    if (legacyRows.length) {
      console.log(
        "Legacy candidates, not deleted unless { legacy: true } is passed:",
      );
      console.table(legacyRows);
    }

    if (!options.delete) {
      console.log(
        "Preview only. To delete strict marker matches, run clearGruvboxStyles({ delete: true }).",
      );
      console.log(
        "To include legacy unmarked candidates, run clearGruvboxStyles({ delete: true, legacy: true }).",
      );
      return { deleted: false, strict: strictRows, legacy: legacyRows };
    }

    if (!rowsToDelete.length) {
      console.log("No matching styles to delete.");
      return { deleted: false, strict: strictRows, legacy: legacyRows };
    }

    console.log("Styles selected for deletion:");
    console.table(rowsToDelete);

    const didBackup = downloadBackup(styles);

    const phrase = `DELETE ${rowsToDelete.length} GRUVBOX USERSTYLES`;
    const typed = typeof prompt === "function"
      ? prompt(
        `${
          didBackup
            ? "A full Stylus backup was downloaded first."
            : "Automatic backup download was not available in this console context."
        }\n\nType exactly this phrase to delete ${rowsToDelete.length} style(s):\n\n${phrase}`,
      )
      : options.confirm;
    if (typed !== phrase) {
      console.log(
        `Confirmation did not match. Nothing was deleted. In this console context, pass { confirm: "${phrase}" }.`,
      );
      return { deleted: false, strict: strictRows, legacy: legacyRows };
    }

    await api.styles.removeMany(rowsToDelete.map((row) => row.id));
    console.log(`Deleted ${rowsToDelete.length} Gruvbox Userstyles style(s).`);
    return {
      deleted: true,
      ids: rowsToDelete.map((row) => row.id),
      strict: strictRows,
      legacy: legacyRows,
    };
  }

  globalThis.clearGruvboxStyles = clearGruvboxStyles;
  console.log("Loaded clearGruvboxStyles(). Running preview now.");
  clearGruvboxStyles();
})();
