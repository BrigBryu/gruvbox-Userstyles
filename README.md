<h1 align="center">Vim-theme Userstyles (unofficial)</h1>

<p align="center">
<a href="https://github.com/morhetz/gruvbox">Gruvbox</a> and other Vim-style
themes for your favorite sites, built as a thin recolor layer on top of the
<a href="https://github.com/catppuccin/userstyles">Catppuccin Userstyles</a>,
for the <a href="https://add0n.com/stylus.html">Stylus</a> browser extension.
</p>

<p align="center">
<b>Not affiliated with Catppuccin, Gruvbox, or any theme below.</b> Personal fork.
</p>

<p align="center">
<i>Made for myself, out of my appreciation for Gruvbox.</i>
</p>

## Install

1. Install **Stylus** ([Chrome](https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) · [Firefox](https://addons.mozilla.org/firefox/addon/styl-us/)).
2. Download the import file for the theme you want (table below).
3. In Stylus: **Manage → Backup → Import** that file. All styles install at once.

Each file installs ~134 site styles and, where the theme has a light variant,
**auto-switches with your OS** (light by day, dark by night). Re-importing a
different theme cleanly replaces the previous one.

## Themes

Download links (right-click → Save, or open and save the raw JSON):

| Theme | Light? | Import file |
| --- | --- | --- |
| **Gruvbox** ⭐ | ✅ auto | [`gruvbox-userstyles.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-userstyles.import.json) — see accents below |
| Tokyo Night | ✅ auto | [`tokyo-night.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/tokyo-night.import.json) |
| Nord | dark only | [`nord.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/nord.import.json) |
| Dracula | dark only | [`dracula.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/dracula.import.json) |
| Solarized | ✅ auto | [`solarized.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/solarized.import.json) |
| Kanagawa | ✅ auto | [`kanagawa.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/kanagawa.import.json) |
| Rosé Pine | ✅ auto | [`rose-pine.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/rose-pine.import.json) |
| One Dark | ✅ auto | [`onedark.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/onedark.import.json) |
| Everforest | ✅ auto | [`everforest.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/everforest.import.json) |

### Gruvbox accents

Gruvbox ships in seven accent flavors — pick one:
[purple](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-purple.import.json) (default) ·
[green](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-green.import.json) ·
[orange](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-orange.import.json) ·
[red](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-red.import.json) ·
[yellow](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-yellow.import.json) ·
[aqua](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-aqua.import.json) ·
[blue](https://github.com/BrigBryu/gruvbox-Userstyles/raw/main/dist/gruvbox-blue.import.json)

For other themes you can change the accent per-site via Stylus's **Accent**
dropdown on each style.

Full docs, the update workflow, how to **add a new theme**, and known
limitations are in **[GRUVBOX.md](GRUVBOX.md)**.

## How it works

Catppuccin styles look colors up by semantic role (`base`, `text`, `red`,
`mauve`, …). This fork only swaps the shared color library: a small generator
reads a palette file (`palettes/<theme>.ts`), maps those roles to the theme's
colors, and vendors the result into a Stylus import. The upstream style files
are never touched, so pulling future Catppuccin updates stays a clean merge.

## Credit

The site styles and tooling are the work of the **[Catppuccin Userstyles](https://github.com/catppuccin/userstyles)**
contributors — this fork only changes colors. Licensed [MIT](LICENSE) (original
copyright © Catppuccin retained). Theme color palettes belong to their authors:

- Gruvbox — [Pavel Pertsev](https://github.com/morhetz/gruvbox)
- Tokyo Night — [enkia](https://github.com/enkia/tokyo-night-vscode-theme)
- Nord — [Arctic Ice Studio](https://www.nordtheme.com)
- Dracula — [Zeno Rocha](https://draculatheme.com)
- Solarized — [Ethan Schoonover](https://ethanschoonover.com/solarized)
- Kanagawa — [rebelot](https://github.com/rebelot/kanagawa.nvim)
- Rosé Pine — [Rosé Pine](https://rosepinetheme.com)
- One Dark — [Atom](https://github.com/atom/atom)
- Everforest — [sainnhe](https://github.com/sainnhe/everforest)
