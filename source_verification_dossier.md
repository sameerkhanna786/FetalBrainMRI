# Source Verification Dossier

This dossier cross-lists the SPEC.md Section 7.5 verification action items so
clinician-owned source review remains visible after implementation work changes
the calculator data layer.

| Action item                                                                                             | Status | Owner                  | Tracking note                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------- | ------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dovjak 2021 Table 1 source check for TCD, vermian height, vermian AP, and pons AP slope/intercept pairs | Open   | Clinician collaborator | Confirm the eight printed slope/intercept pairs against SPEC.md Sections 7.3.7-7.3.10 before clinical reliance.                                                                                  |
| Woitek 2014 Table 3 source check for the TDPF and CSA per-week rows                                     | Open   | Clinician collaborator | Confirm the 17-row per-week values used for Section 6.5.2 and regenerate derived OLS coefficients if any value changes.                                                                          |
| third-ventricle policy decision                                                                         | Closed | Implementation         | Chose the conservative raw-threshold-only policy: third-ventricle width remains visible and triggers the >3.5 mm DDx card, but z-score reporting is disabled until a verified source is encoded. |
| Section 7.4 citation pass                                                                               | Closed | Implementation         | Estimate-only likelihood labels have been relabelled qualitatively in report-output DDx cards; no new primary citations were acquired.                                                           |
| Chiari II / ONTD calibration                                                                            | Open   | Clinician collaborator | Calibrate the Mahalanobis centroids and ONTD posterior threshold on a local cohort before clinical reliance; current reports flag this discriminator as research-mode.                           |

Last updated: 2026-05-23.
