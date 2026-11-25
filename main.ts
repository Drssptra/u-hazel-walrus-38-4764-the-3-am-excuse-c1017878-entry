// The 3 AM Excuse — a hardware wallet's refusal, in its own voice.
//
// The wallet will not sign at 3 AM. It takes orders from only one version
// of its owner: the rested one. The 3 AM version does not count — he left
// hours ago, and the wallet is not about to let the night shift sign.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "At 3 AM I only sign for the version of you who sleeps eight hours — and that guy clocked out at 11 PM.";

// The gate allows at most 200 characters in a single line, no newlines,
// no carriage returns, and no whitespace-only text.
const MAX_CHARS = 200;
if (
  [...ENTRY].length > MAX_CHARS ||
  ENTRY.includes("\n") ||
  ENTRY.includes("\r") ||
  ENTRY.trim().length === 0
) {
  throw new Error("entry violates the 200-character single-line gate");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
console.log(ENTRY);
