import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("SPEC §6.3 FeTA validation endpoints", () => {
  it("surfaces the four FeTA 2024 manuscript-grade validation endpoints", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Validation.tsx"),
      "utf8"
    );

    expect(source).toContain("FeTA 2024");
    expect(source).toContain("per-parameter agreement");
    expect(source).toContain(
      "multi-site, multi-vendor, multi-field-strength robustness"
    );
    expect(source).toContain("pathology-versus-neurotypical comparison");
    expect(source).toContain("ROC-AUC");
  });
});
