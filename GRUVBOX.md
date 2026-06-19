# Gruvbox Userstyles (unofficial)

An unofficial **Gruvbox** recolor of the
[Catppuccin userstyles](https://github.com/catppuccin/userstyles), built as a
thin generated layer on top of the upstream repo so it stays easy to update.

> Not affiliated with or endorsed by Catppuccin or Gruvbox. All credit for the
> styles themselves goes to the Catppuccin userstyles maintainers.

## How it works (the architecture)

The upstream styles never get edited. Each Catppuccin style imports a shared
Less library and looks colors up by semantic name (`@base`, `@text`, `@mauve`,
…). We swap **only that library**:

```
upstream styles/**/catppuccin.user.less   (untouched)
        │  each imports lib/lib.less
        ▼
lib/gruvbox-lib.less                       (same #lib API, Gruvbox palette)
        │  vendored INLINE per style by the generator
        ▼
dist/gruvbox-userstyles.import.json        (one Stylus backup, all styles)
```

Three Gruvbox-specific files do all the work:

| File | Purpose |
| --- | --- |
| `lib/gruvbox-palette.less` | The Gruvbox colors, mapped onto Catppuccin's semantic names. **Edit colors here.** |
| `lib/gruvbox-lib.less` | Generated: Gruvbox palette + upstream filters + the `#lib` API. Do not hand-edit. |
| `scripts/gruvbox/generate-import.ts` | Builds the lib and the Stylus import. |

Every Catppuccin flavor (latte / frappé / macchiato / mocha) currently resolves
to **Gruvbox Dark**, so whichever flavor a style defaults to, you get Gruvbox.

### Why vendor the lib inline instead of a remote `@import`?

The generator inlines `lib/gruvbox-lib.less` into each style inside the
`import.json`. That makes the import **self-contained**: Stylus needs no network
and nothing depends on this repo being reachable. The repo's `styles/**` files
stay byte-for-byte upstream, which keeps `git merge upstream/main` clean — the
opposite tradeoff from editing each style or compiling to plain CSS (which would
lose the per-style `@var` options).

## Install (one time)

1. Make/open the Chrome profile you want themed.
2. Install **Stylus** in that profile
   ([Chrome Web Store](https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)).
3. Get the import file `dist/gruvbox-userstyles.import.json`, either by cloning
   this repo or downloading that one file from GitHub.
   - If you load it from a local file and Stylus refuses, go to
     `chrome://extensions` → Stylus → **Details** → enable **Allow access to
     file URLs**.
4. Open Stylus → **Manage** (the gear / "Manage" button).
5. **Backup → Import**.
6. Select `dist/gruvbox-userstyles.import.json`. All ~134 Gruvbox styles install
   at once.
7. On sites where these styles apply, **disable Dark Reader or any other global
   theming extension** so they don't fight the userstyle.

Verify: open <https://github.com> — it should render in Gruvbox.

## Updating later

Updates are manual on purpose. The generated styles have **no `@updateURL`**, so
Stylus will never silently pull the Catppuccin versions back.

```bash
# one-time: point at the upstream Catppuccin repo
git remote add upstream https://github.com/catppuccin/userstyles.git

# each update:
git fetch upstream
git merge upstream/main          # pull in new/updated styles
deno task generate:gruvbox       # regenerate lib + import.json
deno task check:gruvbox          # optional: confirm nothing regressed
```

Then re-import `dist/gruvbox-userstyles.import.json` in Stylus
(**Backup → Import**). Stylus matches by name and updates the existing styles.

## Commands

| Command | What it does |
| --- | --- |
| `deno task generate:gruvbox` | Build `lib/gruvbox-lib.less` and `dist/gruvbox-userstyles.import.json`. |
| `deno task check:gruvbox` | Compile every style with both the Catppuccin and Gruvbox lib; fail only on Gruvbox-introduced regressions. |

## Tweaking the colors

Edit `lib/gruvbox-palette.less` (semantic name → Gruvbox hex) and re-run
`deno task generate:gruvbox`. To build a real light variant later, give the
`@latte` block light Gruvbox values instead of duplicating the dark ones.

## Known limitations

- **Dark-only.** All four flavors map to Gruvbox Dark. A light Gruvbox is not
  implemented; selecting a "Latte/light" option still yields dark colors (a
  style's `color-scheme` may briefly say `light` while colors are dark).
- **`libreddit`** hardcodes Catppuccin hex values directly instead of using the
  library, so it is **not** recolored by the shim. If you use it, recolor that
  one style by hand (or open an issue to special-case it).
- **Image/icon filters** (`@*-filter` CSS filter chains used by a few styles to
  recolor SVGs/images) are inherited unchanged from Catppuccin, so recolored
  raster assets won't perfectly match Gruvbox. Most styles don't use them.
- **`deepseek`** trips a pre-existing `rgb(var(--x))` quirk in the offline
  `check` compiler (it fails the same way with the upstream lib), so the checker
  skips it. It still installs and works in Stylus.
