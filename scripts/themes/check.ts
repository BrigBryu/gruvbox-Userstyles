/**
 * Validate the theme packs:
 *   1. Every palette resolves all 26 Catppuccin roles to valid #rrggbb.
 *   2. The generated lib doesn't *regress* compilation: for each style we
 *      compile with the upstream Catppuccin lib and with a generated theme lib;
 *      a style is only flagged if it compiles with Catppuccin but breaks with
 *      the theme. (Compilation depends on which roles are defined, not their
 *      hex values, and every theme defines all 26 via expand(), so one
 *      representative theme covers the structural check.)
 *
 * Usage:  deno task check:themes
 */
import less from "less";
import usercssMeta from "usercss-meta";
import * as path from "@std/path";
import { REPO_ROOT } from "@/constants.ts";
import { getUserstylesFiles } from "@/utils.ts";
import { type Mode, validateMode } from "@/themes/types.ts";
import { PALETTES } from "@/themes/registry.ts";
import { buildLibFor } from "@/themes/buildlib.ts";

const REMOTE_LIB_IMPORT =
  '@import "https://userstyles.catppuccin.com/lib/lib.less";';

// ---- 1. Palette validation -------------------------------------------------
let paletteProblems = 0;
for (const p of PALETTES) {
  for (const [mode, data] of Object.entries({ dark: p.dark, light: p.light })) {
    if (!data) continue; // light is optional
    const problems = validateMode(data as Mode);
    if (problems.length) {
      paletteProblems++;
      console.error(`PALETTE ${p.key}.${mode}: ${problems.join(", ")}`);
    }
  }
}
console.log(
  `Palettes: ${PALETTES.length} themes, ${paletteProblems} with bad colors`,
);

// ---- 2. Structural compile check (catppuccin baseline vs generated) --------
const catppuccinLib = await Deno.readTextFile(
  path.join(REPO_ROOT, "lib", "lib.less"),
);
// Reuse the lib builder for the representative theme (gruvbox).
const themeLib = buildLibFor("gruvbox");

function preamble(source: string): string {
  const { metadata } = usercssMeta.parse(source);
  const vars = (metadata.vars ?? {}) as Record<string, { default: unknown }>;
  return Object.entries(vars)
    .map(([name, v]) => `@${name}: ${String(v.default)};`)
    .join("\n");
}

async function compiles(source: string): Promise<true | string> {
  try {
    await less.render(`${preamble(source)}\n${source}`, { math: "always" });
    return true;
  } catch (err) {
    return (err as { message?: string }).message ?? String(err);
  }
}

let ok = 0;
let regressed = 0;
let preexisting = 0;

for (const file of getUserstylesFiles()) {
  const original = await Deno.readTextFile(file);
  const name = path.basename(path.dirname(file));

  const grv = original.replace(REMOTE_LIB_IMPORT, () => themeLib);
  const grvResult = await compiles(grv);
  if (grvResult === true) {
    ok++;
    continue;
  }
  const ctp = original.replace(REMOTE_LIB_IMPORT, () => catppuccinLib);
  if ((await compiles(ctp)) === true) {
    regressed++;
    console.error(`REGRESSION ${name}: ${grvResult}`);
  } else {
    preexisting++;
    console.warn(`skip ${name} (pre-existing less.js quirk)`);
  }
}

console.log(
  `Compile: ${ok} ok, ${preexisting} pre-existing skips, ${regressed} regressions`,
);
if (paletteProblems > 0 || regressed > 0) Deno.exit(1);
