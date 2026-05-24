# Source-Data Final Lock Checklist

This checklist is the clinician-facing signoff packet for declaring the
calculator's source data ready for clinical reliance or manuscript submission.
It does not close any source item by itself; each row needs a named reviewer,
date, and outcome.

## Required Reviews

| Item                                 | Required action                                                                                                                                                                | Outcome fields                                                         |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Dovjak 2021 Table 1                  | Confirm the eight printed 5th/95th-centile slope/intercept pairs for TCD, vermian height, vermian AP, and pons AP against SPEC.md Sections 7.3.7-7.3.10 and both registries.   | reviewer, date, values match yes/no, correction diff if needed         |
| Woitek 2014 Table 3                  | Review the completed PMC4231033 Table 3 byte-check: Section 6.5.2 now matches the 17 normal-CNS TDPF and CSA mean / SD rows, and the existing OLS coefficients reproduce them. | reviewer, date, countersign yes/no, correction diff if needed          |
| extra-axial CSF coefficient decision | Either encode exact Kyriakopoulou fetal-centiles coefficients or formally accept the transparent approximation-tier quadratic with its report caveat.                          | reviewer, date, exact coefficients encoded / approximation accepted    |
| third-ventricle raw-threshold policy | Confirm the Phase 1 policy remains raw-threshold-only: width is recorded, >3.5 mm can trigger DDx, and no z-score is reported.                                                 | reviewer, date, policy accepted yes/no                                 |
| Chiari II / ONTD calibration         | Calibrate the Mahalanobis centroids and ONTD posterior threshold on a local cohort before clinical reliance; keep reports research-mode until complete.                        | reviewer, date, local cohort size, threshold, sensitivity, specificity |

## Mismatch Handling

1. Do not edit the signed source value in place without opening a new
   implementation increment.
2. Record the source location, reviewer, old value, corrected value, and reason
   for change in `PROGRESS.md`.
3. Re-run the source-registry tests, report tests, Python compile, typecheck, and
   production build.
4. If a source correction changes a clinical threshold, update TEST.md fixtures
   before declaring the change ready.

## Clinician Signoff

| Signoff field                        | Value                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------- |
| Source reviewer                      | Pending                                                                |
| Radiologist PI                       | Pending                                                                |
| Dovjak 2021 Table 1 status           | Open                                                                   |
| Woitek 2014 Table 3 status           | Implementation byte-check complete; pending clinician countersignature |
| extra-axial CSF coefficient decision | Open                                                                   |
| third-ventricle raw-threshold policy | Closed by implementation; pending clinician acceptance                 |
| Chiari II / ONTD calibration         | Open                                                                   |
| Final clinical-reliance decision     | Pending                                                                |
