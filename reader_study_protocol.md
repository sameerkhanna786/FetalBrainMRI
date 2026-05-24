# Reader Study Protocol Handoff

This protocol is the implementation-side packet for the radiologist
collaborators. It does not replace the local IRB / QI determination; it lists
the de-identification workflow, fields, and reading schedule needed for that
submission and for the with-tool versus without-tool reader study.

## IRB / QI Determination

| Field        | Protocol value                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Study type   | Retrospective minimal-risk QI / implementation study of a reporting-support calculator.                                      |
| Intended use | Supplemental biometry calculation and structured-report assistance; the calculator does not replace clinical interpretation. |
| Consent path | Request waiver of consent for retrospective de-identified case review and reader-performance analysis.                       |
| Local PI     | Radiologist collaborator at the institution performing the reader study.                                                     |
| PHI handling | No PHI enters the calculator; exported analysis tables use study IDs only.                                                   |
| Data storage | Store source imaging and the secure re-identification crosswalk only on institution-approved encrypted storage.              |
| Safety stop  | Pause the study if a reader believes the tool output could alter signed clinical care outside the approved protocol.         |

## De-Identification Workflow

1. Assign each fetal MRI examination a random study ID before export.
2. Remove MRN, accession, patient name, date of birth, exact exam date, and free-text identifiers from study packets.
3. Keep gestational age, scanner metadata, image-quality tier, expert labels, and measurements required for analysis.
4. Store the secure re-identification crosswalk separately under the local PI or honest broker; implementation does not receive the crosswalk.
5. Export only aggregate validation tables and study-ID-level measurement rows for analysis.

## Reader-Study Design

| Design element | Requirement                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Readers        | Two to five fetal/neuro radiologists or radiology trainees approved by the PI.                          |
| Cases          | Target 60 cases: 20 neurotypical, 20 mild/moderate pathology, 20 severe pathology.                      |
| Design         | Within-reader crossover: each reader interprets each case once without the calculator and once with it. |
| Ordering       | Counter-balanced case order and tool condition by reader.                                               |
| Washout        | Minimum two-week washout between without-tool and with-tool reads for the same case.                    |
| Training       | Five pilot cases for tool familiarization; exclude pilot cases from endpoint analysis.                  |
| Blinding       | Readers are blinded to final consensus labels during interpretation.                                    |

## Endpoint Capture

| Endpoint                     | Capture method                                                                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| reader-study timing          | Start/stop timer per case and condition; report median and interquartile range.                                                                                      |
| report-completeness endpoint | Score whether required biometric measurements, z-scores/percentiles, source caveats, and recommendations are present.                                                |
| recommendation congruence    | Compare follow-up or counselling recommendation against expert adjudication.                                                                                         |
| z-score documentation rate   | Proportion of measured parameters with z-score and percentile documented.                                                                                            |
| inter-rater reliability      | Compute Cohen's kappa for two-reader categorical labels, Fleiss's kappa for three-plus-reader categorical labels, and ICC(2,1) for repeated continuous measurements. |
| NASA Task Load Index         | Collect raw NASA Task Load Index after each reader completes each condition block.                                                                                   |
| System Usability Scale       | Collect System Usability Scale after the with-tool block.                                                                                                            |
| qualitative feedback         | Record short free-text comments about confusing outputs, missing controls, and workflow friction.                                                                    |

## Analysis Table Schema

| Column                    | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| study_id                  | De-identified case identifier.                        |
| reader_id                 | De-identified reader identifier.                      |
| condition                 | `without_tool` or `with_tool`.                        |
| case_order                | Integer order within the reader's assigned sequence.  |
| pathology_group           | `neurotypical`, `mild_moderate`, or `severe`.         |
| started_at_offset_min     | Relative timer offset, not wall-clock timestamp.      |
| duration_sec              | Interpretation time in seconds.                       |
| completeness_score        | Predefined report-completeness score.                 |
| recommendation_congruent  | Boolean adjudicated recommendation match.             |
| zscore_documentation_rate | Per-case proportion from 0 to 1.                      |
| nasa_tlx_raw              | Raw NASA Task Load Index score.                       |
| sus_score                 | System Usability Scale score for the with-tool block. |

## Go / No-Go

The study can begin only after local IRB / QI determination, de-identification
workflow approval, reader recruitment, counter-balanced reading schedule, and
pilot-case training are complete. Manuscript submission remains blocked until
paired within-reader / within-case reader-study timing, report-completeness
endpoint, recommendation congruence, paired delta confidence intervals, NASA
Task Load Index, System Usability Scale, and qualitative feedback tables are
exported and reviewed by the PI.
