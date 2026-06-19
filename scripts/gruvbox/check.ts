/**
 * Validate that the Gruvbox shim doesn't *regress* any style.
 *
 * For every style we compile two variants offline:
 *   - "catppuccin": the upstream `lib/lib.less` vendored inline
 *   - "gruvbox":    our `lib/gruvbox-lib.less` vendored inline
 * A style is only reported as FAILED if it compiles with Catppuccin but breaks
 * with Gruvbox — i.e. a real problem introduced by the shim (e.g. a new
 * upstream style using a palette key we don't define). Styles that already
 * fail to compile with plain less.js (pre-existing quirks like `rgb(var(--x))`)
 * are not our problem and are skipped.
 *
 * Usage:  deno task check:gruvbox
 */
import less from "less";
import usercssMeta from "usercss-meta";
import * as path from "@std/path";
import { REPO_ROOT } from "@/constants.ts";
import { getUserstylesFiles } from "@/utils.ts";

const REMOTE_LIB_IMPORT =
  '@import "https://userstyles.catppuccin.com/lib/lib.less";';

const catppuccinLib = await Deno.readTextFile(
  path.join(REPO_ROOT, "lib", "lib.less"),
);
const gruvboxLib = await Deno.readTextFile(
  path.join(REPO_ROOT, "lib", "gruvbox-lib.less"),
);

/** Prepend each @var's default so the Less can resolve @darkFlavor, etc. */
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

  const ctp = original.replace(REMOTE_LIB_IMPORT, () => catppuccinLib);
  const grv = original.replace(REMOTE_LIB_IMPORT, () => gruvboxLib);

  const grvResult = await compiles(grv);
  if (grvResult === true) {
    ok++;
    continue;
  }

  // Gruvbox failed — is it our fault or pre-existing?
  const ctpResult = await compiles(ctp);
  if (ctpResult === true) {
    regressed++;
    console.error(`REGRESSION ${name}: ${grvResult}`);
  } else {
    preexisting++;
    console.warn(`skip ${name} (pre-existing less.js quirk)`);
  }
}

console.log(
  `Gruvbox check: ${ok} ok, ${preexisting} pre-existing skips, ${regressed} regressions`,
);
if (regressed > 0) Deno.exit(1);
