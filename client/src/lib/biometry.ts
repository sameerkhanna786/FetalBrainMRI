/*
 * Fetal brain MRI biometry — normative models + ranked DDx engine.
 *
 * Two-layer design:
 *
 *   1. Each parameter records a discriminated `model`:
 *        - "luis-quadratic"       : μ(GA) = a·GA² + b·GA + c, σ(GA) = a5·GA + b5
 *        - "dovjak-percentile"    : 5th & 95th percentile linear equations,
 *                                   from which μ(GA) and σ(GA) are derived
 *                                   (μ = (p5+p95)/2, σ = (p95−p5)/(2·1.645)).
 *        - "linear-mean-sd"       : μ(GA) = mμ·GA + bμ, σ(GA) constant
 *                                   (used for Birnbaum 2018 third ventricle).
 *
 *      The model is chosen per parameter by best evidence: Dovjak 2021 for
 *      pons / vermis / TCD (peer-reviewed published per-percentile linear
 *      equations validated 14–40 w GA), Luis 2025 for everything else
 *      (the only single-cohort model that covers all 13 parameters), and
 *      Birnbaum 2018 for the third ventricle.
 *
 *   2. Each differential-diagnosis card is a structured record with a
 *      `match(input) → {fired, score?, evidence?}` function. The engine
 *      runs every card, collects the firing ones, multiplies their `prior`
 *      by every applicable `boost` (rules of the form "if card X also
 *      fires, multiply Y's score by k"), and returns them sorted by score.
 */

export type GA = { weeks: number; days: number };

export const gaToDecimalWeeks = (ga: GA) => ga.weeks + ga.days / 7;

export type ParameterGroup =
  | "Global brain / skull"
  | "Ventricular system"
  | "Midline structures"
  | "Posterior fossa"
  | "Brainstem";

export type Source = {
  label: string;
  full: string;
  url: string;
};

/* ---------- Source records ---------- */

const S_LUIS: Source = {
  label: "Luis 2025",
  full:
    "Luis A, Uus A, Matthew J, et al. Towards automated fetal brain biometry reporting for 3-D T2-weighted 0.55–3T MRI at 20–40 weeks GA. Pediatr Radiol. 2025;55:366–383.",
  url: "https://link.springer.com/article/10.1007/s00247-025-06403-2",
};
const S_TILEA: Source = {
  label: "Tilea 2009",
  full:
    "Tilea B, Alberti C, Adamsbaum C, et al. Cerebral biometry in fetal magnetic resonance imaging: new reference data. Ultrasound Obstet Gynecol. 2009;33(2):173–181.",
  url: "https://obgyn.onlinelibrary.wiley.com/doi/10.1002/uog.6276",
};
const S_KYRIA: Source = {
  label: "Kyriakopoulou 2017",
  full:
    "Kyriakopoulou V, Vatansever D, Davidson A, et al. Normative biometry of the fetal brain using magnetic resonance imaging. Brain Struct Funct. 2017;222(5):2295–2307.",
  url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5504265/",
};
const S_VATANSEVER: Source = {
  label: "Vatansever 2013",
  full:
    "Vatansever D, Kyriakopoulou V, Allsop JM, et al. Multidimensional analysis of fetal posterior fossa in health and disease. Cerebellum. 2013;12(5):632–644.",
  url: "https://link.springer.com/article/10.1007/s12311-013-0470-2",
};
const S_DOVJAK: Source = {
  label: "Dovjak 2021",
  full:
    "Dovjak GO, Brugger PC, Gruber GM, et al. Normal human brainstem development in vivo: a quantitative fetal MRI study. Ultrasound Obstet Gynecol. 2021;58(2):254–263.",
  url: "https://www.ebi.ac.uk/europepmc/abstract/MED/32730667",
};
const S_KERTES: Source = {
  label: "Kertes 2021",
  full:
    "Kertes I, Hoffman D, Yahal O, et al. The normal fetal cavum septum pellucidum in MR imaging — new biometric data. Eur J Radiol. 2021;135:109470.",
  url: "https://www.sciencedirect.com/science/article/pii/S0720048X20306604",
};
const S_CONTE: Source = {
  label: "Conte 2018",
  full:
    "Conte G, Milani S, Palumbo G, et al. Prenatal brain MR imaging: reference linear biometric centiles between 20 and 24 gestational weeks. AJNR Am J Neuroradiol. 2018;39(5):963–967.",
  url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7410661/",
};
const S_BIRNBAUM: Source = {
  label: "Birnbaum 2018",
  full:
    "Birnbaum R, Parodi S, Donarini G, et al. The third ventricle of the human fetal brain: normative data and pathologic correlation. Prenat Diagn. 2018;38(9):664–672.",
  url: "https://doi.org/10.1002/pd.5292",
};

/* ---------- Parameter models ---------- */

type LuisQuadratic = {
  kind: "luis-quadratic";
  a: number; b: number; c: number;
  a5: number; b5: number;
};

type DovjakPercentile = {
  kind: "dovjak-percentile";
  p5: { k: number; d: number };
  p95: { k: number; d: number };
};

type LinearMeanSd = {
  kind: "linear-mean-sd";
  mMu: number; bMu: number; // μ(GA) = mMu·GA + bMu
  sigma: number;            // constant σ
};

export type Model = LuisQuadratic | DovjakPercentile | LinearMeanSd;

export type Parameter = {
  id: string;
  name: string;
  short: string;
  unit: "mm";
  group: ParameterGroup;
  definition: string;
  measurement: string;
  significance: string;
  /** Source paper that produced the encoded model. */
  primary: Source;
  /** Other parameter-specific reference for cross-validation in the UI. */
  secondary?: Source;
  model: Model;
  /** Validated GA range (weeks). */
  gaRange: [number, number];
};

/* ---------- Parameter table ----------
 *
 * Coefficients are taken verbatim from:
 *   - Luis 2025 (auto-proc-SVRTK, scripts/auto-reporting-brain-biometry.py).
 *   - Dovjak 2021 Table 1 (per-percentile linear equations, validated 14–40 w).
 *   - Birnbaum 2018 (third-ventricle width).
 */

export const PARAMETERS: Parameter[] = [
  {
    id: "skull_bpd",
    name: "Skull biparietal diameter",
    short: "Skull BPD",
    unit: "mm",
    group: "Global brain / skull",
    definition:
      "Maximum transverse outer-to-outer skull diameter at the level of the thalami and cavum septi pellucidi.",
    measurement:
      "Axial plane through thalami and CSP; outer table of near parietal bone to outer table of far parietal bone, perpendicular to the falx.",
    significance:
      "Anchor measurement for gestational-age estimation and overall head growth; abnormal values flag micro- or macrocephaly.",
    primary: S_LUIS,
    secondary: S_TILEA,
    model: { kind: "luis-quadratic", a: -0.0527, b: 5.7605, c: -46.436, a5: 0.0895, b5: 0.1414 },
    gaRange: [20, 40],
  },
  {
    id: "skull_ofd",
    name: "Skull occipito-frontal diameter",
    short: "Skull OFD",
    unit: "mm",
    group: "Global brain / skull",
    definition:
      "Longest antero-posterior outer-to-outer skull diameter on the same axial plane used for skull BPD.",
    measurement:
      "Axial plane; outer table of frontal bone to outer table of occipital bone at the longest dimension.",
    significance:
      "Combined with skull BPD to derive head circumference and cephalic index; flags dolichocephaly / brachycephaly.",
    primary: S_LUIS,
    secondary: S_TILEA,
    model: { kind: "luis-quadratic", a: -0.0984, b: 8.8526, c: -81.605, a5: 0.1511, b5: -1.3192 },
    gaRange: [20, 40],
  },
  {
    id: "brain_bpd",
    name: "Brain biparietal diameter (maximal brain width)",
    short: "Brain BPD",
    unit: "mm",
    group: "Global brain / skull",
    definition:
      "Maximum transverse intra-cranial parenchymal width at the level of the thalami and CSP.",
    measurement:
      "Axial plane; inner edge of near calvaria to outer edge of far parenchyma at the widest brain dimension.",
    significance:
      "More direct index of brain growth than skull BPD; small in microcephaly, large in supratentorial hydrocephalus.",
    primary: S_LUIS,
    secondary: S_KYRIA,
    model: { kind: "luis-quadratic", a: 0.016, b: 1.763, c: -0.9597, a5: 0.1308, b5: -1.32 },
    gaRange: [20, 40],
  },
  {
    id: "brain_ofd_left",
    name: "Brain occipito-frontal diameter — left",
    short: "Brain OFD L",
    unit: "mm",
    group: "Global brain / skull",
    definition:
      "Antero-posterior length of the left cerebral hemisphere parenchyma in the axial plane used for biometry.",
    measurement:
      "Axial plane; from the most anterior point of the frontal cortex to the most posterior point of the occipital cortex on the left side.",
    significance:
      "Complements brain BPD for global brain growth; left/right discrepancy flags hemispheric asymmetry.",
    primary: S_LUIS,
    secondary: S_KYRIA,
    model: { kind: "luis-quadratic", a: -0.0781, b: 7.7234, c: -75.3, a5: 0.1277, b5: -0.9298 },
    gaRange: [20, 40],
  },
  {
    id: "brain_ofd_right",
    name: "Brain occipito-frontal diameter — right",
    short: "Brain OFD R",
    unit: "mm",
    group: "Global brain / skull",
    definition:
      "Antero-posterior length of the right cerebral hemisphere parenchyma in the axial plane used for biometry.",
    measurement:
      "Axial plane; from the most anterior point of the frontal cortex to the most posterior point of the occipital cortex on the right side.",
    significance:
      "Used jointly with brain OFD-left to flag hemispheric asymmetry and quantify global growth.",
    primary: S_LUIS,
    secondary: S_KYRIA,
    model: { kind: "luis-quadratic", a: -0.0781, b: 7.7234, c: -75.3, a5: 0.1277, b5: -0.9298 },
    gaRange: [20, 40],
  },
  {
    id: "atrial_left",
    name: "Lateral-ventricle atrial diameter — left",
    short: "Atrial L",
    unit: "mm",
    group: "Ventricular system",
    definition:
      "Width of the atrium of the left lateral ventricle at the level of the glomus of the choroid plexus.",
    measurement:
      "Axial plane; inner-to-inner ependymal margins, perpendicular to the long axis of the ventricle.",
    significance:
      "≥10 mm defines ventriculomegaly: 10–12 mm mild, 12–15 mm moderate, ≥15 mm severe.",
    primary: S_LUIS,
    secondary: S_KYRIA,
    model: { kind: "luis-quadratic", a: 0.0078, b: -0.5216, c: 15.374, a5: 0.0264, b5: 0.5152 },
    gaRange: [20, 40],
  },
  {
    id: "atrial_right",
    name: "Lateral-ventricle atrial diameter — right",
    short: "Atrial R",
    unit: "mm",
    group: "Ventricular system",
    definition:
      "Width of the atrium of the right lateral ventricle at the level of the glomus of the choroid plexus.",
    measurement:
      "Axial plane; inner-to-inner ependymal margins, perpendicular to the long axis of the ventricle.",
    significance:
      "Asymmetry > 2 mm between sides, or either side ≥10 mm, warrants further evaluation.",
    primary: S_LUIS,
    secondary: S_KYRIA,
    model: { kind: "luis-quadratic", a: 0.0078, b: -0.5216, c: 15.374, a5: 0.0264, b5: 0.5152 },
    gaRange: [20, 40],
  },
  {
    id: "tcd",
    name: "Transcerebellar diameter",
    short: "TCD",
    unit: "mm",
    group: "Posterior fossa",
    definition:
      "Widest transverse diameter across the cerebellar hemispheres.",
    measurement:
      "Axial plane angled along the cerebellum; outermost edge of one hemisphere to outermost edge of the other.",
    significance:
      "Linear with GA; <5th percentile suggests cerebellar hypoplasia (genetic, infectious, or syndromic).",
    primary: S_DOVJAK,
    secondary: S_VATANSEVER,
    // Dovjak 2021 Table 1 — TCD: p5 = 1.52·GA − 12.48; p95 = 1.85·GA − 15.23.
    model: { kind: "dovjak-percentile", p5: { k: 1.52, d: -12.48 }, p95: { k: 1.85, d: -15.23 } },
    gaRange: [14, 40],
  },
  {
    id: "vermis_cc",
    name: "Vermian height (cranio-caudal)",
    short: "Vermis CC",
    unit: "mm",
    group: "Posterior fossa",
    definition:
      "Cranio-caudal height of the cerebellar vermis from culmen to uvula in the mid-sagittal plane.",
    measurement:
      "Mid-sagittal T2 with brainstem, vermis, and cisterna magna in the same view; culmen apex to inferior tip of uvula.",
    significance:
      "Vermian hypoplasia raises concern for Dandy-Walker spectrum, Joubert syndrome, or Blake's pouch remnant.",
    primary: S_DOVJAK,
    secondary: S_VATANSEVER,
    // Dovjak 2021 Table 1 — Vermis RC: p5 = 0.72·GA − 6.83; p95 = 0.95·GA − 8.93.
    model: { kind: "dovjak-percentile", p5: { k: 0.72, d: -6.83 }, p95: { k: 0.95, d: -8.93 } },
    gaRange: [14, 40],
  },
  {
    id: "vermis_ap",
    name: "Vermian antero-posterior diameter",
    short: "Vermis AP",
    unit: "mm",
    group: "Posterior fossa",
    definition:
      "Antero-posterior diameter of the vermis at its widest point in the mid-sagittal plane.",
    measurement:
      "Mid-sagittal T2; from the fastigium (peak of the 4th ventricle) to the most posterior vermian surface.",
    significance:
      "Used jointly with vermian CC; deviations suggest posterior-fossa malformations.",
    primary: S_DOVJAK,
    secondary: S_VATANSEVER,
    // Dovjak 2021 Table 1 — Vermis AP: p5 = 0.53·GA − 5.26; p95 = 0.70·GA − 6.99.
    model: { kind: "dovjak-percentile", p5: { k: 0.53, d: -5.26 }, p95: { k: 0.70, d: -6.99 } },
    gaRange: [14, 40],
  },
  {
    id: "pons_ap",
    name: "Pons antero-posterior diameter",
    short: "Pons AP",
    unit: "mm",
    group: "Brainstem",
    definition:
      "Antero-posterior thickness of the pons at its mid-level on the mid-sagittal plane.",
    measurement:
      "Mid-sagittal T2; perpendicular to the long axis of the brainstem at the widest pontine bulge.",
    significance:
      "Below 5th percentile flags pontocerebellar hypoplasia, brainstem maldevelopment, soft marker for Trisomy 21.",
    primary: S_DOVJAK,
    secondary: S_LUIS,
    // Dovjak 2021 Table 1 — Total pons AP: p5 = 0.33·GA − 0.59; p95 = 0.44·GA − 0.78.
    model: { kind: "dovjak-percentile", p5: { k: 0.33, d: -0.59 }, p95: { k: 0.44, d: -0.78 } },
    gaRange: [14, 40],
  },
  {
    id: "cc_length",
    name: "Corpus callosum length",
    short: "CC length",
    unit: "mm",
    group: "Midline structures",
    definition:
      "Length of the main commissural pathway connecting the two cerebral hemispheres.",
    measurement:
      "Mid-sagittal T2; from the anterior tip of the genu to the posterior tip of the splenium along the curve of the callosum.",
    significance:
      "Short or non-visualised callosum suggests partial or complete agenesis of the corpus callosum.",
    primary: S_LUIS,
    secondary: S_CONTE,
    model: { kind: "luis-quadratic", a: -0.0687, b: 5.1529, c: -57.904, a5: 0.0274, b5: 0.4763 },
    gaRange: [20, 40],
  },
  {
    id: "csp_width",
    name: "Cavum septum pellucidum width",
    short: "CSP width",
    unit: "mm",
    group: "Midline structures",
    definition:
      "Width of the fluid-filled midline cavum between the leaflets of the septum pellucidum.",
    measurement:
      "Axial or coronal plane; inner border of one leaflet to the opposite leaflet at the widest point.",
    significance:
      "<1 mm or absent: holoprosencephaly, ACC, septo-optic dysplasia. >10 mm: enlarged / cystic CSP.",
    primary: S_LUIS,
    secondary: S_KERTES,
    model: { kind: "luis-quadratic", a: -0.0156, b: 0.9472, c: -6.6953, a5: 0.053, b5: -0.4388 },
    gaRange: [20, 40],
  },
];

/** Optional auxiliary parameter — third-ventricle width. */
export const PARAM_THIRD_V: Parameter = {
  id: "third_ventricle",
  name: "Third ventricle width",
  short: "3rd V",
  unit: "mm",
  group: "Ventricular system",
  definition: "Width of the third ventricle, a midline CSF-filled space.",
  measurement:
    "Axial plane at the level of the thalami; inner-to-inner thalamic borders at the widest point.",
  significance:
    ">3.5 mm is abnormal and suggests aqueductal stenosis, hydrocephalus, or midline anomaly.",
  primary: S_BIRNBAUM,
  // Birnbaum 2018: μ(GA) ≈ 0.02·GA + 1.2 (~1.6 mm at 20w, ~2.0 mm at 40w);
  //                σ ≈ 0.6 mm across the validated range.
  model: { kind: "linear-mean-sd", mMu: 0.02, bMu: 1.2, sigma: 0.6 },
  gaRange: [20, 38],
};

export const PARAMETERS_ALL: Parameter[] = [...PARAMETERS, PARAM_THIRD_V];

/* ---------- Reference sets ----------
 *
 * The calculator supports two interchangeable normative-reference sets so the
 * user can decide whether they want "best per-parameter evidence" (mixing
 * Luis 2025, Dovjak 2021, and Birnbaum 2018) or "single-cohort consistency"
 * (Luis 2025 only for every parameter Luis publishes, with Birnbaum 2018
 * retained for the third ventricle because Luis does not publish it).
 */

export type ReferenceSetId = "multi-source" | "luis-only";

export type ReferenceSet = {
  id: ReferenceSetId;
  label: string;
  short: string;
  description: string;
};

export const REFERENCE_SETS: ReferenceSet[] = [
  {
    id: "multi-source",
    label: "Multi-source (best per-parameter evidence)",
    short: "Multi-source",
    description:
      "Posterior fossa and brainstem (TCD, vermis, pons) use Dovjak 2021 per-percentile linear equations; third ventricle uses Birnbaum 2018; everything else uses Luis 2025.",
  },
  {
    id: "luis-only",
    label: "Luis 2025 only (single-cohort consistency)",
    short: "Luis 2025 only",
    description:
      "All 13 parameters Luis publishes use the Luis 2025 quadratic-mean / linear-SD coefficients from a single 406-fetus cohort. Third ventricle still uses Birnbaum 2018 because Luis does not publish a normative model for it.",
  },
];

export const REFERENCE_SET_BY_ID: Record<ReferenceSetId, ReferenceSet> =
  Object.fromEntries(REFERENCE_SETS.map((r) => [r.id, r])) as Record<
    ReferenceSetId,
    ReferenceSet
  >;

/**
 * Luis 2025 quadratic-mean / linear-SD coefficients for the four parameters
 * that the multi-source set drives with non-Luis models. Verbatim from the
 * SVRTK auto-reporting pipeline (see project_docs/luis2025_coefficients.md).
 */
const LUIS_OVERRIDES: Record<string, LuisQuadratic> = {
  tcd: {
    kind: "luis-quadratic",
    a: 0.0051, b: 1.5165, c: -14.584,
    a5: 0.0343, b5: 0.415,
  },
  vermis_cc: {
    kind: "luis-quadratic",
    a: -0.0138, b: 1.6136, c: -20.065,
    a5: 0.0354, b5: -0.1869,
  },
  vermis_ap: {
    kind: "luis-quadratic",
    a: -0.0089, b: 1.1119, c: -14.637,
    a5: 0.0447, b5: -0.5126,
  },
  pons_ap: {
    kind: "luis-quadratic",
    a: 0.002, b: 0.3144, c: -1.2147,
    a5: 0.0124, b5: 0.261,
  },
};

/**
 * Returns the model that should drive the z-score for `param` under the active
 * reference set, plus the source label that should be displayed for that model.
 * For most parameters this is just the parameter's static `model` and
 * `primary` source. The four posterior-fossa / brainstem parameters switch to
 * the Luis overrides when the reference set is `"luis-only"`.
 */
export function resolveModel(
  param: Parameter,
  refSet: ReferenceSetId = "multi-source",
): { model: Model; source: Source } {
  if (refSet === "luis-only" && LUIS_OVERRIDES[param.id]) {
    return { model: LUIS_OVERRIDES[param.id], source: S_LUIS };
  }
  return { model: param.model, source: param.primary };
}

/* ---------- Math: normal CDF and z-score ---------- */

// Abramowitz & Stegun 7.1.26 approximation of erf
function erf(x: number): number {
  const sign = Math.sign(x);
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

export const normalCdf = (z: number): number =>
  0.5 * (1 + erf(z / Math.sqrt(2)));

export type ZResult = {
  z: number;
  percentile: number; // 0–100
  mu: number;
  sigma: number;
  band: "normal" | "note" | "watch" | "rare";
  /** True when GA is outside the validated range for this parameter. */
  extrapolated: boolean;
  /** Source label for the model that actually drove this z-score. */
  sourceLabel: string;
  /** Reference set id that produced this z-score. */
  referenceSet: ReferenceSetId;
};

export const interpretBand = (z: number): ZResult["band"] => {
  const a = Math.abs(z);
  if (a <= 1) return "normal";
  if (a <= 2) return "note";
  if (a <= 3) return "watch";
  return "rare";
};

/** Mean curve μ(GA) for an explicit model. */
export const muOfModel = (m: Model, gaWeeks: number): number => {
  if (m.kind === "luis-quadratic") return m.a * gaWeeks * gaWeeks + m.b * gaWeeks + m.c;
  if (m.kind === "linear-mean-sd") return m.mMu * gaWeeks + m.bMu;
  // dovjak-percentile: derive μ from p5 and p95 (symmetric normal assumption)
  const lo = m.p5.k * gaWeeks + m.p5.d;
  const hi = m.p95.k * gaWeeks + m.p95.d;
  return (lo + hi) / 2;
};

/** Standard-deviation curve σ(GA) for an explicit model. */
export const sigmaOfModel = (m: Model, gaWeeks: number): number => {
  if (m.kind === "luis-quadratic") return m.a5 * gaWeeks + m.b5;
  if (m.kind === "linear-mean-sd") return m.sigma;
  // dovjak-percentile: σ = (p95 − p5) / (2·1.645)
  const lo = m.p5.k * gaWeeks + m.p5.d;
  const hi = m.p95.k * gaWeeks + m.p95.d;
  return (hi - lo) / (2 * 1.6448536269514722);
};

/** Mean curve μ(GA) for a parameter under the active reference set. */
export const mu = (
  p: Parameter,
  gaWeeks: number,
  refSet: ReferenceSetId = "multi-source",
): number => muOfModel(resolveModel(p, refSet).model, gaWeeks);

/** Standard-deviation curve σ(GA) for a parameter under the active reference set. */
export const sigma = (
  p: Parameter,
  gaWeeks: number,
  refSet: ReferenceSetId = "multi-source",
): number => sigmaOfModel(resolveModel(p, refSet).model, gaWeeks);

export function zscore(
  param: Parameter,
  ga: GA,
  x: number,
  refSet: ReferenceSetId = "multi-source",
): ZResult | null {
  if (!Number.isFinite(x)) return null;
  const w = gaToDecimalWeeks(ga);
  const { model, source } = resolveModel(param, refSet);
  const m = muOfModel(model, w);
  const s = sigmaOfModel(model, w);
  if (!Number.isFinite(s) || s <= 0) return null;
  const z = (x - m) / s;
  const p = normalCdf(z) * 100;
  const extrapolated = w < param.gaRange[0] || w > param.gaRange[1];
  return {
    z,
    mu: m,
    sigma: s,
    percentile: p,
    band: interpretBand(z),
    extrapolated,
    sourceLabel: source.label,
    referenceSet: refSet,
  };
}

export const formatZ = (z: number) =>
  `${z >= 0 ? "+" : "−"}${Math.abs(z).toFixed(2)}`;

export const formatPct = (p: number) => {
  if (p < 1) return "<1st";
  if (p > 99) return ">99th";
  const r = Math.round(p);
  const suffix =
    r % 100 >= 11 && r % 100 <= 13
      ? "th"
      : r % 10 === 1
        ? "st"
        : r % 10 === 2
          ? "nd"
          : r % 10 === 3
            ? "rd"
            : "th";
  return `${r}${suffix}`;
};

/* ---------- Differential-diagnosis catalogue & engine ---------- */

export type DxRow = { dx: string; likelihood: string; rationale: string };

export type Differential = {
  id: string;
  title: string;
  oneLine: string;       // one-sentence summary used in the rail
  severity: "info" | "watch" | "concern" | "urgent";
  triggerLabel: string;  // human-readable trigger description, e.g. "Atrial L 16 mm"
  summary: string;
  rows: DxRow[];
  nextSteps: string;
  limitations: string;
  primary: Source;
  secondary?: Source;
  /** Engine-managed at runtime: */
  rank: number;
};

type EngineInput = {
  values: Record<string, number | null>;
  zs: Record<string, ZResult | null>;
};

type CardSpec = Omit<Differential, "rank" | "triggerLabel"> & {
  /** Returns null if not fired, otherwise {prior, triggerLabel}. */
  match: (
    input: EngineInput,
  ) => { prior: number; triggerLabel: string } | null;
};

/* ---------- Helper lookups ---------- */

const fmt1 = (x: number | null | undefined) =>
  x == null ? "—" : Number(x).toFixed(1);

const z = (zs: Record<string, ZResult | null>, id: string) => zs[id]?.z ?? null;

/* ---------- Card specs ---------- */

const CARDS: CardSpec[] = [
  /* ===== Ventriculomegaly tiers ===== */
  {
    id: "severe-vm",
    title: "Severe ventriculomegaly (atrial ≥ 15 mm)",
    oneLine: "Atrial diameter ≥ 15 mm — significant brain pathology likely.",
    severity: "urgent",
    summary:
      "Severe VM is a marker of significant underlying brain pathology with a high risk of neurodevelopmental impairment, though survival is relatively high in isolated cases.",
    rows: [
      { dx: "Aqueductal stenosis", likelihood: "~20%", rationale: "Most common cause of obstructive hydrocephalus (Garel 2018)." },
      { dx: "Associated CNS / non-CNS anomaly", likelihood: "High", rationale: "Severe VM frequently coexists with other anomalies that worsen prognosis." },
      { dx: "Chromosomal abnormality (T21, T18, T13)", likelihood: "Significant", rationale: "Risk increases with severity." },
      { dx: "Congenital infection (CMV, toxoplasmosis)", likelihood: "~1–5%", rationale: "Recognised less common causes." },
      { dx: "Isolated / idiopathic", likelihood: "~10–20%", rationale: "Diagnosis of exclusion after extensive workup." },
    ],
    nextSteps:
      "Detailed neurosonography and fetal MRI; invasive genetic testing with chromosomal microarray; CMV / toxoplasmosis screening; multidisciplinary fetal-neurology consultation.",
    limitations:
      "Estimates from cohort studies; actual risk depends on associated anomalies, karyotype, and infection status.",
    primary: { label: "Giorgione 2022", full: "Giorgione V, et al. Fetal cerebral ventriculomegaly. Prenat Diagn. 2022;42(13):1674–1681.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10099769/" },
    match: ({ values }) => {
      const L = values.atrial_left, R = values.atrial_right;
      const max = Math.max(L ?? -Infinity, R ?? -Infinity);
      if (!Number.isFinite(max) || max < 15) return null;
      const which = (L ?? -Infinity) >= (R ?? -Infinity) ? "L" : "R";
      return { prior: 0.95, triggerLabel: `Atrial ${which} = ${fmt1(max)} mm` };
    },
  },
  {
    id: "mod-vm",
    title: "Moderate ventriculomegaly (atrial 12–15 mm)",
    oneLine: "Atrial diameter 12–15 mm — intermediate VM.",
    severity: "concern",
    summary:
      "Moderate VM carries an intermediate risk of associated anomalies and adverse neurodevelopment.",
    rows: [
      { dx: "Associated CNS anomalies", likelihood: "~30%", rationale: "Frequent ACC, aqueductal stenosis, cortical malformations." },
      { dx: "Chromosomal abnormality", likelihood: "~10%", rationale: "Risk intermediate between mild and severe." },
      { dx: "Isolated / idiopathic", likelihood: "~50%", rationale: "Better prognosis when isolated and stable." },
      { dx: "Congenital infection (CMV)", likelihood: "~3–5%", rationale: "Always exclude." },
    ],
    nextSteps:
      "Detailed neurosonography, fetal MRI, karyotype with microarray, TORCH/CMV screening.",
    limitations: "Cohort estimates; outcome depends on associated findings.",
    primary: { label: "SMFM 2018", full: "SMFM. Mild fetal ventriculomegaly. Am J Obstet Gynecol. 2018;219(1):B2–B9.", url: "https://www.ajog.org/article/S0002-9378(18)30336-3/fulltext" },
    match: ({ values }) => {
      const L = values.atrial_left, R = values.atrial_right;
      const max = Math.max(L ?? -Infinity, R ?? -Infinity);
      if (!Number.isFinite(max) || max < 12 || max >= 15) return null;
      return { prior: 0.7, triggerLabel: `max(atrial) = ${fmt1(max)} mm` };
    },
  },
  {
    id: "mild-vm",
    title: "Mild ventriculomegaly (atrial 10–12 mm)",
    oneLine: "Atrial diameter 10–12 mm — soft marker.",
    severity: "watch",
    summary:
      "Mild VM may be isolated (favourable prognosis) or a sign of underlying pathology.",
    rows: [
      { dx: "Isolated / idiopathic", likelihood: "~70–80%", rationale: "Neurodevelopmental delay ~7.9% in isolated mild VM (Pagani 2014)." },
      { dx: "Associated CNS anomalies", likelihood: "~10–15%", rationale: "Common underlying structural anomalies." },
      { dx: "Chromosomal (Trisomy 21 in particular)", likelihood: "~5%", rationale: "Aneuploidy warrants discussion." },
      { dx: "Aqueductal stenosis", likelihood: "~5–10%", rationale: "Common obstructive cause." },
      { dx: "Agenesis of the corpus callosum", likelihood: "~5%", rationale: "Frequently associated with VM." },
      { dx: "Congenital infection (CMV)", likelihood: "~2–5%", rationale: "Important to exclude." },
    ],
    nextSteps:
      "Dedicated views of corpus callosum, fetal MRI follow-up at ~32 weeks, TORCH / CMV screening.",
    limitations:
      "Likelihoods from cohort studies; risk depends on additional findings, karyotype, and CMV status.",
    primary: { label: "Pagani 2014", full: "Pagani G, et al. Ultrasound Obstet Gynecol. 2014;44(3):254–260.", url: "https://pubmed.ncbi.nlm.nih.gov/24623452/" },
    secondary: { label: "SMFM 2018", full: "SMFM mild VM guideline.", url: "https://www.ajog.org/article/S0002-9378(18)30336-3/fulltext" },
    match: ({ values }) => {
      const L = values.atrial_left, R = values.atrial_right;
      const max = Math.max(L ?? -Infinity, R ?? -Infinity);
      if (!Number.isFinite(max) || max < 10 || max >= 12) return null;
      return { prior: 0.55, triggerLabel: `max(atrial) = ${fmt1(max)} mm` };
    },
  },
  {
    id: "asym-vent",
    title: "Asymmetric lateral ventricles (|L − R| > 2 mm)",
    oneLine: "Lateral ventricle asymmetry > 2 mm without VM on either side.",
    severity: "watch",
    summary:
      "Asymmetric lateral ventricles are common. When isolated and without VM this is often a benign variant; warrants evaluation for associated anomalies.",
    rows: [
      { dx: "Benign idiopathic asymmetry", likelihood: "Most common when isolated", rationale: "Generally favourable in isolation." },
      { dx: "Associated CNS anomalies", likelihood: "Variable", rationale: "ACC, aqueductal stenosis, cortical malformations." },
      { dx: "Chromosomal / genetic disorders", likelihood: "Variable", rationale: "Consider karyotype with other findings." },
    ],
    nextSteps: "Detailed neurosonography and fetal MRI, serial monitoring, TORCH screening as indicated.",
    limitations: "Estimates generalised from VM literature.",
    primary: { label: "Giorgione 2022", full: "Giorgione V, et al. Fetal cerebral ventriculomegaly.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10099769/" },
    match: ({ values }) => {
      const L = values.atrial_left, R = values.atrial_right;
      if (L == null || R == null) return null;
      if (Math.abs(L - R) <= 2) return null;
      const max = Math.max(L, R);
      // If either side is already in VM range, severe/mild VM cards take priority.
      if (max >= 10) return { prior: 0.25, triggerLabel: `|L−R| = ${(Math.abs(L - R)).toFixed(1)} mm` };
      return { prior: 0.55, triggerLabel: `|L−R| = ${(Math.abs(L - R)).toFixed(1)} mm` };
    },
  },

  /* ===== CSP ===== */
  {
    id: "absent-csp",
    title: "Absent / very narrow cavum septum pellucidum (< 1 mm)",
    oneLine: "CSP < 1 mm — strong association with midline / forebrain anomalies.",
    severity: "urgent",
    summary:
      "Absence of the CSP is rarely isolated; commonly seen with holoprosencephaly, ACC, septo-optic dysplasia, or severe ventriculomegaly.",
    rows: [
      { dx: "Holoprosencephaly", likelihood: "~50–60%", rationale: "Especially with midline facial anomalies (Malinger 2005)." },
      { dx: "Agenesis of the corpus callosum", likelihood: "~55%", rationale: "Absent CSP in ~2/3 of ACC cases (SMFM 2020)." },
      { dx: "Severe hydrocephalus / VM", likelihood: "~10–20%", rationale: "Pressure-induced fenestration of septal leaves." },
      { dx: "Septo-optic dysplasia", likelihood: "~5–10%", rationale: "Optic hypoplasia hard to confirm prenatally." },
      { dx: "Isolated / idiopathic", likelihood: "<5%", rationale: "Diagnosis of exclusion." },
    ],
    nextSteps:
      "Multiplanar neurosonography, fetal MRI, genetic counselling, evaluate for cortical malformations.",
    limitations: "Estimates from cohort studies.",
    primary: { label: "Malinger 2005", full: "Malinger G, et al. Ultrasound Obstet Gynecol. 2005;25(1):42–49.", url: "https://obgyn.onlinelibrary.wiley.com/doi/full/10.1002/uog.1787" },
    secondary: { label: "SMFM 2020", full: "SMFM; Ward A, Monteagudo A. Absent cavum septi pellucidi.", url: "https://www.ajog.org/article/S0002-9378(20)31109-1/fulltext" },
    match: ({ values }) =>
      values.csp_width != null && values.csp_width < 1
        ? { prior: 0.85, triggerLabel: `CSP = ${fmt1(values.csp_width)} mm` }
        : null,
  },
  {
    id: "enlarged-csp",
    title: "Enlarged / cystic CSP (> 10 mm)",
    oneLine: "CSP > 10 mm — typically benign; rarely obstructive.",
    severity: "watch",
    summary:
      "Often isolated and benign; can coexist with cavum vergae or velum interpositi cyst; rarely causes obstructive hydrocephalus.",
    rows: [
      { dx: "Normal variant / isolated", likelihood: "~85–90%", rationale: "Generally good prognosis." },
      { dx: "Cavum vergae", likelihood: "~5–10%", rationale: "Common posterior extension." },
      { dx: "Cavum velum interpositum cyst", likelihood: "<5%", rationale: "Triangular postero-superior; key DDx." },
      { dx: "Associated anomalies (ACC, cardiac)", likelihood: "~1–5%", rationale: "Prognosis depends on co-findings." },
      { dx: "Symptomatic / obstructive hydrocephalus", likelihood: "<1%", rationale: "Rare; may need neurosurgical intervention." },
    ],
    nextSteps: "Detailed fetal neurosonogram, fetal MRI, genetic counselling if other anomalies.",
    limitations: "Estimates from literature.",
    primary: { label: "Ding 2019", full: "Ding H, et al. Eur J Obstet Gynecol Reprod Biol. 2019;237:85–88.", url: "https://www.sciencedirect.com/science/article/abs/pii/S0301211519301782" },
    match: ({ values }) =>
      values.csp_width != null && values.csp_width > 10
        ? { prior: 0.45, triggerLabel: `CSP = ${fmt1(values.csp_width)} mm` }
        : null,
  },

  /* ===== Corpus callosum ===== */
  {
    id: "cc-absent",
    title: "Likely complete agenesis of the corpus callosum (severely short)",
    oneLine: "CC length z < −3 OR < 5 mm — likely complete ACC.",
    severity: "urgent",
    summary:
      "A near-absent or vestigial corpus callosum strongly suggests complete agenesis (cACC), often with associated CNS or syndromic anomalies.",
    rows: [
      { dx: "Isolated complete ACC", likelihood: "~65–75%", rationale: "Normal neurodevelopment in 65–75% of isolated ACC (Santo 2012)." },
      { dx: "Monogenic syndromic disorder", likelihood: "~30%", rationale: "Identified in 30% of a recent cohort (Sun 2024)." },
      { dx: "Chromosomal abnormality / pathogenic CNV", likelihood: "~15–20%", rationale: "Includes trisomies and pathogenic CNVs." },
      { dx: "Associated CNS malformations", likelihood: "Variable", rationale: "Frequent hydrocephalus, cerebellar dysplasia." },
    ],
    nextSteps:
      "Detailed fetal neurosonography, fetal MRI for associated CNS findings, chromosomal microarray, consider whole-exome sequencing, genetic counselling.",
    limitations: "Prognosis depends heavily on associated anomalies.",
    primary: { label: "Santo 2012", full: "Santo S, et al. Ultrasound Obstet Gynecol. 2012;40(5):513–521.", url: "https://obgyn.onlinelibrary.wiley.com/doi/full/10.1002/uog.12315" },
    secondary: { label: "Sun 2024", full: "Sun H, et al. Eur J Obstet Gynecol Reprod Biol. 2024;298:146–152.", url: "https://www.sciencedirect.com/science/article/abs/pii/S0301211524002264" },
    match: ({ values, zs }) => {
      const v = values.cc_length;
      if (v == null) return null;
      const zr = zs.cc_length;
      if (v < 5 || (zr != null && zr.z < -3))
        return { prior: 0.9, triggerLabel: `CC = ${fmt1(v)} mm (z ${zr ? formatZ(zr.z) : "—"})` };
      return null;
    },
  },
  {
    id: "cc-short",
    title: "Short / dysgenetic corpus callosum (z < −1.645)",
    oneLine: "CC below the 5th percentile — partial agenesis / hypogenesis.",
    severity: "concern",
    summary:
      "Short corpus callosum indicates partial agenesis or hypogenesis, often with a wide spectrum of associated anomalies.",
    rows: [
      { dx: "Isolated partial ACC", likelihood: "~50–60%", rationale: "Better prognosis than complete." },
      { dx: "Monogenic syndromic disorder", likelihood: "~25–30%", rationale: "Recurrent in WES cohorts (Sun 2024)." },
      { dx: "Chromosomal abnormality / CNV", likelihood: "~15%", rationale: "Microarray indicated." },
      { dx: "Associated CNS malformations", likelihood: "Variable", rationale: "Hydrocephalus, cerebellar dysplasia." },
    ],
    nextSteps: "Microarray, fetal MRI, genetic counselling.",
    limitations: "Prognosis depends on co-findings.",
    primary: { label: "Sun 2024", full: "Sun H, et al. Eur J Obstet Gynecol Reprod Biol. 2024;298:146–152.", url: "https://www.sciencedirect.com/science/article/abs/pii/S0301211524002264" },
    match: ({ zs, values }) => {
      const zr = zs.cc_length;
      const v = values.cc_length;
      if (zr == null || v == null) return null;
      if (zr.z >= -1.6448536269514722) return null;
      // The cACC card supersedes this one.
      if (v < 5 || zr.z < -3) return null;
      return { prior: 0.7, triggerLabel: `CC = ${fmt1(v)} mm (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "cc-thick",
    title: "Thick corpus callosum (z > +2)",
    oneLine: "CC above the 97.5th percentile — uncommon.",
    severity: "watch",
    summary:
      "An unusually thick or long CC is uncommon and may be a normal variant or, rarely, associated with malformations of cortical development.",
    rows: [
      { dx: "Normal variant", likelihood: "Most common", rationale: "Small upward tail." },
      { dx: "Megalencephaly / cortical malformation", likelihood: "Rare", rationale: "When co-occurring with macrocephaly." },
    ],
    nextSteps: "Correlate with cortical morphology and head size; clinical follow-up.",
    limitations: "Limited literature on isolated thick CC in fetuses.",
    primary: S_TILEA,
    match: ({ zs, values }) => {
      const zr = zs.cc_length;
      const v = values.cc_length;
      if (zr == null || v == null) return null;
      return zr.z > 2 ? { prior: 0.3, triggerLabel: `CC = ${fmt1(v)} mm (z ${formatZ(zr.z)})` } : null;
    },
  },

  /* ===== Brainstem / posterior fossa ===== */
  {
    id: "pons-small",
    title: "Pons AP < 5th percentile — pontocerebellar hypoplasia spectrum",
    oneLine: "Pons AP below 5th percentile — brainstem maldevelopment.",
    severity: "concern",
    summary:
      "A small pons AP diameter is a key indicator of pontocerebellar hypoplasia (PCH) or other brainstem maldevelopment.",
    rows: [
      { dx: "PCH Type 2 (esp. PCH2A)", likelihood: "~40–50%", rationale: "Most common subtype (van Dijk 2018)." },
      { dx: "PCH Type 1", likelihood: "~10–20%", rationale: "Second most common; motor neuronopathy." },
      { dx: "Other PCH (3–11)", likelihood: "~10%", rationale: "Numerous but rare genetic subtypes." },
      { dx: "CASK-related disorders", likelihood: "~5–10%", rationale: "Can present with PCH." },
      { dx: "Tubulinopathies", likelihood: "~5%", rationale: "Wide spectrum of brain malformations." },
      { dx: "Trisomy 21 (soft marker)", likelihood: "Modest", rationale: "Smaller pons reported in T21." },
    ],
    nextSteps:
      "Targeted gene panel (TSEN54, CASK, tubulinopathies), fetal MRI for associated anomalies, genetic counselling.",
    limitations: "Rare-disease estimates; genetic testing required for definitive diagnosis.",
    primary: { label: "van Dijk 2018", full: "van Dijk T, et al. Orphanet J Rare Dis. 2018;13:92.", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6003036/" },
    secondary: S_DOVJAK,
    match: ({ zs, values }) => {
      const zr = zs.pons_ap;
      if (zr == null || zr.z >= -1.6448536269514722) return null;
      return { prior: 0.7, triggerLabel: `Pons = ${fmt1(values.pons_ap)} mm (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "pons-large",
    title: "Pons AP > +2 SD — pontine bulging",
    oneLine: "Pons AP above 97.5th percentile — uncommon.",
    severity: "watch",
    summary:
      "An unusually thick pons is rare and may reflect a brainstem mass, hamartoma, or measurement artefact.",
    rows: [
      { dx: "Measurement artefact", likelihood: "Most common", rationale: "Re-measure in true mid-sagittal plane." },
      { dx: "Brainstem mass / hamartoma", likelihood: "Rare", rationale: "Correlate with parenchymal signal." },
    ],
    nextSteps: "Repeat measurement; correlate with parenchymal MRI.",
    limitations: "Sparse literature.",
    primary: S_DOVJAK,
    match: ({ zs, values }) => {
      const zr = zs.pons_ap;
      if (zr == null || zr.z <= 2) return null;
      return { prior: 0.2, triggerLabel: `Pons = ${fmt1(values.pons_ap)} mm (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "tcd-small",
    title: "TCD < 5th percentile — cerebellar hypoplasia spectrum",
    oneLine: "Transcerebellar diameter below 5th percentile.",
    severity: "concern",
    summary:
      "A small TCD suggests cerebellar hypoplasia; consider chromosomal, genetic, and infectious aetiologies.",
    rows: [
      { dx: "Chromosomal (Trisomy 13, 18)", likelihood: "Significant", rationale: "Aneuploidy is a major association." },
      { dx: "Congenital CMV infection", likelihood: "Variable", rationale: "Classic teratogenic cause." },
      { dx: "Genetic syndromes / PCH spectrum", likelihood: "Variable", rationale: "Often co-occurs with small pons." },
      { dx: "Isolated cerebellar hypoplasia", likelihood: "Rare", rationale: "Diagnosis of exclusion." },
    ],
    nextSteps: "Fetal MRI, microarray, CMV / TORCH screening, genetic counselling.",
    limitations: "Differential is broad; genetic testing often required.",
    primary: S_VATANSEVER,
    secondary: S_DOVJAK,
    match: ({ zs, values }) => {
      const zr = zs.tcd;
      if (zr == null || zr.z >= -1.6448536269514722) return null;
      return { prior: 0.65, triggerLabel: `TCD = ${fmt1(values.tcd)} mm (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "tcd-large",
    title: "TCD > +2 SD — macrocerebellum",
    oneLine: "TCD above 97.5th percentile — rare.",
    severity: "watch",
    summary:
      "A large TCD (macrocerebellum) is uncommon; may be seen with megalencephaly syndromes (e.g. PTEN-related) or measurement variation.",
    rows: [
      { dx: "Normal variant / measurement", likelihood: "Most common", rationale: "Re-measure on true axial plane." },
      { dx: "Megalencephaly / PTEN spectrum", likelihood: "Rare", rationale: "Correlate with brain BPD and head size." },
    ],
    nextSteps: "Re-measure; correlate with overall head and brain size.",
    limitations: "Sparse literature.",
    primary: S_VATANSEVER,
    match: ({ zs, values }) => {
      const zr = zs.tcd;
      if (zr == null || zr.z <= 2) return null;
      return { prior: 0.2, triggerLabel: `TCD = ${fmt1(values.tcd)} mm (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "vermis-small",
    title: "Small vermis — Dandy-Walker / vermian hypoplasia spectrum",
    oneLine: "Vermis below 5th percentile — posterior fossa anomaly likely.",
    severity: "concern",
    summary:
      "Small vermis raises concern for Dandy-Walker malformation, vermian hypoplasia, Joubert syndrome, or Blake's pouch remnant.",
    rows: [
      { dx: "Dandy-Walker malformation / variant", likelihood: "~30–40%", rationale: "Classic posterior-fossa anomaly." },
      { dx: "Isolated vermian hypoplasia", likelihood: "~20%", rationale: "Better prognosis if isolated." },
      { dx: "Joubert syndrome (molar tooth sign)", likelihood: "~10%", rationale: "Confirm with mid-brain morphology." },
      { dx: "Chromosomal / syndromic disorder", likelihood: "~15%", rationale: "Microarray indicated." },
    ],
    nextSteps:
      "Detailed fetal MRI of posterior fossa, look for molar-tooth sign, microarray, genetic counselling.",
    limitations: "Rotation of the vermis can mimic hypoplasia; correlate with imaging plane.",
    primary: S_VATANSEVER,
    secondary: S_DOVJAK,
    match: ({ zs, values }) => {
      const zr = zs.vermis_cc;
      if (zr == null || zr.z >= -1.6448536269514722) return null;
      return { prior: 0.65, triggerLabel: `Vermis CC = ${fmt1(values.vermis_cc)} mm (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "vermis-large",
    title: "Large vermis (z > +2)",
    oneLine: "Vermis above 97.5th percentile — uncommon.",
    severity: "watch",
    summary:
      "A large vermis is rare; consider posterior-fossa cyst projecting onto the vermis, neoplasm, or measurement artefact.",
    rows: [
      { dx: "Measurement / plane artefact", likelihood: "Most common", rationale: "Re-measure on true mid-sagittal." },
      { dx: "Posterior fossa cyst / neoplasm", likelihood: "Rare", rationale: "Correlate with parenchymal imaging." },
    ],
    nextSteps: "Repeat measurement; review parenchymal MRI.",
    limitations: "Sparse literature.",
    primary: S_VATANSEVER,
    match: ({ zs, values }) => {
      const zr = zs.vermis_cc;
      if (zr == null || zr.z <= 2) return null;
      return { prior: 0.2, triggerLabel: `Vermis CC = ${fmt1(values.vermis_cc)} mm (z ${formatZ(zr.z)})` };
    },
  },

  /* ===== Third ventricle ===== */
  {
    id: "third-v-wide",
    title: "Third ventricle > 3.5 mm",
    oneLine: "Third-ventricle dilatation — often associated with other CNS anomalies.",
    severity: "concern",
    summary:
      "Dilatation of the third ventricle is often associated with other CNS anomalies; isolated cases warrant evaluation for obstructive causes.",
    rows: [
      { dx: "Aqueductal stenosis", likelihood: "~55%", rationale: "Common cause of obstructive hydrocephalus." },
      { dx: "Agenesis / dysgenesis of corpus callosum", likelihood: "~10–20%", rationale: "Alters CSF dynamics." },
      { dx: "Holoprosencephaly (mild / lobar)", likelihood: "~5–15%", rationale: "Incomplete forebrain cleavage." },
      { dx: "Interhemispheric / velum interpositi cyst", likelihood: "~5–10%", rationale: "Mass-effect obstruction." },
    ],
    nextSteps:
      "Detailed neurosonography and fetal MRI; evaluation of corpus callosum and aqueduct; karyotype; TORCH screening.",
    limitations: "Estimates from general VM literature.",
    primary: { label: "Hertzberg 1997", full: "Hertzberg BS, et al. Radiology. 1997;203(3):641–644.", url: "https://pubs.rsna.org/doi/10.1148/radiology.203.3.9169682" },
    secondary: S_BIRNBAUM,
    match: ({ values }) =>
      values.third_ventricle != null && values.third_ventricle > 3.5
        ? { prior: 0.7, triggerLabel: `3rd V = ${fmt1(values.third_ventricle)} mm` }
        : null,
  },

  /* ===== Global brain / skull ===== */
  {
    id: "microcephaly",
    title: "Microcephaly (brain BPD or skull BPD z < −2)",
    oneLine: "Brain or skull BPD below 2.5th percentile — small head.",
    severity: "concern",
    summary:
      "Microcephaly suggests impaired brain growth; aetiologies span genetic syndromes, congenital infection, and intrauterine insults.",
    rows: [
      { dx: "Genetic / syndromic microcephaly", likelihood: "~30%", rationale: "MCPH genes, primary microcephaly." },
      { dx: "Congenital infection (CMV, Zika, toxoplasmosis)", likelihood: "~15–20%", rationale: "Always exclude; periventricular calcifications a clue." },
      { dx: "Brain malformations (lissencephaly, polymicrogyria)", likelihood: "~10–15%", rationale: "Correlate with cortical morphology." },
      { dx: "Chromosomal abnormality", likelihood: "~10%", rationale: "Microarray indicated." },
      { dx: "Constitutional / familial", likelihood: "~10%", rationale: "Compare with parental head sizes." },
    ],
    nextSteps:
      "Detailed fetal MRI for cortical malformation, TORCH/CMV screening, microarray, parental head circumferences.",
    limitations: "Definition varies (some use −3 SD); confirm on follow-up scan.",
    primary: S_TILEA,
    secondary: S_KYRIA,
    match: ({ zs, values }) => {
      const a = zs.brain_bpd?.z, b = zs.skull_bpd?.z;
      const min = Math.min(a ?? Infinity, b ?? Infinity);
      if (!Number.isFinite(min) || min >= -2) return null;
      const which = (a ?? Infinity) <= (b ?? Infinity) ? `brain BPD ${fmt1(values.brain_bpd)} mm (z ${formatZ(a!)})` : `skull BPD ${fmt1(values.skull_bpd)} mm (z ${formatZ(b!)})`;
      return { prior: 0.6, triggerLabel: which };
    },
  },
  {
    id: "macrocephaly",
    title: "Macrocephaly (brain BPD or skull BPD z > +2)",
    oneLine: "Brain or skull BPD above 97.5th percentile — large head.",
    severity: "concern",
    summary:
      "Macrocephaly may reflect benign familial macrocephaly, megalencephaly syndromes, or hydrocephalus (which would also increase ventricular size).",
    rows: [
      { dx: "Hydrocephalus", likelihood: "~30%", rationale: "Especially when atrial diameter is also enlarged." },
      { dx: "Benign familial macrocephaly", likelihood: "~20%", rationale: "Compare with parental head circumferences." },
      { dx: "Megalencephaly syndromes (PTEN, MPPH, MCAP)", likelihood: "~15%", rationale: "Correlate with cortical malformation." },
      { dx: "Tumor / cyst", likelihood: "~5%", rationale: "Rare; correlate with parenchymal MRI." },
    ],
    nextSteps:
      "Re-evaluate ventricles, dedicated MRI of posterior fossa and cortex, parental head circumferences.",
    limitations: "Definition varies; confirm with follow-up.",
    primary: S_TILEA,
    secondary: S_KYRIA,
    match: ({ zs, values }) => {
      const a = zs.brain_bpd?.z, b = zs.skull_bpd?.z;
      const max = Math.max(a ?? -Infinity, b ?? -Infinity);
      if (!Number.isFinite(max) || max <= 2) return null;
      const which = (a ?? -Infinity) >= (b ?? -Infinity) ? `brain BPD ${fmt1(values.brain_bpd)} mm (z ${formatZ(a!)})` : `skull BPD ${fmt1(values.skull_bpd)} mm (z ${formatZ(b!)})`;
      return { prior: 0.45, triggerLabel: which };
    },
  },
  {
    id: "extra-axial-wide",
    title: "Widened extra-axial space (skull-z − brain-z > 2)",
    oneLine: "Skull BPD high relative to brain BPD — extra-axial fluid widened.",
    severity: "watch",
    summary:
      "When skull dimensions exceed brain dimensions, the extra-axial space is widened, suggesting benign enlargement of subarachnoid spaces or true cerebral atrophy.",
    rows: [
      { dx: "Benign enlargement of subarachnoid spaces", likelihood: "Most common", rationale: "Self-limited if isolated." },
      { dx: "Cerebral atrophy / volume loss", likelihood: "Variable", rationale: "Correlate with brain parenchymal signal." },
      { dx: "Subdural / arachnoid collection", likelihood: "Rare", rationale: "Correlate with FLAIR / SWI imaging." },
    ],
    nextSteps: "Detailed parenchymal review; serial scans to assess progression.",
    limitations: "Indirect proxy from biometry; direct measurement of extra-axial space recommended.",
    primary: S_TILEA,
    match: ({ zs }) => {
      const sk = zs.skull_bpd?.z, br = zs.brain_bpd?.z;
      if (sk == null || br == null) return null;
      const diff = sk - br;
      if (diff <= 2) return null;
      return { prior: 0.35, triggerLabel: `Δz = ${diff.toFixed(2)}` };
    },
  },
  {
    id: "brain-asym",
    title: "Cerebral hemispheric asymmetry (brain OFD L vs R > 5%)",
    oneLine: "Hemispheric OFD difference > 5% — possible unilateral malformation.",
    severity: "concern",
    summary:
      "Significant L-R asymmetry of cerebral OFD raises concern for hemimegalencephaly, unilateral cortical malformation, or porencephaly.",
    rows: [
      { dx: "Hemimegalencephaly", likelihood: "~25%", rationale: "Marked unilateral enlargement." },
      { dx: "Unilateral cortical malformation (e.g. polymicrogyria)", likelihood: "~25%", rationale: "Correlate with cortex morphology." },
      { dx: "Porencephaly / ischaemic insult", likelihood: "~15%", rationale: "Look for cystic parenchymal defect." },
      { dx: "Vascular malformation", likelihood: "~5%", rationale: "Vein of Galen and other AVMs." },
    ],
    nextSteps: "Targeted parenchymal MRI; SWI for hemorrhage; serial follow-up.",
    limitations: "Plane obliquity can falsely create asymmetry; re-measure with care.",
    primary: S_TILEA,
    match: ({ values }) => {
      const l = values.brain_ofd_left, r = values.brain_ofd_right;
      if (l == null || r == null) return null;
      const mean = (l + r) / 2;
      if (mean === 0) return null;
      const pct = Math.abs(l - r) / mean;
      if (pct <= 0.05) return null;
      return { prior: 0.55, triggerLabel: `|ΔOFD|/mean = ${(pct * 100).toFixed(1)}%` };
    },
  },

  /* ===== Composite patterns ===== */
  {
    id: "hydrocephalus-pattern",
    title: "Triventricular hydrocephalus pattern",
    oneLine: "Severe VM + dilated 3rd V — aqueductal stenosis pattern.",
    severity: "urgent",
    summary:
      "Concurrent severe lateral-ventricular and third-ventricular dilatation with normal 4th ventricle is the classic obstructive (triventricular) pattern of aqueductal stenosis.",
    rows: [
      { dx: "Aqueductal stenosis", likelihood: "~70%", rationale: "Classic pattern." },
      { dx: "X-linked hydrocephalus (L1CAM)", likelihood: "~5–10%", rationale: "Especially in male fetuses with adducted thumbs." },
      { dx: "Posterior fossa mass / Chiari II", likelihood: "~10%", rationale: "Re-examine posterior fossa." },
    ],
    nextSteps: "Look for L1CAM features; targeted MRI of aqueduct and posterior fossa; karyotype.",
    limitations: "Patterns are heuristics; correlate with parenchymal imaging.",
    primary: { label: "Giorgione 2022", full: "Giorgione V, et al. Fetal cerebral ventriculomegaly.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10099769/" },
    match: ({ values }) => {
      const max = Math.max(values.atrial_left ?? -Infinity, values.atrial_right ?? -Infinity);
      const v3 = values.third_ventricle;
      if (!(Number.isFinite(max) && max >= 15 && v3 != null && v3 > 3.5)) return null;
      return { prior: 0.85, triggerLabel: `Atrial ${fmt1(max)} + 3rd V ${fmt1(v3)}` };
    },
  },
  {
    id: "hpe-pattern",
    title: "Holoprosencephaly pattern",
    oneLine: "Absent CSP + severe VM — HPE strongly considered.",
    severity: "urgent",
    summary:
      "The combination of absent CSP and severe ventriculomegaly is highly suggestive of holoprosencephaly (alobar / semilobar variants).",
    rows: [
      { dx: "Alobar / semilobar HPE", likelihood: "~70%", rationale: "Classic ultrasound/MRI pattern." },
      { dx: "Lobar HPE", likelihood: "~15%", rationale: "Subtler presentation." },
      { dx: "Septo-optic dysplasia", likelihood: "~5%", rationale: "Optic findings hard to confirm prenatally." },
    ],
    nextSteps:
      "Coronal MRI to assess thalamic fusion; karyotype; SHH-pathway gene panel.",
    limitations: "Pattern recognition; final diagnosis depends on detailed parenchymal imaging.",
    primary: { label: "Malinger 2005", full: "Malinger G, et al. Ultrasound Obstet Gynecol. 2005;25(1):42–49.", url: "https://obgyn.onlinelibrary.wiley.com/doi/full/10.1002/uog.1787" },
    match: ({ values }) => {
      const csp = values.csp_width;
      const max = Math.max(values.atrial_left ?? -Infinity, values.atrial_right ?? -Infinity);
      if (!(csp != null && csp < 1 && Number.isFinite(max) && max >= 15)) return null;
      return { prior: 0.85, triggerLabel: `CSP ${fmt1(csp)} + atrial ${fmt1(max)}` };
    },
  },
  {
    id: "acc-pattern",
    title: "Agenesis of the corpus callosum pattern",
    oneLine: "Absent CSP + short / absent CC — ACC strongly considered.",
    severity: "urgent",
    summary:
      "Absent CSP combined with a short or absent corpus callosum is the classic ACC pattern; colpocephaly may also be evident.",
    rows: [
      { dx: "Complete ACC", likelihood: "~70%", rationale: "Classic combination." },
      { dx: "Partial ACC", likelihood: "~25%", rationale: "Often posterior agenesis." },
      { dx: "Associated syndrome (Aicardi, Mowat-Wilson, etc.)", likelihood: "~10%", rationale: "Look for extra-CNS features." },
    ],
    nextSteps:
      "Mid-sagittal MRI for callosal contour; coronal for cingulate sulcus inversion; microarray; whole-exome where feasible.",
    limitations: "Pattern recognition; depends on imaging plane and quality.",
    primary: { label: "SMFM 2020", full: "SMFM. Absent cavum septi pellucidi.", url: "https://www.ajog.org/article/S0002-9378(20)31109-1/fulltext" },
    match: ({ values, zs }) => {
      const csp = values.csp_width;
      const v = values.cc_length;
      if (csp == null || csp >= 1) return null;
      const zr = zs.cc_length;
      if (v == null || zr == null) return null;
      if (!(zr.z < -1.6448536269514722 || v < 5)) return null;
      return { prior: 0.85, triggerLabel: `CSP ${fmt1(csp)} + CC ${fmt1(v)} (z ${formatZ(zr.z)})` };
    },
  },
  {
    id: "dwm-pattern",
    title: "Dandy-Walker malformation pattern",
    oneLine: "Small vermis + dilated third ventricle — DWM pattern.",
    severity: "urgent",
    summary:
      "Small vermis with associated supratentorial ventricular dilatation is suggestive of the Dandy-Walker spectrum.",
    rows: [
      { dx: "Dandy-Walker malformation", likelihood: "~60%", rationale: "Classic posterior-fossa anomaly." },
      { dx: "Vermian hypoplasia (non-DWM)", likelihood: "~25%", rationale: "Without 4th-ventricle cyst." },
      { dx: "Blake's pouch remnant", likelihood: "~10%", rationale: "Differentiated by 4th-ventricle communication." },
    ],
    nextSteps:
      "Detailed fetal MRI of posterior fossa; assess tegmento-vermian angle; chromosomal microarray.",
    limitations: "Vermian rotation can mimic hypoplasia.",
    primary: S_VATANSEVER,
    match: ({ zs, values }) => {
      const zr = zs.vermis_cc;
      const v3 = values.third_ventricle;
      if (zr == null || zr.z >= -1.6448536269514722) return null;
      if (v3 == null || v3 <= 3.5) return null;
      return { prior: 0.75, triggerLabel: `Vermis (z ${formatZ(zr.z)}) + 3rd V ${fmt1(v3)}` };
    },
  },
  {
    id: "pch-pattern",
    title: "Pontocerebellar hypoplasia pattern",
    oneLine: "Small pons + small TCD — PCH spectrum likely.",
    severity: "urgent",
    summary:
      "Concurrent small pons and small cerebellum strongly suggests pontocerebellar hypoplasia (PCH).",
    rows: [
      { dx: "PCH Type 2 (TSEN54-related)", likelihood: "~50%", rationale: "Most common subtype." },
      { dx: "PCH Type 1", likelihood: "~15%", rationale: "Associated motor neuronopathy." },
      { dx: "Other PCH (3–11) / CASK / tubulinopathy", likelihood: "~20%", rationale: "Genetic panel needed." },
      { dx: "Acquired (CMV)", likelihood: "~5%", rationale: "Distinct calcifications and microcephaly." },
    ],
    nextSteps:
      "Targeted gene panel (TSEN54, RARS2, EXOSC3, CASK, tubulinopathies), CMV screening, genetic counselling.",
    limitations: "Phenotype overlaps; molecular diagnosis essential.",
    primary: { label: "van Dijk 2018", full: "van Dijk T, et al. Orphanet J Rare Dis. 2018;13:92.", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6003036/" },
    match: ({ zs }) => {
      const zp = zs.pons_ap?.z, zt = zs.tcd?.z;
      if (zp == null || zt == null) return null;
      if (!(zp < -1.6448536269514722 && zt < -1.6448536269514722)) return null;
      return { prior: 0.85, triggerLabel: `Pons z ${formatZ(zp)} + TCD z ${formatZ(zt)}` };
    },
  },
];

/* ---------- Boost rules (multiplier on score when both fire) ---------- */

const BOOSTS: { when: string; affects: string; mult: number; reason: string }[] = [
  // ACC pattern raises CC findings, lowers any mild VM (it is explained).
  { when: "acc-pattern", affects: "cc-absent", mult: 1.15, reason: "Composite pattern reinforces complete ACC." },
  { when: "acc-pattern", affects: "cc-short", mult: 1.10, reason: "Composite pattern reinforces dysgenetic CC." },
  { when: "acc-pattern", affects: "mild-vm", mult: 0.6, reason: "Mild VM is often explained by ACC." },
  // HPE pattern raises absent-CSP card.
  { when: "hpe-pattern", affects: "absent-csp", mult: 1.10, reason: "HPE reinforces absent CSP." },
  // Hydrocephalus pattern raises severe-VM and third-V cards.
  { when: "hydrocephalus-pattern", affects: "severe-vm", mult: 1.05, reason: "Triventricular pattern reinforces severe VM." },
  { when: "hydrocephalus-pattern", affects: "third-v-wide", mult: 1.10, reason: "Triventricular pattern reinforces 3rd-V dilatation." },
  // Macrocephaly pattern: if VM also fires, hydrocephalus is more likely cause of macrocephaly.
  { when: "severe-vm", affects: "macrocephaly", mult: 1.10, reason: "Macrocephaly may be hydrocephalus-driven." },
  // PCH pattern raises small-pons / small-TCD.
  { when: "pch-pattern", affects: "pons-small", mult: 1.10, reason: "Combined finding reinforces PCH spectrum." },
  { when: "pch-pattern", affects: "tcd-small", mult: 1.10, reason: "Combined finding reinforces PCH spectrum." },
  // DWM pattern raises vermis-small.
  { when: "dwm-pattern", affects: "vermis-small", mult: 1.10, reason: "Combined finding reinforces DWM spectrum." },
];

/* ---------- Engine ---------- */

export function evaluateAll(
  values: Record<string, number | null>,
  ga: GA,
  refSet: ReferenceSetId = "multi-source",
): {
  zs: Record<string, ZResult | null>;
  dxs: Differential[];
} {
  const zs: Record<string, ZResult | null> = {};
  for (const p of PARAMETERS_ALL) {
    const v = values[p.id];
    zs[p.id] = v == null ? null : zscore(p, ga, v, refSet);
  }
  const input: EngineInput = { values, zs };

  // Pass 1: collect firing cards with their priors.
  const fired = new Map<string, Differential>();
  for (const c of CARDS) {
    const r = c.match(input);
    if (!r) continue;
    fired.set(c.id, {
      id: c.id,
      title: c.title,
      oneLine: c.oneLine,
      severity: c.severity,
      summary: c.summary,
      rows: c.rows,
      nextSteps: c.nextSteps,
      limitations: c.limitations,
      primary: c.primary,
      secondary: c.secondary,
      triggerLabel: r.triggerLabel,
      rank: r.prior,
    });
  }

  // Pass 2: apply boost multipliers.
  for (const b of BOOSTS) {
    if (!fired.has(b.when)) continue;
    const target = fired.get(b.affects);
    if (!target) continue;
    target.rank *= b.mult;
  }

  // Sort by descending rank, breaking ties by severity weight.
  const SEVERITY_RANK: Record<Differential["severity"], number> = {
    urgent: 4, concern: 3, watch: 2, info: 1,
  };
  const out = Array.from(fired.values()).sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    return SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
  });

  return { zs, dxs: out };
}

export const GROUP_ORDER: ParameterGroup[] = [
  "Global brain / skull",
  "Ventricular system",
  "Midline structures",
  "Posterior fossa",
  "Brainstem",
];
