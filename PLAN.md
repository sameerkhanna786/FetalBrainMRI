## Consensus registry increment

- Add Vitest coverage for SPEC §4.2.3/§4.2.4: TCD at 28w0d and 33.0 mm must evaluate Luis 2025 and Dovjak 2021 and compute consensus z from in-range sources. Because the verbatim §7.3 coefficients yield Delta z 0.98 for 33.0 mm, add a 33.2 mm disagreement assertion for the Delta z >= 1.0 runtime flag.
- Add report coverage for SPEC §4.8: measured rows must include consensus values, per-source z/mean/SD/range details, agreement state, and SOURCE-AGREEMENT NOTES when a row disagrees.
- Replace one-model-per-parameter scoring with a per-parameter source registry and deterministic consensus reconciler.
- Surface source count, agreement badge, and per-source details in each parameter row.
- Remove the user-facing reference-set selector so the imaging-context strip only indicates multi-source consensus mode.

## Chiari II / open NTD increment

- Add Vitest coverage for SPEC §6.5.2 worked example: at 24w0d, TDPF 24.0 mm and CSA 55.0 degrees must produce severely low single-source Woitek z-scores.
- Add Vitest coverage for SPEC §6.5.4: the combined TDPF/CSA pattern must emit a Chiari II / open neural tube defect DDx card when both z-scores are below -2 and the ONTD Mahalanobis posterior is above 0.5.
- Extend the parameter model and UI/report rendering so a parameter can use degree units, not only millimetres.
- Add TDPF and CSA source-registry entries using the Woitek 2014 quadratic mean / linear SD coefficients and validated 21-37 week window.
- Implement the Mahalanobis posterior helper and DDx card using consensus z-scores.

## Source-registry acceptance increment

- Add Vitest coverage for SPEC §4.10.1 using skull BPD: an identical candidate source should pass with zero standardized divergence.
- Add Vitest coverage for SPEC §4.10.1 rejection: a candidate shifted well above the existing mean curve should fail and report the offending source, GA, and delta.
- Implement a source-registry extension validator that samples half-week increments over each overlap and computes max |mu_new - mu_existing| / max(sigma_new, sigma_existing).

## Methodology audit increment

- Add Vitest coverage for SPEC §4.10.2: cross-validation audits must be reproducible from the source registry and include half-week samples for each multi-source parameter.
- Add verification tier metadata to source-registry entries so Methodology can show byte-identical, transcribed, derived, or approximation rows per SPEC §7.5.
- Implement audit status classification (`pass`, `partial-fail`, `fail`) using the 0.5 SD threshold and contiguous excursion rule from SPEC §4.10.2.
- Replace stale Methodology copy about selectable reference sets with always-on consensus wording, audit charts, and verification-tier lines.

## DDx source-disagreement increment

- Add Vitest coverage for SPEC §4.6: a DDx card triggered from a disagreeing source row must carry source-disagreement metadata.
- Add related-parameter metadata to z-score-driven DDx cards so the engine can propagate `disagree` rows into the card output.
- Render source-disagreement badges in expanded cards and rail items.

## Third-ventricle manifest correction

- Add Vitest coverage for SPEC §4.2.2 / §7.3.12 third-ventricle metadata: Birnbaum 2018 must be tagged cross-modality, approximation-tier, and valid over 18-37 weeks.
- Correct the third-ventricle registry range so 18w is in range and 38w is extrapolated.

## Chiari research-mode report flag

- Add report coverage for SPEC §7.5: when the Chiari II / ONTD card fires, the structured report must explicitly flag that discriminator as research-mode pending local calibration.
- Add a deterministic report note tied to the fired card id.

## Gestational-age parsing increment

- Add Vitest coverage for TEST.md §1.3: GA input strings must accept weeks+days (`24+3`, `24w 3d`) and decimal weeks (`24.5 w`).
- Implement a parser that normalizes valid inputs to `{weeks, days}` and rejects out-of-range days.
- Add a compact top-bar GA text field that applies parsed GA on Enter or blur while preserving the existing week/day dropdown workflow.

## Normal-control impression increment

- Add Vitest coverage for TEST.md §2 normal controls: when measurements are present and no abnormal thresholds fire, the report impression must contain the exact sentence `No abnormal biometric findings.`
- Replace the longer prototype normal-impression sentence with the TEST.md expected line.

## Mild-VM impression increment

- Add Vitest coverage for TEST.md §3 Case M1: bilateral 11 mm atria at 24w0d should emit the isolated mild ventriculomegaly impression sentence.
- Add card-specific deterministic impression text for the mild ventriculomegaly DDx card.
- Update report generation to prefer a fired card's deterministic impression line before the generic abnormal-report fallback.

## Asymmetric mild-VM impression increment

- Add Vitest coverage for TEST.md §3 Case M3: right-sided 12 mm atrium with normal left atrium at 28w0d must use the asymmetric mild-VM impression.
- Add deterministic impression text to the asymmetric-ventricle card.
- Add impression priority so specific combined/asymmetric impressions can override generic mild-VM prose even when the mild-VM card ranks higher.

## Isolated severe-VM impression increment

- Add Vitest coverage for TEST.md §4 Case S3: bilateral 17.5 mm atria at 28w0d with otherwise normal measured context should fire severe VM only and emit the Carta 2018 isolated severe-VM impression.
- Add card-specific deterministic impression text to the severe ventriculomegaly card.
- Assign severe VM an impression priority above generic mild/moderate VM but below future combined-pattern impressions.

## Aqueductal-stenosis impression increment

- Add Vitest coverage for TEST.md §4 Case S1: severe bilateral VM with third-ventricle dilatation and macrocephaly at 26w0d should fire the triventricular hydrocephalus pattern.
- Assert the combined-pattern report impression exactly matches the Heaphy-Henault aqueductal-stenosis wording.
- Add a high-priority deterministic impression to the hydrocephalus composite card so it overrides the generic severe-VM impression.

## ACC severe-VM impression increment

- Add Vitest coverage for TEST.md §4 Case S2: severe bilateral VM with absent CSP and absent CC at 24w0d should fire the ACC composite and not the HPE or aqueductal-stenosis composites.
- Add the Santo 2012 ACC counselling impression to the ACC composite with priority above standalone severe VM.
- Tighten the HPE composite trigger so absent CSP plus severe VM alone does not misclassify the ACC fixture as HPE.

## HPE severe-VM impression increment

- Add Vitest coverage for TEST.md §4 Case S5: severe VM with absent CSP/CC and microcephaly at 32w0d should fire the HPE composite and suppress ACC.
- Add the Malinger 2013 HPE counselling impression to the HPE composite with the highest current report priority.
- Tighten the ACC composite so the HPE microcephaly pattern is not simultaneously labelled as ACC.

## Mixed-tier asymmetric VM increment

- Add Vitest coverage for TEST.md §4 Case S4: right severe VM with left mild VM should fire severe VM, mild VM, and asymmetric ventricles together.
- Change mild/moderate VM tier matching from max-only logic to side-aware logic so a contralateral lower-tier ventricle is not hidden by the more severe side.
- Preserve existing severe, mild, and asymmetric report-impression priority behavior.

## Vermian-hypoplasia caveat increment

- Add Vitest coverage for TEST.md §6 Case V3: isolated inferior vermian hypoplasia at 26w0d should fire the vermis-small card without small-TCD or small-pons cards.
- Assert the report impression references Limperopoulos 2006's warning that early fetal MRI can over-call inferior vermian hypoplasia.
- Add a deterministic impression line to the vermis-small card below higher-priority combined-pattern impressions.

## Combined cerebellar hypoplasia report increment

- Add Vitest coverage for TEST.md §6 Case V5's combined-pattern requirement: severe vermian hypoplasia with a registry-threshold small TCD should fire both `vermis-small` and `tcd-small`.
- Assert the report flags the combined small-TCD plus small-vermis concern for cerebellar agenesis or pontocerebellar hypoplasia.
- Add a report-level combined-pattern impression override without introducing a formal new DDx card.

## Centile-table fitting increment

- Add Vitest coverage for SPEC §4.2.5: per-week 5th/95th centile rows should fit into the per-percentile linear model family by ordinary least squares.
- Return the fitted model coefficients plus retained residual RMSE values for auditability.
- Reject underdetermined or malformed centile tables rather than silently producing unstable registry entries.

## Mean-SD table fitting increment

- Add Vitest coverage for SPEC §4.2.5: per-week mean/SD rows should fit into the linear-mean/constant-SD model family.
- Return fitted mean-line coefficients, average constant sigma, and retained residual RMSE values.
- Reject underdetermined rows, non-finite values, and non-positive SD inputs.

## Dandy-Walker TVA trigger increment

- Add Vitest coverage for TEST.md §7 Case D1: small vermis, small TCD, small pons, and markedly elevated TVA should fire the Dandy-Walker composite card.
- Change the DWM composite trigger from third-ventricle dilatation to elevated tegmento-vermian angle with small vermis.
- Update DWM card wording to describe the TVA-based posterior-fossa pattern.

## ACC plus Dandy-Walker report increment

- Add Vitest coverage for TEST.md §7 Case D3: ACC and Dandy-Walker composite cards should fire simultaneously.
- Add deterministic Dandy-Walker report wording for DWM-only cases.
- Add report handling so ACC plus DWM enumerates both combined-pattern diagnoses instead of hiding DWM behind the ACC impression priority.

## Mega-cisterna-magna qualitative report increment

- Add Vitest coverage for TEST.md §8 Case BP3: when the qualitative MCM/Blake's pouch panel is toggled with otherwise normal quantitative measurements, no DDx cards should fire.
- Add report handling for the qualitative panel so the IMPRESSION mentions isolated mega cisterna magna with persistent Blake's pouch as a likely benign normal variant.
- Keep the qualitative panel separate from quantitative DDx card firing.

## Isolated small-TCD report increment

- Add Vitest coverage for TEST.md §9 Case CH3: isolated small TCD with preserved vermis and pons at 32w0d should fire `tcd-small` only among posterior-fossa small-structure cards.
- Assert the report impression suggests unilateral cerebellar hypoplasia or cerebellar disruption injury and recommends postnatal MRI for laterality assessment.
- Add deterministic report wording to the `tcd-small` card below higher-priority DWM/PCH/combined-cerebellar impressions.

## Macrocerebellum plus macrocephaly report increment

- Add Vitest coverage for TEST.md §10 Case LC2: macrocerebellum with macrocephaly at 30w0d should fire both `tcd-large` and `macrocephaly`.
- Assert the report impression suggests fetal overgrowth syndromes, including Sotos and Beckwith-Wiedemann syndrome.
- Add a report-level combined-pattern impression for `tcd-large` plus `macrocephaly`, while allowing hydrocephalus-specific impressions to remain higher priority.

## Macrocerebellum plus thick-CC report increment

- Add Vitest coverage for TEST.md §10 Case LC5: macrocerebellum with thick corpus callosum at 30w0d should fire both `tcd-large` and `cc-thick`.
- Assert the report impression flags the combined finding as an overgrowth-syndrome concern.
- Extend the overgrowth combined-pattern report override to include `tcd-large` plus `cc-thick`.

## Short corpus-callosum report increment

- Add Vitest coverage for TEST.md §11 Case A4's partial / hypogenetic corpus-callosum report requirement using a registry-threshold short-CC value with preserved CSP.
- Assert `cc-short` fires without `cc-absent` or `acc-pattern`.
- Add deterministic `cc-short` impression wording recommending postnatal MRI confirmation.

## Isolated small-pons report increment

- Add Vitest coverage for TEST.md §17 Case PCH6: isolated small pons with preserved TCD and vermis at 32w0d should fire `pons-small` without `pch-pattern`.
- Assert the report impression calls this isolated brainstem / pontine hypoplasia rather than classical PCH and recommends considering PMM2-CDG and other isolated brainstem disorders.
- Add report-level isolated-pons wording that is suppressed whenever the PCH composite fires.

## Large pons plus thick-CC report increment

- Add Vitest coverage for TEST.md §18 Case LP6: large pons with thick corpus callosum at 26w0d should fire both `pons-large` and `cc-thick`.
- Assert the report impression flags the pair as a strong overgrowth-syndrome pattern.
- Add a report-level overgrowth combined-pattern impression for `pons-large` plus `cc-thick`.

## Macrocephaly plus thick-CC report increment

- Add Vitest coverage for TEST.md §20 Case MA3 / §13 Case TC2: macrocephaly with thick corpus callosum should fire both `macrocephaly` and `cc-thick`.
- Assert the report impression flags the pair as an overgrowth-syndrome combined pattern.
- Add a report-level overgrowth combined-pattern impression for `macrocephaly` plus `cc-thick`.

## Isolated third-ventricle report increment

- Add Vitest coverage for TEST.md §21 Case TV2: isolated third-ventricle dilatation at 30w0d should fire `third-v-wide` without ventriculomegaly or aqueductal-stenosis cards.
- Assert the report impression suggests isolated third-ventricle prominence, early aqueductal stenosis or measurement-technique error, and short-interval follow-up.
- Add report-level isolated `third-v-wide` wording that is suppressed by hydrocephalus / aqueductal-stenosis patterns.

## Aqueductal-stenosis absent-CSP negative-control increment

- Add Vitest coverage for TEST.md §22 Case AS-P3: severe VM plus third-ventricle dilatation with absent CSP should not fire `hydrocephalus-pattern`.
- Preserve `severe-vm`, `absent-csp`, and `third-v-wide` firing for the fixture.
- Update the hydrocephalus composite matcher so an explicitly absent CSP suppresses aqueductal-stenosis classification.

## Isolated absent-CSP report increment

- Add Vitest coverage for TEST.md §14 Case CSP-A3: absent CSP with preserved corpus callosum should fire `absent-csp` without ACC or HPE composites.
- Assert the report impression recommends evaluation for septo-optic dysplasia, corpus callosum abnormality, and mild HPE-spectrum findings.
- Add deterministic `absent-csp` impression wording below ACC/HPE composite priorities.

## Isolated enlarged-CSP report increment

- Add Vitest coverage for TEST.md §15 Case CSP-E1: isolated enlarged CSP at 32w0d should fire `enlarged-csp` without other DDx cards.
- Assert the report impression describes the finding as usually benign while noting cavum vergae / velum interpositum cyst and associated-anomaly correlation.
- Add deterministic `enlarged-csp` impression wording for isolated watch-level cases.

## CMV qualitative microcephaly report increment

- Add Vitest coverage for TEST.md §19 Case MC5's qualitative CMV report requirement using registry-consistent microcephaly plus mild VM measurements.
- Assert the quantitative cards remain `microcephaly` plus `mild-vm` while a manual qualitative CMV panel drives the CMV impression.
- Add report-level `qualitative_cmv_panel` handling without introducing a quantitative CMV DDx card.

## Growth-restriction microcephaly report increment

- Add Vitest coverage for TEST.md §19 Case MC6's growth-restriction-context report requirement using registry-consistent microcephaly measurements.
- Assert `microcephaly` fires while a manual growth-restriction context value drives the IUGR-associated impression.
- Add report-level growth-restriction context handling without introducing a quantitative IUGR DDx card.

## Direct extra-axial CSF report increment

- Add Vitest coverage for TEST.md §25 Case EA1: direct extra-axial CSF measurement at 32w0d should fire the widened extra-axial-space card.
- Add an `extra_axial_csf` worksheet parameter with Kyriakopoulou 2017 provenance and an explicitly approximate GA-adjusted reference curve.
- Update the existing widened extra-axial-space card to prefer the direct measurement and keep the skull/brain BPD proxy as a fallback.
- Add deterministic external-hydrocephalus / benign macrocrania report wording for the isolated direct-measurement pattern.

## Brain-volume-loss extra-axial report increment

- Add Vitest coverage for TEST.md §25 Case EA2 using registry-consistent microcephaly, mild ventriculomegaly, and widened extra-axial CSF values.
- Assert `microcephaly`, `mild-vm`, and `extra-axial-wide` fire together without requiring a manual qualitative CMV panel.
- Add a report-level combined-pattern impression suggesting congenital CMV or another intrauterine destructive insult.
- Keep the existing qualitative-CMV and growth-restriction context impressions available for their more specific manually entered contexts.

## IUGR extra-axial report increment

- Add Vitest coverage for TEST.md §25 Case EA4 using registry-consistent microcephaly plus widened extra-axial CSF values at 28w0d.
- Assert `microcephaly` and `extra-axial-wide` fire without the mild-VM brain-volume-loss pattern.
- Add a report-level impression that references IUGR-associated extra-axial-space prominence.
- Preserve the manual growth-restriction context impression as the higher-specificity wording when that context is entered.

## Extreme-z percentile formatting increment

- Add Vitest coverage for TEST.md §27 Case STRESS4 using an exact z = +5 macrocephaly value from the active source registry.
- Assert the macrocephaly card fires and the structured report renders a percentile above 99.9 rather than collapsing to `>99th`.
- Update percentile formatting to expose sub-0.1st and above-99.9th saturation buckets.
- Keep the existing rounded ordinal formatting for ordinary 1st–99th percentile values.

## Moderate ventriculomegaly report increment

- Add Vitest coverage for TEST.md §3 Case M4: bilateral 13.5 mm atria should fire the moderate ventriculomegaly card without severe VM or ventricular asymmetry.
- Assert the structured report names the 12–14.9 mm moderate VM sub-band and recommends follow-up imaging for progression.
- Add deterministic moderate-VM impression wording with priority above isolated mild VM and below severe VM.

## Near-severe ventriculomegaly boundary increment

- Add Vitest coverage for TEST.md §3 Case M2: bilateral 14.5 mm atria should fire moderate VM without severe VM.
- Assert the report explicitly says the atrial dimensions are approaching the severe threshold at 15 mm.
- Add dynamic moderate-VM impression wording for high-end moderate values while preserving the generic M4 moderate wording.

## Pure ventricular asymmetry report increment

- Add Vitest coverage for TEST.md §5 Case AS1: atrial side-to-side difference > 2 mm should fire `asym-vent` without VM cards.
- Assert the structured report does not label a fired DDx-card case as having no abnormal biometric findings.
- Update report abnormality detection so fixed-threshold DDx cards count as abnormal even when all measured z-scores are within ±2.

## Unilateral severe-VM asymmetry report increment

- Add Vitest coverage for TEST.md §5 Case AS6: unilateral severe VM with normal contralateral atrium should fire `severe-vm` plus `asym-vent`.
- Assert the report suggests unilateral haemorrhage or encephaloclastic insult rather than isolated bilateral severe VM.
- Add a report-level asymmetric severe-VM impression suppressed by aqueductal-stenosis, ACC, and HPE combined patterns.

## Vermian-hypoplasia DWM boundary increment

- Add Vitest coverage for TEST.md §6 Case V2 boundary behavior using small vermis, borderline TVA, and registry-normal TCD/pons values.
- Assert `vermis-small` fires while `dwm-pattern`, `tcd-small`, and `pons-small` remain absent.
- Tighten the Dandy-Walker matcher so borderline TVA requires additional small TCD and small pons support, while markedly elevated TVA remains sufficient.

## Vermian-AP hypoplasia trigger increment

- Add Vitest coverage for the TEST.md §6 small-vermis rule using a normal vermis CC value and an AP-only low vermis measurement.
- Assert `vermis-small` fires without unrelated posterior-fossa cards when the AP axis is below the fifth percentile.
- Update the small-vermis matcher and linked parameter metadata so either entered vermis axis can support the card.

## Vermian-AP DWM trigger increment

- Add Vitest coverage for TEST.md §7 Dandy-Walker spectrum behavior with normal vermis CC, AP-only vermis hypoplasia, and markedly elevated TVA.
- Assert `dwm-pattern` fires alongside `vermis-small` without requiring small TCD or pons when TVA is markedly elevated.
- Update the Dandy-Walker matcher to use the same lowest entered vermis-axis logic as the small-vermis card.

## Isolated DWM With Preserved Pons Increment

- Add Vitest coverage for TEST.md §7 Case D5 using small vermis, TVA 80 degrees, small TCD, and registry-normal pons.
- Assert `dwm-pattern` fires with `vermis-small` and `tcd-small` while `pons-small` remains absent.
- Relax the moderate-TVA DWM support rule so TVA in the 60-89 degree range can be supported by either small TCD or small pons, while lower borderline TVA still requires both.

## Hemispheric-Asymmetry Z-Delta Increment

- Add Vitest coverage for TEST.md §24 boundary behavior using brain-OFD left/right values separated by 1.6 SD.
- Assert `brain-asym` does not fire below the specified >2 SD discordance threshold even when the raw percent difference exceeds 5%.
- Update the hemispheric-asymmetry card title, summary trigger, and matcher to use left/right consensus z-score delta.

## Large-TCD 95th-Percentile Threshold Increment

- Add Vitest coverage for TEST.md §10 macrocerebellum behavior using a registry-derived TCD value between +1.645 and +2 SD.
- Assert `tcd-large` fires at the 95th-percentile threshold while unrelated overgrowth combination cards remain absent.
- Lower the large-TCD matcher and card wording from +2 SD to the TEST.md §10 +1.645 SD threshold.

## Thick-CC 95th-Percentile Threshold Increment

- Add Vitest coverage for TEST.md §13 thick corpus callosum behavior using a registry-derived CC value between +1.645 and +2 SD.
- Assert `cc-thick` fires at the 95th-percentile threshold without unrelated macrocephaly or large-pons cards.
- Lower the thick-CC matcher and card wording from +2 SD to the TEST.md §13 +1.645 SD threshold.

## Large-Pons 95th-Percentile Threshold Increment

- Add Vitest coverage for TEST.md §18 large pons behavior using a registry-derived pons AP value between +1.645 and +2 SD.
- Assert `pons-large` fires at the 95th-percentile threshold without unrelated macrocephaly or thick-CC cards.
- Lower the large-pons matcher and card wording from +2 SD to the TEST.md §18 +1.645 SD threshold.

## Macrocephaly 97th-Percentile Threshold Increment

- Add Vitest coverage for TEST.md §20 macrocephaly behavior using a registry-derived skull BPD value between the 97th percentile and +2 SD.
- Assert `macrocephaly` fires at the 97th-percentile threshold while unrelated overgrowth cards remain absent.
- Lower the macrocephaly matcher and card wording from +2 SD / 97.5th percentile to the TEST.md §20 97th-percentile threshold.

## Microcephaly 3rd-Percentile Threshold Increment

- Add Vitest coverage for TEST.md §19 microcephaly behavior using a registry-derived skull BPD value between -2 SD and the 3rd percentile.
- Assert `microcephaly` fires at the 3rd-percentile threshold while unrelated ventriculomegaly and posterior-fossa cards remain absent.
- Raise the microcephaly matcher and card wording from -2 SD / 2.5th percentile to the TEST.md §19 3rd-percentile threshold.

## Early Aqueductal-Stenosis Pattern Increment

- Add Vitest coverage for TEST.md §22 Case AS-P2 using bilateral 14 mm atria, third ventricle 5.5 mm, preserved CSP, and normal skull size.
- Assert `hydrocephalus-pattern` fires with moderate VM and `third-v-wide` even when `severe-vm` and `macrocephaly` are absent.
- Add early-evolving triventricular-hydrocephalus impression wording for non-severe VM so the severe-hydrocephalus sentence remains reserved for severe cases.

## HPE 3rd-Percentile Microcephaly Increment

- Add Vitest coverage for an HPE-pattern boundary case with absent CSP, severe VM, preserved CC, and skull BPD between -2 SD and the 3rd percentile.
- Assert `microcephaly` and `hpe-pattern` both fire at the shared TEST.md §19/§16 microcephaly threshold.
- Align the HPE composite and ACC-vs-HPE suppression threshold with the 3rd-percentile microcephaly cutoff.

## PCH Vermis-Support Increment

- Add Vitest coverage for TEST.md §17 wording that small pons combined with vermian reduction can trigger `pch-pattern` even when TCD is preserved.
- Use registry-derived pons and vermis values below the fifth percentile with a normal TCD to isolate the vermis-support path.
- Update the PCH composite matcher and trigger label to accept small pons plus either small TCD or the lowest entered small vermis axis.

## BP6 TVA-60 Dandy-Walker Increment

- Add Vitest coverage for TEST.md §8 Case BP6: small vermis plus TVA 60 degrees should fire `dwm-pattern` even with preserved TCD and pons.
- Keep the existing lower-borderline TVA negative control intact so TVA values below 60 degrees still require additional posterior-fossa support.
- Relax only the Dandy-Walker moderate-TVA support rule at 60 degrees and above.

## HPE Qualitative-Toggle Increment

- Add Vitest coverage for TEST.md §16 Case HPE3 behavior: mild-range VM plus absent CSP and microcephaly should not fire `hpe-pattern` unless qualitative HPE findings are entered.
- Introduce a `qualitative_hpe_panel` matcher path, mirroring the existing qualitative CMV/MCM test values.
- Keep the existing severe-VM quantitative HPE path and 3rd-percentile microcephaly threshold intact.

## HA1 Hemispheric-Disruption Report Increment

- Add Vitest coverage for TEST.md §24 Case HA1 using right brain-OFD reduction with right-sided ventricular enlargement and marked ventricular asymmetry.
- Assert `brain-asym`, `asym-vent`, and a VM card fire together and the report suggests unilateral encephaloclastic insult or porencephaly.
- Add a report-level combined-pattern impression that outranks generic asymmetric ventriculomegaly wording when cerebral hemispheric asymmetry is present.

## HPE Plus DWM Report Increment

- Add Vitest coverage for a TEST.md §16/§27 simultaneous HPE and Dandy-Walker case using registry-derived microcephaly and vermian hypoplasia values.
- Assert `hpe-pattern` and `dwm-pattern` both fire and the report impression mentions both combined patterns.
- Add an HPE+DWM report override parallel to the existing ACC+DWM combined-pattern wording.

## LP2 Pons-Macrocephaly Overgrowth Report Increment

- Add Vitest coverage for TEST.md §18 Case LP2 using registry-derived large pons and macrocephaly values.
- Assert `pons-large` and `macrocephaly` fire together without hydrocephalus.
- Add a report-level overgrowth impression for large pons plus macrocephaly, keeping hydrocephalus-driven macrocephaly suppressed.

## LP4 Pons-Macrocerebellum Overgrowth Report Increment

- Add Vitest coverage for TEST.md §18 Case LP4 using registry-derived large pons and large TCD values.
- Assert `pons-large` and `tcd-large` fire together without macrocephaly or thick CC.
- Add a report-level overgrowth impression for large pons plus macrocerebellum.

## STRESS1 Consensus-Zero Mu Increment

- Add Vitest coverage for TEST.md §27 Case STRESS1 by filling every reportable parameter with `mu(parameter, 28w)`.
- Assert no DDx cards fire and every resulting consensus z-score is within 0.05 SD of zero, including multi-source posterior-fossa rows.
- Update the exported multi-source `mu`/`sigma` helpers so generated fixtures invert the runtime consensus-z calculation.

## SPEC 4.7 RES Qualitative Trigger Increment

- Add Vitest coverage for SPEC.md §4.7 rhombencephalosynapsis detection using small TCD plus an entered absent-primary-fissure qualitative flag.
- Assert the qualitative flag is required: small TCD alone still does not fire the RES composite card.
- Add a minimal `res-pattern` differential card that shares the TCD smallness logic and links the qualitative primary-fissure finding in its trigger label.

## SPEC 4.7 Cisterna-Magna Depth Increment

- Add Vitest coverage for SPEC.md §4.7 numeric cisterna magna depth: >10 mm should trigger the mega cisterna magna / Blake's pouch differential.
- Assert the threshold is strict so exactly 10 mm remains negative.
- Add a minimal `mega-cisterna-magna` card with deterministic benign-variant report wording.

## SPEC 4.7 Posterior-Fossa Auxiliary Inputs Increment

- Add Vitest coverage that the UI-facing auxiliary measurement registry includes `cisterna_magna_depth` in millimetres and `tva` in degrees.
- Keep these auxiliary inputs separate from the z-scored `PARAMETERS_ALL` registry so stress fixtures and source-consensus reporting remain unchanged.
- Render the auxiliary rows in the posterior-fossa worksheet section using raw-value input rows that can feed existing threshold-based DDx logic.

## SPEC 4.7 Colpocephaly Comparison Increment

- Add Vitest coverage for the SPEC.md §4.7 anterior/posterior ventricle comparison: atrial diameter >10 mm plus a normal same-side frontal horn should fire a colpocephaly card.
- Add negative controls so atrial diameter alone and atrial diameter with an enlarged frontal horn do not fire the colpocephaly card.
- Add raw frontal-horn auxiliary inputs and a minimal colpocephaly differential card without changing existing ACC or ventriculomegaly thresholds.

## TEST 8 Blake's-Pouch Advisory Toggle Increment

- Add Vitest coverage for TEST.md §8 Blake's pouch guidance: elevated TVA with normal vermis should stay negative without the qualitative advisory toggle.
- Assert `qualitative_blakes_pouch_panel` fires a low-severity Blake's pouch differential card while preserving the existing no-DWM behavior.
- Add deterministic report wording for the advisory card without turning TVA alone into a quantitative trigger.

## TEST 27 STRESS5 DWM Fallback Increment

- Add Vitest coverage for TEST.md §27 Case STRESS5, asserting the multi-card severe-malformation fixture includes `dwm-pattern` alongside HPE and PCH.
- Keep the fallback narrower than generic PCH by requiring small vermis, small TCD, small pons, and third-ventricle dilation when TVA is unavailable.
- Align the approximate direct extra-axial CSF curve so the TEST.md §27 STRESS5 5.5 mm value at 26 weeks fires `extra-axial-wide`.
- Preserve existing TVA-based Dandy-Walker paths and the PCH-only fixtures without third-ventricle support.
