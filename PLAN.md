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
