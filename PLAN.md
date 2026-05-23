## Consensus registry increment

- Add Vitest coverage for SPEC §4.2.3/§4.2.4: TCD at 28w0d and 33.0 mm must evaluate Luis 2025 and Dovjak 2021 and compute consensus z from in-range sources. Because the verbatim §7.3 coefficients yield Delta z 0.98 for 33.0 mm, add a 33.2 mm disagreement assertion for the Delta z >= 1.0 runtime flag.
- Add report coverage for SPEC §4.8: measured rows must include consensus values, per-source z/mean/SD/range details, agreement state, and SOURCE-AGREEMENT NOTES when a row disagrees.
- Replace one-model-per-parameter scoring with a per-parameter source registry and deterministic consensus reconciler.
- Surface source count, agreement badge, and per-source details in each parameter row.
- Remove the user-facing reference-set selector so the imaging-context strip only indicates multi-source consensus mode.
