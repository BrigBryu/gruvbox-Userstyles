export const REPO_URL = "https://github.com/BrigBryu/gruvbox-Userstyles";
export const REPO_SLUG = "BrigBryu/gruvbox-Userstyles";
export const STRICT_MARKER = "installed-from-id: brigbryu-gruvbox-userstyles";

export interface StylusStyleLike {
  id?: number;
  name?: string;
  customName?: string;
  url?: string;
  sourceCode?: string;
  usercssData?: {
    homepageURL?: string;
    namespace?: string;
  };
}

export interface MatchResult {
  match: boolean;
  reason: string;
}

export interface MatchedStyle {
  id: number;
  name: string;
  reason: string;
}

export function displayName(style: StylusStyleLike): string {
  return style.customName || style.name || "(unnamed style)";
}

export function strictMatch(style: StylusStyleLike): MatchResult {
  if (style.sourceCode?.includes(STRICT_MARKER)) {
    return { match: true, reason: "marker" };
  }
  return { match: false, reason: "" };
}

export function matchedRows(
  styles: StylusStyleLike[],
  options: { legacy?: boolean } = {},
): MatchedStyle[] {
  const rows: MatchedStyle[] = [];
  for (const style of styles) {
    const id = style.id;
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) continue;

    const strict = strictMatch(style);
    if (strict.match) {
      rows.push({
        id,
        name: displayName(style),
        reason: strict.reason,
      });
      continue;
    }

    if (options.legacy) {
      const legacy = legacyMatch(style);
      if (legacy.match) {
        rows.push({
          id,
          name: displayName(style),
          reason: legacy.reason,
        });
      }
    }
  }
  return rows;
}

export function legacyMatch(style: StylusStyleLike): MatchResult {
  const signals: string[] = [];
  const metadata = style.usercssData ?? {};
  const source = style.sourceCode ?? "";

  if (style.url === REPO_URL) signals.push("url");
  if (metadata.homepageURL === REPO_URL) signals.push("homepageURL");
  if (metadata.namespace?.includes(REPO_SLUG)) signals.push("namespace");
  if (source.includes(REPO_SLUG)) signals.push("source");

  if (signals.length >= 2) {
    return { match: true, reason: `legacy ${signals.join("+")} match` };
  }
  return { match: false, reason: "" };
}
