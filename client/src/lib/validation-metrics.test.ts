import { describe, expect, it } from "vitest";

import {
  computeBinaryValidationMetrics,
  computeDecisionCurve,
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
    expect(metrics.brierScore).toBeCloseTo(0.025, 6);
    expect(metrics.rocAuc).toBe(1);
    expect(metrics.prAuc).toBe(1);
    expect(metrics.observedEventRate).toBe(0.5);
    expect(metrics.meanPredictedRisk).toBe(0.5);
    expect(metrics.calibrationInTheLarge).toBeCloseTo(0, 6);
    expect(Number.isFinite(metrics.calibrationSlope)).toBe(true);
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
});
