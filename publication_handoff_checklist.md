# Publication Handoff Checklist

This checklist turns the publication-readiness audit into a handoff packet for
the radiologist collaborators. It is intentionally operational: every row maps a
reviewer expectation to a manuscript section, Required evidence, and Owner.

## Reporting Standards Map

| Standard   | Manuscript section                  | Required evidence                                                                                                                                                                                        | Owner                    | Status                                 |
| ---------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------- |
| TRIPOD+AI  | Title, Abstract, Methods, Results   | State the intended-use population, predictor inputs, locked thresholds, missing-data handling, calibration-in-the-large, calibration slope, Brier score, ROC-AUC, PR-AUC, and external validation split. | Implementation + analyst | Prepared; fill with validation results |
| CLAIM      | Methods - data and image analysis   | Describe FeTA 2024 access, institutional cohort selection, scanner field strength, vendor, super-resolution strategy, image quality / motion tier, preprocessing, and de-identification.                 | Analyst + radiologists   | Prepared; fill with cohort table       |
| STARD-AI   | Results - diagnostic accuracy       | Report sensitivity, specificity, confidence intervals, reference standard, pathology labels, indeterminate cases, and threshold-lock date for every diagnostic trigger claimed.                          | Analyst + radiologists   | Prepared; requires labels              |
| DECIDE-AI  | Methods - clinical decision support | Describe intended user, workflow insertion point, human override, failure states, audit logging, reader-study timing, NASA Task Load Index, System Usability Scale, and qualitative feedback capture.    | PI + radiologists        | Prepared; requires IRB protocol        |
| CONSORT-AI | Future prospective study            | Use only if the calculator is evaluated as an intervention; specify allocation, masking, participant flow, human-AI interaction, and safety monitoring.                                                  | PI                       | Not active for retrospective/QI phase  |

## Results Endpoint Checklist

| Endpoint                       | Manuscript section                | Required evidence                                                                                                                                                | Owner                  | Go / no-go                                                 |
| ------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------- |
| Per-parameter agreement        | FeTA and institutional validation | MAE / MAPE for z-scored parameters, Bland-Altman plots, ICC where repeated readers exist, and explicit exclusion of third-ventricle z-score reporting.           | Analyst                | Go only after FeTA and local measurements are locked       |
| External robustness            | FeTA subgroup analysis            | Stratify by site, vendor, field strength, super-resolution strategy, acquisition site, and image quality tier.                                                   | Analyst                | Go only if subgroup failures are disclosed or mitigated    |
| Discrimination and calibration | Primary results                   | ROC-AUC, PR-AUC, sensitivity / specificity at locked thresholds, calibration-in-the-large, calibration slope, Brier score, and confidence intervals.             | Analyst                | Go only after thresholds are frozen before analysis        |
| Clinical utility               | Secondary results                 | decision-curve net benefit across plausible follow-up thresholds and a plain-language threshold rationale.                                                       | Analyst + PI           | Go only if decision threshold matches clinical workflow    |
| Reader study                   | QI / implementation results       | reader-study timing, report completeness, z-score documentation rate, recommendation congruence, reading time, NASA Task Load Index, and System Usability Scale. | PI + radiologists      | Go only after IRB / QI determination                       |
| Source-data final lock         | Supplement / appendix             | Dovjak/Woitek/extra-axial CSF implementation byte-check countersignature, third-ventricle raw-threshold policy, and Chiari calibration status.                   | Clinician collaborator | Go only after unresolved source checks are marked reviewed |

## Handoff Packet Contents

| Artifact                             | Purpose                                                                                                                                                                                                        | Owner                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| SPEC.md                              | Canonical technical and validation specification.                                                                                                                                                              | Implementation                |
| TEST.md                              | Test corpus and expected clinical behavior.                                                                                                                                                                    | Implementation                |
| source_verification_dossier.md       | Open source checks, publication blockers, and clinical-reliance caveats.                                                                                                                                       | Implementation + radiologists |
| PROGRESS.md                          | Change history and command-level verification evidence.                                                                                                                                                        | Implementation                |
| client/src/lib/validation-metrics.ts | Reusable helpers for MAE / MAPE, grouped agreement, Bland-Altman limits, ROC-AUC, PR-AUC, locked-threshold sensitivity / specificity, Brier score, calibration summary, and decision-curve net benefit tables. | Implementation + analyst      |
| reader_study_protocol.md             | IRB / QI, de-identification, reader-study timing, report-completeness, NASA Task Load Index, System Usability Scale, and handoff schema.                                                                       | Implementation + radiologists |
| source_data_final_lock.md            | Clinician signoff packet for Dovjak/Woitek/extra-axial CSF countersignature, third-ventricle raw-threshold policy, and Chiari II / ONTD calibration.                                                           | Radiologist PI                |
| Exported validation results          | FeTA, institutional, calibration, decision-curve, and reader-study tables once data are available.                                                                                                             | Analyst                       |

## Go / No-Go Summary

The project is ready for radiologist review when the application gates are green
and this checklist is present. The project is ready for manuscript submission
only after the source-data final lock, IRB / QI determination, FeTA or equivalent
external validation, institutional reader study, calibration table,
decision-curve net benefit table, and reviewer-standard checklist rows are
filled with actual data.
