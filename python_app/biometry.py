"""Python biometry model-family scaffold for SPEC §4.2 / §4.3."""

from dataclasses import dataclass

import numpy as np
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
