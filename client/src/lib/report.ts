/*
 * Structured report generator — ESPR-inspired sections. Deterministic string
 * interpolation (spec §4.11.4 "Deterministic Data Anchoring"), never LLM.
 */

import {
  Differential,
  GA,
  GROUP_ORDER,
  Parameter,
  PARAMETERS_ALL,
  ZResult,
  formatPct,
  formatZ,
  gaToDecimalWeeks,
} from "./biometry";

export type ReportContext = {
  ga: GA;
  fieldStrength: string; // "1.5T" | "3T" | "0.55T"
  motion: string; // "None" | "Mild" | "Moderate" | "Severe"
  values: Record<string, number | null>;
  zs: Record<string, ZResult | null>;
  dxs: Differential[];
};

const bandPhrase = (z: number) => {
  const a = Math.abs(z);
  if (a <= 1) return "within the normal range";
  if (a <= 2) return "mildly deviated from the expected mean";
  if (a <= 3) return "moderately deviated from the expected mean";
  return "markedly deviated from the expected mean";
};

const paramLine = (p: Parameter, x: number, zr: ZResult): string => {
  const flag = zr.extrapolated ? " [case GA outside every source range]" : "";
  const unit = p.unit === "degrees" ? "degrees" : "mm";
  const agreement =
    zr.disagreementWidth == null
      ? `agreement: ${zr.agreementState}`
      : `agreement: ${zr.agreementState}, Delta z ${zr.disagreementWidth.toFixed(2)}`;
  const sources = zr.sourceDetails
    .map(source => {
      const range = `${source.gaRange[0]}-${source.gaRange[1]}w`;
      const rangeTag = source.inRange
        ? `in-range ${range}`
        : `extrapolated ${range}`;
      const modalityTag = source.crossModality ? ", cross-modality" : "";
      return `${source.sourceLabel} z ${formatZ(source.z)} (${formatPct(
        source.percentile
      )}, mu ${source.mu.toFixed(2)}, sigma ${source.sigma.toFixed(
        2
      )}, ${rangeTag}${modalityTag})`;
    })
    .join("; ");
  return `${p.name}: ${x.toFixed(1)} ${unit} (consensus z ${formatZ(
    zr.z
  )}, ${formatPct(zr.percentile)} percentile; ${agreement})${flag} - ${bandPhrase(
    zr.z
  )}. Sources: ${sources}.`;
};

export function generateReport(ctx: ReportContext): string {
  const { ga, fieldStrength, motion, values, zs, dxs } = ctx;
  const gaLabel = `${ga.weeks}w ${ga.days}d (${gaToDecimalWeeks(ga).toFixed(1)} weeks)`;

  const lines: string[] = [];
  lines.push("CLINICAL INDICATION");
  lines.push(
    `Fetal brain MRI at ${gaLabel} for evaluation of brain development.`
  );
  lines.push("");

  lines.push("TECHNIQUE");
  lines.push(
    `Multiplanar T2-weighted single-shot fast spin-echo imaging of the fetal brain at ${fieldStrength}. Motion artefact: ${motion.toLowerCase()}. Calculator operated in multi-source consensus mode: consensus z-score is the arithmetic mean across in-range sources, and source disagreement is flagged at Delta z >= 1.0 SD between in-range sources.`
  );
  if (dxs.some(dx => dx.id === "chiari-ii-ontd")) {
    lines.push(
      "Research-mode Chiari II / ONTD discriminator: posterior probabilities are model-derived and require local cohort calibration before clinical reliance."
    );
  }
  lines.push("");

  lines.push("FINDINGS");
  const disagreeingRows: { parameter: Parameter; result: ZResult }[] = [];
  for (const group of GROUP_ORDER) {
    const inGroup = PARAMETERS_ALL.filter(p => p.group === group);
    const measured = inGroup.filter(p => values[p.id] != null);
    if (measured.length === 0) continue;
    lines.push(`— ${group.toUpperCase()} —`);
    for (const p of measured) {
      const x = values[p.id]!;
      const zr = zs[p.id]!;
      if (zr.agreementState === "disagree") {
        disagreeingRows.push({ parameter: p, result: zr });
      }
      lines.push(`  • ${paramLine(p, x, zr)}`);
    }
    lines.push("");
  }

  if (disagreeingRows.length > 0) {
    lines.push("SOURCE-AGREEMENT NOTES");
    for (const row of disagreeingRows) {
      const detail = row.result.sourceDetails
        .map(source => `${source.sourceLabel} z ${formatZ(source.z)}`)
        .join("; ");
      lines.push(
        `${row.parameter.name} Delta z ${row.result.disagreementWidth?.toFixed(
          2
        )}: ${detail}.`
      );
    }
    lines.push("");
  }

  lines.push("IMPRESSION");
  const anyAbnormal = PARAMETERS_ALL.some(p => {
    const z = zs[p.id];
    return z != null && Math.abs(z.z) > 2;
  });
  const qualitativeMcmImpression =
    (values.qualitative_mcm_panel ?? 0) > 0
      ? "Isolated mega cisterna magna with persistent Blake's pouch — likely benign normal variant."
      : undefined;
  if (qualitativeMcmImpression) {
    lines.push(qualitativeMcmImpression);
  } else if (!anyAbnormal && Object.values(values).some(v => v != null)) {
    lines.push("No abnormal biometric findings.");
  } else if (anyAbnormal) {
    const accImpression = dxs.find(
      dx => dx.id === "acc-pattern"
    )?.impressionLine;
    const accDwmImpression =
      accImpression && dxs.some(dx => dx.id === "dwm-pattern")
        ? `${accImpression} Dandy-Walker spectrum with elevated tegmento-vermian angle is also present.`
        : undefined;
    const combinedCerebellarHypoplasiaImpression =
      dxs.some(dx => dx.id === "vermis-small") &&
      dxs.some(dx => dx.id === "tcd-small") &&
      !dxs.some(dx => dx.id === "dwm-pattern")
        ? "Combined small TCD and small vermis pattern raises concern for cerebellar agenesis or pontocerebellar hypoplasia."
        : undefined;
    const overgrowthMacrocerebellumImpression =
      dxs.some(dx => dx.id === "tcd-large") &&
      dxs.some(dx => dx.id === "macrocephaly") &&
      !dxs.some(dx => dx.id === "hydrocephalus-pattern")
        ? "Macrocerebellum with macrocephaly raises concern for fetal overgrowth syndromes such as Sotos or Beckwith-Wiedemann syndrome."
        : undefined;
    const overgrowthThickCallosumImpression =
      dxs.some(dx => dx.id === "tcd-large") &&
      dxs.some(dx => dx.id === "cc-thick") &&
      !dxs.some(dx => dx.id === "hydrocephalus-pattern")
        ? "Macrocerebellum with thick corpus callosum raises concern for a fetal overgrowth syndrome."
        : undefined;
    const deterministicImpression = dxs.reduce<Differential | undefined>(
      (best, dx) => {
        if (!dx.impressionLine) return best;
        if (!best) return dx;
        return (dx.impressionPriority ?? 0) > (best.impressionPriority ?? 0)
          ? dx
          : best;
      },
      undefined
    );
    if (
      accDwmImpression ||
      combinedCerebellarHypoplasiaImpression ||
      overgrowthMacrocerebellumImpression ||
      overgrowthThickCallosumImpression ||
      deterministicImpression?.impressionLine
    ) {
      lines.push(
        accDwmImpression ??
          combinedCerebellarHypoplasiaImpression ??
          overgrowthMacrocerebellumImpression ??
          overgrowthThickCallosumImpression ??
          deterministicImpression!.impressionLine!
      );
      lines.push("");
      lines.push("Differential considerations ranked by likelihood:");
    } else {
      lines.push(
        "Biometric deviations were identified (see FINDINGS). The following differential considerations are suggested by the calculator's evidence-based trigger engine, ranked by likelihood:"
      );
    }
    dxs.forEach((dx, i) => {
      lines.push(
        `  ${i + 1}. ${dx.title} — ${dx.severity.toUpperCase()} — ${dx.oneLine}`
      );
    });
    lines.push("");
    lines.push(
      "Correlation with detailed neurosonography, maternal history, genetic testing, and TORCH screening is recommended as clinically appropriate."
    );
  } else {
    lines.push(
      "No measurements entered. Please enter biometric values to generate an impression."
    );
  }

  lines.push("");
  lines.push(
    "— Generated by the Fetal Brain MRI Biometry Calculator (prototype). Deterministic string interpolation; no PHI stored."
  );

  return lines.join("\n");
}
