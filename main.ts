// The 3 AM Excuse (v2, revised) — the wallet refuses a 3 AM signature
// because the requester is a sleepwalker, and nobody hands car keys to
// a sleepwalker. The twist: the sleepwalker is the owner themselves.
// Entry is assembled from its two clauses so the em-dash join is the
// only punctuation decision; the text itself is never edited in place.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type Clause = { text: string; joinBefore: string };

const CLAUSES: Clause[] = [
  { text: "You wouldn't hand car keys to a sleepwalker", joinBefore: "" },
  {
    text: "so at 3 AM I'm not handing yours to one, and the sleepwalker is you.",
    joinBefore: " — ",
  },
];

function assemble(clauses: Clause[]): string {
  return clauses.reduce(
    (acc, clause) => acc + clause.joinBefore + clause.text,
    "",
  );
}

function assertGate(text: string): void {
  const problems: string[] = [];
  if (text.length === 0 || text.length > 200) problems.push("length");
  if (/[\r\n]/.test(text)) problems.push("newline");
  if (text.trim() !== text || text.trim().length === 0)
    problems.push("whitespace");
  if (problems.length > 0) {
    throw new Error(`entry fails gate (${problems.join(", ")})`);
  }
}

async function main(): Promise<void> {
  const entry = assemble(CLAUSES);
  assertGate(entry);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  await mkdir(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  await writeFile(target, entry, { encoding: "utf8" });
  // Revision pass: read the file back and refuse to report success
  // unless what landed on disk is byte-for-byte the assembled entry.
  const written = await readFile(target, "utf8");
  if (written !== entry) {
    throw new Error("entry.txt on disk does not match the assembled entry");
  }
  process.stdout.write(entry + "\n");
}

await main();
