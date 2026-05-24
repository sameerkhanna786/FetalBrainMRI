"""Python biometry model-family scaffold for SPEC §4.2 / §4.3."""

from collections.abc import Sequence
from dataclasses import dataclass

import numpy as np
from scipy.optimize import curve_fit
from scipy.stats import norm


@dataclass(frozen=True)
class QuadraticMeanLinearSd:
    """mu(GA) = a*GA^2 + b*GA + c; sigma(GA) = a5*GA + b5."""

    a: float
    b: float
    c: float
    a5: float
    b5: float


@dataclass(frozen=True)
class PerPercentileLinear:
    """Recover mean/sigma from 5th and 95th percentile linear equations."""

    p5_k: float
    p5_d: float
    p95_k: float
    p95_d: float


@dataclass(frozen=True)
class LinearMeanConstantSd:
    """mu(GA) = m_mu*GA + b_mu; sigma is constant."""

    m_mu: float
    b_mu: float
    sigma: float


Model = QuadraticMeanLinearSd | PerPercentileLinear | LinearMeanConstantSd


def _as_float_array(name: str, values: Sequence[float]) -> np.ndarray:
    if len(values) == 0:
        raise ValueError(f"{name} must not be empty")
    return np.asarray(values, dtype=float)


def _linear(ga_weeks: np.ndarray, slope: float, intercept: float) -> np.ndarray:
    return slope * ga_weeks + intercept


def quadratic_mean_linear_sd(
    model: QuadraticMeanLinearSd, ga_weeks: float
) -> tuple[float, float]:
    mean = float(np.polyval([model.a, model.b, model.c], ga_weeks))
    sigma = float(model.a5 * ga_weeks + model.b5)
    return mean, sigma


def per_percentile_linear(
    model: PerPercentileLinear, ga_weeks: float
) -> tuple[float, float]:
    p5 = model.p5_k * ga_weeks + model.p5_d
    p95 = model.p95_k * ga_weeks + model.p95_d
    mean = (p5 + p95) / 2
    sigma = (p95 - p5) / (2 * 1.6449)
    return mean, sigma


def linear_mean_constant_sd(
    model: LinearMeanConstantSd, ga_weeks: float
) -> tuple[float, float]:
    mean = model.m_mu * ga_weeks + model.b_mu
    return mean, model.sigma


def evaluate_model(model: Model, ga_weeks: float) -> tuple[float, float]:
    if isinstance(model, QuadraticMeanLinearSd):
        return quadratic_mean_linear_sd(model, ga_weeks)
    if isinstance(model, PerPercentileLinear):
        return per_percentile_linear(model, ga_weeks)
    return linear_mean_constant_sd(model, ga_weeks)


def fit_per_percentile_linear_table(
    ga_weeks: Sequence[float],
    p5_values: Sequence[float],
    p95_values: Sequence[float],
) -> PerPercentileLinear:
    ga = _as_float_array("ga_weeks", ga_weeks)
    p5 = _as_float_array("p5_values", p5_values)
    p95 = _as_float_array("p95_values", p95_values)
    if len(ga) != len(p5) or len(ga) != len(p95):
        raise ValueError("ga_weeks, p5_values, and p95_values must match")

    p5_slope, p5_intercept = curve_fit(_linear, ga, p5)[0]
    p95_slope, p95_intercept = curve_fit(_linear, ga, p95)[0]
    return PerPercentileLinear(
        float(p5_slope),
        float(p5_intercept),
        float(p95_slope),
        float(p95_intercept),
    )


def fit_linear_mean_constant_sd_table(
    ga_weeks: Sequence[float],
    mean_values: Sequence[float],
    sd_values: Sequence[float],
) -> LinearMeanConstantSd:
    ga = _as_float_array("ga_weeks", ga_weeks)
    means = _as_float_array("mean_values", mean_values)
    sds = _as_float_array("sd_values", sd_values)
    if len(ga) != len(means) or len(ga) != len(sds):
        raise ValueError("ga_weeks, mean_values, and sd_values must match")
    if np.any(sds <= 0):
        raise ValueError("sd_values must be positive")

    mean_slope, mean_intercept = curve_fit(_linear, ga, means)[0]
    return LinearMeanConstantSd(
        float(mean_slope),
        float(mean_intercept),
        float(np.mean(sds)),
    )


def zscore(model: Model, ga_weeks: float, value: float) -> dict[str, float]:
    mean, sigma = evaluate_model(model, ga_weeks)
    if sigma <= 0:
        raise ValueError("sigma must be positive")

    z_value = (value - mean) / sigma
    return {
        "mean": mean,
        "sigma": sigma,
        "z": z_value,
        "percentile": float(norm.cdf(z_value) * 100),
    }
