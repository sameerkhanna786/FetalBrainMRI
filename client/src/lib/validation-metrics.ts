export type BinaryLabel = boolean | 0 | 1;

export interface ValidationPrediction {
  label: BinaryLabel;
  probability: number;
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

interface NormalizedPrediction {
  label: 0 | 1;
  probability: number;
}

const EPSILON = 1e-6;

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
  options: { threshold?: number } = {}
): BinaryValidationMetrics => {
  const threshold = options.threshold ?? 0.5;
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
    positivePredictiveValue:
      predictedPositive === 0 ? null : truePositive / predictedPositive,
    negativePredictiveValue:
      predictedNegative === 0 ? null : trueNegative / predictedNegative,
    accuracy: (truePositive + trueNegative) / normalized.length,
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
