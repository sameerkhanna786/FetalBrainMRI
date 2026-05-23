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
