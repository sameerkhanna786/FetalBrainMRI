import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("SPEC §7.5 row-level source detail disclosure", () => {
  it("renders verification metadata and caveat fields from source details", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/components/ParameterRow.tsx"),
      "utf8"
    );

    expect(source).toContain("source.verificationTier");
    expect(source).toContain("source.verificationDate");
    expect(source).toContain("source.caveat");
  });
});
