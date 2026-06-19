import type { Palette } from "@/themes/types.ts";

import gruvbox from "../../palettes/gruvbox.ts";
import tokyoNight from "../../palettes/tokyo-night.ts";
import nord from "../../palettes/nord.ts";
import dracula from "../../palettes/dracula.ts";
import solarized from "../../palettes/solarized.ts";
import kanagawa from "../../palettes/kanagawa.ts";
import rosePine from "../../palettes/rose-pine.ts";
import onedark from "../../palettes/onedark.ts";
import everforest from "../../palettes/everforest.ts";

/** All theme packs. Gruvbox is the hero (and gets accent variants). */
export const PALETTES: Palette[] = [
  gruvbox,
  tokyoNight,
  nord,
  dracula,
  solarized,
  kanagawa,
  rosePine,
  onedark,
  everforest,
];

export function getPalette(key: string): Palette | undefined {
  return PALETTES.find((p) => p.key === key);
}
