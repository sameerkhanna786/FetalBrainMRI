# Validation Data Dictionary

Last updated: 2026-05-24.

No PHI belongs in these files. Use `study_id` values that cannot be reversed to
MRNs, accession numbers, names, dates of birth, or exam dates without a secure
local crosswalk retained by the clinical site. Dates should be omitted or shifted
before export.

This dictionary defines the analyst-facing CSV/export schemas needed to close
the FeTA 2024, institutional cohort, reader-study, and pre/post report-audit
blockers. Column names are intentionally aligned to the helper inputs in
`client/src/lib/validation-metrics.ts`.

Before metrics are computed, export rows should be checked with
`validateValidationDataRows` and full file sets should be checked with
`validateValidationDataExport` from
`client/src/lib/validation-data-schema.ts`. These guards verify that every file
contains the required fields documented below, catch blank required values,
enforce high-risk conditional fields such as exclusion and missingness reasons,
check locked enum values such as reader-study condition and report-audit phase,
reject non-boolean tokens in `true` / `false` fields, reject non-finite or
out-of-range numeric values, reject fractional values in integer fields, ensure
exported rows reference known `case_log.csv` study IDs, and require paired
`without_tool` / `with_tool` reader-study rows before downstream analysis code
runs.

Starter CSV header templates live in `validation_export_templates/` and are
checked against the runtime schema.

## File set

| File                  | Grain                                                              | Primary helper or use                                                                       |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| case_log.csv          | one row per fetal MRI case                                         | `summarizeValidationCohortFlow`                                                             |
| measurement_rows.csv  | one row per case, parameter, source role, and reader if applicable | `computeAgreementMetrics`, `computeGroupedAgreementMetrics`, `computeIntraclassCorrelation` |
| diagnostic_labels.csv | one row per case and diagnostic trigger                            | `computeBinaryValidationMetrics`, `computeDecisionCurve`                                    |
| reader_study_rows.csv | one row per reader, case, and reading condition                    | `computeReaderStudyCrossoverSummary`, `computeCohenKappa`, `computeFleissKappa`             |
| report_audit_rows.csv | one row per baseline or post-tool report                           | `computeQiAuditSummary`, `compareQiAuditPhases`                                             |

## case_log.csv

| Column                       | Required    | Values / notes                                                                                        |
| ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| study_id                     | yes         | De-identified case key shared across all files.                                                       |
| cohort                       | yes         | `feta_2024`, `institutional`, `reader_study`, or `report_audit`.                                      |
| site_id                      | yes         | De-identified site key; use `single_site` if only one institution.                                    |
| scanner_vendor               | yes         | Vendor label or `unknown`.                                                                            |
| field_strength_t             | yes         | Numeric Tesla value such as `0.55`, `1.5`, or `3`.                                                    |
| svr_method                   | yes         | `none`, `clinical_svr`, `research_svr`, or `unknown`.                                                 |
| image_quality_tier           | yes         | `diagnostic`, `motion_limited`, `nondiagnostic`, or local locked categories.                          |
| ga_weeks                     | yes         | Integer gestational age weeks at MRI.                                                                 |
| ga_days                      | yes         | Integer 0-6 gestational age days.                                                                     |
| included                     | yes         | `true` or `false`.                                                                                    |
| exclusion_reason             | conditional | Required when `included=false`; examples: `motion-degraded`, `missing-sequence`, `outside-ga-window`. |
| reference_standard_available | yes         | `true` if expert measurement or final label is available.                                             |
| prediction_available         | yes         | `true` if calculator output is available.                                                             |
| pathology_label_available    | yes         | `true` if diagnostic truth labels are available.                                                      |

## measurement_rows.csv

Use this file for FeTA external validation, institutional validation, and
inter-rater reliability. Store millimetre and degree values in separate columns
so angular parameters cannot be silently interpreted as millimetres.
Rows with `measurement_available=true` must populate exactly one of `value_mm`
or `value_deg`. Rows with `measurement_available=false` must leave both value
columns blank and provide `missing_reason`.

| Column                | Required    | Values / notes                                                                                                                                                                    |
| --------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| study_id              | yes         | Links to `case_log.csv`.                                                                                                                                                          |
| parameter_id          | yes         | Runtime parameter id such as `skull_bpd`, `brain_bpd`, `atrial_right`, `csp_width`, `cc_length`, `tcd`, `vermis_cc`, `vermis_ap`, `pons_ap`, `extra_axial_csf`, `tdpf`, or `csa`. |
| source_role           | yes         | `reference`, `calculator`, `reader`, or `ai_prefill`.                                                                                                                             |
| reader_id             | conditional | Required for repeated reader measurements; otherwise blank.                                                                                                                       |
| value_mm              | conditional | Numeric millimetres for linear measurements.                                                                                                                                      |
| value_deg             | conditional | Numeric degrees for angular measurements such as `csa` and `tva`.                                                                                                                 |
| measurement_available | yes         | `true` or `false`; use `false` instead of sentinel numeric values.                                                                                                                |
| missing_reason        | conditional | Required when `measurement_available=false`.                                                                                                                                      |
| image_quality_tier    | yes         | Repeat from `case_log.csv` if stratifying agreement by image quality.                                                                                                             |
| acquisition_site      | optional    | De-identified acquisition site or scanner group for FeTA subgroup analysis.                                                                                                       |

## diagnostic_labels.csv

Use one row per diagnostic trigger that will be reported in the manuscript. Lock
the threshold before analysis in `validation_analysis_lock.md`.

| Column                | Required    | Values / notes                                                                                                                                                                       |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| study_id              | yes         | Links to `case_log.csv`.                                                                                                                                                             |
| trigger_id            | yes         | Runtime card id such as `mild-vm`, `severe-vm`, `macrocephaly`, `microcephaly`, `acc-pattern`, `hpe-pattern`, `dwm-pattern`, `pch-pattern`, `extra-axial-wide`, or `chiari-ii-ontd`. |
| reference_label       | yes         | `true` or `false` expert truth label.                                                                                                                                                |
| predicted_label       | yes         | `true` or `false` calculator label at the locked threshold.                                                                                                                          |
| predicted_probability | conditional | 0-1 probability; required when computing calibration, ROC-AUC, PR-AUC, Brier score, or decision-curve net benefit.                                                                   |
| threshold             | yes         | Locked 0-1 threshold used for `predicted_label`.                                                                                                                                     |
| indeterminate         | yes         | `true` if the case is excluded from the trigger analysis because truth is not adjudicable.                                                                                           |
| indeterminate_reason  | conditional | Required when `indeterminate=true`.                                                                                                                                                  |

## reader_study_rows.csv

The reader-study protocol uses counter-balanced with-tool / without-tool reads
with a two-week washout. Each reader-case pair needs exactly one `without_tool`
and one `with_tool` row before paired deltas are computed.

NASA Task Load Index and System Usability Scale fields are all-or-none groups:
if any NASA TLX subscale is present, all six subscales must be present; if any
SUS item is present, all ten item responses must be present.

| Column                    | Required    | Values / notes                                           |
| ------------------------- | ----------- | -------------------------------------------------------- |
| reader_id                 | yes         | De-identified reader key.                                |
| study_id                  | yes         | Links to `case_log.csv`.                                 |
| condition                 | yes         | `without_tool` or `with_tool`.                           |
| read_order                | yes         | Integer order within the reader's assigned sequence.     |
| washout_days              | yes         | Days between paired reads; target is at least 14.        |
| duration_sec              | yes         | Reading or reporting duration in seconds.                |
| completeness_score        | yes         | Locked rubric score, same scale in both conditions.      |
| zscore_documentation_rate | yes         | Fraction 0-1 of required z-scores documented.            |
| recommendation_congruent  | conditional | `true`, `false`, or blank if not applicable.             |
| categorical_label         | optional    | Reader's final categorical diagnostic label for kappa.   |
| continuous_measurement    | optional    | Repeated continuous measurement for ICC(2,1).            |
| nasa_tlx_mental_demand    | conditional | NASA Task Load Index 0-100 subscale.                     |
| nasa_tlx_physical_demand  | conditional | NASA Task Load Index 0-100 subscale.                     |
| nasa_tlx_temporal_demand  | conditional | NASA Task Load Index 0-100 subscale.                     |
| nasa_tlx_performance      | conditional | NASA Task Load Index 0-100 subscale.                     |
| nasa_tlx_effort           | conditional | NASA Task Load Index 0-100 subscale.                     |
| nasa_tlx_frustration      | conditional | NASA Task Load Index 0-100 subscale.                     |
| sus_item_1                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_2                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_3                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_4                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_5                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_6                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_7                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_8                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_9                | conditional | System Usability Scale response 1-5 after with-tool use. |
| sus_item_10               | conditional | System Usability Scale response 1-5 after with-tool use. |

## report_audit_rows.csv

Use this file for the QI pre/post report audit modeled after the TI-RADS
calculator study. `required_measurement_count` must be greater than zero, and
`documented_measurement_count` cannot exceed `required_measurement_count`.

| Column                         | Required    | Values / notes                                              |
| ------------------------------ | ----------- | ----------------------------------------------------------- |
| report_id                      | yes         | De-identified report key.                                   |
| phase                          | yes         | `baseline` or `post_tool`.                                  |
| duration_sec                   | yes         | Time to complete report.                                    |
| required_measurement_count     | yes         | Number of measurements required by the locked audit rubric. |
| documented_measurement_count   | yes         | Number of required measurements documented in report.       |
| explicit_zscore_documented     | yes         | `true` or `false`.                                          |
| explicit_percentile_documented | yes         | `true` or `false`.                                          |
| recommendation_congruent       | conditional | `true`, `false`, or blank if no recommendation applies.     |

## Export checks before analysis

1. No PHI appears in any export file.
2. Every file uses `study_id` consistently.
3. `ga_weeks` and `ga_days` are populated for every included case.
4. Excluded cases have non-empty `exclusion_reason`.
5. Missing measurements use `measurement_available=false` plus `missing_reason`,
   not numeric placeholders; available measurements use exactly one of
   `value_mm` or `value_deg`.
6. Every reader-study case has exactly one `without_tool` and exactly one
   `with_tool` row for each reader; duplicate condition rows are fixed before
   paired deltas are computed.
7. Locked thresholds and endpoint definitions are copied into
   `validation_analysis_lock.md` before analysis.
8. Probability, rate, NASA Task Load Index, System Usability Scale, gestational
   age day, duration, and count fields stay inside the documented numeric
   ranges.
9. Partial NASA Task Load Index or System Usability Scale rows are fixed before
   scoring; do not export only selected subscales or selected SUS items.
10. Report-audit rows have a non-zero required-measurement denominator and never
    document more measurements than the locked audit rubric requires.
11. Integer fields such as `ga_weeks`, `ga_days`, `read_order`,
    `required_measurement_count`, and `documented_measurement_count` do not use
    fractional values.
