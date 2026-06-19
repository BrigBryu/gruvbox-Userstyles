import type { Palette } from "@/themes/types.ts";

// Kanagawa by rebelot — https://github.com/rebelot/kanagawa.nvim
const kanagawa: Palette = {
  key: "kanagawa",
  label: "Kanagawa",
  credit: "Kanagawa by rebelot — https://github.com/rebelot/kanagawa.nvim",
  // Kanagawa Wave
  dark: {
    base: "#1f1f28",
    mantle: "#16161d",
    crust: "#1a1a22",
    surface0: "#2a2a37",
    surface1: "#363646",
    surface2: "#54546d",
    overlay0: "#727169",
    overlay1: "#9e9b93",
    overlay2: "#a6a69c",
    text: "#dcd7ba",
    subtext1: "#c8c093",
    subtext0: "#a6a69c",
    red: "#e82424",
    orange: "#ffa066",
    yellow: "#e6c384",
    green: "#98bb6c",
    aqua: "#7aa89f",
    blue: "#7e9cd8",
    purple: "#957fb8",
    overrides: { pink: "#d27e99", maroon: "#ff5d62", sapphire: "#7fb4ca" },
  },
  // Kanagawa Lotus
  light: {
    base: "#f2ecbc",
    mantle: "#e7dba0",
    crust: "#e5ddb0",
    surface0: "#e4d794",
    surface1: "#dcd5ac",
    surface2: "#c9cbac",
    overlay0: "#8a8980",
    overlay1: "#716e61",
    overlay2: "#43436c",
    text: "#545464",
    subtext1: "#5e5c64",
    subtext0: "#716e61",
    red: "#c84053",
    orange: "#cc6d00",
    yellow: "#77713f",
    green: "#6f894e",
    aqua: "#597b75",
    blue: "#4d699b",
    purple: "#624c83",
    overrides: { pink: "#b35b79", maroon: "#d7474b", sapphire: "#5d57a3" },
  },
};

export default kanagawa;
