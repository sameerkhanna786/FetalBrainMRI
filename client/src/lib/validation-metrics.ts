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

export type ReaderStudyCondition = "without_tool" | "with_tool";

export interface ReaderStudyCrossoverRecord {
  readerId: string;
  studyId: string;
  condition: ReaderStudyCondition;
  durationSec: number;
  completenessScore: number;
  zscoreDocumentationRate: number;
  recommendationCongruent?: boolean | null;
}

export interface ReaderStudyPairedDelta {
  readerId: string;
  studyId: string;
  durationDeltaSec: number;
  completenessScoreDelta: number;
  zscoreDocumentationRateDelta: number;
  recommendationCongruenceDelta: number | null;
}

export interface ReaderStudyCrossoverSummary {
  nPairs: number;
  meanDurationDeltaSec: number;
  meanCompletenessScoreDelta: number;
  meanZScoreDocumentationRateDelta: number;
  durationDeltaInterval: ConfidenceInterval | null;
  completenessScoreDeltaInterval: ConfidenceInterval | null;
  zscoreDocumentationRateDeltaInterval: ConfidenceInterval | null;
  recommendationCongruenceRateDelta: number | null;
  recommendationCongruenceDenominator: number;
  pairedDeltas: ReaderStudyPairedDelta[];
}

export interface NasaTaskLoadIndexSubscales {
  mentalDemand: number;
  physicalDemand: number;
  temporalDemand: number;
  performance: number;
  effort: number;
  frustration: number;
}

export interface NasaTaskLoadIndexScore {
  rawScore: number;
  subscales: NasaTaskLoadIndexSubscales;
}

export interface SystemUsabilityScaleScore {
  score: number;
  itemContributions: number[];
}

export type ReaderLabel = string | number | boolean;

export interface CohenKappaPair {
  raterA: ReaderLabel;
  raterB: ReaderLabel;
}

export interface CohenKappaMetrics {
  n: number;
  categories: string[];
  observedAgreement: number;
  expectedAgreement: number;
  kappa: number;
}

export interface FleissKappaMetrics {
  nSubjects: number;
  nRaters: number;
  categories: string[];
  subjectAgreement: number[];
  categoryPrevalence: Record<string, number>;
  meanObservedAgreement: number;
  expectedAgreement: number;
  kappa: number;
}

export interface IntraclassCorrelationMetrics {
  model: "ICC(2,1)";
  nSubjects: number;
  nRaters: number;
  icc: number;
  meanSquares: {
    rows: number;
    raters: number;
    error: number;
  };
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

const assertNonEmptyId = (name: string, value: string) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} must be a non-empty string`);
  }
};

const assertUnitInterval = (name: string, value: number) => {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${name} must be a finite value between 0 and 1`);
  }
};

const assertNonNegativeFinite = (name: string, value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a finite non-negative value`);
  }
};

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const tCriticalTable: Record<0.9 | 0.95 | 0.99, number[]> = {
  0.9: [
    6.313752, 2.919986, 2.353363, 2.131847, 2.015048, 1.94318, 1.894579,
    1.859548, 1.833113, 1.812461, 1.795885, 1.782288, 1.770933, 1.76131,
    1.75305, 1.745884, 1.739607, 1.734064, 1.729133, 1.724718, 1.720743,
    1.717144, 1.713872, 1.710882, 1.708141, 1.705618, 1.703288, 1.701131,
    1.699127, 1.697261,
  ],
  0.95: [
    12.706205, 4.302653, 3.182446, 2.776445, 2.570582, 2.446912, 2.364624,
    2.306004, 2.262157, 2.228139, 2.200985, 2.178813, 2.160369, 2.144787,
    2.13145, 2.119905, 2.109816, 2.100922, 2.093024, 2.085963, 2.079614,
    2.073873, 2.068658, 2.063899, 2.059539, 2.055529, 2.051831, 2.048407,
    2.04523, 2.042272,
  ],
  0.99: [
    63.656741, 9.924843, 5.840909, 4.604095, 4.032143, 3.707428, 3.499483,
    3.355387, 3.249836, 3.169273, 3.105807, 3.05454, 3.012276, 2.976843,
    2.946713, 2.920782, 2.898231, 2.87844, 2.860935, 2.84534, 2.83136, 2.818756,
    2.807336, 2.79694, 2.787436, 2.778715, 2.770683, 2.763262, 2.756386,
    2.749996,
  ],
};

const criticalTScore = (degreesOfFreedom: number, confidenceLevel: number) => {
  if (!Number.isInteger(degreesOfFreedom) || degreesOfFreedom < 1) {
    throw new Error("degreesOfFreedom must be a positive integer");
  }
  if (
    confidenceLevel !== 0.9 &&
    confidenceLevel !== 0.95 &&
    confidenceLevel !== 0.99
  ) {
    throw new Error("confidenceLevel must be 0.9, 0.95, or 0.99");
  }

  const table = tCriticalTable[confidenceLevel];
  return table[degreesOfFreedom - 1] ?? criticalZScore(confidenceLevel);
};

const computeMeanConfidenceInterval = (
  values: number[],
  confidenceLevel = 0.95
): ConfidenceInterval | null => {
  if (values.length < 2) return null;

  const estimate = mean(values);
  const sumSquaredError = values.reduce(
    (sum, value) => sum + (value - estimate) ** 2,
    0
  );
  const sampleStandardDeviation = Math.sqrt(
    sumSquaredError / (values.length - 1)
  );
  const standardError = sampleStandardDeviation / Math.sqrt(values.length);
  const margin =
    criticalTScore(values.length - 1, confidenceLevel) * standardError;

  return {
    estimate,
    lower: estimate - margin,
    upper: estimate + margin,
    confidenceLevel,
  };
};

const assertBoundedScore = (
  name: string,
  value: number,
  minimum: number,
  maximum: number
) => {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new Error(
      `${name} must be a finite value between ${minimum} and ${maximum}`
    );
  }
};

export const computeRawNasaTaskLoadIndex = (
  subscales: NasaTaskLoadIndexSubscales
): NasaTaskLoadIndexScore => {
  const values = [
    subscales.mentalDemand,
    subscales.physicalDemand,
    subscales.temporalDemand,
    subscales.performance,
    subscales.effort,
    subscales.frustration,
  ];
  values.forEach((value, index) =>
    assertBoundedScore(`NASA TLX subscale ${index + 1}`, value, 0, 100)
  );

  return {
    rawScore: mean(values),
    subscales,
  };
};

export const computeSystemUsabilityScale = (
  responses: number[]
): SystemUsabilityScaleScore => {
  if (responses.length !== 10) {
    throw new Error("System Usability Scale requires 10 Likert items");
  }

  const itemContributions = responses.map((response, index) => {
    if (!Number.isInteger(response) || response < 1 || response > 5) {
      throw new Error(
        "System Usability Scale items must be integers from 1 to 5"
      );
    }

    return index % 2 === 0 ? response - 1 : 5 - response;
  });

  return {
    score: itemContributions.reduce((sum, value) => sum + value, 0) * 2.5,
    itemContributions,
  };
};

export const computeReaderStudyCrossoverSummary = (
  records: ReaderStudyCrossoverRecord[]
): ReaderStudyCrossoverSummary => {
  if (records.length === 0) {
    throw new Error("reader-study crossover records must not be empty");
  }

  const groups = new Map<
    string,
    Partial<Record<ReaderStudyCondition, ReaderStudyCrossoverRecord>>
  >();
  records.forEach(record => {
    assertNonEmptyId("readerId", record.readerId);
    assertNonEmptyId("studyId", record.studyId);
    if (
      record.condition !== "without_tool" &&
      record.condition !== "with_tool"
    ) {
      throw new Error("condition must be without_tool or with_tool");
    }
    assertNonNegativeFinite("durationSec", record.durationSec);
    assertNonNegativeFinite("completenessScore", record.completenessScore);
    assertUnitInterval(
      "zscoreDocumentationRate",
      record.zscoreDocumentationRate
    );
    if (
      record.recommendationCongruent != null &&
      typeof record.recommendationCongruent !== "boolean"
    ) {
      throw new Error("recommendationCongruent must be boolean when present");
    }

    const key = `${record.readerId}\u0000${record.studyId}`;
    const group = groups.get(key) ?? {};
    if (group[record.condition] != null) {
      throw new Error(
        `duplicate ${record.condition} row for reader ${record.readerId} and study ${record.studyId}`
      );
    }
    group[record.condition] = record;
    groups.set(key, group);
  });

  const pairedDeltas = Array.from(groups.values())
    .map(group => {
      const withoutTool = group.without_tool;
      const withTool = group.with_tool;
      if (withoutTool == null || withTool == null) {
        const available = withoutTool ?? withTool;
        throw new Error(
          `incomplete condition pair for reader ${available?.readerId} and study ${available?.studyId}`
        );
      }

      const recommendationCongruenceDelta =
        withoutTool.recommendationCongruent == null ||
        withTool.recommendationCongruent == null
          ? null
          : Number(withTool.recommendationCongruent) -
            Number(withoutTool.recommendationCongruent);

      return {
        readerId: withTool.readerId,
        studyId: withTool.studyId,
        durationDeltaSec: withTool.durationSec - withoutTool.durationSec,
        completenessScoreDelta:
          withTool.completenessScore - withoutTool.completenessScore,
        zscoreDocumentationRateDelta:
          withTool.zscoreDocumentationRate -
          withoutTool.zscoreDocumentationRate,
        recommendationCongruenceDelta,
      };
    })
    .sort((left, right) =>
      `${left.readerId}\u0000${left.studyId}`.localeCompare(
        `${right.readerId}\u0000${right.studyId}`
      )
    );

  const recommendationDeltas = pairedDeltas
    .map(delta => delta.recommendationCongruenceDelta)
    .filter((delta): delta is number => delta != null);
  const durationDeltas = pairedDeltas.map(delta => delta.durationDeltaSec);
  const completenessScoreDeltas = pairedDeltas.map(
    delta => delta.completenessScoreDelta
  );
  const zscoreDocumentationRateDeltas = pairedDeltas.map(
    delta => delta.zscoreDocumentationRateDelta
  );

  return {
    nPairs: pairedDeltas.length,
    meanDurationDeltaSec: mean(durationDeltas),
    meanCompletenessScoreDelta: mean(completenessScoreDeltas),
    meanZScoreDocumentationRateDelta: mean(zscoreDocumentationRateDeltas),
    durationDeltaInterval: computeMeanConfidenceInterval(durationDeltas),
    completenessScoreDeltaInterval: computeMeanConfidenceInterval(
      completenessScoreDeltas
    ),
    zscoreDocumentationRateDeltaInterval: computeMeanConfidenceInterval(
      zscoreDocumentationRateDeltas
    ),
    recommendationCongruenceRateDelta:
      recommendationDeltas.length === 0 ? null : mean(recommendationDeltas),
    recommendationCongruenceDenominator: recommendationDeltas.length,
    pairedDeltas,
  };
};

const labelKey = (label: ReaderLabel) => {
  if (typeof label === "number" && !Number.isFinite(label)) {
    throw new Error("reader labels must be finite when numeric");
  }

  const key = String(label);
  if (key.trim() === "") {
    throw new Error("reader labels must not be empty");
  }
  return key;
};

export const computeCohenKappa = (
  pairs: CohenKappaPair[]
): CohenKappaMetrics => {
  if (pairs.length === 0) {
    throw new Error("Cohen's kappa pairs must not be empty");
  }

  const categories = new Set<string>();
  const raterACounts = new Map<string, number>();
  const raterBCounts = new Map<string, number>();
  let agreements = 0;

  pairs.forEach(pair => {
    const a = labelKey(pair.raterA);
    const b = labelKey(pair.raterB);
    categories.add(a);
    categories.add(b);
    raterACounts.set(a, (raterACounts.get(a) ?? 0) + 1);
    raterBCounts.set(b, (raterBCounts.get(b) ?? 0) + 1);
    if (a === b) agreements += 1;
  });

  const categoryList = Array.from(categories).sort();
  if (categoryList.length < 2) {
    throw new Error("Cohen's kappa requires at least two categories");
  }

  const observedAgreement = agreements / pairs.length;
  const expectedAgreement = categoryList.reduce((sum, category) => {
    const raterAProbability = (raterACounts.get(category) ?? 0) / pairs.length;
    const raterBProbability = (raterBCounts.get(category) ?? 0) / pairs.length;
    return sum + raterAProbability * raterBProbability;
  }, 0);

  if (expectedAgreement >= 1) {
    throw new Error("Cohen's kappa is undefined when expected agreement is 1");
  }

  return {
    n: pairs.length,
    categories: categoryList,
    observedAgreement,
    expectedAgreement,
    kappa: (observedAgreement - expectedAgreement) / (1 - expectedAgreement),
  };
};

export const computeFleissKappa = (
  ratings: ReaderLabel[][]
): FleissKappaMetrics => {
  if (ratings.length < 2) {
    throw new Error("Fleiss's kappa requires at least two subjects");
  }

  const nSubjects = ratings.length;
  const nRaters = ratings[0]?.length ?? 0;
  if (nRaters < 3) {
    throw new Error("Fleiss's kappa requires at least three raters");
  }

  const categories = new Set<string>();
  const normalized = ratings.map(row => {
    if (row.length !== nRaters) {
      throw new Error(
        "Fleiss's kappa ratings must form a complete rectangular matrix"
      );
    }

    return row.map(label => {
      const key = labelKey(label);
      categories.add(key);
      return key;
    });
  });

  const categoryList = Array.from(categories).sort();
  if (categoryList.length < 2) {
    throw new Error("Fleiss's kappa requires at least two categories");
  }

  const categoryCounts = Object.fromEntries(
    categoryList.map(category => [category, 0])
  ) as Record<string, number>;

  const subjectAgreement = normalized.map(row => {
    const rowCounts = new Map<string, number>();
    row.forEach(category => {
      rowCounts.set(category, (rowCounts.get(category) ?? 0) + 1);
      categoryCounts[category] += 1;
    });

    const agreementNumerator = categoryList.reduce((sum, category) => {
      const count = rowCounts.get(category) ?? 0;
      return sum + count * (count - 1);
    }, 0);
    return agreementNumerator / (nRaters * (nRaters - 1));
  });

  const categoryPrevalence = Object.fromEntries(
    categoryList.map(category => [
      category,
      categoryCounts[category] / (nSubjects * nRaters),
    ])
  ) as Record<string, number>;
  const meanObservedAgreement =
    subjectAgreement.reduce((sum, value) => sum + value, 0) / nSubjects;
  const expectedAgreement = categoryList.reduce(
    (sum, category) => sum + categoryPrevalence[category] ** 2,
    0
  );

  if (expectedAgreement >= 1) {
    throw new Error("Fleiss's kappa is undefined when expected agreement is 1");
  }

  return {
    nSubjects,
    nRaters,
    categories: categoryList,
    subjectAgreement,
    categoryPrevalence,
    meanObservedAgreement,
    expectedAgreement,
    kappa:
      (meanObservedAgreement - expectedAgreement) / (1 - expectedAgreement),
  };
};

export const computeIntraclassCorrelation = (
  ratings: number[][]
): IntraclassCorrelationMetrics => {
  if (ratings.length < 2) {
    throw new Error("ICC requires at least two subjects");
  }
  const nSubjects = ratings.length;
  const nRaters = ratings[0]?.length ?? 0;
  if (nRaters < 2) {
    throw new Error("ICC requires at least two raters");
  }

  ratings.forEach(row => {
    if (row.length !== nRaters) {
      throw new Error("ICC ratings must form a complete rectangular matrix");
    }
    row.forEach(value => {
      if (!Number.isFinite(value)) {
        throw new Error("ICC ratings must be finite values");
      }
    });
  });

  const rowMeans = ratings.map(
    row => row.reduce((sum, value) => sum + value, 0) / nRaters
  );
  const columnMeans = Array.from({ length: nRaters }, (_, columnIndex) => {
    const sum = ratings.reduce((total, row) => total + row[columnIndex], 0);
    return sum / nSubjects;
  });
  const grandMean =
    ratings.reduce(
      (total, row) => total + row.reduce((sum, value) => sum + value, 0),
      0
    ) /
    (nSubjects * nRaters);

  const rowSumOfSquares =
    nRaters * rowMeans.reduce((sum, mean) => sum + (mean - grandMean) ** 2, 0);
  const columnSumOfSquares =
    nSubjects *
    columnMeans.reduce((sum, mean) => sum + (mean - grandMean) ** 2, 0);
  const totalSumOfSquares = ratings.reduce(
    (total, row) =>
      total + row.reduce((sum, value) => sum + (value - grandMean) ** 2, 0),
    0
  );
  const rawErrorSumOfSquares =
    totalSumOfSquares - rowSumOfSquares - columnSumOfSquares;
  const errorSumOfSquares =
    Math.abs(rawErrorSumOfSquares) < 1e-12 ? 0 : rawErrorSumOfSquares;

  const meanSquareRows = rowSumOfSquares / (nSubjects - 1);
  const meanSquareRaters = columnSumOfSquares / (nRaters - 1);
  const meanSquareError = errorSumOfSquares / ((nSubjects - 1) * (nRaters - 1));
  const denominator =
    meanSquareRows +
    (nRaters - 1) * meanSquareError +
    (nRaters * (meanSquareRaters - meanSquareError)) / nSubjects;

  if (Math.abs(denominator) < 1e-12) {
    throw new Error("ICC is undefined when measurement variance is zero");
  }

  return {
    model: "ICC(2,1)",
    nSubjects,
    nRaters,
    icc: (meanSquareRows - meanSquareError) / denominator,
    meanSquares: {
      rows: meanSquareRows,
      raters: meanSquareRaters,
      error: meanSquareError,
    },
  };
};
