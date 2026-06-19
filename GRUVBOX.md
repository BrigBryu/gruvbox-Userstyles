# Theme-pack docs (unofficial)

Vim-style theme packs (Gruvbox + friends) built as a thin recolor layer on top
of the [Catppuccin userstyles](https://github.com/catppuccin/userstyles).

> Not affiliated with or endorsed by Catppuccin or any theme. All credit for the
> site styles goes to the Catppuccin userstyles maintainers; color palettes
> belong to their respective authors (see the README credits).

## How it works (the architecture)

The upstream styles are never edited. Each Catppuccin style imports a shared
Less library and looks colors up by 26 semantic roles (`@base`, `@text`,
`@mauve`, …). We swap **only that library**, per theme:

```
palettes/<theme>.ts            (19 colors: 12 neutrals + 7 accents, dark + light)
        │  expand() -> 26 Catppuccin roles
        ▼
generated theme lib            (same #lib API + filters, theme colors)
        │  vendored INLINE per style by the generator
        ▼
dist/<theme>.import.json        (one Stylus backup, all styles, self-contained)
```

| File | Purpose |
| --- | --- |
| `palettes/<theme>.ts` | A theme's colors (dark + optional light) + credit. **Edit colors here.** |
| `scripts/themes/types.ts` | `Mode`/`Palette` types + `expand()` (role mapping) + validation. |
| `scripts/themes/registry.ts` | The list of all themes. |
| `scripts/themes/buildlib.ts` | Splices a palette into upstream `lib/lib.less`. |
| `scripts/themes/generate-import.ts` | Builds every `dist/*.import.json`. |
| `scripts/themes/check.ts` | Validates palettes + checks for compile regressions. |

### Light mode is automatic

A palette's `light` variant maps to Catppuccin's `latte` flavor; `dark` maps to
the other three. Since every style already picks `latte` when the OS is in light
mode and `mocha` in dark mode, each import **follows the OS** with no per-style
edits. Themes without an official light variant (Nord, Dracula) omit `light` and
stay dark.

### Why vendor the lib inline?

The generator inlines the theme lib into each style inside the `import.json`, so
the import is **self-contained**: Stylus needs no network and nothing depends on
this repo being reachable. The `styles/**` files stay byte-for-byte upstream,
which keeps `git merge upstream/main` clean — the opposite tradeoff from editing
each style or compiling to plain CSS (which would lose the per-style `@var`
options).

## Install (one time)

1. Install **Stylus**
   ([Chrome Web Store](https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)).
2. Get the import file for your theme from `dist/` (see the README table), by
   cloning this repo or downloading the one JSON from GitHub.
   - If you load it from a local file and Stylus refuses, go to
     `chrome://extensions` → Stylus → **Details** → enable **Allow access to
     file URLs**.
3. Open Stylus → **Manage** → **Backup → Import**.
4. Select the file. All ~134 styles install at once.
5. On themed sites, **disable Dark Reader / other global theming extensions** so
   they don't fight the userstyle.

Verify: open <https://github.com> — it should render in your theme. Toggle your
OS appearance light↔dark to see auto-switching (on themes that ship light).

## Updating later

Updates are manual on purpose. The generated styles have **no `@updateURL`**, so
Stylus never silently pulls the Catppuccin versions back.

```bash
# one-time: point at the upstream Catppuccin repo
git remote add upstream https://github.com/catppuccin/userstyles.git

# each update:
git fetch upstream
git merge upstream/main       # pull in new/updated styles
deno task generate:themes     # regenerate every dist/*.import.json
deno task check:themes        # confirm nothing regressed
```

Then re-import the file(s) in Stylus (**Backup → Import**). Stylus matches by
name and updates the existing styles.

## Commands

| Command | What it does |
| --- | --- |
| `deno task generate:themes` | Build every `dist/<theme>.import.json` (+ Gruvbox accents). |
| `deno task generate:gruvbox` | Build just Gruvbox (and its 7 accent files). |
| `deno task check:themes` | Validate all palettes + fail on any compile regression. |

## Add a new theme

1. Copy an existing file in `palettes/` (e.g. `palettes/nord.ts`) to
   `palettes/<your-theme>.ts`.
2. Fill in the 19 colors for `dark` (and `light` if the theme has one): 12
   neutrals (`base`, `mantle`, `crust`, `surface0-2`, `overlay0-2`, `text`,
   `subtext1`, `subtext0`) + 7 accents (`red`, `orange`, `yellow`, `green`,
   `aqua`, `blue`, `purple`). Use `overrides` for any extra distinct hue (e.g.
   a separate `pink`). Set `key`, `label`, and `credit`.
3. Register it in `scripts/themes/registry.ts`.
4. `deno task generate:themes && deno task check:themes`, then import
   `dist/<your-theme>.import.json`.

## Tweaking Gruvbox accents

Gruvbox emits 7 accent files (`dist/gruvbox-<accent>.import.json`) by setting
each style's `accentColor` default. The accent→role mapping lives in
`GRUVBOX_ACCENTS` in `scripts/themes/generate-import.ts`. For any other theme,
change the accent per-site via Stylus's **Accent** dropdown.

## Known limitations

- **`libreddit`** hardcodes Catppuccin hex values directly instead of using the
  library, so it is **not** recolored. Recolor it by hand if you use it.
- **Light mode** only applies where the theme has a `light` variant *and* the
  site exposes a light theme (most do, via `prefers-color-scheme`). Sites with
  no light theme stay dark. Nord and Dracula are dark-only by design.
- **Image/icon filters** (`@*-filter` CSS filter chains a few styles use to
  recolor SVGs/images) are inherited unchanged from Catppuccin, so recolored
  raster assets won't perfectly match the theme. Most styles don't use them.
- **`deepseek`** trips a pre-existing `rgb(var(--x))` quirk in the offline
  `check` compiler (it fails the same way with the upstream lib), so the checker
  skips it. It still installs and works in Stylus.
