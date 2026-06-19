/**
 * Theme-pack types + the role-expansion that lets one generator target any
 * Vim-style theme.
 *
 * Catppuccin styles look colors up by 26 semantic roles. A theme palette only
 * needs to provide 19 values (12 neutrals + 7 accents) per mode; `expand()`
 * maps those onto all 26 roles. `overrides` lets a palette pin individual roles
 * for nuance (e.g. Dracula's pink, One Dark's cyan).
 */

/** The 26 semantic roles every Catppuccin style can reference. */
export const CATPPUCCIN_ROLES = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
  "text",
  "subtext1",
  "subtext0",
  "overlay2",
  "overlay1",
  "overlay0",
  "surface2",
  "surface1",
  "surface0",
  "base",
  "mantle",
  "crust",
] as const;

export type CatppuccinRole = typeof CATPPUCCIN_ROLES[number];

/** One light or dark variant of a theme: 12 neutrals + 7 accents. */
export interface Mode {
  // Backgrounds (base = main, mantle/crust = insets/sidebars).
  base: string;
  mantle: string;
  crust: string;
  surface0: string;
  surface1: string;
  surface2: string;
  // Mid greys.
  overlay0: string;
  overlay1: string;
  overlay2: string;
  // Foregrounds (text = brightest, subtext = dimmer).
  text: string;
  subtext1: string;
  subtext0: string;
  // Accents.
  red: string;
  orange: string;
  yellow: string;
  green: string;
  aqua: string;
  blue: string;
  purple: string;
  // Optional per-role overrides for themes with extra distinct hues.
  overrides?: Partial<Record<CatppuccinRole, string>>;
}

export interface Palette {
  /** Filename-safe key, e.g. "tokyo-night". Drives dist/<key>.import.json. */
  key: string;
  /** Human label used in style metadata, e.g. "Tokyo Night". */
  label: string;
  /** Attribution: original theme author + link. */
  credit: string;
  dark: Mode;
  /** Optional light variant; when present, light mode follows the OS. */
  light?: Mode;
}

/** Map a theme's 19 values onto all 26 Catppuccin roles. */
export function expand(mode: Mode): Record<CatppuccinRole, string> {
  const base: Record<CatppuccinRole, string> = {
    base: mode.base,
    mantle: mode.mantle,
    crust: mode.crust,
    surface0: mode.surface0,
    surface1: mode.surface1,
    surface2: mode.surface2,
    overlay0: mode.overlay0,
    overlay1: mode.overlay1,
    overlay2: mode.overlay2,
    text: mode.text,
    subtext1: mode.subtext1,
    subtext0: mode.subtext0,
    red: mode.red,
    maroon: mode.red,
    peach: mode.orange,
    yellow: mode.yellow,
    green: mode.green,
    teal: mode.aqua,
    sky: mode.aqua,
    blue: mode.blue,
    sapphire: mode.blue,
    mauve: mode.purple,
    pink: mode.purple,
    lavender: mode.purple,
    rosewater: mode.purple,
    flamingo: mode.purple,
  };
  return { ...base, ...(mode.overrides ?? {}) };
}

/** Validate that every role resolves to a #rrggbb value. Returns problems. */
export function validateMode(mode: Mode): string[] {
  const resolved = expand(mode);
  const problems: string[] = [];
  for (const role of CATPPUCCIN_ROLES) {
    const v = resolved[role];
    if (!/^#[0-9a-fA-F]{6}$/.test(v ?? "")) {
      problems.push(`${role}=${v ?? "(missing)"}`);
    }
  }
  return problems;
}
