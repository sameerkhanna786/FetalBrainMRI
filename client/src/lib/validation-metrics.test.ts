import { describe, expect, it } from "vitest";

import {
  computeBinaryValidationMetrics,
  computeDecisionCurve,
  computeAgreementMetrics,
  computeGroupedAgreementMetrics,
  compareQiAuditPhases,
  computeQiAuditSummary,
  computeWilsonScoreInterval,
} from "./validation-metrics";

describe("publication validation metrics", () => {
  it("computes locked-threshold discrimination, Brier score, and calibration summaries", () => {
    const metrics = computeBinaryValidationMetrics(
      [
        { label: true, probability: 0.9 },
        { label: true, probability: 0.8 },
        { label: false, probability: 0.2 },
        { label: false, probability: 0.1 },
      ],
      { threshold: 0.5 }
    );

    expect(metrics.n).toBe(4);
    expect(metrics.positives).toBe(2);
    expect(metrics.negatives).toBe(2);
    expect(metrics.truePositive).toBe(2);
    expect(metrics.falsePositive).toBe(0);
    expect(metrics.trueNegative).toBe(2);
    expect(metrics.falseNegative).toBe(0);
    expect(metrics.sensitivity).toBe(1);
    expect(metrics.specificity).toBe(1);
    expect(metrics.sensitivityInterval.estimate).toBe(1);
    expect(metrics.sensitivityInterval.lower).toBeLessThan(1);
    expect(metrics.specificityInterval.estimate).toBe(1);
    expect(metrics.accuracyInterval.estimate).toBe(1);
    expect(metrics.brierScore).toBeCloseTo(0.025, 6);
    expect(metrics.rocAuc).toBe(1);
    expect(metrics.prAuc).toBe(1);
    expect(metrics.observedEventRate).toBe(0.5);
    expect(metrics.meanPredictedRisk).toBe(0.5);
    expect(metrics.calibrationInTheLarge).toBeCloseTo(0, 6);
    expect(Number.isFinite(metrics.calibrationSlope)).toBe(true);
  });

  it("computes Wilson confidence intervals for locked-threshold proportions", () => {
    const interval = computeWilsonScoreInterval(18, 20);

    expect(interval.estimate).toBe(0.9);
    expect(interval.confidenceLevel).toBe(0.95);
    expect(interval.lower).toBeGreaterThan(0.68);
    expect(interval.lower).toBeLessThan(0.7);
    expect(interval.upper).toBeGreaterThan(0.97);
    expect(interval.upper).toBeLessThan(0.99);
  });

  it("computes decision-curve net benefit against treat-all and treat-none comparators", () => {
    const [point] = computeDecisionCurve(
      [
        { label: true, probability: 0.9 },
        { label: false, probability: 0.8 },
        { label: false, probability: 0.4 },
        { label: true, probability: 0.7 },
      ],
      [0.5]
    );

    expect(point.threshold).toBe(0.5);
    expect(point.truePositive).toBe(2);
    expect(point.falsePositive).toBe(1);
    expect(point.netBenefit).toBeCloseTo(0.25, 6);
    expect(point.treatAllNetBenefit).toBeCloseTo(0, 6);
    expect(point.treatNoneNetBenefit).toBe(0);
  });

  it("rejects invalid validation inputs instead of reporting unstable metrics", () => {
    expect(() =>
      computeBinaryValidationMetrics([{ label: true, probability: 0.8 }])
    ).toThrow("at least one positive and one negative");

    expect(() =>
      computeBinaryValidationMetrics([
        { label: true, probability: 1.2 },
        { label: false, probability: 0.2 },
      ])
    ).toThrow("probability");

    expect(() =>
      computeDecisionCurve(
        [
          { label: true, probability: 0.8 },
          { label: false, probability: 0.2 },
        ],
        [1]
      )
    ).toThrow("threshold");
  });

  it("computes per-parameter agreement and Bland-Altman summaries", () => {
    const metrics = computeAgreementMetrics([
      { reference: 10, observed: 12 },
      { reference: 20, observed: 18 },
      { reference: 30, observed: 33 },
    ]);

    expect(metrics.n).toBe(3);
    expect(metrics.meanAbsoluteError).toBeCloseTo(7 / 3, 6);
    expect(metrics.meanAbsolutePercentageError).toBeCloseTo(13.333333, 6);
    expect(metrics.bias).toBeCloseTo(1, 6);
    expect(metrics.errorStandardDeviation).toBeCloseTo(Math.sqrt(7), 6);
    expect(metrics.lowerLimitOfAgreement).toBeCloseTo(
      1 - 1.96 * Math.sqrt(7),
      6
    );
    expect(metrics.upperLimitOfAgreement).toBeCloseTo(
      1 + 1.96 * Math.sqrt(7),
      6
    );
  });

  it("groups agreement summaries by FeTA robustness strata", () => {
    const grouped = computeGroupedAgreementMetrics(
      [
        { reference: 10, observed: 11, strata: { site: "Kispi" } },
        { reference: 20, observed: 18, strata: { site: "Kispi" } },
        { reference: 30, observed: 36, strata: { site: "UCSF" } },
      ],
      "site"
    );

    expect(grouped).toHaveLength(2);
    expect(grouped[0].stratum).toBe("Kispi");
    expect(grouped[0].metrics.n).toBe(2);
    expect(grouped[0].metrics.meanAbsoluteError).toBeCloseTo(1.5, 6);
    expect(grouped[1].stratum).toBe("UCSF");
    expect(grouped[1].metrics.meanAbsolutePercentageError).toBeCloseTo(20, 6);
  });

  it("computes SPEC 4.10 pre/post QI report-audit summaries", () => {
    const baseline = computeQiAuditSummary([
      {
        durationSec: 600,
        requiredMeasurementCount: 14,
        documentedMeasurementCount: 9,
        explicitZScoreDocumented: false,
        explicitPercentileDocumented: false,
        recommendationCongruent: false,
      },
      {
        durationSec: 480,
        requiredMeasurementCount: 14,
        documentedMeasurementCount: 14,
        explicitZScoreDocumented: true,
        explicitPercentileDocumented: false,
        recommendationCongruent: true,
      },
    ]);
    const intervention = computeQiAuditSummary([
      {
        durationSec: 360,
        requiredMeasurementCount: 14,
        documentedMeasurementCount: 14,
        explicitZScoreDocumented: true,
        explicitPercentileDocumented: true,
        recommendationCongruent: true,
      },
      {
        durationSec: 300,
        requiredMeasurementCount: 14,
        documentedMeasurementCount: 14,
        explicitZScoreDocumented: true,
        explicitPercentileDocumented: true,
        recommendationCongruent: true,
      },
    ]);
    const comparison = compareQiAuditPhases(baseline, intervention);

    expect(baseline.n).toBe(2);
    expect(baseline.meanDurationSec).toBe(540);
    expect(baseline.allRequiredMeasurementsDocumentedRate).toBe(0.5);
    expect(baseline.meanMeasurementCompletenessRate).toBeCloseTo(23 / 28, 6);
    expect(baseline.explicitZScoreDocumentationRate).toBe(0.5);
    expect(baseline.explicitPercentileDocumentationRate).toBe(0);
    expect(baseline.recommendationCongruenceRate).toBe(0.5);
    expect(intervention.allRequiredMeasurementsDocumentedRate).toBe(1);
    expect(comparison.meanDurationDeltaSec).toBe(-210);
    expect(comparison.allRequiredMeasurementsDocumentedRateDelta).toBe(0.5);
    expect(comparison.explicitZScoreDocumentationRateDelta).toBe(0.5);
    expect(comparison.explicitPercentileDocumentationRateDelta).toBe(1);
    expect(comparison.recommendationCongruenceRateDelta).toBe(0.5);
  });
});
