/**
 * Theme-pack generator.
 *
 * One code path turns the upstream Catppuccin userstyles into a Stylus import
 * per theme by swapping ONLY the shared color library. Upstream style files are
 * never edited (clean `git merge upstream/main`); the theme lib is vendored
 * inline into each style so the import is self-contained (no network, no
 * dependency on this repo being reachable).
 *
 *   palettes/<theme>.ts  ->  expand() -> Catppuccin @catppuccin map
 *                        ->  spliced into lib/lib.less (keeps filters + #lib)
 *                        ->  vendored into each style, metadata re-branded
 *                        ->  dist/<theme>.import.json
 *
 * Light mode is automatic: latte <- light variant (when the theme has one),
 * the dark flavors <- dark variant. Styles already pick latte in light mode and
 * mocha in dark mode, so each file follows the OS with no per-style edits.
 *
 * Gruvbox (the hero) additionally gets 7 accent variants.
 *
 * Usage:
 *   deno task generate:themes          # all themes
 *   deno task generate:gruvbox         # just gruvbox (+ accent variants)
 */
import usercssMeta from "usercss-meta";
import { ensureDir } from "@std/fs";
import * as path from "@std/path";
import { REPO_ROOT } from "@/constants.ts";
import { getUserstylesFiles } from "@/utils.ts";
import { log } from "@/logger.ts";
import type { Palette } from "@/themes/types.ts";
import { getPalette, PALETTES } from "@/themes/registry.ts";
import { buildLib } from "@/themes/buildlib.ts";

// ---- Fork identity (edit if you rename/move the repo) ----------------------
const FORK = {
  owner: "BrigBryu",
  repo: "gruvbox-Userstyles",
  get slug() {
    return `${this.owner}/${this.repo}`;
  },
  get homepage() {
    return `https://github.com/${this.slug}`;
  },
};
const REMOTE_LIB_IMPORT =
  '@import "https://userstyles.catppuccin.com/lib/lib.less";';

// Accent variants generated for Gruvbox only: label -> Catppuccin accent key.
const GRUVBOX_ACCENTS: Record<string, string> = {
  purple: "mauve",
  green: "green",
  orange: "peach",
  red: "red",
  yellow: "yellow",
  aqua: "teal",
  blue: "blue",
};

// ---- Re-brand a single style -----------------------------------------------
function themeifyStyle(
  content: string,
  lib: string,
  palette: Palette,
  accentKey?: string,
): string {
  const headerRe = /(\/\* ==UserStyle==)([\s\S]*?)(==\/UserStyle== \*\/)/;
  const m = content.match(headerRe);
  if (!m) throw new Error("missing UserStyle metadata header");

  let header = m[2];

  // @name "GitHub Catppuccin" -> "GitHub <Label>"
  header = header.replace(
    /^(@name\s+)(.*)$/m,
    (_all, p: string, val: string) =>
      p + val.replace(/Catppuccin/g, palette.label),
  );
  // namespace / homepageURL / supportURL all contain `catppuccin/userstyles`.
  header = header.replaceAll("catppuccin/userstyles", FORK.slug);
  header = header.replace(
    /^@description\s+.*$/m,
    `@description Unofficial ${palette.label} theme based on Catppuccin userstyles`,
  );
  header = header.replace(
    /^@author\s+.*$/m,
    `@author ${FORK.owner} (${palette.label} port) — based on Catppuccin (catppuccin/userstyles)`,
  );
  // Drop @updateURL so Stylus never silently pulls the Catppuccin version.
  header = header.replace(/^@updateURL\s+.*$\n?/m, "");

  // Set the default accent (Gruvbox accent variants only).
  if (accentKey) header = setAccentDefault(header, accentKey);

  let out = content.replace(headerRe, `$1${header}$3`);

  if (!out.includes(REMOTE_LIB_IMPORT)) {
    throw new Error("expected lib.less import not found");
  }
  out = out.replace(
    REMOTE_LIB_IMPORT,
    () => `/* ${palette.label}: vendored theme lib */\n${lib}`,
  );
  return out;
}

/** Move the `*` default in the accentColor select line to `key`. */
function setAccentDefault(header: string, key: string): string {
  return header.replace(
    /^@var select accentColor .*$/m,
    (line) =>
      line
        .replace(/\*"/, '"') // clear current default
        .replace(new RegExp(`("${key}:[^"]*)"`), '$1*"'), // star the chosen one
  );
}

// ---- Assemble one import.json ----------------------------------------------
// Recommended Stylus settings. updateInterval 0 => never auto-check.
const SETTINGS = {
  settings: {
    updateInterval: 0,
    updateOnlyEnabled: true,
    patchCsp: true,
    "editor.linter": "",
  },
};

function buildImport(
  files: string[],
  lib: string,
  palette: Palette,
  accentKey?: string,
): Record<string, unknown>[] {
  const data: Record<string, unknown>[] = [SETTINGS];
  for (const file of files) {
    const original = Deno.readTextFileSync(file);
    let source: string;
    try {
      source = themeifyStyle(original, lib, palette, accentKey);
    } catch (err) {
      log.error(
        `Skipping ${path.relative(REPO_ROOT, file)} (${palette.key}): ${
          (err as Error).message
        }`,
      );
      continue;
    }
    const { metadata } = usercssMeta.parse(source);
    data.push({
      enabled: true,
      name: metadata.name,
      description: metadata.description,
      author: metadata.author,
      url: FORK.homepage,
      updateUrl: null,
      usercssData: metadata,
      sourceCode: source,
    });
  }
  return data;
}

// ---- Main ------------------------------------------------------------------
const onlyKey = Deno.args[0]; // optional: generate a single theme
const palettes = onlyKey
  ? [getPalette(onlyKey) ?? (() => {
    log.error(`Unknown theme: ${onlyKey}`);
    return Deno.exit(1);
  })()]
  : PALETTES;

const files = getUserstylesFiles();
const distDir = path.join(REPO_ROOT, "dist");
await ensureDir(distDir);

const written: string[] = [];

async function writeImport(name: string, data: unknown) {
  const out = path.join(distDir, name);
  await Deno.writeTextFile(out, JSON.stringify(data));
  written.push(name);
}

for (const palette of palettes) {
  const lib = buildLib(palette);

  if (palette.key === "gruvbox") {
    // Gruvbox: 7 accent variants + a default (purple) alias.
    for (const [label, accentKey] of Object.entries(GRUVBOX_ACCENTS)) {
      const data = buildImport(files, lib, palette, accentKey);
      await writeImport(`gruvbox-${label}.import.json`, data);
      if (label === "purple") {
        await writeImport("gruvbox-userstyles.import.json", data);
      }
    }
  } else {
    const data = buildImport(files, lib, palette);
    await writeImport(`${palette.key}.import.json`, data);
  }
}

console.log(`Generated ${written.length} import files in dist/:`);
for (const n of written) console.log(`  - ${n}`);
