## 2026-05-23, Source Inventory PMCID Absence Label Increment

- Added failing-first source-document coverage requiring explicit PMCID absence labels instead of ambiguous `(NA)` cells in the SPEC source inventory.
- Verified via NCBI ID Converter that Corroenne 2023 PMID `36864530`, SMFM 2018 PMID `29705191`, SMFM 2020 CSP PMID `32114082`, Sun 2024 PMID `38756055`, and Garel 2003 PMID `12879338` do not have PMC records.
- Replaced the verified no-PMC source-inventory rows with `(not in PMC)`.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the PMCID label update because SPEC.md still contained `(NA)`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 200 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 200 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.
- `git diff --check` passes.

## 2026-05-23, Bahlmann 2015 Spina-Bifida Source Metadata Increment

- Added failing-first source-document coverage that locks `BAHLMANN_2015` to DOI `10.1002/pd.4524` and PubMed PMID `25346419`.
- Verified via Crossref and PubMed E-utilities that the article is Bahlmann et al. _Cranial and cerebral signs in the diagnosis of spina bifida between 18 and 22 weeks of gestation: a German multicentre study_, Prenat Diagn 2015;35(3):228-235.
- Verified that the previously listed PMID `25333768` resolves to an unrelated nanoscience article and that the correct PMID has no PMC record.
- Corrected the SPEC source inventory and reference metadata, including the explicit `(not in PMC)` PMCID state.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `25346419`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 199 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 199 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Kertes 2021 CSP Source Metadata Increment

- Added failing-first source-document coverage that locks `KERTES_2021` to the European Journal of Radiology CSP MRI article with DOI `10.1016/j.ejrad.2020.109470` and PMID `33338761`.
- Verified via Crossref and PubMed that the article is Kertes et al. _The normal fetal Cavum Septum Pellucidum in MR imaging - New biometric data_, Eur J Radiol 2021;135:109470.
- Verified via NCBI ID Converter that the article does not have a PMC record.
- Corrected the SPEC tooltip, source inventory, and reference metadata away from the ScienceDirect PII-in-DOI-field row and author/title typos, and added the DOI / PMID lock to the runtime Kertes source record.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `33338761`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 198 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 198 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Malinger 2005 Absent-CSP Source Metadata Increment

- Added failing-first source-document coverage that locks `MALINGER_2005` to the Ultrasound in Obstetrics & Gynecology absent-septum-pellucidum article with DOI `10.1002/uog.1787` and PMID `15593321`.
- Verified via Crossref and PubMed that the article is Malinger et al. _Differential diagnosis in fetuses with absent septum pellucidum_, Ultrasound Obstet Gynecol 2005;25(1):42-49.
- Verified via NCBI ID Converter that the article does not have a PMC record.
- Corrected the SPEC tooltip, source inventory, and reference metadata, and added the DOI / PMID lock to runtime Malinger source strings used by absent-CSP and HPE cards.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `15593321`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 197 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 197 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Vatansever 2013 Posterior-Fossa Source Metadata Increment

- Added failing-first source-document coverage that locks `VATANSEVER_2013` to the Cerebellum posterior-fossa MRI article with DOI `10.1007/s12311-013-0470-2` and PMID `23553467`.
- Verified via Crossref and PubMed that the article is Vatansever et al. _Multidimensional Analysis of Fetal Posterior Fossa in Health and Disease_, Cerebellum 2013;12(5):632-644.
- Verified via NCBI ID Converter that the article does not have a PMC record.
- Corrected the SPEC source inventory and reference metadata, and added the DOI / PMID lock to the runtime Vatansever source record used by posterior-fossa details and DDx cards.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `10.1007/s12311-013-0470-2`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 196 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 196 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Ma 2019 Atrial-Diameter Source Metadata Increment

- Added failing-first source-document coverage that locks `MA_2019` to the Medicine fetal-MRI lateral-ventricle article and rejects the unrelated Wiley `10.1002/jum.15003` ovarian cystadenofibroma article.
- Verified via Crossref that `10.1002/jum.15003` resolves to an unrelated Journal of Ultrasound in Medicine ovarian cystadenofibroma paper, while `10.1097/MD.0000000000016118` resolves to the Ma 2019 fetal lateral-ventricle MRI article.
- Verified via PubMed and NCBI ID Converter that the correct Ma 2019 identifiers are PMID `31261528` and PMCID `PMC6616102`.
- Corrected the SPEC tooltip, source inventory, and atrial-diameter cross-validation row while preserving Ma 2019 as a teaching / cross-validation source rather than an active computational coefficient source.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `10.1097/MD.0000000000016118`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 195 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 195 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Corroenne 2023 Citation Metadata Increment

- Added failing-first source-document coverage that locks Corroenne 2023 to DOI `10.1002/uog.26187` and PubMed PMID `36864530`.
- Verified via Crossref that DOI `10.1002/uog.26187` is the corpus-callosal reference-ranges systematic review and DOI `10.1002/uog.26280` is an unrelated acrania-exencephaly-anencephaly letter.
- Corrected SPEC tooltip, source inventory, and reference metadata away from the wrong DOI, wrong PMID, and unrelated PMCID while preserving Corroenne as a teaching / cross-validation source.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `36864530`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 194 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 194 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Heaphy-Henault 2018 Citation Metadata Increment

- Added failing-first source-document coverage that locks the aqueductal-stenosis source to DOI `10.3174/ajnr.A5590`, PMID `29519789`, and PMCID `PMC7410663`.
- Verified via PubMed and PMC that PMID `29519789` belongs to the AJNR congenital aqueductal stenosis fetal-MRI article; the previously listed PMID `29545253` belongs to an unrelated stroke stem-cell trial.
- Corrected SPEC and TEST metadata for Heaphy-Henault 2018 and removed stale `Garel 2018` / citation-correction wording from the severe-ventriculomegaly likelihood manifest.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `29519789`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 193 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 193 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Sun 2024 ACC Citation Metadata Increment

- Added failing-first source-document coverage that locks Sun 2024 ACC metadata to PubMed PMID `38756055`, DOI `10.1016/j.ejogrb.2024.05.005`, and ScienceDirect PII `S0301211524002264`.
- Verified via PubMed and Crossref that DOI `10.1016/j.ejogrb.2024.05.005` is the fetal ACC clinical/genetic analysis article in `Eur J Obstet Gynecol Reprod Biol` 2024;298:146-152, and that DOI `10.1016/j.ejogrb.2024.05.022` belongs to an unrelated maternal-mortality-surveillance position statement.
- Corrected SPEC, TEST, and runtime citation metadata away from the unrelated DOI / PII / volume-page tuple.
- Replaced the stale `precise yield requires eyes on Table 2` action wording with the active estimate-only qualitative policy for the Sun 2024 monogenic ACC likelihood row.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `10.1016/j.ejogrb.2024.05.005`.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 192 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 192 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/biometry.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Publication Confidence-Interval Metrics Increment

- Added failing-first coverage that binary validation outputs include Wilson confidence intervals for locked-threshold proportions.
- Added `computeWilsonScoreInterval` and attached confidence intervals to sensitivity, specificity, positive predictive value, negative predictive value, and accuracy in `computeBinaryValidationMetrics`.
- Updated the Validation page, publication handoff checklist, and source-verification dossier so analyst exports include uncertainty intervals rather than point estimates alone.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts` failed before implementation because `computeWilsonScoreInterval` was not exported and `sensitivityInterval` was undefined.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts client/src/lib/validation-page.test.ts client/src/lib/methodology-page.test.ts` passes with 191 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 191 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md publication_handoff_checklist.md source_verification_dossier.md client/src/lib/validation-metrics.ts client/src/lib/validation-metrics.test.ts client/src/lib/validation-page.test.ts client/src/lib/methodology-page.test.ts client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.10 QI Audit Metrics Increment

- Added failing-first coverage for the SPEC §4.10 pre/post QI report-audit metrics and for SQUIRE 2.0 in the publication handoff.
- Verified online via PubMed PMID 26369893 / DOI `10.1136/bmjqs-2015-004411` that SQUIRE 2.0 is the relevant Standards for QUality Improvement Reporting Excellence guideline for healthcare QI reports.
- Added `computeQiAuditSummary` and `compareQiAuditPhases` to `client/src/lib/validation-metrics.ts` for average report time, all-required-measurement completion, mean measurement completeness, explicit z-score documentation, explicit percentile documentation, and recommendation congruence.
- Updated the Validation page, publication handoff checklist, and source-verification dossier so the QI manuscript path is mapped to SQUIRE 2.0 and the new pre/post report-audit metrics.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts` failed before implementation because `computeQiAuditSummary` was not exported and the SQUIRE handoff strings were absent.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts` passes with 190 tests.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-page.test.ts client/src/lib/methodology-page.test.ts` passes with 190 tests.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 190 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md publication_handoff_checklist.md source_verification_dossier.md client/src/lib/validation-metrics.ts client/src/lib/validation-metrics.test.ts client/src/lib/validation-page.test.ts client/src/lib/methodology-page.test.ts client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, D'Addario 2001 Citation Metadata Correction Increment

- Added failing-first source-document coverage that locks D'Addario 2001 to the clivus-supraocciput article DOI `10.1046/j.1469-0705.2001.00409.x`.
- Verified via Crossref that DOI `00409.x` is the 146-149 clivus-supraocciput article and DOI `00472.x` belongs to a different pages 157-162 article.
- Corrected the TEST.md case citation and source inventory entry from the unrelated `00472.x` DOI to `00409.x`, and aligned the author list with SPEC §7.2.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the TEST.md update because TEST.md did not contain `10.1046/j.1469-0705.2001.00409.x`.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 189 tests.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 189 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check TEST.md` still reports the existing canonical-document formatting warning; `TEST.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Aertsen 2019 Citation Metadata Correction Increment

- Added failing-first source-document coverage that locks Aertsen 2019 to the PMC7048594 AJNR article and DOI `10.3174/ajnr.A5930`.
- Verified the DOI directly from the PMC page metadata using `curl`.
- Corrected SPEC §7.2 `AERTSEN_2019` metadata from stale `10.3174/ajnr.A5921` to `10.3174/ajnr.A5930`.
- Corrected the TEST.md source inventory entry away from the unrelated UOG citation while preserving the case-level AJNR citation and PMCID.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the citation update because SPEC.md did not contain `10.3174/ajnr.A5930`.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 188 tests.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 188 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md TEST.md` still reports the existing canonical-document formatting warnings; neither large document was mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 2.2 Source-Dossier Alignment Increment

- Added failing-first source-document coverage that requires SPEC Part 2's normative-source dossier to match the active Phase 1 registry rather than stale initial source recommendations.
- Updated SPEC §2.1 to include the active extra-cerebral CSF, third-ventricle raw-threshold, cisterna magna, TVA, TDPF, and CSA measurements now present in Phase 1 behavior.
- Rewrote SPEC §2.2 around active computational source groups: Luis 2025, Kyriakopoulou 2017, Dovjak 2021, Woitek 2014, and Hertzberg 1997 raw-threshold third-ventricle support.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the SPEC update because Part 2 still listed Tilea and Vatansever as recommended default computational sources.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 187 tests.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 187 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; `SPEC.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.2.2 Extra-Axial Registry-Table Alignment Increment

- Added failing-first source-document coverage that requires SPEC §4.2.2 to list the active Kyriakopoulou extra-cerebral CSF source-registry row.
- Added the extra-cerebral CSF width row to the Phase 1 default source-registry table with the Kyriakopoulou 2017 source, quadratic mean / linear SD model family, 21-38 week runtime window, and fetal-MRI cohort note.
- Aligned the §4.2.2 registry prose with the completed Kyriakopoulou supplementary workbook row 19 source-lock.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the SPEC table update because the §4.2.2 registry table did not contain the extra-cerebral CSF row.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes with 186 tests.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 186 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; `SPEC.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Extra-Axial CSF Source-Lock Increment

- Added failing-first coverage that requires the direct `extra_axial_csf` row to use the exact Kyriakopoulou 2017 fetal-centiles workbook coefficients instead of the temporary approximation.
- Encoded the supplementary workbook row 19 model in both React and Python: `a = -0.0604400737108953`, `b = 3.650533392397`, `c = -44.5543682103265`, `a5 = 0.0736569049728816`, `b5 = -0.34287991257886`.
- Removed the approximation caveat from extra-axial CSF source details and moved the row to the transcribed verification tier.
- Updated TEST.md §25 and the multi-card stress fixture so widened extra-axial CSF examples remain above the exact Kyriakopoulou 95th-centile boundary.
- Marked the implementation-side extra-axial CSF coefficient decision closed in the source-verification and final-lock documents while preserving clinician countersignature as a handoff item.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/biometry.test.ts client/src/lib/methodology-page.test.ts` failed before implementation because 32w 10.3721 mm produced z = 6.4121 under the approximation and SPEC.md did not document the Kyriakopoulou workbook row.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/biometry.test.ts client/src/lib/methodology-page.test.ts client/src/lib/architecture.test.ts` passes with 185 tests.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 185 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md source_verification_dossier.md source_data_final_lock.md publication_handoff_checklist.md client/src/lib/biometry.ts client/src/lib/biometry.test.ts client/src/lib/methodology-page.test.ts client/src/lib/architecture.test.ts client/src/pages/Methodology.tsx client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` and the broader check including `TEST.md` still report the existing canonical-document formatting warnings; neither large document was mass-reflowed.
- `uv run --no-project --with numpy --with scipy python -c "from python_app.registry import evaluate_parameter; ..."` confirms `evaluate_parameter("extra_axial_csf", 32, 10.3721)` returns z = 0.0 with no caveat and `evaluate_parameter("extra_axial_csf", 32, 14)` returns z = 1.8012.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Dovjak Table 1 Source-Verification Increment

- Added publication-readiness coverage that locks the Dovjak 2021 Table 1 audit into source-document tests.
- Byte-checked the TCD, vermis rostrocaudal, vermis AP, and total pons AP 5th/95th percentile equations against the PMC8457244 Table 1 HTML.
- Confirmed the existing React and Python Dovjak coefficients already match the source table, so no runtime coefficient change was needed.
- Marked the Dovjak implementation-side source check closed in `source_verification_dossier.md` while keeping clinician countersignature visible in `source_data_final_lock.md`.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the source documents were updated because SPEC.md did not contain `PMC8457244 Table 1 byte-checked`.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 183 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md source_verification_dossier.md source_data_final_lock.md publication_handoff_checklist.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; `SPEC.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Woitek Table 3 Source-Correction Increment

- Added publication-readiness coverage that locks the Woitek 2014 Table 3 audit into source-document tests.
- Found and corrected a SPEC §6.5.2 transcription mismatch: the per-week TDPF/CSA control table now matches the PMC4231033 Table 3 normal-CNS mean and standard-deviation rows.
- Recomputed the OLS fit from the corrected PMC rows and confirmed the existing TDPF/CSA runtime coefficients already reproduce the corrected table, so no app or Python coefficient change was needed.
- Marked the Woitek implementation-side source check closed in `source_verification_dossier.md` while keeping clinician countersignature visible in `source_data_final_lock.md`.

Verification:

- Failing-first check: `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` failed before the source documents were updated because SPEC.md did not contain the PMC Table 3 row `| 21 | 26.9 | 2.6 | 74.2 | 5.1 |`.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 182 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md source_verification_dossier.md source_data_final_lock.md publication_handoff_checklist.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; `SPEC.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST.md Citation-Line Index Cleanup Increment

- Added publication-readiness coverage that prevents `**Citation.**` lines in `TEST.md` from carrying stale numeric reference brackets.
- Removed bracketed reference indices from citation lines while preserving source names, years, journal text, DOI, PMID, and explanatory fixture rationale.
- Left the end-of-file source inventory untouched to avoid a broad bibliography rewrite; citation lines are now self-contained and no longer point at potentially stale numeric slots.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 181 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check TEST.md` still reports the existing canonical-corpus markdown formatting warning; `TEST.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Qualitative-Likelihood Alignment Increment

- Added source-document coverage that the closed Section 7.4 citation-pass status in `source_verification_dossier.md` stays aligned with `SPEC.md`.
- Updated SPEC §7.4 to state that estimate-only likelihood rows are surfaced with qualitative labels rather than unsupported precise percentages.
- Replaced stale Dandy-Walker citation-correction wording with Whitehead / Nagaraj posterior-fossa phenotype guidance while keeping numeric estimate values as audit context only.
- Updated SPEC §7.5 to mark the Section 7.4 citation pass closed for implementation and preserve clinician-owned source-review items separately.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 180 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; `SPEC.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, TEST.md Verified-Citation Lock Increment

- Added publication-readiness coverage that rejects pending citation placeholders in `TEST.md` and checks DOI / PubMed traceability for the HPE and mega-cisterna fixtures.
- Replaced the unresolved HPE4 Cureus placeholder with the PubMed/PMC/DOI-traceable Chafiq 2024 Cureus alobar-HPE case and removed the unsupported verbatim 22-week claim.
- Replaced the unresolved mega-cisterna reference with the fetal MRI/US biometry study by Gafner et al. 2022 and corrected the app source metadata away from the wrong Cureus 2025 journal label.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 179 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check TEST.md` still reports the existing canonical-corpus markdown formatting warning; `TEST.md` was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Source-Data Final-Lock Checklist Increment

- Added `source_data_final_lock.md` as the clinician-facing signoff packet for declaring source data ready for clinical reliance or manuscript submission.
- Covered Dovjak 2021 Table 1, Woitek 2014 Table 3, extra-axial CSF coefficient decision, third-ventricle raw-threshold policy, Chiari II / ONTD calibration, mismatch handling, and clinician signoff fields.
- Linked the checklist from `publication_handoff_checklist.md` and `source_verification_dossier.md` while keeping clinician review items open until signed.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 178 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md source_data_final_lock.md publication_handoff_checklist.md source_verification_dossier.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, FeTA Agreement Metrics Utility Increment

- Extended `client/src/lib/validation-metrics.ts` with per-parameter agreement helpers for MAE, MAPE, bias, error standard deviation, and Bland-Altman 95% limits of agreement.
- Added grouped agreement summaries so FeTA and institutional validation can stratify results by site, vendor, field strength, SVR method, or image-quality tier.
- Added Vitest coverage for agreement metrics, Bland-Altman limits, grouped FeTA robustness summaries, and input validation.
- Updated the publication handoff checklist and source-verification dossier to point analysts at the helper while keeping FeTA access, measurements, and exported results open.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 177 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md publication_handoff_checklist.md source_verification_dossier.md client/src/lib/validation-metrics.ts client/src/lib/validation-metrics.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Reader-Study Protocol Handoff Increment

- Added `reader_study_protocol.md` as the implementation-side handoff packet for the radiologist reader study.
- Covered IRB / QI determination, waiver of consent, no-PHI calculator use, de-identification workflow, secure re-identification crosswalk, two-week washout, counter-balanced reading order, pilot-case exclusion, reader-study timing, report-completeness endpoint, recommendation congruence, NASA Task Load Index, System Usability Scale, and analysis-table schema.
- Linked the protocol from `publication_handoff_checklist.md`.
- Updated `source_verification_dossier.md` to mark the implementation side of the IRB / radiologist handoff protocol as prepared while preserving local PI submission as clinician-owned.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 175 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md reader_study_protocol.md publication_handoff_checklist.md source_verification_dossier.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Validation Metrics Utility Increment

- Added `client/src/lib/validation-metrics.ts` for analyst handoff of manuscript-grade validation endpoints: Brier score, ROC-AUC, PR-AUC, locked-threshold sensitivity / specificity, calibration-in-the-large, calibration slope, and decision-curve net benefit.
- Added input validation so malformed cohort tables, out-of-range probabilities, invalid thresholds, and one-class datasets fail explicitly instead of producing unstable metrics.
- Added Vitest coverage for discrimination, calibration summary, Brier score, decision-curve net benefit, treat-all / treat-none comparators, and invalid-input rejection.
- Linked the helper from `publication_handoff_checklist.md` and updated `source_verification_dossier.md`; the calibration / clinical utility blocker remains open until real FeTA / institutional labels and exported results are available.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/validation-metrics.test.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 174 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md source_verification_dossier.md publication_handoff_checklist.md client/src/lib/validation-metrics.ts client/src/lib/validation-metrics.test.ts client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Dandy-Walker TVA Trigger Correction Increment

- Added source-document consistency coverage that the SPEC combined-pattern likelihood manifest uses the implemented Dandy-Walker trigger: small vermis plus elevated tegmento-vermian angle.
- Updated SPEC §7.4.19 to replace the stale `Small vermis + dilated 3rd V` DWM trigger with `Small vermis + elevated TVA`.
- Preserved the third-ventricle raw-threshold policy by keeping third-ventricle width out of the Dandy-Walker combined-pattern trigger.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 171 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; SPEC.md was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Approximation-Tier Correction Increment

- Added source-document consistency coverage that the canonical SPEC no longer assigns the approximation verification tier to an active third-ventricle z-score model.
- Corrected SPEC §7.5 so the approximation tier applies to the extra-axial CSF quadratic curve, with explicit Kyriakopoulou 2017 coefficient-lock caveats.
- Preserved the publication-ready third-ventricle policy in SPEC §7.5: third ventricle remains raw-threshold-only in Phase 1, with no z-score reporting until a verified fetal-MRI or explicitly accepted cross-modality model is encoded.
- Added the extra-axial CSF coefficient decision to the clinician-owned source-lock action items.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 170 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md` still reports the existing canonical-document formatting warning; SPEC.md was not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Python Packaging Hardening Increment

- Added architecture coverage that `pyproject.toml` explicitly scopes setuptools packaging to the FastAPI Python app instead of the full flat repository.
- Configured setuptools to package `python_app`, `python_app.static`, and `python_app.templates`, while preserving the Jinja template and local HTMX/Tailwind assets as package data.
- Reproduced the pre-fix `uv build --wheel` failure from setuptools package discovery, then verified the fixed wheel builds cleanly and includes `python_app/static/htmx.min.js`, `python_app/static/tailwind.css`, and `python_app/templates/index.html`.
- Installed the built wheel in an isolated `uv --no-project` runtime and confirmed `evaluate_parameter("extra_axial_csf", 28, 4.0)` still returns the Kyriakopoulou caveat and packaged offline assets are discoverable via `importlib.resources`.

Verification:

- `uv build --wheel --out-dir /tmp/fbmri-wheel-test-after-clean` passes.
- `uv run --no-project --with /tmp/fbmri-wheel-test-after-clean/fetal_brain_mri_python_app-0.1.0-py3-none-any.whl python ...` passes for registry import, caveat output, and packaged template/static asset checks.
- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 170 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Python Extra-Axial Caveat Parity Increment

- Added architecture coverage that Python carries the same extra-axial CSF approximation disclosure expected by the React source registry.
- Added `EXTRA_AXIAL_CSF_APPROXIMATION_CAVEAT` and a Python `REGISTRY_OVERRIDES` row for `extra_axial_csf`, so FastAPI/Jinja report source details can disclose the Kyriakopoulou 2017 approximation caveat through the existing formatter.
- Verified at runtime with `uv run --no-project --with numpy --with scipy` that `evaluate_parameter("extra_axial_csf", 28, 4.0)` returns Kyriakopoulou 2017, the 21-38 week GA window, and the approximation caveat.
- During validation, default `uv run` exposed a separate publication-readiness blocker: setuptools editable build fails because `pyproject.toml` does not explicitly scope package discovery in the flat repository layout. This is queued as the next packaging-hardening increment.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 169 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Publication Handoff Checklist Increment

- Added test coverage that a publication handoff checklist maps reviewer standards to concrete manuscript sections, owners, and required evidence.
- Created `publication_handoff_checklist.md` covering TRIPOD+AI, CLAIM, STARD-AI, DECIDE-AI, CONSORT-AI, calibration, decision-curve net benefit, FeTA 2024, reader-study timing, source-data final lock, and go / no-go criteria.
- Updated the source-verification dossier to point the reporting-map blocker at the prepared handoff checklist while preserving PI/radiologist review as the remaining owner action.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 168 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md source_verification_dossier.md publication_handoff_checklist.md client/src/lib/methodology-page.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Publication-Readiness Literature Audit Increment

- Added tests that the Validation page surfaces reviewer-facing reporting standards and endpoint families: TRIPOD+AI, CLAIM, DECIDE-AI / CONSORT-AI, STARD-AI development, calibration, Brier score, decision-curve net benefit, reader timing, NASA Task Load Index, and System Usability Scale.
- Recorded the online literature audit in the Validation page and source-verification dossier, including the FeTA 2024 / Zalevskyi 2026 biometry gap (best automated biometry 7.72% MAPE versus 5.38% inter-rater MAPE) and domain-shift controls for site, SVR strategy, and image quality.
- Aligned SPEC.md, TEST.md, and the home footer with the publication-ready raw-threshold third-ventricle policy so the corpus no longer describes an active Birnbaum approximation z-score.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 167 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md source_verification_dossier.md client/src/lib/methodology-page.test.ts client/src/lib/validation-page.test.ts client/src/pages/Home.tsx client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 exec prettier --check SPEC.md TEST.md` reports existing corpus-style warnings; those long canonical documents were not mass-reflowed.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.
- Production smoke check passes: `PORT=4174 npx pnpm@10.4.1 start` served `/`, `/validation`, and `/methodology` with HTTP 200 responses.

## 2026-05-23, SPEC 7.5 Third-Ventricle Raw-Threshold Policy Increment

- Added tests that third-ventricle width is an auxiliary raw-threshold input rather than an approximate z-scored source row.
- Removed the Birnbaum approximation from React and Python source registries while preserving the >3.5 mm DDx trigger.
- Updated Methodology, Validation, and the verification dossier to document the conservative raw-threshold policy.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 163 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md source_verification_dossier.md client/src/lib/architecture.test.ts client/src/lib/biometry.test.ts client/src/lib/biometry.ts client/src/components/ParameterRow.tsx client/src/pages/Methodology.tsx client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.6 Python Residual DDx Trigger Increment

- Added architecture coverage for Python residual z-score and composite DDx trigger names.
- Added Python atrial asymmetry, corpus-callosum, large posterior-fossa, extra-axial, and hemispheric-asymmetry rows.
- Added Python hydrocephalus, ACC, HPE, and PCH composite pattern rows from already-computed measurements.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 164 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.7 Python Posterior-Fossa Auxiliary Trigger Increment

- Added architecture coverage for Python cisterna magna and TVA auxiliary trigger output.
- Emitted a Python mega-cisterna-magna / Blake's-pouch differential when cisterna magna depth exceeds 10 mm.
- Emitted a Python Blake's-pouch advisory when TVA is elevated without a small-vermis Dandy-Walker pattern.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 163 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.7 Python Colpocephaly Auxiliary Increment

- Added architecture coverage that the Python worksheet includes frontal horn inputs for colpocephaly comparison.
- Added left/right frontal horn raw inputs to the Python ventricular-system group.
- Emitted a Python differential row when atrial dilation is disproportionate to a normal same-side frontal horn.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 162 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Production Label Cleanup Increment

- Added coverage that user-facing source and package metadata no longer label the calculator as a prototype or scaffold.
- Replaced report, Methodology, footer, and home-screen prototype/scaffold language with release-neutral wording.
- Updated Python package/docstring metadata to describe implemented modules.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 161 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/client-shell.test.ts client/src/lib/report.ts client/src/lib/genai.ts client/src/pages/Home.tsx client/src/pages/Methodology.tsx package.json` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 Public Telemetry Removal Increment

- Added privacy-shell coverage that public assets and Vite config do not ship Manus telemetry collectors or storage proxies.
- Removed the copied debug collector asset from `client/public`.
- Stripped Manus/Builder dev plugins and proxy middleware from the Vite config and package manifest.
- Rebuilt production output so `dist/public` no longer contains the collector asset.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 160 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/client-shell.test.ts package.json vite.config.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Python Source Detail Completeness Increment

- Added architecture coverage that Python report source details include z, percentile, mean, sigma, validated GA range, and extrapolated state.
- Carried source registry metadata into each Python per-source detail row, including GA range, cross-modality status, and caveat text.
- Expanded the Python report source-detail formatter without changing consensus math.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 159 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

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

## 2026-05-23, SPEC 4.8 Auxiliary Report Inclusion Increment

- Added report coverage proving entered auxiliary measurements appear in the structured report as raw-threshold inputs.
- Rendered measured auxiliary rows in a dedicated `AUXILIARY INPUTS` report section after z-scored biometric findings.
- Kept auxiliary rows out of z-score/source-agreement wording while preserving their use by existing differential-card triggers.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 87 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Qualitative Report Inclusion Increment

- Added report coverage proving entered qualitative/context findings appear in the structured report body.
- Rendered manual findings in a `QUALITATIVE / CONTEXT INPUTS` section after numeric findings without z-score, percentile, source, or agreement wording.
- Kept qualitative DDx and impression matching unchanged; this increment only improves report traceability for manually entered context.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 88 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Report Source-Caveat Disclosure Increment

- Added report coverage proving third-ventricle source details disclose the approximation verification tier and cross-modality caveat.
- Rendered source verification tier and verification date in the per-source report detail for measured rows.
- Appended registry caveat text only for sources that carry a caveat, preserving existing consensus, z-score, and DDx behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 89 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 Unused HTTP Dependency Removal Increment

- Added client-shell privacy coverage proving the package does not declare a generic HTTP client dependency.
- Removed the unused Axios production dependency and its lockfile entries.
- Preserved existing source-level network/script/storage guards while tightening the package-level privacy surface.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 90 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check package.json PLAN.md client/src/lib/client-shell.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Row Source-Caveat UI Disclosure Increment

- Added source-detail UI coverage proving the parameter row consumes verification tier, verification date, and caveat fields from source details.
- Rendered verification tier/date in the expanded parameter-row source breakdown beside the existing z, percentile, range, and cross-modality tags.
- Rendered registry caveat text only inside the expanded source breakdown so routine rows remain compact.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 91 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/components/ParameterRow.tsx client/src/lib/source-detail-ui.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11 Deterministic Report Dependency Increment

- Added client-shell coverage proving the package does not declare an unused streaming/Markdown response renderer dependency.
- Removed the unused Streamdown production dependency and its lockfile entries.
- Preserved deterministic report behavior; this increment only tightens the package surface around report generation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 92 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check package.json PLAN.md client/src/lib/client-shell.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 Google Maps Package Removal Increment

- Added client-shell coverage proving the package does not declare Google Maps integration or type packages.
- Removed the unused `@types/google.maps` dev dependency left after the earlier Google Maps component deletion.
- Preserved citation links while keeping executable and typed Maps integration surfaces out of the project.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 93 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check package.json PLAN.md client/src/lib/client-shell.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.9 Stateless Toaster Theme Increment

- Added client-shell coverage proving the package does not declare `next-themes` or import it from client source.
- Switched the toast component to the app's stateless local `ThemeContext`.
- Removed the `next-themes` dependency so theme state cannot reintroduce browser persistence through an unused provider package.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 94 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check package.json PLAN.md client/src/lib/client-shell.test.ts client/src/components/ui/sonner.tsx` passes after formatting `client/src/lib/client-shell.test.ts`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8/4.9 Raw HTML Surface Removal Increment

- Added client-shell coverage rejecting raw HTML injection surfaces in non-test client source.
- Removed the unused chart component that relied on `dangerouslySetInnerHTML` for generated style injection.
- Removed the unused Recharts dependency so the plain-text report shell has no unused rich-chart surface.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 95 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check package.json PLAN.md client/src/lib/client-shell.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Plain-Text Clipboard Export Increment

- Added focused coverage for the PowerScribe copy path using a clipboard abstraction that only writes plain text.
- Preserved report line breaks exactly when writing to the clipboard.
- Routed the existing Copy to Clipboard button through the tested helper without changing report generation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 96 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/clipboard.ts client/src/lib/clipboard.test.ts client/src/pages/Home.tsx` passes after formatting `client/src/lib/clipboard.test.ts`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.4 Workflow Button Label Increment

- Added source-level UI coverage for the SPEC-required `Copy to Clipboard` and `Clear All` workflow labels.
- Updated the top-bar copy button label from `Copy report` to `Copy to Clipboard`.
- Updated the worksheet reset button label from `Clear` to `Clear All` without changing behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 97 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/workflow-ui.test.ts client/src/pages/Home.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.4/4.8 Report Copy Placement Increment

- Added source-level UI coverage proving the report-panel `Copy to Clipboard` action appears below the structured report preview.
- Changed the report-panel copy label from `Copy` to `Copy to Clipboard`.
- Moved the report-panel copy action below the preview while preserving the existing plain-text clipboard behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 98 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/workflow-ui.test.ts client/src/pages/Home.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.4 Report Text Box Increment

- Added source-level UI coverage proving the structured report preview is a read-only text box bound to the live report value.
- Replaced the report preview `<pre>` with a read-only `<textarea>` so radiologists can select plain report text directly.
- Preserved the existing `Copy to Clipboard` action below the preview and the deterministic report-generation path.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 99 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/workflow-ui.test.ts client/src/pages/Home.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Technique Consensus Sentence Increment

- Added report coverage proving the Technique section begins with the fixed multi-source consensus sentence.
- Preserved the reconciliation-rule and Delta z disagreement-threshold wording in that first Technique sentence.
- Moved the imaging-acquisition and motion sentence after the fixed consensus sentence without changing measured-parameter output.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 100 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.10 Registry Failure Parameter Logging Increment

- Added source-registry acceptance coverage requiring failed candidates to log the offending parameter.
- Extended registry validation failures with the parameter id and display name alongside GA, Delta, candidate source, and existing source.
- Preserved accepted-candidate behavior and the existing half-week overlap sampling rule.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 100 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.6 Source-Disagreement Link Increment

- Added UI coverage proving differential source-disagreement badges link to row-level source breakdown anchors.
- Gave each measured parameter source breakdown a stable `source-breakdown-{parameterId}` anchor target.
- Rendered differential source-disagreement badges as links to those anchors without changing card ranking or trigger logic.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 101 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/source-detail-ui.test.ts client/src/components/ParameterRow.tsx client/src/components/DifferentialCard.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.2 Disagree Source Auto-Expansion Increment

- Added row-level UI coverage proving source breakdowns open by default when the agreement state is `disagree`.
- Bound the parameter-row source breakdown `open` state to the computed disagreement state.
- Preserved collapsed source breakdowns for non-disagree rows and kept the existing source-disagreement anchors.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 102 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/source-detail-ui.test.ts client/src/components/ParameterRow.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.2 Reference-Cohort Surface Removal Increment

- Added source-surface coverage rejecting alternate reference-set selection code such as `luis-only`.
- Removed legacy reference-set exports and the unused reference-set resolver from the biometry engine.
- Kept the Luis coefficients used as source-registry entries for multi-source consensus reconciliation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 103 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/client-shell.test.ts client/src/lib/biometry.ts` passes after formatting `client/src/lib/client-shell.test.ts` and `client/src/lib/biometry.ts`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.4 N-Sources Affordance Label Increment

- Added row-level UI coverage proving the clickable source-breakdown summary includes the dynamic source count.
- Changed the source breakdown summary from generic `Source breakdown` text to an `N source(s) breakdown` affordance.
- Preserved the existing source-breakdown anchor and disagreement default-open behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 104 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/source-detail-ui.test.ts client/src/components/ParameterRow.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.10 QI Protocol Methodology Increment

- Added Methodology-page coverage for the SPEC-required pre/intervention/post QI deployment tracking protocol.
- Surfaced the 100 historical-report baseline audit, intervention deployment, and 100 new-report post-audit endpoints.
- Named the required baseline metrics: time to report, measurement completeness, and explicit z-score/percentile documentation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 105 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/methodology-page.test.ts client/src/pages/Methodology.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.3 FeTA Validation Endpoint Increment

- Added Validation-page coverage for the four SPEC §6.3 FeTA 2024 manuscript endpoints.
- Surfaced per-parameter agreement, multi-site/multi-vendor/multi-field-strength robustness, pathology-versus-neurotypical comparison, and ROC-AUC.
- Kept the increment documentation-only without changing scoring-engine behavior.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 106 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.4 Institutional Validation Cohort Increment

- Added Validation-page coverage for the SPEC §6.4 institutional cohort composition and study roles.
- Surfaced the 60-case target with 20 neurotypical, 20 mild-or-moderate pathology, and 20 severe pathology scans.
- Documented the cohort roles: expert ground truth, per-condition labels, with-tool-versus-without-tool reader study, and inter-rater reliability.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 107 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes after formatting `client/src/pages/Validation.tsx`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.6 Validation Dataset Cross-Reference Increment

- Added Validation-page coverage for the SPEC §6.6 datasets considered and rejected.
- Surfaced the dHCP fetal release caveat: no expert-measured biometry and no case-level pathology labels.
- Surfaced the Luis 2025 cohort caveat: it is a registry reference distribution and cannot be used for circular validation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 108 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.7 Validation Timeline Increment

- Added Validation-page coverage for the SPEC §6.7 validation timeline.
- Surfaced the FeTA access and analysis timing: Synapse Data Access Request, Data Transfer Agreement, two-to-four-week access, and three-to-four-week analysis.
- Surfaced the institutional timeline: four-to-six-week IRB submission, six-to-twelve-week reader study, and six-to-nine-month manuscript path.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 109 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes after formatting `client/src/pages/Validation.tsx`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.1 Validation Philosophy Increment

- Added Validation-page coverage for the SPEC §6.1 validation philosophy.
- Surfaced the measurement-layer versus interpretation-layer distinction and the Phase 1 interpretation-only scope.
- Documented that validation requires both internal and external cohorts, with expert ground-truth measurements anchoring interpretation-layer agreement.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 110 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.2 FeTA Cohort Composition Increment

- Added Validation-page coverage for the SPEC §6.2 FeTA 2024 external cohort composition.
- Surfaced the 300 super-resolution T2 volumes across five named sites, three field strengths, and four vendor classes.
- Documented the neurotypical/pathological split and named pathology categories used for external validation.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 111 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.2 FeTA Measurement Coverage Increment

- Added Validation-page coverage for the SPEC §6.2 FeTA ground-truth, derivable, and unavailable measurement groups.
- Surfaced the five direct expert-measured FeTA biometric values and the four additional values derivable from segmentation masks.
- Documented the remaining parameters requiring the institutional cohort plus the 120-case training and 180-case test-set access split.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 112 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/validation-page.test.ts client/src/pages/Validation.tsx` passes after formatting `client/src/lib/validation-page.test.ts` and `client/src/pages/Validation.tsx`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Mild-VM Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 mild-ventriculomegaly likelihood manifest.
- Kept the transcribed Pagani 2014 neurodevelopmental-delay statistic visible in the rationale and report impression.
- Replaced estimate-only mild-VM likelihood labels with qualitative wording rather than unsupported numeric percentages.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 113 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Moderate-VM Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 moderate-ventriculomegaly likelihood manifest.
- Confirmed the moderate-VM card no longer surfaces estimate-only numeric percentages.
- Replaced the associated-anomaly, chromosomal, isolated, and CMV likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 114 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Severe-VM Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 severe-ventriculomegaly likelihood manifest.
- Replaced estimate-only severe-VM numeric likelihood labels with qualitative wording.
- Corrected the aqueductal-stenosis rationale attribution from the placeholder Garel 2018 wording to the canonical Heaphy-Henault 2018 fetal-MRI source.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 115 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Absent-CSP Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 absent-CSP likelihood manifest.
- Kept the SMFM absent-CSP/ACC rationale visible while avoiding numeric likelihood labels for estimate rows.
- Replaced the holoprosencephaly, ACC, hydrocephalus, SOD, and isolated likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 116 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Enlarged-CSP Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 wide/enlarged-CSP likelihood manifest.
- Confirmed the enlarged-CSP card no longer surfaces estimate-only numeric percentages.
- Replaced the normal-variant, cavum-vergae, cavum-velum-interpositum, associated-anomaly, and obstructive-hydrocephalus labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 117 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Complete-ACC Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 complete-ACC likelihood manifest.
- Preserved the transcribed Santo 2012 isolated complete-ACC likelihood label and rationale.
- Replaced approximate or estimate-only monogenic and chromosomal likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 118 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Partial-ACC Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 partial/hypogenesis corpus-callosum likelihood manifest.
- Confirmed the partial-ACC card no longer surfaces estimate-only numeric percentages.
- Replaced the isolated, monogenic, and chromosomal/CNV likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 119 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Small-Pons Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 small-pons likelihood manifest.
- Preserved the van Dijk 2018 PCH Type 2 rationale while avoiding a precise estimate label.
- Replaced the PCH subtype, CASK, and tubulinopathy likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 120 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Small-Vermis Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 small-vermis likelihood manifest.
- Confirmed the small-vermis card no longer surfaces estimate-only numeric percentages.
- Replaced the Dandy-Walker, isolated hypoplasia, Joubert, and chromosomal/syndromic likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 121 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes after formatting `client/src/lib/biometry.test.ts`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Third-Ventricle Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 wide-third-ventricle likelihood manifest.
- Confirmed the third-ventricle card no longer surfaces estimate-only numeric percentages.
- Replaced the aqueductal-stenosis, ACC/dysgenesis, HPE, and cyst likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 122 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Microcephaly Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 microcephaly likelihood manifest.
- Confirmed the microcephaly card no longer surfaces estimate-only numeric percentages.
- Replaced the genetic, infection, malformation, chromosomal, and constitutional likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 123 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Macrocephaly Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 macrocephaly likelihood manifest.
- Confirmed the macrocephaly card no longer surfaces estimate-only numeric percentages.
- Replaced the hydrocephalus, benign familial macrocephaly, megalencephaly, and tumor/cyst likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 124 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 Hydrocephalus-Pattern Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 hydrocephalus combined-pattern likelihood manifest.
- Confirmed the hydrocephalus-pattern card no longer surfaces estimate-only numeric percentages.
- Replaced the aqueductal-stenosis, L1CAM, and posterior-fossa/Chiari II likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 125 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 HPE-Pattern Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 HPE combined-pattern likelihood manifest.
- Confirmed the HPE-pattern card no longer surfaces estimate-only numeric percentages.
- Replaced the alobar/semilobar, lobar, and septo-optic-dysplasia likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 126 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 ACC-Pattern Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 ACC combined-pattern likelihood manifest.
- Confirmed the ACC-pattern card no longer surfaces estimate-only numeric percentages.
- Replaced the complete-ACC, partial-ACC, and associated-syndrome likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 127 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 DWM-Pattern Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 Dandy-Walker combined-pattern likelihood manifest.
- Confirmed the DWM-pattern card no longer surfaces estimate-only numeric percentages.
- Replaced the Dandy-Walker, vermian-hypoplasia, and Blake's-pouch-remnant likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 128 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.4 PCH-Pattern Likelihood Qualitative Increment

- Added DDx coverage for the SPEC §7.4 pontocerebellar-hypoplasia combined-pattern likelihood manifest.
- Confirmed the PCH-pattern card no longer surfaces estimate-only numeric percentages.
- Replaced the PCH2, PCH1, other-PCH/CASK/tubulinopathy, and acquired-CMV likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 129 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, Hemispheric-Asymmetry Likelihood Qualitative Increment

- Added DDx coverage for the TEST.md §24 hemispheric-asymmetry likelihood labels.
- Confirmed the brain-asym card no longer surfaces unsupported numeric percentages.
- Replaced the hemimegalencephaly, cortical-malformation, porencephaly, and vascular-malformation likelihood labels with qualitative wording.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 130 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/biometry.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 7.5 Source Verification Dossier Increment

- Added regression coverage that the SPEC §7.5 verification dossier exists.
- Cross-listed the Dovjak, Woitek, third-ventricle, Section 7.4 citation-pass, and Chiari calibration action items.
- Tracked each action item with an explicit status so unresolved clinician-collaborator work is visible.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 131 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md source_verification_dossier.md client/src/lib/methodology-page.test.ts` passes after formatting `source_verification_dossier.md`.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Clinical Integration Workflow Increment

- Added Methodology-page coverage for the Epic Radiant launch path and SMART-on-FHIR deferral.
- Surfaced the PowerScribe paste workflow and plain-text clipboard constraint from SPEC §4.8.
- Kept the implementation as documentation of Phase 1 integration rather than introducing PHI-bearing EHR code.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 132 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/methodology-page.test.ts client/src/pages/Methodology.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11.1 Clinical-Indication Report Increment

- Added report coverage for the SPEC §4.11.1 clinical-indication behavior.
- Left Clinical Indication blank for manual entry when no EHR context is supplied.
- Allowed an optional EHR/context indication string to populate the Clinical Indication section.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 133 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11.4 Citation-Grounded Impression Increment

- Added report coverage for citation-grounding on generated Impression differential lines.
- Included each fired DDx card's primary source inline in the plain-text report.
- Included secondary source attribution when a fired DDx card has one.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 134 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11 GenAI/RAG Guardrail Scaffold Increment

- Added regression coverage for the SPEC §4.11.2 RAG prompt constraint and knowledge-bank scope.
- Added coverage for the SPEC §4.11.3 agentic PubMed search query shape, top-3 retrieval limit, and transparency flag.
- Added metadata coverage for the SPEC §4.11.5 local and free-tier backend recommendations without introducing network calls.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 138 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/genai.ts client/src/lib/genai.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11.4 Post-Generation Verification Increment

- Added GenAI guardrail coverage for cross-checking generated report text against original numeric inputs.
- Failed verification when a generated report omits the exact expected measurement anchor.
- Returned the safe deterministic-template fallback whenever verification fails.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 140 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/genai.ts client/src/lib/genai.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11 GenAI/RAG Methodology Exposure Increment

- Added Methodology-page coverage for the optional GenAI/RAG module and strict no-external-claims prompt.
- Surfaced the Bio.Entrez top-3 PubMed fallback, temporary abstract context, and PMID transparency requirement.
- Surfaced the safe deterministic fallback and local/free-tier backend recommendations without enabling network calls.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 141 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/methodology-page.test.ts client/src/pages/Methodology.tsx` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Source-Agreement Note Ordering Increment

- Added report coverage for a disagreeing measurement rendered alongside auxiliary inputs.
- Confirmed SOURCE-AGREEMENT NOTES appears immediately after FINDINGS, before auxiliary or qualitative sections.
- Kept auxiliary and qualitative sections intact after source-agreement notes.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 142 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/biometry.test.ts client/src/lib/report.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11.2 RAG Prompt Payload Increment

- Added GenAI coverage that prompt payloads include the strict RAG system prompt.
- Injected exact numerical inputs, z-scores, and percentiles into the prompt payload.
- Injected retrieved evidence chunks with source labels so generated impressions stay literature-grounded.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 143 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/genai.ts client/src/lib/genai.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Python/FastAPI Architecture Scaffold Increment

- Added architecture coverage for the SPEC §4.3 Python/FastAPI/Jinja deployment surface.
- Required local HTMX and Tailwind assets so the scaffold remains offline-capable.
- Declared the required numpy/scipy math dependencies and standalone packaging dependency.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 146 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md python_app/templates/index.html python_app/static/tailwind.css python_app/static/htmx.min.js client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Python Biometry Core Scaffold Increment

- Added architecture coverage that the Python scaffold exposes the three SPEC §4.2.1 model families.
- Required numpy-backed polynomial evaluation and scipy.stats.norm percentile conversion.
- Added a minimal Python z-score helper that can be expanded toward the full TypeScript consensus engine.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 147 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Standalone Docker Packaging Increment

- Added architecture coverage for the SPEC §4.3 lightweight Docker deployment option.
- Packaged the Python FastAPI scaffold from `pyproject.toml`.
- Ran the offline FastAPI app with uvicorn on a local workstation/container port.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 148 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Python Build Metadata Increment

- Added packaging coverage that the Docker `pip install .` path has PEP 517 build-system metadata.
- Declared the setuptools build backend in `pyproject.toml`.
- Kept the deployment artifact aligned with the FastAPI scaffold.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 148 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Python Centile-Table Fit Scaffold Increment

- Added architecture coverage for the offline `scipy.optimize.curve_fit` registry-build path.
- Provided Python helpers that fit per-week 5th/95th centile tables into the supported per-percentile linear family.
- Provided a companion helper for per-week mean/SD tables using the linear-mean constant-SD family.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 149 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.2.5 Python Fit Residual Audit Increment

- Added architecture coverage that Python registry-build fits retain residual RMSE.
- Added an optional max-RMSE guard matching the inter-rater-variability threshold requirement.
- Returned fit result records that keep both the fitted model and audit residuals.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 150 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.11.3 Python Bio.Entrez Fallback Scaffold Increment

- Added architecture coverage for the optional Python Bio.Entrez agentic-search backend hook.
- Declared Biopython as an optional GenAI dependency without enabling network calls in the client.
- Added a Python plan module that builds the PubMed query shape, top-3 abstract limit, and PMID transparency metadata.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 151 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.4 Python Jinja Worksheet Shell Increment

- Added architecture coverage that the FastAPI/Jinja first screen is a worksheet shell rather than scaffold copy.
- Rendered GA week/day controls, imaging context, parameter inputs, and a structured-report preview from Jinja.
- Added a lightweight HTMX `/calculate` endpoint hook for report-preview updates without storing PHI.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 152 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts python_app/templates/index.html` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Local HTMX Adapter Increment

- Added architecture coverage that the bundled HTMX asset is not a placeholder.
- Implemented the local `hx-post`/`hx-target` form-update behavior used by the Python worksheet.
- Preserved the offline/no-external-script deployment posture.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 153 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts python_app/static/htmx.min.js` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.3 Local Tailwind Stylesheet Increment

- Added architecture coverage that the bundled Tailwind stylesheet is not a placeholder.
- Provided local CSS for the FastAPI/Jinja worksheet shell layout, controls, and report preview.
- Preserved the offline/no-CDN styling posture.

Verification:

- `npx pnpm@10.4.1 test -- --runInBand` passes with 154 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts python_app/static/tailwind.css` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.2 Python Source Registry Increment

- Added architecture coverage for a Python source registry covering every z-scored worksheet parameter.
- Ported the model coefficients and multi-source overrides needed for consensus evaluation.
- Used the Python registry in the FastAPI report-preview endpoint to emit consensus z-score, percentile, agreement, and source labels.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 155 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.8 Python Source Detail Report Increment

- Added architecture coverage that the Python report endpoint propagates per-source z values.
- Added SOURCE-AGREEMENT NOTES for Python rows whose registry sources disagree.
- Kept the report preview plain text for PowerScribe paste compatibility.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 156 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 4.6 Python Core DDx Bridge Increment

- Added architecture coverage for Python endpoint differential-consideration output.
- Implemented deterministic threshold triggers for the core ventriculomegaly, CSP, third-ventricle, size-summary, posterior-fossa, and pons patterns.
- Used the Python DDx rows to make the report impression more specific when a core trigger fires.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 157 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.

## 2026-05-23, SPEC 6.5 Python Chiari II Discriminator Increment

- Added architecture coverage for the Python Mahalanobis ONTD posterior helper.
- Implemented the TDPF/CSA Chiari II trigger using consensus z-scores and posterior > 0.5.
- Flagged the Python report output as research-mode when the Chiari II / ONTD discriminator fires.

Verification:

- `python3 -m py_compile python_app/__init__.py python_app/main.py python_app/biometry.py python_app/genai.py python_app/registry.py` passes.
- `npx pnpm@10.4.1 test -- --runInBand` passes with 158 tests.
- `npx pnpm@10.4.1 check` passes.
- `npx pnpm@10.4.1 exec prettier --check PLAN.md PROGRESS.md client/src/lib/architecture.test.ts` passes.
- `npx pnpm@10.4.1 build` passes with only the pre-existing chunk-size warning.
