import type { Palette } from "@/themes/types.ts";

// Rosé Pine by the Rosé Pine team — https://rosepinetheme.com
const rosePine: Palette = {
  key: "rose-pine",
  label: "Rosé Pine",
  credit: "Rosé Pine — https://rosepinetheme.com",
  // Rosé Pine (main)
  dark: {
    base: "#191724",
    mantle: "#1f1d2e",
    crust: "#16141f",
    surface0: "#1f1d2e",
    surface1: "#26233a",
    surface2: "#403d52",
    overlay0: "#6e6a86",
    overlay1: "#908caa",
    overlay2: "#b3afc7",
    text: "#e0def4",
    subtext1: "#908caa",
    subtext0: "#6e6a86",
    red: "#eb6f92",
    orange: "#f6c177",
    yellow: "#f6c177",
    green: "#9ccfd8",
    aqua: "#9ccfd8",
    blue: "#31748f",
    purple: "#c4a7e7",
    overrides: { rosewater: "#ebbcba", pink: "#ebbcba", sapphire: "#31748f" },
  },
  // Rosé Pine Dawn
  light: {
    base: "#faf4ed",
    mantle: "#fffaf3",
    crust: "#f2e9e1",
    surface0: "#fffaf3",
    surface1: "#f2e9e1",
    surface2: "#dfdad9",
    overlay0: "#9893a5",
    overlay1: "#797593",
    overlay2: "#575279",
    text: "#575279",
    subtext1: "#797593",
    subtext0: "#9893a5",
    red: "#b4637a",
    orange: "#ea9d34",
    yellow: "#ea9d34",
    green: "#56949f",
    aqua: "#56949f",
    blue: "#286983",
    purple: "#907aa9",
    overrides: { rosewater: "#d7827e", pink: "#d7827e", sapphire: "#286983" },
  },
};

export default rosePine;
