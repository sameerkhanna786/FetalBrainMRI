import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("SPEC §4.4 workflow controls", () => {
  it("uses the specified reset and copy workflow button labels", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Home.tsx"),
      "utf8"
    );

    expect(source).toContain("Clear All");
    expect(source).toContain("Copy to Clipboard");
  });
});
