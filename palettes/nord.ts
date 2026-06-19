import type { Palette } from "@/themes/types.ts";

// Nord by Arctic Ice Studio & Sven Greb — https://www.nordtheme.com
const nord: Palette = {
  key: "nord",
  label: "Nord",
  credit: "Nord by Arctic Ice Studio — https://www.nordtheme.com",
  // Dark only (Nord has no official light variant).
  dark: {
    base: "#2e3440",
    mantle: "#2b303b",
    crust: "#242933",
    surface0: "#3b4252",
    surface1: "#434c5e",
    surface2: "#4c566a",
    overlay0: "#60728a",
    overlay1: "#7b88a1",
    overlay2: "#8893a8",
    text: "#eceff4",
    subtext1: "#e5e9f0",
    subtext0: "#d8dee9",
    red: "#bf616a",
    orange: "#d08770",
    yellow: "#ebcb8b",
    green: "#a3be8c",
    aqua: "#8fbcbb",
    blue: "#81a1c1",
    purple: "#b48ead",
    overrides: { sapphire: "#5e81ac", teal: "#88c0d0" },
  },
};

export default nord;
