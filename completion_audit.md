# Active Goal Completion Audit

Last updated: 2026-05-24.

Goal status: Not complete.

This audit maps the active thread goal to concrete repository evidence. It is
not a substitute for clinical validation or radiologist signoff; it records what
is implementation-complete and what still blocks declaring the project done.

## Objective Restatement

Build the project described in SPEC.md from scratch in small, verifiable
increments. Each increment should append PLAN.md, use TEST.md as the behavior
source, add failing-first coverage before implementation, run tests/linter/type
checks/build gates, update PROGRESS.md, and commit. The done condition is that
every SPEC.md acceptance criterion has passing evidence and the suite is green.

The publication-readiness extension of the goal adds: validate as deeply as
possible, research the publication landscape, document gaps that could prevent
successful publication, and address all implementation-side issues before
radiologist handoff.

## Prompt-to-artifact checklist

| Requirement                                                   | Evidence artifact or command                                                | Current evidence                                                                                                                                                                                                | Status               |
| ------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Canonical requirements exist and drive implementation         | SPEC.md                                                                     | SPEC.md is present and remains the normative technical, validation, source, and publication specification.                                                                                                      | Implementation-ready |
| Test corpus exists and is runtime-aligned                     | TEST.md; source-document tests in `client/src/lib/methodology-page.test.ts` | TEST corpus numeric audit is closed with 0 residual normal-label rows in `source_verification_dossier.md`.                                                                                                      | Closed               |
| Small increment planning is recorded                          | PLAN.md                                                                     | PLAN.md contains the per-increment plan history, including the Active Goal Completion Audit Increment.                                                                                                          | Active               |
| Progress and verification evidence are recorded               | PROGRESS.md                                                                 | PROGRESS.md records command-level evidence for each committed increment, including failing-first checks and full gates.                                                                                         | Active               |
| Browser calculator implementation exists                      | `client/src/lib/biometry.ts`, UI pages, report tests                        | Full Vitest suite covers source registry, DDx cards, report generation, validation metrics, workflow UI, methodology, and privacy shell.                                                                        | Implementation-ready |
| Python offline app exists                                     | python_app, pyproject.toml                                                  | `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` is part of the full gate; packaging hardening is documented in PROGRESS.md. | Implementation-ready |
| Publication handoff is operationalized                        | publication_handoff_checklist.md                                            | Checklist maps TRIPOD+AI, CLAIM, SQUIRE 2.0, STARD-AI, DECIDE-AI, SPIRIT-AI, and CONSORT-AI to evidence and owners.                                                                                             | Prepared             |
| Source verification and clinical-reliance caveats are visible | source_verification_dossier.md; source_data_final_lock.md                   | Implementation-side Dovjak, Woitek, extra-axial CSF, third-ventricle, likelihood-label, and TEST numeric audit items are closed; clinician countersignature remains open.                                       | Partially complete   |
| Validation analysis is pre-specified                          | validation_analysis_lock.md; validation_data_dictionary.md                  | Threshold, cohort, endpoint, code-freeze, calibration, clinical-utility, no-post-hoc-threshold templates, and de-identified export schemas are present.                                                         | Prepared             |
| Reader study and IRB/QI workflow are specified                | reader_study_protocol.md                                                    | IRB / QI determination, waiver path, de-identification, timing, washout, usability, and report-completeness endpoints are documented.                                                                           | Prepared             |
| Full test gate is required before each commit                 | `npx pnpm@10.4.1 test -- --runInBand`                                       | Validation positive duration guard increment reran the full Vitest suite with 265 passing tests.                                                                                                                | Passed               |
| Type check is required before each commit                     | `npx pnpm@10.4.1 check`                                                     | Validation positive duration guard increment reran the TypeScript check successfully.                                                                                                                           | Passed               |
| Production build is required before each commit               | `npx pnpm@10.4.1 build`                                                     | Validation positive duration guard increment reran the production build successfully; build has only the known chunk-size warning.                                                                              | Passed               |
| Python compile gate is required before each commit            | `python3 -m py_compile`                                                     | Validation positive duration guard increment reran the Python compile gate successfully.                                                                                                                        | Passed               |
| Formatting and diff hygiene are required before commit        | Prettier check; `git diff --check`                                          | Validation positive duration guard increment reran Prettier check for touched non-SPEC/TEST files and `git diff --check` successfully.                                                                          | Passed               |

## Current blockers

These are not implementation-side bugs; they require analyst, PI, or radiology
collaborator action before the goal can be honestly marked complete.

| Blocker                               | Evidence                                                                                        | Required closure condition                                                                                                             |
| ------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| FeTA 2024 biometry gap                | source_verification_dossier.md; publication_handoff_checklist.md; validation_data_dictionary.md | FeTA access, measurements, cohort flow, subgroup tables, and external validation results are locked.                                   |
| Institutional cohort and reader study | reader_study_protocol.md; publication_handoff_checklist.md; validation_data_dictionary.md       | IRB / QI determination, de-identification workflow, local case set, reader assignments, and exported paired results are complete.      |
| IRB / QI determination                | reader_study_protocol.md                                                                        | Local PI confirms QI versus IRB path and records waiver / approval outcome.                                                            |
| Calibration and clinical utility      | validation_analysis_lock.md; source_verification_dossier.md                                     | Locked thresholds, labels, calibration table, decision-curve net benefit, and exported results are available.                          |
| Sample-size / precision assumptions   | publication_handoff_checklist.md; validation_analysis_lock.md                                   | PI selects target Wilson half-widths, expected paired effects, and feasible case counts.                                               |
| Source-data final lock                | source_data_final_lock.md                                                                       | Radiologist reviewer and PI countersign Dovjak, Woitek, extra-axial CSF, third-ventricle policy, and final clinical-reliance decision. |
| Chiari II / ONTD calibration          | SPEC.md Section 6.5; source_data_final_lock.md                                                  | Local cohort calibrates Mahalanobis centroids / ONTD threshold and records sensitivity, specificity, and threshold.                    |

## Completion decision

Do not call the goal complete yet. The implementation, tests, source documents,
and handoff scaffolding are in strong shape, and the TEST.md normal-label audit
is closed at 0 residual normal-label rows. The remaining blockers are real
publication and clinical-reliance dependencies that cannot be closed without
external cohort data and radiologist / PI signoff.
