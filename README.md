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

## Clear installed styles

Use the temporary Chrome helper extension in
[`tools/stylus-cleaner`](tools/stylus-cleaner) to delete only styles generated
by this repo. It previews matches first, downloads a full Stylus backup, then
deletes the exact previewed IDs.

1. Open Chrome → `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select `tools/stylus-cleaner`.
4. Open the **Gruvbox Cleaner** extension popup.
5. Click **Preview**, review the matched styles, then click **Delete matched styles**.
6. Remove the helper extension when you are done.

Chrome will show a debugger-permission warning because the helper intentionally
controls the Stylus Manage tab. The older DevTools helper remains available at
[`site/clear-stylus-console.js`](site/clear-stylus-console.js) as an advanced
fallback.

## Themes

Click a link to download the import file, then **Manage → Backup → Import** it
in Stylus. (Files are published on the
[Releases](https://github.com/BrigBryu/gruvbox-Userstyles/releases/tag/themes)
page, regenerated automatically by CI — they aren't committed to the repo.)

| Theme | Light? | Import file |
| --- | --- | --- |
| **Gruvbox** ⭐ | ✅ auto | [`gruvbox-userstyles.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-userstyles.import.json) — see accents below |
| Tokyo Night | ✅ auto | [`tokyo-night.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/tokyo-night.import.json) |
| Nord | dark only | [`nord.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/nord.import.json) |
| Dracula | dark only | [`dracula.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/dracula.import.json) |
| Solarized | ✅ auto | [`solarized.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/solarized.import.json) |
| Kanagawa | ✅ auto | [`kanagawa.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/kanagawa.import.json) |
| Rosé Pine | ✅ auto | [`rose-pine.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/rose-pine.import.json) |
| One Dark | ✅ auto | [`onedark.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/onedark.import.json) |
| Everforest | ✅ auto | [`everforest.import.json`](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/everforest.import.json) |

### Gruvbox variant files

Gruvbox keeps the normal dark/light palette in every variant file so non-purple
files do not recolor broad UI surfaces. The extra filenames are kept for
backwards-compatible downloads:
[purple](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-purple.import.json) (default) ·
[green](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-green.import.json) ·
[orange](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-orange.import.json) ·
[red](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-red.import.json) ·
[yellow](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-yellow.import.json) ·
[aqua](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-aqua.import.json) ·
[blue](https://github.com/BrigBryu/gruvbox-Userstyles/releases/download/themes/gruvbox-blue.import.json)

Change the accent per-site via Stylus's **Accent** dropdown if a specific site
needs a stronger highlight color.

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
