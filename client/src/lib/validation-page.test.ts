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

describe("SPEC §6.4 institutional validation cohort", () => {
  it("surfaces the institutional cohort composition and study roles", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Validation.tsx"),
      "utf8"
    );

    expect(source).toContain("60-case institutional cohort");
    expect(source).toContain("20 neurotypical");
    expect(source).toContain("20 mild-or-moderate pathology");
    expect(source).toContain("20 severe pathology");
    expect(source).toContain("expert ground-truth measurements");
    expect(source).toContain("per-condition labels");
    expect(source).toContain("with-tool-versus-without-tool reader study");
    expect(source).toContain("inter-rater reliability");
  });
});

describe("SPEC §6.6 validation dataset cross-reference", () => {
  it("surfaces rejected validation datasets and their caveats", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Validation.tsx"),
      "utf8"
    );

    expect(source).toContain("dHCP fetal release");
    expect(source).toContain("lacks expert-measured biometry");
    expect(source).toContain("does not include case-level pathology labels");
    expect(source).toContain("Luis 2025 normative cohort");
    expect(source).toContain("circular validation");
    expect(source).toContain("source-registry acceptance criterion");
  });
});

describe("SPEC §6.7 validation timeline", () => {
  it("surfaces the external-access, institutional, and manuscript timelines", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Validation.tsx"),
      "utf8"
    );

    expect(source).toContain("Synapse Data Access Request");
    expect(source).toContain("Data Transfer Agreement");
    expect(source).toContain("two-to-four-week access");
    expect(source).toContain("three-to-four-week analysis");
    expect(source).toContain("four-to-six-week IRB submission");
    expect(source).toContain("six-to-twelve-week reader study");
    expect(source).toContain("six-to-nine-month manuscript path");
  });
});
