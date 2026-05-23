## Consensus registry increment

- Add Vitest coverage for SPEC §4.2.3/§4.2.4: TCD at 28w0d and 33.0 mm must evaluate Luis 2025 and Dovjak 2021 and compute consensus z from in-range sources. Because the verbatim §7.3 coefficients yield Delta z 0.98 for 33.0 mm, add a 33.2 mm disagreement assertion for the Delta z >= 1.0 runtime flag.
- Add report coverage for SPEC §4.8: measured rows must include consensus values, per-source z/mean/SD/range details, agreement state, and SOURCE-AGREEMENT NOTES when a row disagrees.
- Replace one-model-per-parameter scoring with a per-parameter source registry and deterministic consensus reconciler.
- Surface source count, agreement badge, and per-source details in each parameter row.
- Remove the user-facing reference-set selector so the imaging-context strip only indicates multi-source consensus mode.

## Chiari II / open NTD increment

- Add Vitest coverage for SPEC §6.5.2 worked example: at 24w0d, TDPF 24.0 mm and CSA 55.0 degrees must produce severely low single-source Woitek z-scores.
- Add Vitest coverage for SPEC §6.5.4: the combined TDPF/CSA pattern must emit a Chiari II / open neural tube defect DDx card when both z-scores are below -2 and the ONTD Mahalanobis posterior is above 0.5.
- Extend the parameter model and UI/report rendering so a parameter can use degree units, not only millimetres.
- Add TDPF and CSA source-registry entries using the Woitek 2014 quadratic mean / linear SD coefficients and validated 21-37 week window.
- Implement the Mahalanobis posterior helper and DDx card using consensus z-scores.

## Source-registry acceptance increment

- Add Vitest coverage for SPEC §4.10.1 using skull BPD: an identical candidate source should pass with zero standardized divergence.
- Add Vitest coverage for SPEC §4.10.1 rejection: a candidate shifted well above the existing mean curve should fail and report the offending source, GA, and delta.
- Implement a source-registry extension validator that samples half-week increments over each overlap and computes max |mu_new - mu_existing| / max(sigma_new, sigma_existing).

## Methodology audit increment

- Add Vitest coverage for SPEC §4.10.2: cross-validation audits must be reproducible from the source registry and include half-week samples for each multi-source parameter.
- Add verification tier metadata to source-registry entries so Methodology can show byte-identical, transcribed, derived, or approximation rows per SPEC §7.5.
- Implement audit status classification (`pass`, `partial-fail`, `fail`) using the 0.5 SD threshold and contiguous excursion rule from SPEC §4.10.2.
- Replace stale Methodology copy about selectable reference sets with always-on consensus wording, audit charts, and verification-tier lines.

## DDx source-disagreement increment

- Add Vitest coverage for SPEC §4.6: a DDx card triggered from a disagreeing source row must carry source-disagreement metadata.
- Add related-parameter metadata to z-score-driven DDx cards so the engine can propagate `disagree` rows into the card output.
- Render source-disagreement badges in expanded cards and rail items.

## Third-ventricle manifest correction

- Add Vitest coverage for SPEC §4.2.2 / §7.3.12 third-ventricle metadata: Birnbaum 2018 must be tagged cross-modality, approximation-tier, and valid over 18-37 weeks.
- Correct the third-ventricle registry range so 18w is in range and 38w is extrapolated.

## Chiari research-mode report flag

- Add report coverage for SPEC §7.5: when the Chiari II / ONTD card fires, the structured report must explicitly flag that discriminator as research-mode pending local calibration.
- Add a deterministic report note tied to the fired card id.

## Gestational-age parsing increment

- Add Vitest coverage for TEST.md §1.3: GA input strings must accept weeks+days (`24+3`, `24w 3d`) and decimal weeks (`24.5 w`).
- Implement a parser that normalizes valid inputs to `{weeks, days}` and rejects out-of-range days.
- Add a compact top-bar GA text field that applies parsed GA on Enter or blur while preserving the existing week/day dropdown workflow.
