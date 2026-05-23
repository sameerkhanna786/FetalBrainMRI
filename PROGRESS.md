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

## 2026-05-23, Mega-Cisterna-Magna Qualitative Report Increment

- Implemented TEST.md §8 Case BP3 qualitative report behavior for the MCM / Blake's pouch panel.
- Added a report impression path for `qualitative_mcm_panel` that emits `Isolated mega cisterna magna with persistent Blake's pouch — likely benign normal variant.`
- Kept the qualitative panel separate from DDx card firing; the BP3 fixture still emits no quantitative DDx cards.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated Small-TCD Report Increment

- Implemented TEST.md §9 Case CH3 report behavior for isolated small transcerebellar diameter at 32w0d.
- Added Vitest coverage that TCD 33.0 mm fires `tcd-small` without `vermis-small`, `pons-small`, or `dwm-pattern`.
- Added a deterministic `tcd-small` impression recommending consideration of unilateral cerebellar hypoplasia or cerebellar disruption injury, with postnatal MRI for laterality assessment.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Macrocerebellum Plus Macrocephaly Report Increment

- Implemented TEST.md §10 Case LC2 report behavior for macrocerebellum with macrocephaly at 30w0d.
- Added Vitest coverage that TCD 42.0 mm and skull BPD 90.0 mm fire `tcd-large` and `macrocephaly` together.
- Added a report-level combined-pattern impression that raises concern for fetal overgrowth syndromes such as Sotos or Beckwith-Wiedemann syndrome, while preserving hydrocephalus-specific report priority.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Macrocerebellum Plus Thick-CC Report Increment

- Implemented TEST.md §10 Case LC5 report behavior for macrocerebellum with thick corpus callosum at 30w0d.
- Added Vitest coverage that TCD 42.5 mm and corpus callosum length 44.0 mm fire `tcd-large` and `cc-thick` together.
- Extended the report-level overgrowth combined-pattern impression to include `tcd-large` plus `cc-thick`, while preserving hydrocephalus-specific report priority.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Short Corpus-Callosum Report Increment

- Implemented TEST.md §11 Case A4's partial / hypogenetic corpus-callosum report wording.
- Added Vitest coverage that a registry-threshold short corpus-callosum value fires `cc-short` without `cc-absent` or `acc-pattern`.
- Added a deterministic `cc-short` impression recommending postnatal MRI confirmation.
- Used CC length 30.0 mm at 28w0d for coverage because the literal TEST.md A4 value of 22.0 mm falls into `cc-absent` under the implemented Luis 2025 coefficients.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated Small-Pons Report Increment

- Implemented TEST.md §17 Case PCH6 report behavior for isolated pontine hypoplasia with preserved TCD and vermis at 32w0d.
- Added Vitest coverage that `pons-small` fires without `tcd-small`, `vermis-small`, or `pch-pattern`.
- Added a report-level isolated brainstem / pontine hypoplasia impression that is suppressed when the PCH composite or accompanying small TCD/vermis cards fire.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Large Pons Plus Thick-CC Report Increment

- Implemented TEST.md §18 Case LP6 report behavior for large pons with thick corpus callosum at 26w0d.
- Added Vitest coverage that pons AP 10.5 mm and corpus callosum length 35.0 mm fire `pons-large` and `cc-thick` together.
- Added a report-level overgrowth combined-pattern impression for `pons-large` plus `cc-thick`.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Macrocephaly Plus Thick-CC Report Increment

- Implemented TEST.md §20 Case MA3 / §13 Case TC2 report behavior for macrocephaly with thick corpus callosum.
- Added Vitest coverage that skull BPD 96.0 mm, brain BPD 94.0 mm, and corpus callosum length 47.0 mm fire `macrocephaly` and `cc-thick` together.
- Added a report-level overgrowth combined-pattern impression for `macrocephaly` plus `cc-thick`.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated Third-Ventricle Report Increment

- Implemented TEST.md §21 Case TV2 report behavior for isolated third-ventricle prominence at 30w0d.
- Added Vitest coverage that third-ventricle width 4.0 mm fires `third-v-wide` without mild/severe ventriculomegaly or `hydrocephalus-pattern`.
- Added a report-level isolated third-ventricle impression recommending consideration of early aqueductal stenosis or measurement-technique error with short-interval follow-up.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Aqueductal-Stenosis Absent-CSP Negative-Control Increment

- Implemented TEST.md §22 Case AS-P3 negative-control behavior for severe VM plus third-ventricle dilatation with absent CSP.
- Added Vitest coverage that `severe-vm`, `absent-csp`, and `third-v-wide` fire while `hydrocephalus-pattern` stays suppressed.
- Updated the hydrocephalus composite matcher so explicitly absent CSP rules out aqueductal-stenosis classification.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated Absent-CSP Report Increment

- Implemented TEST.md §14 Case CSP-A3 report behavior for absent CSP with preserved corpus callosum.
- Added Vitest coverage that `absent-csp` fires without `acc-pattern` or `hpe-pattern`.
- Added a deterministic `absent-csp` impression recommending evaluation for septo-optic dysplasia, corpus callosum abnormality, and mild HPE-spectrum findings.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated Enlarged-CSP Report Increment

- Implemented TEST.md §15 Case CSP-E1 report behavior for isolated enlarged CSP at 32w0d.
- Added Vitest coverage that `enlarged-csp` fires alone for CSP width 11.5 mm.
- Added a low-priority deterministic `enlarged-csp` impression describing the finding as usually benign while recommending correlation for cavum velum interpositum cyst or associated anomalies.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, CMV Qualitative Microcephaly Report Increment

- Implemented TEST.md §19 Case MC5 qualitative CMV report behavior for microcephaly with associated mild ventriculomegaly.
- Added Vitest coverage using registry-consistent measurements that fire `microcephaly` and `mild-vm` while a manual `qualitative_cmv_panel` value drives the CMV impression.
- Added report-level qualitative CMV handling without adding a quantitative CMV DDx card.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Growth-Restriction Microcephaly Report Increment

- Implemented TEST.md §19 Case MC6 growth-restriction-context report behavior for microcephaly.
- Added Vitest coverage using registry-consistent measurements that fire `microcephaly` while a manual `growth_restriction_context` value drives the IUGR-associated impression.
- Added report-level growth-restriction context handling without adding a quantitative IUGR DDx card.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Direct Extra-Axial CSF Report Increment

- Implemented TEST.md §25 Case EA1 behavior for direct extra-axial CSF measurement at 32w0d.
- Added an `extra_axial_csf` worksheet parameter with Kyriakopoulou 2017 provenance and an explicitly flagged approximate quadratic reference curve calibrated to the TEST.md §25 boundaries until exact fetal-centiles coefficients are encoded.
- Updated the widened extra-axial-space DDx card to prefer direct `extra_axial_csf` z-scores above the 95th percentile while preserving the prior skull/brain BPD z-gap proxy as a fallback.
- Added deterministic report wording for the external hydrocephalus / benign macrocrania pattern and updated methodology/validation copy to disclose the approximation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 44 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/pages/Methodology.tsx client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Brain-Volume-Loss Extra-Axial Report Increment

- Implemented TEST.md §25 Case EA2 report behavior for the combined microcephaly, mild ventriculomegaly, and widened extra-axial CSF pattern.
- Added Vitest coverage using registry-consistent values that fire `microcephaly`, `mild-vm`, and `extra-axial-wide` without requiring a manual qualitative CMV panel.
- Added a report-level brain-volume-loss impression suggesting congenital CMV or another intrauterine destructive insult, while preserving more specific manually entered qualitative-CMV and growth-restriction context impressions.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 45 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, IUGR Extra-Axial Report Increment

- Implemented TEST.md §25 Case EA4 report behavior for microcephaly with widened extra-axial CSF and no ventriculomegaly.
- Added Vitest coverage using registry-consistent values that fire `microcephaly` and `extra-axial-wide` while keeping `mild-vm` absent.
- Added a report-level IUGR-associated extra-axial-space prominence impression, with manual qualitative-CMV, brain-volume-loss, and entered growth-restriction context paths remaining higher specificity.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 46 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Extreme-Z Percentile Formatting Increment

- Implemented TEST.md §27 Case STRESS4 percentile-saturation behavior for an exact z = +5 macrocephaly fixture.
- Added Vitest coverage that computes a registry-derived skull-BPD z = +5 value, verifies `macrocephaly` fires, and asserts the structured report renders a `>99.9th percentile` bucket.
- Updated `formatPct` to expose `<0.1st` and `>99.9th` saturation buckets while preserving ordinary rounded ordinal percentiles.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 47 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Moderate Ventriculomegaly Report Increment

- Implemented TEST.md §3 Case M4 report behavior for bilateral moderate ventriculomegaly in the 12-14.9 mm sub-band.
- Added Vitest coverage that 13.5 mm bilateral atria fire `mod-vm` without `severe-vm` or `asym-vent`.
- Added deterministic moderate-VM impression wording recommending follow-up imaging for progression toward severe VM and associated-anomaly evaluation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 48 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Near-Severe VM Boundary Increment

- Implemented TEST.md §3 Case M2 report behavior for bilateral 14.5 mm atria just below the severe-VM threshold.
- Added Vitest coverage that `mod-vm` fires without `severe-vm` and that the report states the finding is approaching the 15 mm severe threshold.
- Added match-time moderate-VM impression override for high-end moderate measurements while preserving the generic moderate-VM wording for lower moderate values.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 49 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Pure Ventricular-Asymmetry Report Increment

- Implemented TEST.md §5 Case AS1 report classification behavior for ventricular side-to-side asymmetry without VM.
- Added Vitest coverage using registry-consistent atrial values that fire `asym-vent` while keeping `mild-vm`, `severe-vm`, and all z-scores below the report abnormality threshold.
- Updated report abnormality detection so fired DDx cards are treated as abnormal findings even when all measured z-scores are within ±2.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 50 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Unilateral Severe-VM Asymmetry Report Increment

- Implemented TEST.md §5 Case AS6 report behavior for unilateral severe ventriculomegaly with marked ventricular asymmetry.
- Added Vitest coverage that right atrium 15.0 mm and left atrium 7.6 mm fire `severe-vm` and `asym-vent` without `mild-vm`.
- Added a report-level asymmetric severe-VM impression suggesting unilateral haemorrhage or encephaloclastic insult, suppressed by aqueductal-stenosis, ACC, and HPE combined patterns.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 51 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Vermian-Hypoplasia DWM Boundary Increment

- Implemented TEST.md §6 Case V2 boundary behavior for small vermis with borderline TVA and preserved TCD/pons.
- Added Vitest coverage using registry-normal TCD and pons values that fires `vermis-small` while keeping `dwm-pattern`, `tcd-small`, and `pons-small` absent.
- Tightened the Dandy-Walker matcher so borderline TVA requires both small TCD and small pons support, while markedly elevated TVA remains sufficient.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 52 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Vermian-AP Hypoplasia Trigger Increment

- Implemented the TEST.md §6 small-vermis rule for vermian AP-only hypoplasia, aligning the matcher with the SPEC trigger wording that allows vermian height or AP diameter below the fifth percentile.
- Added Vitest coverage using a registry-normal vermis CC value and an AP-only low vermis value that fires `vermis-small` without unrelated posterior-fossa cards.
- Updated the small-vermis card metadata and trigger label so either entered vermis axis can support and explain the card.
- Adjusted older isolated-TCD and qualitative Blake's pouch fixtures to use registry-normal vermis AP values, preserving their intended non-vermis-hypoplasia behavior after AP support was added.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 53 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Vermian-AP DWM Trigger Increment

- Implemented TEST.md §7 Dandy-Walker spectrum behavior for AP-only vermian hypoplasia with markedly elevated TVA.
- Added Vitest coverage using registry-normal vermis CC, TCD, and pons values with low vermis AP and TVA 95 degrees; `vermis-small` and `dwm-pattern` fire without `tcd-small` or `pons-small`.
- Refactored the vermis-axis selection into a shared helper so both `vermis-small` and `dwm-pattern` use the lowest entered vermis-axis z-score and expose the triggering axis in the label.
- Updated the Dandy-Walker card metadata to link both vermis CC and vermis AP.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 54 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Isolated DWM With Preserved Pons Increment

- Implemented TEST.md §7 Case D5 behavior for isolated Dandy-Walker spectrum with TVA 80 degrees, small vermis, small TCD, and preserved pons.
- Added Vitest coverage using a registry-normal pons value that fires `vermis-small`, `tcd-small`, and `dwm-pattern` while keeping `pons-small` absent.
- Relaxed the DWM support rule for TVA 60-89 degrees so either small TCD or small pons can support the combined pattern; TVA 35-59 degrees still requires both support features, and TVA >= 90 remains sufficient.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 55 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Hemispheric-Asymmetry Z-Delta Increment

- Implemented TEST.md §24 boundary behavior for hemispheric asymmetry using brain-OFD left/right consensus z-score delta rather than raw percent difference.
- Added Vitest coverage showing a 1.6 SD left/right brain-OFD gap does not fire `brain-asym` even when the raw percent gap exceeds 5%.
- Added positive Vitest coverage showing a >2 SD left/right brain-OFD gap still fires `brain-asym`.
- Updated the hemispheric-asymmetry card title, one-line summary, and trigger label to describe the z-delta threshold.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 57 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Large-TCD 95th-Percentile Threshold Increment

- Implemented TEST.md §10 macrocerebellum threshold behavior so `tcd-large` fires above the 95th percentile rather than only above +2 SD.
- Added Vitest coverage using a registry-derived TCD value between +1.645 and +2 SD that fires `tcd-large` without unrelated overgrowth combination cards.
- Updated the large-TCD card title and one-line summary to describe the 95th-percentile threshold.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 58 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Thick-CC 95th-Percentile Threshold Increment

- Implemented TEST.md §13 thick corpus callosum threshold behavior so `cc-thick` fires above the 95th percentile rather than only above +2 SD.
- Added Vitest coverage using a registry-derived CC length between +1.645 and +2 SD that fires `cc-thick` without unrelated macrocephaly or large-pons cards.
- Updated the thick-CC card title and one-line summary to describe the 95th-percentile threshold.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 59 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Large-Pons 95th-Percentile Threshold Increment

- Implemented TEST.md §18 large pons threshold behavior so `pons-large` fires above the 95th percentile rather than only above +2 SD.
- Added Vitest coverage using a registry-derived pons AP value between +1.645 and +2 SD that fires `pons-large` without unrelated macrocephaly or thick-CC cards.
- Updated the large-pons card title and one-line summary to describe the 95th-percentile threshold.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 60 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Macrocephaly 97th-Percentile Threshold Increment

- Implemented TEST.md §20 macrocephaly threshold behavior so `macrocephaly` fires above the 97th percentile rather than only above +2 SD.
- Added Vitest coverage using a registry-derived skull BPD value between the 97th percentile and +2 SD that fires `macrocephaly` without unrelated overgrowth cards.
- Updated the macrocephaly card title and one-line summary to describe the 97th-percentile threshold.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 61 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Microcephaly 3rd-Percentile Threshold Increment

- Implemented TEST.md §19 microcephaly threshold behavior so `microcephaly` fires below the 3rd percentile rather than only below -2 SD.
- Added Vitest coverage using a registry-derived skull BPD value between -2 SD and the 3rd percentile that fires `microcephaly` without unrelated ventriculomegaly or posterior-fossa cards.
- Updated the microcephaly card title and one-line summary to describe the 3rd-percentile threshold.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 62 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, Early Aqueductal-Stenosis Pattern Increment

- Implemented TEST.md §22 Case AS-P2 behavior for pronounced third-ventricle dilatation with moderate bilateral ventriculomegaly and preserved CSP.
- Added Vitest coverage using bilateral 14 mm atria, third ventricle 5.5 mm, preserved CSP, and registry-normal skull BPD that fires `mod-vm`, `third-v-wide`, and `hydrocephalus-pattern` without `severe-vm` or `macrocephaly`.
- Relaxed the hydrocephalus composite matcher from severe VM only to any ventriculomegaly-range atrium plus third-ventricle dilatation, while preserving absent-CSP suppression.
- Added match-time early-evolving aqueductal-stenosis impression wording for non-severe cases so severe-triventricular wording remains reserved for severe VM.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 63 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, HPE 3rd-Percentile Microcephaly Increment

- Implemented TEST.md §16/§19 threshold alignment so `hpe-pattern` uses the same 3rd-percentile microcephaly cutoff as the base `microcephaly` card.
- Added Vitest coverage using absent CSP, severe VM, preserved CC, and a registry-derived skull BPD between -2 SD and the 3rd percentile; `microcephaly` and `hpe-pattern` both fire without `acc-pattern`.
- Updated the ACC-vs-HPE suppression check to use the same 3rd-percentile microcephaly cutoff, preserving the existing alobar-HPE report behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 64 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, PCH Vermis-Support Increment

- Implemented TEST.md §17 wording that `pch-pattern` can fire from small pons plus vermian hypoplasia even when TCD is preserved.
- Added Vitest coverage using registry-derived pons and vermis values below the fifth percentile with registry-mean TCD; `pons-small`, `vermis-small`, and `pch-pattern` fire while `tcd-small` remains absent.
- Updated the PCH composite card wording, related-parameter metadata, trigger label, and boost rules so vermian support is surfaced consistently.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 65 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, BP6 TVA-60 Dandy-Walker Increment

- Implemented TEST.md §8 Case BP6 behavior so small vermis plus TVA 60 degrees fires `dwm-pattern` even with preserved TCD and pons.
- Added Vitest coverage confirming `vermis-small` and `dwm-pattern` fire while `tcd-small` and `pons-small` remain absent.
- Preserved the lower-borderline TVA negative control: TVA values from 35 to below 60 degrees still require both small TCD and small pons support.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 66 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, HPE Qualitative-Toggle Increment

- Implemented TEST.md §16 Case HPE3 behavior so `qualitative_hpe_panel` can support `hpe-pattern` when absent CSP and 3rd-percentile microcephaly are present despite only mild-range VM.
- Added Vitest coverage showing mild VM plus absent CSP and microcephaly remains non-HPE without the qualitative HPE entry, then fires `hpe-pattern` when the entry is present.
- Preserved the severe-VM quantitative HPE path and the shared 3rd-percentile microcephaly cutoff.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 67 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, HA1 Hemispheric-Disruption Report Increment

- Implemented TEST.md §24 Case HA1 report behavior for cerebral hemispheric asymmetry with ipsilateral ventriculomegaly and marked ventricular asymmetry.
- Added Vitest coverage using registry-derived right brain-OFD reduction plus right-sided mild VM; `brain-asym`, `asym-vent`, and `mild-vm` fire together.
- Added a report-level combined-pattern impression suggesting unilateral encephaloclastic insult or porencephaly, with side derived from the smaller brain OFD, ahead of generic asymmetric-VM wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 68 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, HPE Plus DWM Report Increment

- Implemented TEST.md §16/§27 simultaneous combined-pattern report behavior for HPE plus Dandy-Walker spectrum.
- Added Vitest coverage using registry-derived microcephaly and vermian hypoplasia values; `hpe-pattern` and `dwm-pattern` both fire and the report impression names both.
- Added an HPE+DWM report override parallel to the existing ACC+DWM combined-pattern wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 69 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, LP2 Pons-Macrocephaly Overgrowth Report Increment

- Implemented TEST.md §18 Case LP2 report behavior for large pons plus macrocephaly as an overgrowth-pattern combination.
- Added Vitest coverage using registry-derived pons AP and skull BPD values above the relevant thresholds; `pons-large` and `macrocephaly` fire without `hydrocephalus-pattern`.
- Added a report-level overgrowth impression for large pons plus macrocephaly, suppressed when macrocephaly is part of a hydrocephalus composite.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 70 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, LP4 Pons-Macrocerebellum Overgrowth Report Increment

- Implemented TEST.md §18 Case LP4 report behavior for large pons plus macrocerebellum as an overgrowth-pattern combination.
- Added Vitest coverage using registry-derived pons AP and TCD values above the relevant thresholds; `pons-large` and `tcd-large` fire without macrocephaly or thick CC.
- Added a report-level overgrowth impression for large pons plus macrocerebellum.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 71 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/report.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, STRESS1 Consensus-Zero Mu Increment

- Implemented TEST.md §27 Case STRESS1 behavior so `mu(parameter, GA)` values produce consensus z-scores within 0.05 SD of zero for every reportable parameter.
- Added Vitest coverage filling every `PARAMETERS_ALL` row at 28w0d from the exported `mu` helper and asserting no DDx cards fire.
- Updated multi-source `mu` to return the inverse-SD weighted zero-consensus center and multi-source `sigma` to return the harmonic scale, so `mu + k*sigma` inverts the runtime consensus-z calculation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 72 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, SPEC 4.7 RES Qualitative Trigger Increment

- Implemented SPEC.md §4.7 rhombencephalosynapsis support as a qualitative composite card: small TCD plus entered absent primary fissure fires `res-pattern`.
- Added Vitest coverage proving small TCD alone stays limited to `tcd-small`, while adding `qualitative_absent_primary_fissure` fires `res-pattern`.
- Refactored the repeated TCD lowest-source-z calculation into a shared helper and added a boost from `res-pattern` back to `tcd-small`.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 73 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, SPEC 4.7 Cisterna-Magna Depth Increment

- Implemented SPEC.md §4.7 cisterna magna depth support so depth >10 mm fires the `mega-cisterna-magna` differential card.
- Added Vitest coverage proving the threshold is strict: 10 mm remains negative, while 10.1 mm fires the card.
- Added deterministic benign-variant report wording for isolated mega cisterna magna with persistent Blake's pouch.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 74 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, SPEC 4.7 Posterior-Fossa Auxiliary Inputs Increment

- Implemented SPEC.md §4.7 UI-facing auxiliary inputs for cisterna magna depth and tegmento-vermian angle.
- Added Vitest coverage that `AUXILIARY_MEASUREMENTS` contains `cisterna_magna_depth` in millimetres and `tva` in degrees while keeping both out of the z-scored `PARAMETERS_ALL` registry.
- Added a raw auxiliary worksheet row component and rendered the new inputs in the posterior-fossa section so they can feed existing threshold-based DDx logic.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 75 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/pages/Home.tsx client/src/components/AuxiliaryMeasurementRow.tsx` passes after formatting `Home.tsx`.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, SPEC 4.7 Colpocephaly Comparison Increment

- Implemented SPEC.md §4.7 anterior/posterior ventricle comparison support using raw same-side frontal-horn auxiliary inputs.
- Added Vitest coverage proving atrial diameter >10 mm plus a normal same-side frontal horn fires `colpocephaly-pattern`, while atrial dilation alone and atrial dilation with an enlarged frontal horn do not.
- Added a qualitative colpocephaly differential card focused on corpus-callosum agenesis and malformations of cortical development without changing existing ACC or ventriculomegaly thresholds.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 76 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, TEST 8 Blake's-Pouch Advisory Toggle Increment

- Implemented TEST.md §8 qualitative Blake's pouch advisory support with a low-severity `blakes-pouch-dd` card.
- Added Vitest coverage proving elevated TVA with registry-normal vermis/TCD/pons stays negative without `qualitative_blakes_pouch_panel`, then fires the advisory card with the toggle while preserving no-DWM behavior.
- Added deterministic report wording for the advisory card and guarded against firing it when the entered vermis is already small.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 77 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, TEST 27 STRESS5 DWM Fallback Increment

- Implemented TEST.md §27 Case STRESS5 multi-card behavior so the severe-malformation fixture fires `dwm-pattern` alongside HPE and PCH even when TVA is unavailable.
- Added Vitest coverage for the 26w STRESS5 fixture, asserting at least 10 cards including severe VM, absent CSP, absent CC, small TCD, vermian hypoplasia, small pons, microcephaly, third-ventricle dilation, hemispheric asymmetry, extra-axial widening, HPE, PCH, and DWM.
- Kept the new DWM fallback narrow: it requires small vermis, small TCD, small pons, and third-ventricle dilation when TVA is missing; TVA-measured cases still use the existing TVA thresholds.
- Adjusted the approximate direct extra-axial CSF curve so the documented STRESS5 5.5 mm value at 26w crosses the 95th-percentile trigger while preserving existing negative controls.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 78 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with the same pre-existing Vite warnings about unset analytics placeholders and chunk size.

## 2026-05-23, SPEC 4.9 No-Analytics Shell Increment

- Implemented SPEC.md §4.9 no-transmission hardening by removing the placeholder Umami analytics script from the client HTML shell.
- Added Vitest coverage proving `client/index.html` contains no analytics, Umami, or `data-website-id` telemetry hooks.
- Preserved the Vite application entrypoint and confirmed the production build no longer emits analytics-placeholder warnings.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 79 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/index.html client/src/lib/client-shell.test.ts` passes after formatting `client/index.html`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 Offline Font Shell Increment

- Implemented SPEC.md §4.9 offline/no-transmission hardening by removing Google Fonts preconnect and stylesheet requests from `client/index.html`.
- Extended the client-shell Vitest coverage to reject external `http(s)` font links and preconnect hints.
- Replaced named web-font CSS variables with system serif, sans, and monospace stacks so the UI keeps its typography roles without network font loading.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 79 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/index.html client/src/index.css client/src/lib/client-shell.test.ts` passes after formatting `client/src/index.css`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST 11 Heterotopia Qualitative Add-On Increment

- Implemented TEST.md §11 Case A2 qualitative heterotopia support with a low-severity `heterotopia-dd` advisory card.
- Added Vitest coverage proving complete ACC remains on the existing quantitative cards without the toggle, then adds `heterotopia-dd` when `qualitative_heterotopia_panel` is entered.
- Kept the card qualitative-only so it does not alter ACC, CSP, CC, or ventriculomegaly thresholds.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 80 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST 11 Interhemispheric-Cyst Qualitative Add-On Increment

- Implemented TEST.md §11 Case A5 qualitative interhemispheric-cyst support with a low-severity `interhemispheric-cyst-dd` advisory card.
- Added Vitest coverage proving ACC with severe VM remains on the existing quantitative cards without the toggle, then adds `interhemispheric-cyst-dd` when `qualitative_interhemispheric_cyst_panel` is entered.
- Kept the card qualitative-only so it does not alter ACC, ventriculomegaly, or hydrocephalus matching.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 81 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes after formatting `client/src/lib/biometry.test.ts`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST 15 Cavum-Vergae Qualitative Label Increment

- Implemented TEST.md §15 Case CSP-E3 qualitative cavum-vergae support with a low-severity `cavum-vergae-dd` advisory card.
- Added Vitest coverage proving enlarged CSP remains on the quantitative `enlarged-csp` card without the toggle, then adds `cavum-vergae-dd` when `qualitative_cavum_vergae_panel` is entered.
- Kept the card qualitative-only so it does not alter CSP enlargement or ventriculomegaly thresholds.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 82 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST 14 SOD Qualitative Manual-Entry Increment

- Implemented TEST.md §14 Case CSP-A3 qualitative SOD support with a low-priority `sod-dd` advisory card for entered small optic apparatus.
- Added Vitest coverage proving isolated absent CSP keeps the existing absent-CSP impression without the toggle, then adds `sod-dd` when `qualitative_sod_panel` is entered.
- Kept the SOD advisory below the absent-CSP impression so it does not become a new quantitative combined-pattern trigger.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 83 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST 19 CMV Qualitative Add-On Increment

- Implemented TEST.md §19 Case MC5 qualitative CMV support with a `cmv-dd` advisory card for entered periventricular cysts, calcifications, or germinolytic cysts.
- Extended the existing CMV report test to prove microcephaly with mild VM stays on quantitative cards without the toggle, then adds `cmv-dd` and preserves the CMV impression when `qualitative_cmv_panel` is entered.
- Kept the card qualitative-only so it does not alter microcephaly, ventriculomegaly, or brain-volume-loss matching.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 83 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts` passes after formatting `client/src/lib/biometry.test.ts`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Qualitative Finding UI Controls Increment

- Added a UI-facing `QUALITATIVE_FINDINGS` registry for every manual engine/report flag, including growth-restriction context.
- Added Vitest coverage proving the qualitative/context registry is distinct from z-scored parameters and auxiliary numeric inputs.
- Rendered the registry as worksheet checkbox rows by anatomical group so qualitative add-ons can be entered from the app instead of hidden fixtures.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 84 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/pages/Home.tsx client/src/components/QualitativeFindingRow.tsx` passes after formatting `client/src/components/QualitativeFindingRow.tsx`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 Stateless Browser-Storage Hardening Increment

- Extended client-shell privacy coverage to reject browser persistence APIs in client source, including `localStorage`, `sessionStorage`, IndexedDB, and cookie writes.
- Removed theme `localStorage` persistence so theme state remains runtime-only.
- Removed sidebar cookie persistence so UI state is not retained through browser storage.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 85 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/client-shell.test.ts client/src/contexts/ThemeContext.tsx client/src/components/ui/sidebar.tsx` passes after formatting `client/src/lib/client-shell.test.ts` and `client/src/components/ui/sidebar.tsx`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 No External Script Loader Increment

- Extended client-shell privacy coverage to reject dynamic script creation, script `src` assignment, Google Maps integration hooks, and Forge maps proxy hooks in client source.
- Removed the unused `client/src/components/Map.tsx` Google Maps component that dynamically injected a remote script.
- Preserved citation/source URLs while blocking executable third-party script-loader code paths.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 86 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/client-shell.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.
