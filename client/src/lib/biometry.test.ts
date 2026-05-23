import { describe, expect, it } from "vitest";

import {
  PARAMETERS_ALL,
  computeCrossValidationAudits,
  evaluateAll,
  parseGestationalAge,
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

describe("gestational-age parsing", () => {
  it("accepts weeks-plus-days and decimal-week input forms", () => {
    expect(parseGestationalAge("24+3")).toEqual({ weeks: 24, days: 3 });
    expect(parseGestationalAge("24w 3d")).toEqual({ weeks: 24, days: 3 });
    expect(parseGestationalAge("24.5 w")).toEqual({ weeks: 24, days: 4 });
  });

  it("rejects invalid day values", () => {
    expect(parseGestationalAge("24+7")).toBeNull();
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

describe("normal-control report impression", () => {
  it("uses the TEST.md normal-control impression line", () => {
    const ga = { weeks: 28, days: 0 };
    const skullBpd = byId("skull_bpd");
    const zr = zscore(skullBpd, ga, 75.5);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values: { skull_bpd: 75.5 },
      zs: { skull_bpd: zr },
      dxs: [],
    });

    expect(report).toContain("IMPRESSION\nNo abnormal biometric findings.");
  });
});

describe("mild ventriculomegaly report impression", () => {
  it("uses the TEST.md Case M1 isolated mild VM impression line", () => {
    const ga = { weeks: 24, days: 0 };
    const values = {
      atrial_left: 11,
      atrial_right: 11,
    };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });

    expect(dxs.map(dx => dx.id)).toContain("mild-vm");
    expect(report).toContain(
      "Isolated mild ventriculomegaly; consider postnatal MRI follow-up. Pooled neurodevelopmental delay rate ~7.9% (Pagani 2014)."
    );
  });
});

describe("asymmetric mild ventriculomegaly report impression", () => {
  it("uses the TEST.md Case M3 asymmetric mild VM impression line", () => {
    const ga = { weeks: 28, days: 0 };
    const values = {
      atrial_right: 12,
      atrial_left: 7.4,
    };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });

    expect(dxs.map(dx => dx.id)).toEqual(
      expect.arrayContaining(["mild-vm", "asym-vent"])
    );
    expect(report).toContain(
      "Right-sided mild ventriculomegaly with marked side-to-side asymmetry; recommend dedicated workup for unilateral causes (intra-ventricular obstruction, encephaloclastic insult, germinal matrix haemorrhage)."
    );
  });
});

describe("isolated severe ventriculomegaly report impression", () => {
  it("uses the TEST.md Case S3 isolated severe VM impression line", () => {
    const ga = { weeks: 28, days: 0 };
    const values = {
      atrial_right: 17.5,
      atrial_left: 17.5,
      csp_width: 4.4,
      cc_length: 32.5,
      third_ventricle: 2,
    };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });
    const dxIds = dxs.map(dx => dx.id);

    expect(dxIds).toContain("severe-vm");
    expect(dxIds).not.toContain("mild-vm");
    expect(dxIds).not.toContain("hydrocephalus-pattern");
    expect(dxIds).not.toContain("acc-pattern");
    expect(dxIds).not.toContain("hpe-pattern");
    expect(report).toContain(
      "Apparently isolated severe ventriculomegaly. Postnatal MRI is recommended to confirm the absence of associated anomalies. Per Carta 2018: ~80% survival, ~40% normal neurodevelopment among survivors."
    );
  });
});

describe("aqueductal-stenosis pattern report impression", () => {
  it("uses the TEST.md Case S1 triventricular hydrocephalus impression line", () => {
    const ga = { weeks: 26, days: 0 };
    const values = {
      skull_bpd: 72,
      skull_ofd: 100,
      brain_bpd: 65.5,
      brain_ofd_left: 88,
      brain_ofd_right: 88.1,
      atrial_right: 18,
      atrial_left: 18,
      csp_width: 3.9,
      cc_length: 28,
      third_ventricle: 4.5,
    };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });
    const dxIds = dxs.map(dx => dx.id);

    expect(dxIds).toEqual(
      expect.arrayContaining([
        "severe-vm",
        "third-v-wide",
        "macrocephaly",
        "hydrocephalus-pattern",
      ])
    );
    expect(dxIds).not.toContain("mild-vm");
    expect(dxIds).not.toContain("acc-pattern");
    expect(dxIds).not.toContain("hpe-pattern");
    expect(report).toContain(
      "Severe triventricular hydrocephalus with preserved CSP and macrocephaly — pattern most consistent with congenital aqueductal stenosis."
    );
  });
});

describe("ACC pattern report impression", () => {
  it("uses the TEST.md Case S2 complete ACC impression line", () => {
    const ga = { weeks: 24, days: 0 };
    const values = {
      skull_bpd: 60.6,
      skull_ofd: 84.5,
      brain_bpd: 58.4,
      brain_ofd_left: 79.5,
      brain_ofd_right: 79.6,
      atrial_right: 16,
      atrial_left: 16,
      csp_width: 0,
      cc_length: 0,
      third_ventricle: 1.5,
    };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });
    const dxIds = dxs.map(dx => dx.id);

    expect(dxIds).toEqual(
      expect.arrayContaining([
        "severe-vm",
        "absent-csp",
        "cc-absent",
        "acc-pattern",
      ])
    );
    expect(dxIds).not.toContain("mild-vm");
    expect(dxIds).not.toContain("hydrocephalus-pattern");
    expect(dxIds).not.toContain("hpe-pattern");
    expect(report).toContain(
      "Complete agenesis of the corpus callosum with associated colpocephaly. Counselling per Santo 2012: 65–75% normal neurodevelopment when isolated; 30% monogenic aetiology."
    );
  });
});

describe("HPE pattern report impression", () => {
  it("uses the TEST.md Case S5 alobar HPE impression line", () => {
    const ga = { weeks: 32, days: 0 };
    const values = {
      skull_bpd: 75,
      skull_ofd: 95,
      brain_bpd: 73,
      brain_ofd_left: 92,
      brain_ofd_right: 92,
      atrial_right: 20,
      atrial_left: 20,
      csp_width: 0,
      cc_length: 0,
    };
    const { zs, dxs } = evaluateAll(values, ga);
    const report = generateReport({
      ga,
      fieldStrength: "1.5T",
      motion: "None",
      values,
      zs,
      dxs,
    });
    const dxIds = dxs.map(dx => dx.id);

    expect(dxIds).toEqual(
      expect.arrayContaining([
        "severe-vm",
        "absent-csp",
        "cc-absent",
        "microcephaly",
        "hpe-pattern",
      ])
    );
    expect(dxIds).not.toContain("acc-pattern");
    expect(dxIds).not.toContain("hydrocephalus-pattern");
    expect(report).toContain(
      "Alobar holoprosencephaly. Counselling per Malinger 2013: poor prognosis; chromosomal microarray and exome sequencing indicated."
    );
  });
});

describe("mixed-tier asymmetric ventriculomegaly triggers", () => {
  it("fires severe VM, mild VM, and asymmetry for TEST.md Case S4", () => {
    const { dxs } = evaluateAll(
      {
        atrial_right: 15.5,
        atrial_left: 11,
        csp_width: 4.7,
        cc_length: 36,
        third_ventricle: 1.7,
      },
      { weeks: 30, days: 0 }
    );
    const dxIds = dxs.map(dx => dx.id);

    expect(dxIds).toEqual(
      expect.arrayContaining(["severe-vm", "mild-vm", "asym-vent"])
    );
    expect(dxIds).not.toContain("hydrocephalus-pattern");
    expect(dxIds).not.toContain("acc-pattern");
    expect(dxIds).not.toContain("hpe-pattern");
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
