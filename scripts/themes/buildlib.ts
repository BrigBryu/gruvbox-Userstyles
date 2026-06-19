/**
 * Build a theme's color library: splice the palette's expanded roles into the
 * upstream lib.less `@catppuccin` map (keeping the filters + `#lib` API).
 * Shared by the generator and the checker.
 */
import * as path from "@std/path";
import { REPO_ROOT } from "@/constants.ts";
import {
  CATPPUCCIN_ROLES,
  type CatppuccinRole,
  expand,
  type Mode,
  type Palette,
} from "@/themes/types.ts";
import { getPalette } from "@/themes/registry.ts";

function emitFlavor(roles: Record<CatppuccinRole, string>): string {
  const body = CATPPUCCIN_ROLES.map((r) => `@${r}: ${roles[r]};`).join(" ");
  return `{ ${body} }`;
}

export function buildLib(palette: Palette): string {
  const upstream = Deno.readTextFileSync(
    path.join(REPO_ROOT, "lib", "lib.less"),
  );
  const dark = expand(palette.dark);
  const light = expand((palette.light ?? palette.dark) as Mode);

  const map = [
    "/* deno-fmt-ignore */",
    "@catppuccin: {",
    `  @latte:     ${emitFlavor(light)};`,
    `  @frappe:    ${emitFlavor(dark)};`,
    `  @macchiato: ${emitFlavor(dark)};`,
    `  @mocha:     ${emitFlavor(dark)};`,
    "};",
  ].join("\n");

  const replaced = upstream.replace(/@catppuccin:\s*\{[\s\S]*?\n\};/, () => map);
  if (replaced === upstream) {
    throw new Error("Could not find @catppuccin map in lib/lib.less");
  }
  const header =
    `/* GENERATED theme lib for ${palette.label}. Source: palettes/${palette.key}.ts */\n`;
  return header + replaced;
}

export function buildLibFor(key: string): string {
  const p = getPalette(key);
  if (!p) throw new Error(`Unknown theme: ${key}`);
  return buildLib(p);
}
