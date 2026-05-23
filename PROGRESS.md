## 2026-05-23

- Implemented SPEC sections 4.2.3, 4.2.4, and 4.8 increment for runtime multi-source consensus reconciliation.
- Added a per-parameter source registry for TCD, vermis CC, vermis AP, and pons AP so Luis 2025 and Dovjak 2021 are evaluated together; single-source rows continue to use their registry entry.
- Added consensus `ZResult` source details, agreement state (`single`, `agree`, `disagree`), disagreement width, per-source in-range/extrapolated tags, and third-ventricle cross-modality metadata.
- Updated the structured report to state multi-source consensus mode, include per-source z/percentile/mu/sigma/range values for every measured row, and add SOURCE-AGREEMENT NOTES for disagreeing rows.
- Updated the worksheet to show source counts, agreement badges, expandable per-source breakdowns, and removed the user-facing reference cohort selector.
- Added Vitest tests covering consensus source evaluation, disagreement thresholding, and report source-agreement notes.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check package.json PLAN.md client/src/lib/biometry.ts client/src/lib/report.ts client/src/components/ParameterRow.tsx client/src/pages/Home.tsx client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with pre-existing Vite warnings about unset analytics placeholders and chunk size.
- Full-repo Prettier check is not green because many pre-existing files outside this increment are not formatted.

## 2026-05-23, Chiari II / ONTD increment

- Implemented SPEC §6.5.1-§6.5.4 for maximum transverse diameter of the posterior fossa (TDPF), clivus-supraocciput angle (CSA), and the Chiari II / open neural tube defect differential card.
- Added Woitek 2014 quadratic mean / linear SD models for TDPF and CSA with validated 21-37 week windows. Both are single-source registry rows and report `single` agreement.
- Extended parameter units to support degree measurements so CSA renders as degrees in reports and as `deg` in the worksheet.
- Added a Mahalanobis posterior helper over the Woitek control, ONTD, and CNTD z-score centroids; the Chiari II card fires when TDPF z < -2, CSA z < -2, and ONTD posterior > 0.5.
- Added Vitest coverage for the SPEC §6.5.2 worked example and the combined Chiari II card trigger.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/report.ts client/src/components/ParameterRow.tsx client/src/pages/Home.tsx client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Source-Registry Acceptance Increment

- Implemented SPEC §4.10.1 source-registry extension validation.
- Added `validateSourceRegistryExtension`, which samples every existing-source overlap at half-week increments and computes the worst standardized mean divergence: `abs(mu_new - mu_existing) / max(sigma_new, sigma_existing)`.
- The validator returns acceptance status plus offending source, GA, and delta details for any comparison exceeding the 0.5 SD ceiling.
- Added Vitest coverage for an accepted duplicate skull-BPD source and a rejected shifted source.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Chiari Research-Mode Report Flag

- Implemented SPEC §7.5 report disclosure for the Chiari II / ONTD discriminator.
- When the `chiari-ii-ontd` card fires, the structured report now adds a deterministic research-mode note stating that model-derived posterior probabilities require local cohort calibration before clinical reliance.
- Added Vitest coverage for the report flag.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Mild-VM Impression Increment

- Implemented TEST.md §3 Case M1 expected impression wording for isolated mild ventriculomegaly.
- Added `impressionLine` support to fired differential cards and a deterministic report path that prefers a card-specific impression line before generic abnormal-report prose.
- Added the Pagani 2014 mild-VM impression line to the mild ventriculomegaly card.
- Added Vitest coverage for bilateral 11 mm atria at 24w0d.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Gestational-Age Parsing Increment

- Implemented TEST.md §1.3 gestational-age parsing for weeks+days and decimal-week input forms.
- Added `parseGestationalAge`, accepting examples such as `24+3`, `24w 3d`, and `24.5w`, with invalid day values rejected.
- Added a compact top-bar quick-entry field that applies parsed GA on Enter or blur while preserving the existing week/day dropdown controls.
- Added Vitest coverage for accepted and rejected GA strings.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/pages/Home.tsx` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Normal-Control Impression Increment

- Implemented TEST.md §2 expected normal-control impression wording.
- Replaced the longer prototype normal-impression sentence with the deterministic line `No abnormal biometric findings.`
- Added Vitest coverage for the report impression when measurements are present and no abnormality is detected.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Methodology Audit Increment

- Implemented SPEC §4.10.2 periodic cross-validation audit computation from the source registry.
- Added verification-tier metadata (`byte-identical`, `transcribed`, `derived`, `approximation`) and verification dates to source-registry entries for Methodology rendering.
- Added `computeCrossValidationAudits`, which samples half-week overlaps for every multi-source parameter, computes per-sample standardized mean divergence, and classifies each parameter as `pass`, `partial-fail`, or `fail` using the SPEC 0.5 SD and contiguous-excursion rule.
- Updated the Methodology page to remove stale reference-set selection language, describe always-on consensus mode, render per-source mean line glyphs, render disagreement bars, and list per-parameter verification tiers.
- Added Vitest coverage that verifies audits are registry-derived and sampled at half-week increments for multi-source rows.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/pages/Methodology.tsx` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, DDx Source-Disagreement Increment

- Implemented SPEC §4.6 source-disagreement propagation for z-score-driven DDx cards.
- Added related-parameter metadata to z-score and composite DDx triggers so the engine can attach any contributing rows in `disagree` state.
- Added `sourceDisagreements` metadata to fired differential cards, including parameter id, parameter name, and disagreement width.
- Rendered source-disagreement badges in both expanded differential cards and compact rail items.
- Added Vitest coverage using a TCD-triggered card with a disagreeing Luis/Dovjak row.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/components/DifferentialCard.tsx` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Third-Ventricle Manifest Correction

- Corrected the Birnbaum 2018 third-ventricle source registry window to 18-37 weeks per SPEC §7.3.12.
- Confirmed the row carries cross-modality and approximation-tier metadata.
- Added Vitest coverage for in-range 18w behavior and extrapolated 38w behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Asymmetric Mild-VM Impression Increment

- Implemented TEST.md §3 Case M3 expected impression wording for unilateral right-sided mild ventriculomegaly with marked side-to-side asymmetry.
- Adjusted the ventriculomegaly tier boundary so exactly 12.0 mm remains in the mild VM bucket and moderate VM starts above 12.0 mm.
- Added side-specific asymmetric mild-VM impression generation and impression priority so combined/asymmetric report wording can override the generic mild-VM line.
- Added Vitest coverage for 28w0d, right atrium 12.0 mm, and normal left atrium 7.4 mm.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated Severe-VM Impression Increment

- Implemented TEST.md §4 Case S3 expected impression wording for apparently isolated severe ventriculomegaly.
- Added the Carta 2018 isolated severe-VM impression line to the severe ventriculomegaly card.
- Assigned severe VM an impression priority above generic mild VM and below future combined-pattern report impressions.
- Added Vitest coverage for 28w0d with bilateral 17.5 mm atria, normal third ventricle, preserved CSP, and preserved corpus callosum.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Aqueductal-Stenosis Impression Increment

- Implemented TEST.md §4 Case S1 expected impression wording for severe triventricular hydrocephalus with preserved CSP and macrocephaly.
- Added the Heaphy-Henault aqueductal-stenosis impression line to the triventricular hydrocephalus composite card.
- Assigned the hydrocephalus composite a higher impression priority than the standalone severe-VM card so combined-pattern report wording wins.
- Added Vitest coverage for 26w0d with bilateral 18.0 mm atria, dilated third ventricle, macrocephaly, preserved CSP, and preserved corpus callosum.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, ACC Severe-VM Impression Increment

- Implemented TEST.md §4 Case S2 expected impression wording for complete agenesis of the corpus callosum with associated colpocephaly.
- Added the Santo 2012 ACC counselling impression line to the ACC composite card.
- Tightened the HPE composite trigger so absent CSP plus severe VM alone does not fire HPE without a microcephaly proxy.
- Added Vitest coverage for 24w0d with bilateral 16.0 mm atria, absent CSP, absent corpus callosum, and normal third ventricle.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, HPE Severe-VM Impression Increment

- Implemented TEST.md §4 Case S5 expected impression wording for alobar holoprosencephaly.
- Added the Malinger 2013 HPE counselling impression line to the HPE composite card with the highest current report priority.
- Tightened the ACC composite so the HPE microcephaly pattern is not simultaneously labelled as ACC.
- Added Vitest coverage for 32w0d with bilateral 20.0 mm atria, absent CSP, absent corpus callosum, and microcephaly.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Mixed-Tier Asymmetric VM Increment

- Implemented TEST.md §4 Case S4 trigger coverage for asymmetric severe right VM with mild left VM.
- Changed mild and moderate VM DDx matching from max-only logic to side-aware tier matching so a contralateral lower-tier ventricle is not hidden by the more severe side.
- Preserved existing report impression priority ordering, with severe VM still outranking the generic mild-VM impression.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Vermian-Hypoplasia Caveat Increment

- Implemented TEST.md §6 Case V3 report caveat coverage for isolated inferior vermian hypoplasia.
- Added a deterministic vermis-small impression line referencing Limperopoulos 2006's warning that fetal MRI before 24 weeks can substantially over-call inferior vermian hypoplasia.
- Added Vitest coverage that 26w0d vermis hypoplasia fires `vermis-small` without `tcd-small` or `pons-small`.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Combined Cerebellar Hypoplasia Report Increment

- Implemented TEST.md §6 Case V5 combined-pattern report behavior for concurrent small TCD and small vermis without adding a formal DDx card.
- Added a report-level impression override that flags concern for cerebellar agenesis or pontocerebellar hypoplasia when `tcd-small` and `vermis-small` both fire and no Dandy-Walker pattern is present.
- Used a registry-threshold TCD value for coverage because the literal TEST.md V5 value of 38.0 mm is normal under the implemented SPEC §7.3.7 Luis+Dovjak consensus coefficients.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Centile-Table Fitting Increment

- Implemented SPEC §4.2.5 helper support for fitting per-week 5th/95th centile rows into the per-percentile linear model family by ordinary least squares.
- Added retained residual RMSE values for the 5th and 95th centile fits so fitted source rows remain auditable.
- Added validation that rejects underdetermined tables, non-finite values, and inverted centile rows.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Mean-SD Table Fitting Increment

- Implemented SPEC §4.2.5 helper support for fitting per-week mean/SD rows into the linear-mean/constant-SD model family.
- Added retained RMSE values for the mean-line fit and constant-SD approximation.
- Added validation that rejects underdetermined rows, non-finite values, and non-positive SD inputs.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Dandy-Walker TVA Trigger Increment

- Implemented TEST.md §7 Case D1 coverage for a TVA-based Dandy-Walker spectrum composite trigger.
- Changed the DWM composite from small vermis plus third-ventricle dilatation to small vermis plus tegmento-vermian angle >= 35 degrees.
- Updated the small-TCD base card to fire when any in-range source is below the 5th percentile, preserving sensitivity for DWM fixtures where the consensus z-score is just above the cutoff.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, ACC Plus Dandy-Walker Report Increment

- Implemented TEST.md §7 Case D3 coverage for simultaneous ACC and Dandy-Walker composite cards.
- Added deterministic Dandy-Walker report wording for TVA-based DWM cases.
- Added report handling so ACC plus DWM enumerates both combined-pattern diagnoses instead of letting the ACC impression hide DWM.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.
