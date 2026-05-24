export type BinaryLabel = boolean | 0 | 1;

export interface ValidationPrediction {
  label: BinaryLabel;
  probability: number;
}

export interface AgreementPair {
  reference: number;
  observed: number;
  strata?: Record<string, string>;
}

export interface AgreementMetrics {
  n: number;
  meanError: number;
  bias: number;
  meanAbsoluteError: number;
  meanAbsolutePercentageError: number;
  errorStandardDeviation: number | null;
  lowerLimitOfAgreement: number | null;
  upperLimitOfAgreement: number | null;
}

export interface ConfidenceInterval {
  estimate: number;
  lower: number;
  upper: number;
  confidenceLevel: number;
}

export interface GroupedAgreementMetrics {
  stratum: string;
  metrics: AgreementMetrics;
}

export interface BinaryValidationMetrics {
  n: number;
  positives: number;
  negatives: number;
  threshold: number;
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  sensitivity: number;
  specificity: number;
  positivePredictiveValue: number | null;
  negativePredictiveValue: number | null;
  accuracy: number;
  sensitivityInterval: ConfidenceInterval;
  specificityInterval: ConfidenceInterval;
  positivePredictiveValueInterval: ConfidenceInterval | null;
  negativePredictiveValueInterval: ConfidenceInterval | null;
  accuracyInterval: ConfidenceInterval;
  brierScore: number;
  rocAuc: number;
  prAuc: number;
  observedEventRate: number;
  meanPredictedRisk: number;
  calibrationInTheLarge: number;
  calibrationSlope: number;
}

export interface DecisionCurvePoint {
  threshold: number;
  truePositive: number;
  falsePositive: number;
  netBenefit: number;
  treatAllNetBenefit: number;
  treatNoneNetBenefit: 0;
}

export interface QiReportAuditRecord {
  durationSec: number;
  requiredMeasurementCount: number;
  documentedMeasurementCount: number;
  explicitZScoreDocumented: boolean;
  explicitPercentileDocumented: boolean;
  recommendationCongruent?: boolean | null;
}

export interface QiAuditSummary {
  n: number;
  meanDurationSec: number;
  allRequiredMeasurementsDocumentedRate: number;
  meanMeasurementCompletenessRate: number;
  explicitZScoreDocumentationRate: number;
  explicitPercentileDocumentationRate: number;
  recommendationCongruenceRate: number | null;
  recommendationCongruenceDenominator: number;
}

export interface QiAuditComparison {
  baseline: QiAuditSummary;
  intervention: QiAuditSummary;
  meanDurationDeltaSec: number;
  meanDurationRelativeChange: number;
  allRequiredMeasurementsDocumentedRateDelta: number;
  meanMeasurementCompletenessRateDelta: number;
  explicitZScoreDocumentationRateDelta: number;
  explicitPercentileDocumentationRateDelta: number;
  recommendationCongruenceRateDelta: number | null;
}

interface NormalizedPrediction {
  label: 0 | 1;
  probability: number;
}

const EPSILON = 1e-6;

const criticalZScore = (confidenceLevel: number) => {
  if (confidenceLevel === 0.9) return 1.6448536269514722;
  if (confidenceLevel === 0.95) return 1.959963984540054;
  if (confidenceLevel === 0.99) return 2.5758293035489004;
  throw new Error("confidenceLevel must be 0.9, 0.95, or 0.99");
};

export const computeWilsonScoreInterval = (
  successes: number,
  total: number,
  confidenceLevel = 0.95
): ConfidenceInterval => {
  if (!Number.isInteger(successes) || successes < 0) {
    throw new Error("successes must be a non-negative integer");
  }
  if (!Number.isInteger(total) || total <= 0) {
    throw new Error("total must be a positive integer");
  }
  if (successes > total) {
    throw new Error("successes cannot exceed total");
  }

  const z = criticalZScore(confidenceLevel);
  const estimate = successes / total;
  const zSquared = z * z;
  const denominator = 1 + zSquared / total;
  const adjustedCenter = (estimate + zSquared / (2 * total)) / denominator;
  const adjustedMargin =
    (z *
      Math.sqrt((estimate * (1 - estimate) + zSquared / (4 * total)) / total)) /
    denominator;

  return {
    estimate,
    lower: Math.max(0, adjustedCenter - adjustedMargin),
    upper: Math.min(1, adjustedCenter + adjustedMargin),
    confidenceLevel,
  };
};

const labelToNumber = (label: BinaryLabel): 0 | 1 => {
  if (label === true || label === 1) return 1;
  if (label === false || label === 0) return 0;
  throw new Error("label must be boolean, 0, or 1");
};

const assertThreshold = (threshold: number) => {
  if (!Number.isFinite(threshold) || threshold <= 0 || threshold >= 1) {
    throw new Error("threshold must be a finite value between 0 and 1");
  }
};

const normalizePredictions = (
  predictions: ValidationPrediction[]
): NormalizedPrediction[] => {
  if (predictions.length === 0) {
    throw new Error("validation predictions must not be empty");
  }

  const normalized = predictions.map(prediction => {
    if (
      !Number.isFinite(prediction.probability) ||
      prediction.probability < 0 ||
      prediction.probability > 1
    ) {
      throw new Error("probability must be a finite value between 0 and 1");
    }

    return {
      label: labelToNumber(prediction.label),
      probability: prediction.probability,
    };
  });

  const positives = normalized.filter(prediction => prediction.label === 1);
  const negatives = normalized.length - positives.length;
  if (positives.length === 0 || negatives === 0) {
    throw new Error(
      "validation predictions require at least one positive and one negative case"
    );
  }

  return normalized;
};

const clampProbability = (probability: number) =>
  Math.min(1 - EPSILON, Math.max(EPSILON, probability));

const logit = (probability: number) => {
  const clamped = clampProbability(probability);
  return Math.log(clamped / (1 - clamped));
};

const sigmoid = (value: number) => {
  if (value >= 0) {
    const z = Math.exp(-value);
    return 1 / (1 + z);
  }
  const z = Math.exp(value);
  return z / (1 + z);
};

const brierScore = (predictions: NormalizedPrediction[]) =>
  predictions.reduce((sum, prediction) => {
    const residual = prediction.probability - prediction.label;
    return sum + residual * residual;
  }, 0) / predictions.length;

const rocAuc = (predictions: NormalizedPrediction[]) => {
  const sorted = predictions
    .map((prediction, index) => ({ ...prediction, index }))
    .sort((left, right) => left.probability - right.probability);

  const ranks = new Array<number>(sorted.length);
  let index = 0;
  while (index < sorted.length) {
    let end = index + 1;
    while (
      end < sorted.length &&
      sorted[end].probability === sorted[index].probability
    ) {
      end += 1;
    }

    const averageRank = (index + 1 + end) / 2;
    for (let rankIndex = index; rankIndex < end; rankIndex += 1) {
      ranks[sorted[rankIndex].index] = averageRank;
    }
    index = end;
  }

  const positives = predictions.filter(prediction => prediction.label === 1);
  const negatives = predictions.length - positives.length;
  const positiveRankSum = predictions.reduce(
    (sum, prediction, predictionIndex) =>
      prediction.label === 1 ? sum + ranks[predictionIndex] : sum,
    0
  );

  return (
    (positiveRankSum - (positives.length * (positives.length + 1)) / 2) /
    (positives.length * negatives)
  );
};

const prAuc = (predictions: NormalizedPrediction[]) => {
  const sorted = [...predictions].sort(
    (left, right) => right.probability - left.probability
  );
  const positives = predictions.filter(prediction => prediction.label === 1);

  let truePositive = 0;
  let precisionSum = 0;
  sorted.forEach((prediction, index) => {
    if (prediction.label === 1) {
      truePositive += 1;
      precisionSum += truePositive / (index + 1);
    }
  });

  return precisionSum / positives.length;
};

const calibrationSlope = (predictions: NormalizedPrediction[]) => {
  const xs = predictions.map(prediction => logit(prediction.probability));
  let intercept = 0;
  let slope = 1;
  const ridge = 1e-4;

  for (let iteration = 0; iteration < 50; iteration += 1) {
    let gradientIntercept = 0;
    let gradientSlope = 0;
    let infoInterceptIntercept = ridge;
    let infoInterceptSlope = 0;
    let infoSlopeSlope = ridge;

    predictions.forEach((prediction, index) => {
      const x = xs[index];
      const fitted = sigmoid(intercept + slope * x);
      const weight = Math.max(fitted * (1 - fitted), 1e-9);
      const residual = prediction.label - fitted;

      gradientIntercept += residual;
      gradientSlope += residual * x;
      infoInterceptIntercept += weight;
      infoInterceptSlope += weight * x;
      infoSlopeSlope += weight * x * x;
    });

    const determinant =
      infoInterceptIntercept * infoSlopeSlope -
      infoInterceptSlope * infoInterceptSlope;
    if (Math.abs(determinant) < 1e-12) break;

    const deltaIntercept =
      (gradientIntercept * infoSlopeSlope -
        gradientSlope * infoInterceptSlope) /
      determinant;
    const deltaSlope =
      (infoInterceptIntercept * gradientSlope -
        infoInterceptSlope * gradientIntercept) /
      determinant;

    intercept += deltaIntercept;
    slope += deltaSlope;
    if (Math.abs(deltaIntercept) + Math.abs(deltaSlope) < 1e-8) break;
  }

  return slope;
};

export const computeBinaryValidationMetrics = (
  predictions: ValidationPrediction[],
  options: { threshold?: number; confidenceLevel?: number } = {}
): BinaryValidationMetrics => {
  const threshold = options.threshold ?? 0.5;
  const confidenceLevel = options.confidenceLevel ?? 0.95;
  assertThreshold(threshold);
  const normalized = normalizePredictions(predictions);

  let truePositive = 0;
  let falsePositive = 0;
  let trueNegative = 0;
  let falseNegative = 0;

  normalized.forEach(prediction => {
    const predictedPositive = prediction.probability >= threshold;
    if (predictedPositive && prediction.label === 1) truePositive += 1;
    if (predictedPositive && prediction.label === 0) falsePositive += 1;
    if (!predictedPositive && prediction.label === 0) trueNegative += 1;
    if (!predictedPositive && prediction.label === 1) falseNegative += 1;
  });

  const positives = truePositive + falseNegative;
  const negatives = trueNegative + falsePositive;
  const observedEventRate = positives / normalized.length;
  const meanPredictedRisk =
    normalized.reduce((sum, prediction) => sum + prediction.probability, 0) /
    normalized.length;
  const predictedPositive = truePositive + falsePositive;
  const predictedNegative = trueNegative + falseNegative;
  const positivePredictiveValue =
    predictedPositive === 0 ? null : truePositive / predictedPositive;
  const negativePredictiveValue =
    predictedNegative === 0 ? null : trueNegative / predictedNegative;

  return {
    n: normalized.length,
    positives,
    negatives,
    threshold,
    truePositive,
    falsePositive,
    trueNegative,
    falseNegative,
    sensitivity: truePositive / positives,
    specificity: trueNegative / negatives,
    positivePredictiveValue,
    negativePredictiveValue,
    accuracy: (truePositive + trueNegative) / normalized.length,
    sensitivityInterval: computeWilsonScoreInterval(
      truePositive,
      positives,
      confidenceLevel
    ),
    specificityInterval: computeWilsonScoreInterval(
      trueNegative,
      negatives,
      confidenceLevel
    ),
    positivePredictiveValueInterval:
      positivePredictiveValue == null
        ? null
        : computeWilsonScoreInterval(
            truePositive,
            predictedPositive,
            confidenceLevel
          ),
    negativePredictiveValueInterval:
      negativePredictiveValue == null
        ? null
        : computeWilsonScoreInterval(
            trueNegative,
            predictedNegative,
            confidenceLevel
          ),
    accuracyInterval: computeWilsonScoreInterval(
      truePositive + trueNegative,
      normalized.length,
      confidenceLevel
    ),
    brierScore: brierScore(normalized),
    rocAuc: rocAuc(normalized),
    prAuc: prAuc(normalized),
    observedEventRate,
    meanPredictedRisk,
    calibrationInTheLarge: logit(observedEventRate) - logit(meanPredictedRisk),
    calibrationSlope: calibrationSlope(normalized),
  };
};

export const computeDecisionCurve = (
  predictions: ValidationPrediction[],
  thresholds: number[]
): DecisionCurvePoint[] => {
  if (thresholds.length === 0) {
    throw new Error("decision-curve thresholds must not be empty");
  }

  thresholds.forEach(assertThreshold);
  const normalized = normalizePredictions(predictions);
  const positives = normalized.filter(
    prediction => prediction.label === 1
  ).length;
  const negatives = normalized.length - positives;

  return thresholds.map(threshold => {
    let truePositive = 0;
    let falsePositive = 0;
    normalized.forEach(prediction => {
      if (prediction.probability < threshold) return;
      if (prediction.label === 1) {
        truePositive += 1;
      } else {
        falsePositive += 1;
      }
    });

    const thresholdOdds = threshold / (1 - threshold);
    return {
      threshold,
      truePositive,
      falsePositive,
      netBenefit:
        truePositive / normalized.length -
        (falsePositive / normalized.length) * thresholdOdds,
      treatAllNetBenefit:
        positives / normalized.length -
        (negatives / normalized.length) * thresholdOdds,
      treatNoneNetBenefit: 0,
    };
  });
};

const normalizeAgreementPairs = (pairs: AgreementPair[]) => {
  if (pairs.length === 0) {
    throw new Error("agreement pairs must not be empty");
  }

  pairs.forEach(pair => {
    if (!Number.isFinite(pair.reference) || !Number.isFinite(pair.observed)) {
      throw new Error("agreement reference and observed values must be finite");
    }
    if (pair.reference === 0) {
      throw new Error("agreement reference values must be non-zero for MAPE");
    }
  });

  return pairs;
};

export const computeAgreementMetrics = (
  pairs: AgreementPair[]
): AgreementMetrics => {
  const normalized = normalizeAgreementPairs(pairs);
  const errors = normalized.map(pair => pair.observed - pair.reference);
  const meanError =
    errors.reduce((sum, error) => sum + error, 0) / normalized.length;
  const meanAbsoluteError =
    errors.reduce((sum, error) => sum + Math.abs(error), 0) / normalized.length;
  const meanAbsolutePercentageError =
    (normalized.reduce(
      (sum, pair) =>
        sum + Math.abs((pair.observed - pair.reference) / pair.reference),
      0
    ) /
      normalized.length) *
    100;

  const errorStandardDeviation =
    normalized.length < 2
      ? null
      : Math.sqrt(
          errors.reduce((sum, error) => {
            const centered = error - meanError;
            return sum + centered * centered;
          }, 0) /
            (normalized.length - 1)
        );

  return {
    n: normalized.length,
    meanError,
    bias: meanError,
    meanAbsoluteError,
    meanAbsolutePercentageError,
    errorStandardDeviation,
    lowerLimitOfAgreement:
      errorStandardDeviation == null
        ? null
        : meanError - 1.96 * errorStandardDeviation,
    upperLimitOfAgreement:
      errorStandardDeviation == null
        ? null
        : meanError + 1.96 * errorStandardDeviation,
  };
};

export const computeGroupedAgreementMetrics = (
  pairs: AgreementPair[],
  stratumKey: string
): GroupedAgreementMetrics[] => {
  if (stratumKey.trim() === "") {
    throw new Error("stratum key must not be empty");
  }

  const normalized = normalizeAgreementPairs(pairs);
  const groups = new Map<string, AgreementPair[]>();

  normalized.forEach(pair => {
    const stratum = pair.strata?.[stratumKey];
    if (stratum == null || stratum === "") {
      throw new Error(`agreement pair is missing stratum ${stratumKey}`);
    }

    const group = groups.get(stratum) ?? [];
    group.push(pair);
    groups.set(stratum, group);
  });

  return Array.from(groups.entries()).map(([stratum, group]) => ({
    stratum,
    metrics: computeAgreementMetrics(group),
  }));
};

const assertAuditCount = (name: string, value: number) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
};

const normalizeQiAuditRecords = (records: QiReportAuditRecord[]) => {
  if (records.length === 0) {
    throw new Error("QI audit records must not be empty");
  }

  records.forEach(record => {
    if (!Number.isFinite(record.durationSec) || record.durationSec < 0) {
      throw new Error("durationSec must be a finite non-negative value");
    }
    assertAuditCount(
      "requiredMeasurementCount",
      record.requiredMeasurementCount
    );
    assertAuditCount(
      "documentedMeasurementCount",
      record.documentedMeasurementCount
    );
    if (record.requiredMeasurementCount === 0) {
      throw new Error("requiredMeasurementCount must be greater than zero");
    }
    if (record.documentedMeasurementCount > record.requiredMeasurementCount) {
      throw new Error(
        "documentedMeasurementCount cannot exceed requiredMeasurementCount"
      );
    }
    if (typeof record.explicitZScoreDocumented !== "boolean") {
      throw new Error("explicitZScoreDocumented must be boolean");
    }
    if (typeof record.explicitPercentileDocumented !== "boolean") {
      throw new Error("explicitPercentileDocumented must be boolean");
    }
    if (
      record.recommendationCongruent != null &&
      typeof record.recommendationCongruent !== "boolean"
    ) {
      throw new Error("recommendationCongruent must be boolean when present");
    }
  });

  return records;
};

export const computeQiAuditSummary = (
  records: QiReportAuditRecord[]
): QiAuditSummary => {
  const normalized = normalizeQiAuditRecords(records);
  const meanDurationSec =
    normalized.reduce((sum, record) => sum + record.durationSec, 0) /
    normalized.length;
  const allRequiredMeasurementsDocumentedRate =
    normalized.filter(
      record =>
        record.documentedMeasurementCount === record.requiredMeasurementCount
    ).length / normalized.length;
  const meanMeasurementCompletenessRate =
    normalized.reduce(
      (sum, record) =>
        sum +
        record.documentedMeasurementCount / record.requiredMeasurementCount,
      0
    ) / normalized.length;
  const explicitZScoreDocumentationRate =
    normalized.filter(record => record.explicitZScoreDocumented).length /
    normalized.length;
  const explicitPercentileDocumentationRate =
    normalized.filter(record => record.explicitPercentileDocumented).length /
    normalized.length;
  const recommendationRows = normalized.filter(
    record => record.recommendationCongruent != null
  );

  return {
    n: normalized.length,
    meanDurationSec,
    allRequiredMeasurementsDocumentedRate,
    meanMeasurementCompletenessRate,
    explicitZScoreDocumentationRate,
    explicitPercentileDocumentationRate,
    recommendationCongruenceRate:
      recommendationRows.length === 0
        ? null
        : recommendationRows.filter(record => record.recommendationCongruent)
            .length / recommendationRows.length,
    recommendationCongruenceDenominator: recommendationRows.length,
  };
};

const nullableDelta = (baseline: number | null, intervention: number | null) =>
  baseline == null || intervention == null ? null : intervention - baseline;

export const compareQiAuditPhases = (
  baseline: QiAuditSummary,
  intervention: QiAuditSummary
): QiAuditComparison => ({
  baseline,
  intervention,
  meanDurationDeltaSec: intervention.meanDurationSec - baseline.meanDurationSec,
  meanDurationRelativeChange:
    (intervention.meanDurationSec - baseline.meanDurationSec) /
    baseline.meanDurationSec,
  allRequiredMeasurementsDocumentedRateDelta:
    intervention.allRequiredMeasurementsDocumentedRate -
    baseline.allRequiredMeasurementsDocumentedRate,
  meanMeasurementCompletenessRateDelta:
    intervention.meanMeasurementCompletenessRate -
    baseline.meanMeasurementCompletenessRate,
  explicitZScoreDocumentationRateDelta:
    intervention.explicitZScoreDocumentationRate -
    baseline.explicitZScoreDocumentationRate,
  explicitPercentileDocumentationRateDelta:
    intervention.explicitPercentileDocumentationRate -
    baseline.explicitPercentileDocumentationRate,
  recommendationCongruenceRateDelta: nullableDelta(
    baseline.recommendationCongruenceRate,
    intervention.recommendationCongruenceRate
  ),
});
