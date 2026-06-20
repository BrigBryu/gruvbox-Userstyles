import { assertEquals } from "@std/assert";

import {
  legacyMatch,
  REPO_SLUG,
  REPO_URL,
  STRICT_MARKER,
  strictMatch,
  type StylusStyleLike,
} from "../clear-stylus/matcher.ts";

Deno.test("strictMatch requires the exact installed-from marker", () => {
  const style: StylusStyleLike = {
    sourceCode: `/* ${STRICT_MARKER} */\nbody { color: red; }`,
  };

  assertEquals(strictMatch(style), { match: true, reason: "marker" });
});

Deno.test("strictMatch ignores repo URL without marker", () => {
  const style: StylusStyleLike = {
    url: REPO_URL,
    sourceCode: `/* ${REPO_SLUG} */`,
  };

  assertEquals(strictMatch(style), { match: false, reason: "" });
});

Deno.test("legacyMatch requires two independent repo signals", () => {
  const style: StylusStyleLike = {
    url: REPO_URL,
    sourceCode: `/* ${REPO_SLUG} */`,
  };

  assertEquals(legacyMatch(style), {
    match: true,
    reason: "legacy url+source match",
  });
});

Deno.test("legacyMatch rejects a single broad source signal", () => {
  const style: StylusStyleLike = {
    sourceCode: `/* copied from ${REPO_SLUG} */`,
  };

  assertEquals(legacyMatch(style), { match: false, reason: "" });
});

Deno.test("legacyMatch rejects unrelated upstream Catppuccin metadata", () => {
  const style: StylusStyleLike = {
    url: "https://github.com/catppuccin/userstyles",
    usercssData: {
      homepageURL:
        "https://github.com/catppuccin/userstyles/tree/main/styles/github",
      namespace: "github.com/catppuccin/userstyles/styles/github",
    },
  };

  assertEquals(legacyMatch(style), { match: false, reason: "" });
});
