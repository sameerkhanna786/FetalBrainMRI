import { describe, expect, it } from "vitest";

import { PARAMETERS_ALL, zscore } from "./biometry";
import { generateReport } from "./report";

const byId = (id: string) => {
  const param = PARAMETERS_ALL.find(p => p.id === id);
  if (!param) throw new Error(`Missing parameter ${id}`);
  return param;
};

describe("multi-source consensus reconciliation", () => {
  it("evaluates every TCD source and computes consensus from in-range sources", () => {
    const result = zscore(byId("tcd"), { weeks: 28, days: 0 }, 33);

    expect(result).not.toBeNull();
    expect(result!.sourceDetails).toHaveLength(2);
    expect(result!.z).toBeCloseTo(0.326, 2);
    expect(result!.agreementState).toBe("agree");
    expect(result!.disagreementWidth).toBeCloseTo(0.98, 2);

    expect(result!.sourceDetails.map(s => s.sourceLabel)).toEqual([
      "Luis 2025",
      "Dovjak 2021",
    ]);
    expect(result!.sourceDetails[0]).toMatchObject({
      inRange: true,
      sourceLabel: "Luis 2025",
    });
    expect(result!.sourceDetails[0].z).toBeCloseTo(0.817, 2);
    expect(result!.sourceDetails[1].z).toBeCloseTo(-0.167, 2);
  });

  it("flags disagreement when in-range TCD source z-scores differ by at least 1 SD", () => {
    const result = zscore(byId("tcd"), { weeks: 28, days: 0 }, 33.2);

    expect(result).not.toBeNull();
    expect(result!.agreementState).toBe("disagree");
    expect(result!.disagreementWidth).toBeGreaterThanOrEqual(1);
    expect(result!.sourceDetails[0].z).toBeCloseTo(0.96, 2);
    expect(result!.sourceDetails[1].z).toBeCloseTo(-0.06, 2);
  });
});

describe("structured report source provenance", () => {
  it("includes per-source values and source-agreement notes for disagreeing rows", () => {
    const ga = { weeks: 28, days: 0 };
    const tcd = byId("tcd");
    const zr = zscore(tcd, ga, 33.2);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values: { tcd: 33.2 },
      zs: { tcd: zr },
      dxs: [],
    });

    expect(report).toContain("multi-source consensus mode");
    expect(report).toContain("Transcerebellar diameter: 33.2 mm");
    expect(report).toContain("agreement: disagree");
    expect(report).toContain("Luis 2025 z +0.96");
    expect(report).toContain("Dovjak 2021 z -0.06");
    expect(report).toContain("SOURCE-AGREEMENT NOTES");
    expect(report).toContain("Transcerebellar diameter Delta z 1.03");
  });
});
