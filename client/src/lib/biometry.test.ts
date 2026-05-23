import { describe, expect, it } from "vitest";

import {
  PARAMETERS_ALL,
  computeCrossValidationAudits,
  evaluateAll,
  sourceRegistryFor,
  validateSourceRegistryExtension,
  zscore,
} from "./biometry";
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

describe("Chiari II / open NTD discriminator", () => {
  it("matches the SPEC §6.5.2 TDPF and CSA worked example", () => {
    const ga = { weeks: 24, days: 0 };
    const tdpf = zscore(byId("tdpf"), ga, 24);
    const csa = zscore(byId("csa"), ga, 55);

    expect(tdpf).not.toBeNull();
    expect(csa).not.toBeNull();
    expect(tdpf!.agreementState).toBe("single");
    expect(csa!.agreementState).toBe("single");
    expect(tdpf!.sourceDetails[0].sourceLabel).toBe("Woitek 2014");
    expect(csa!.sourceDetails[0].sourceLabel).toBe("Woitek 2014");
    expect(tdpf!.z).toBeCloseTo(-3.8, 1);
    expect(csa!.z).toBeCloseTo(-3.23, 1);
  });

  it("fires the Chiari II / open neural tube defect card for the worked example", () => {
    const { dxs } = evaluateAll(
      {
        tdpf: 24,
        csa: 55,
      },
      { weeks: 24, days: 0 }
    );

    expect(dxs[0]?.id).toBe("chiari-ii-ontd");
    expect(dxs[0]?.triggerLabel).toContain("ONTD posterior");
    expect(dxs[0]?.severity).toBe("urgent");
  });
});

describe("source-registry acceptance criterion", () => {
  it("accepts an identical source over the overlapping GA window", () => {
    const skullBpd = byId("skull_bpd");
    const existing = sourceRegistryFor(skullBpd)[0];
    const result = validateSourceRegistryExtension(skullBpd, {
      ...existing,
      source: {
        ...existing.source,
        label: "Duplicate Luis 2025",
      },
    });

    expect(result.accepted).toBe(true);
    expect(result.maxDelta).toBe(0);
    expect(result.failures).toHaveLength(0);
  });

  it("rejects a candidate whose mean curve diverges by more than 0.5 SD", () => {
    const skullBpd = byId("skull_bpd");
    const existing = sourceRegistryFor(skullBpd)[0];
    const result = validateSourceRegistryExtension(skullBpd, {
      ...existing,
      source: {
        ...existing.source,
        label: "Shifted candidate",
      },
      model: {
        ...existing.model,
        c:
          existing.model.kind === "luis-quadratic" ? existing.model.c + 10 : 10,
      },
    });

    expect(result.accepted).toBe(false);
    expect(result.maxDelta).toBeGreaterThan(0.5);
    expect(result.failures[0]).toMatchObject({
      candidateSource: "Shifted candidate",
      existingSource: "Luis 2025",
    });
    expect(result.failures[0].gaWeeks).toBeGreaterThanOrEqual(20);
  });
});

describe("periodic cross-validation audit", () => {
  it("derives half-week audit samples for every multi-source parameter", () => {
    const audits = computeCrossValidationAudits();
    const tcd = audits.find(audit => audit.parameterId === "tcd");

    expect(audits.map(audit => audit.parameterId)).toEqual(
      expect.arrayContaining(["tcd", "vermis_cc", "vermis_ap", "pons_ap"])
    );
    expect(tcd).toBeDefined();
    expect(tcd!.sources.map(source => source.label)).toEqual([
      "Luis 2025",
      "Dovjak 2021",
    ]);
    expect(tcd!.samples[0].gaWeeks).toBe(20);
    expect(tcd!.samples[1].gaWeeks).toBe(20.5);
    expect(tcd!.samples.at(-1)!.gaWeeks).toBeLessThanOrEqual(39.3);
    expect(tcd!.maxDelta).toBeGreaterThan(0);
    expect(["pass", "partial-fail", "fail"]).toContain(tcd!.status);
  });
});

describe("DDx source-disagreement propagation", () => {
  it("marks a z-score-triggered card when the contributing row disagrees", () => {
    const { dxs, zs } = evaluateAll(
      {
        tcd: 38,
      },
      { weeks: 28, days: 0 }
    );
    const card = dxs.find(dx => dx.id === "tcd-large");

    expect(zs.tcd?.agreementState).toBe("disagree");
    expect(card).toBeDefined();
    expect(card!.sourceDisagreements).toEqual([
      {
        parameterId: "tcd",
        parameterName: "Transcerebellar diameter",
        disagreementWidth: expect.any(Number),
      },
    ]);
  });
});

describe("third-ventricle source metadata", () => {
  it("uses the SPEC cross-modality approximation metadata and 18-37w range", () => {
    const at18 = zscore(byId("third_ventricle"), { weeks: 18, days: 0 }, 1.6);
    const at38 = zscore(byId("third_ventricle"), { weeks: 38, days: 0 }, 2.0);

    expect(at18?.sourceDetails[0]).toMatchObject({
      sourceLabel: "Birnbaum 2018",
      gaRange: [18, 37],
      inRange: true,
      crossModality: true,
      verificationTier: "approximation",
    });
    expect(at18?.extrapolated).toBe(false);
    expect(at38?.sourceDetails[0]).toMatchObject({
      gaRange: [18, 37],
      inRange: false,
      extrapolated: true,
    });
    expect(at38?.extrapolated).toBe(true);
  });
});

describe("research-mode report flags", () => {
  it("flags the Chiari II / ONTD discriminator as research-mode when it fires", () => {
    const ga = { weeks: 24, days: 0 };
    const values = { tdpf: 24, csa: 55 };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });

    expect(dxs.some(dx => dx.id === "chiari-ii-ontd")).toBe(true);
    expect(report).toContain("Research-mode Chiari II / ONTD discriminator");
  });
});
