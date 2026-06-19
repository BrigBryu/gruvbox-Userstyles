import type { Palette } from "@/themes/types.ts";

// Dracula by Zeno Rocha — https://draculatheme.com
const dracula: Palette = {
  key: "dracula",
  label: "Dracula",
  credit: "Dracula by Zeno Rocha — https://draculatheme.com",
  // Dark only (Dracula has no official light variant).
  dark: {
    base: "#282a36",
    mantle: "#21222c",
    crust: "#191a21",
    surface0: "#343746",
    surface1: "#44475a",
    surface2: "#565872",
    overlay0: "#6272a4",
    overlay1: "#7b86b8",
    overlay2: "#9aa3d0",
    text: "#f8f8f2",
    subtext1: "#e2e2dc",
    subtext0: "#c8c8c2",
    red: "#ff5555",
    orange: "#ffb86c",
    yellow: "#f1fa8c",
    green: "#50fa7b",
    aqua: "#8be9fd",
    blue: "#8be9fd",
    purple: "#bd93f9",
    // Dracula's signature pink is distinct from its purple.
    overrides: { pink: "#ff79c6", rosewater: "#ff79c6", sapphire: "#6272a4" },
  },
};

export default dracula;
