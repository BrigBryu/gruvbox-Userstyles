import type { Palette } from "@/themes/types.ts";

// One Dark / One Light by GitHub/Atom — https://github.com/atom/one-dark-syntax
const onedark: Palette = {
  key: "onedark",
  label: "One Dark",
  credit: "One Dark by Atom — https://github.com/atom/atom",
  dark: {
    base: "#282c34",
    mantle: "#21252b",
    crust: "#1b1f23",
    surface0: "#2c313a",
    surface1: "#3b4048",
    surface2: "#4b5263",
    overlay0: "#5c6370",
    overlay1: "#828997",
    overlay2: "#9da5b4",
    text: "#abb2bf",
    subtext1: "#9da5b4",
    subtext0: "#828997",
    red: "#e06c75",
    orange: "#d19a66",
    yellow: "#e5c07b",
    green: "#98c379",
    aqua: "#56b6c2",
    blue: "#61afef",
    purple: "#c678dd",
  },
  // One Light
  light: {
    base: "#fafafa",
    mantle: "#eaeaeb",
    crust: "#dbdbdc",
    surface0: "#eaeaeb",
    surface1: "#dbdbdc",
    surface2: "#c2c2c3",
    overlay0: "#a0a1a7",
    overlay1: "#8b8b8c",
    overlay2: "#696c77",
    text: "#383a42",
    subtext1: "#494b53",
    subtext0: "#696c77",
    red: "#e45649",
    orange: "#986801",
    yellow: "#c18401",
    green: "#50a14f",
    aqua: "#0184bc",
    blue: "#4078f2",
    purple: "#a626a4",
  },
};

export default onedark;
