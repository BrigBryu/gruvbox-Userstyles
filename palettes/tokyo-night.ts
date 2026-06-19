import type { Palette } from "@/themes/types.ts";

// Tokyo Night by enkia — https://github.com/enkia/tokyo-night-vscode-theme
const tokyoNight: Palette = {
  key: "tokyo-night",
  label: "Tokyo Night",
  credit: "Tokyo Night by enkia — https://github.com/enkia/tokyo-night-vscode-theme",
  dark: {
    base: "#1a1b26",
    mantle: "#16161e",
    crust: "#16161e",
    surface0: "#292e42",
    surface1: "#343a52",
    surface2: "#3b4261",
    overlay0: "#565f89",
    overlay1: "#787c99",
    overlay2: "#9aa5ce",
    text: "#c0caf5",
    subtext1: "#a9b1d6",
    subtext0: "#9aa5ce",
    red: "#f7768e",
    orange: "#ff9e64",
    yellow: "#e0af68",
    green: "#9ece6a",
    aqua: "#7dcfff",
    blue: "#7aa2f7",
    purple: "#bb9af7",
    overrides: { teal: "#73daca", sky: "#2ac3de" },
  },
  // Tokyo Night Day
  light: {
    base: "#e1e2e7",
    mantle: "#d6d8df",
    crust: "#c4c8da",
    surface0: "#cbccd6",
    surface1: "#c4c8da",
    surface2: "#a8aecb",
    overlay0: "#9699a3",
    overlay1: "#848cb5",
    overlay2: "#6172b0",
    text: "#3760bf",
    subtext1: "#3f5273",
    subtext0: "#6172b0",
    red: "#f52a65",
    orange: "#b15c00",
    yellow: "#8c6c3e",
    green: "#587539",
    aqua: "#007197",
    blue: "#2e7de9",
    purple: "#9854f1",
  },
};

export default tokyoNight;
