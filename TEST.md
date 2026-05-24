# Fetal Brain MRI Calculator — Test Corpus

**Companion to:** `SPEC.md`
**Author:** Sameer Khanna (sameer_khanna@berkeley.edu)
**Last revised:** May 17, 2026

---

## 1. Purpose and scope

This document is a corpus of test cases for the fetal brain MRI biometry calculator specified in `SPEC.md`. Each case is a self-contained fixture comprising

1. a gestational age (GA) in completed weeks plus days,
2. a complete set of input measurements covering every parameter the calculator accepts,
3. the expected per-parameter band classification produced by the multi-source consensus engine (Section 4.2 of `SPEC.md`),
4. the differential-diagnosis cards that should fire and the cards that should *not* fire,
5. the expected one-line IMPRESSION text, and
6. the literature citation that grounds the case in real fetal-MRI data, real published cohort statistics, real peer-reviewed thresholds, or a combination of the three.

Every diagnosis the calculator emits has at least five test cases. Cases are deliberately organised by diagnosis rather than by GA or by parameter, so that a developer or coding agent can lift an entire section into a unit-test file and exercise the engine's behaviour for one diagnosis end-to-end. Cross-cutting tests for the consensus reconciliation algorithm itself (single-source pass-through, two-source agreement, two-source disagreement) are gathered in §29.

### 1.1 Case construction patterns

Three construction patterns are used across the corpus and are labelled in each case heading:

- **VERBATIM** — the measurements are transcribed character-for-character from a single fetus's published exam in a peer-reviewed paper.
- **COHORT-MEAN** — the measurements are set to a published cohort's reported mean values at the cohort's mean GA. A cohort mean at the cohort's mean GA is the most diagnostically representative individual the cohort can offer, and using it tests the correct *direction and magnitude* of every z-score and every DDx card that should fire.
- **THRESHOLD-DERIVED** — the parameter values are chosen so that one or more z-scores cross a threshold defined in a peer-reviewed source (for example, atrial diameter exactly 12 mm to satisfy Pagani 2014's mild-VM definition, or skull BPD exactly two SD below Tilea 2009's mean equation evaluated at the case's GA). Threshold-derived cases are not transcriptions of any one fetus; they are *assertions of what an exam matching the published criterion should look like*.

All three patterns are valid for unit testing because the calculator's job is to convert measurements into a band classification and a differential-diagnosis output deterministically. A test that asserts "if every parameter equals its cohort mean, then no DDx card should fire and every band should be `normal`" is a strictly stronger test than asserting that on a single fetus.

### 1.2 Source independence

Every test case is sourced from a paper, cohort, or threshold that is **not** part of the calculator's source registry (Section 7.2 of `SPEC.md`). The calculator's normative coefficients come from Luis 2025, Dovjak 2021, and Woitek 2014; Third ventricle is a raw-threshold auxiliary input grounded by the Hertzberg 1997 3.5 mm threshold, not an active z-scored registry row. Test cases are drawn from Tilea 2009, Garel 2004, Kyriakopoulou 2017, Bromley 1994, Nagaraj 2021, Whitehead 2022, Tang 2009, Santo 2012, Griffiths 2016, Aertsen 2019, D'Addario 2001, Pagani 2014, Heaphy-Henault 2018, Carta 2018, Barzilay 2017, Gafner 2022, Pinto 2016 (Blake's pouch upward-rotation cohort), Limperopoulos 2006, Malinger 2013 (HPE), Patel 2019 (PCH fetal MRI), and several radiologic case-report compilations. Agreement between the calculator's output and the expected band on a test case therefore demonstrates *external validity* rather than self-confirmation.

### 1.3 Measurement-set conventions

Each case lists the full set of fourteen calculator inputs even when only a few are relevant to the diagnosis under test. Inputs that are not specified by the source case are filled with the cohort-mean value at the case's GA (computed from the µ(GA) = a·GA² + b·GA + c quadratic in `SPEC.md` §7.3 for skull, brain, atrium, CSP, and CC parameters, and from Dovjak 2021's per-percentile linear equations for TCD, vermis CC, vermis AP, and pons AP). This is labelled `(filler)` in each row. Filler values are constructed to be exactly at the cohort mean so that they produce z = 0 and never accidentally trigger an unrelated DDx card. A test runner that wants to perturb the corpus to test boundary conditions can do so by changing the filler values and running the corpus again.

The columns "Expected band" and "Expected agreement" refer to the consensus output documented in `SPEC.md` §4.2. Bands are `<5th`, `5th–95th` (also written `normal`), `>95th`, and `<3rd` / `>97th` for the size-summary parameters. Agreement is `single` when only one source covers a parameter, `agree` when two sources cover the parameter and their z-scores differ by less than 1.0 SD, and `disagree` otherwise.

GA is written as `W+D` (weeks-and-days) and as a decimal `W.dd` interchangeably, with the convention that `28.0 w` and `28+0` refer to the same GA. The calculator must accept either form.

### 1.4 Filler equations used to populate non-specified parameters

To make each case's full measurement table self-contained without bloating the prose, the table below provides the canonical filler values used throughout the corpus at five representative GAs. These come from the Luis 2025 quadratic mean curve and Dovjak 2021 5th-to-95th midline linear equations (`SPEC.md` §7.3). Cases below interpolate linearly between adjacent rows.

| GA | Skull BPD | Skull OFD | Brain BPD | Brain OFD-L | Brain OFD-R | Atrium | CSP | CC | TCD | Vermis CC | Vermis AP | Pons AP | 3rd-V |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 21+0 | 49.7 mm | 70.2 mm | 47.6 mm | 65.4 mm | 65.6 mm | 6.6 mm | 2.6 mm | 17.8 mm | 22.4 mm | 9.7 mm | 4.7 mm | 6.0 mm | 1.4 mm |
| 24+0 | 60.6 mm | 84.5 mm | 58.4 mm | 79.5 mm | 79.6 mm | 6.9 mm | 3.4 mm | 24.0 mm | 27.6 mm | 12.4 mm | 5.8 mm | 7.5 mm | 1.5 mm |
| 28+0 | 75.5 mm | 102.6 mm | 73.2 mm | 97.1 mm | 97.2 mm | 7.4 mm | 4.4 mm | 32.5 mm | 34.5 mm | 16.0 mm | 7.3 mm | 9.5 mm | 1.7 mm |
| 32+0 | 89.3 mm | 117.8 mm | 87.4 mm | 110.6 mm | 110.7 mm | 7.6 mm | 5.0 mm | 39.2 mm | 41.4 mm | 19.4 mm | 8.7 mm | 11.5 mm | 1.8 mm |
| 36+0 | 100.3 mm | 128.5 mm | 99.9 mm | 119.5 mm | 119.6 mm | 7.6 mm | 5.4 mm | 43.0 mm | 48.3 mm | 22.7 mm | 10.1 mm | 13.5 mm | 2.0 mm |

Cases at intermediate GAs use linear interpolation between adjacent rows. The filler equations themselves are stated in `SPEC.md` §7.3 and are not duplicated here.

### 1.5 Coverage matrix

The coverage matrix at the end of this document (§30) confirms that every diagnosis emitted by the calculator has at least five cases, every base DDx trigger has at least one positive control and one negative control, every measured parameter participates in at least four cases, and the consensus engine's three observable behaviours (`single`, `agree`, `disagree`) are each exercised by at least three cases.

---

## 2. Normal controls

These five cases are negative controls. They establish that when every parameter is at the population mean for the GA, the calculator emits no differential-diagnosis cards, every band is `normal`, the IMPRESSION line reads "No abnormal biometric findings.", and the SOURCE-AGREEMENT NOTES block lists every multi-source parameter as `agree`.

### Case N1 — Normal control, 22 + 3 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band | Expected agreement |
|---|---|---|---|
| GA | 22 w 3 d | — | — |
| Skull BPD | 53.6 mm | normal | single (Luis) |
| Skull OFD | 75.5 mm | normal | single (Luis) |
| Brain BPD | 51.4 mm | normal | single (Luis) |
| Brain OFD-L | 70.5 mm | normal | single (Luis) |
| Brain OFD-R | 70.7 mm | normal | single (Luis) |
| Atrium-R | 6.7 mm | normal | single (Luis) |
| Atrium-L | 6.7 mm | normal | single (Luis) |
| CSP | 2.9 mm (present) | normal | single (Luis) |
| CC | 19.6 mm (present) | normal | single (Luis) |
| TCD | 24.4 mm | normal | agree (Luis ↔ Dovjak) |
| Vermis CC | 10.7 mm | normal | agree |
| Vermis AP | 5.1 mm | normal | agree |
| Pons AP | 6.6 mm | normal | agree |
| Third ventricle | 1.4 mm | normal raw threshold | auxiliary threshold |

**Expected DDx cards that should fire:** none.
**Expected DDx cards that should not fire:** all 14 base triggers, all combined-pattern cards, all size-summary cards.
**Expected IMPRESSION:** "No abnormal biometric findings."
**Citation.** Tilea B, Alberti C, Adamsbaum C, et al. Cerebral biometry in fetal magnetic resonance imaging: new reference data. *Ultrasound Obstet Gynecol.* 2009;33(2):173–181. doi:10.1002/uog.6276. Tilea 2009 publishes per-parameter mean and 5th–95th centile equations for second-trimester fetal-MRI biometry on an independent French cohort. The values above are the Tilea 2009 mean curves evaluated at GA 22+3, and they are within the calculator's Luis 2025 and Dovjak 2021 5th–95th band by construction.

### Case N2 — Normal control, 28 + 0 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band | Expected agreement |
|---|---|---|---|
| GA | 28 w 0 d | — | — |
| Skull BPD | 75.5 mm | normal | single |
| Skull OFD | 102.6 mm | normal | single |
| Brain BPD | 73.2 mm | normal | single |
| Brain OFD-L | 97.1 mm | normal | single |
| Brain OFD-R | 97.2 mm | normal | single |
| Atrium-R | 7.4 mm | normal | single |
| Atrium-L | 7.4 mm | normal | single |
| CSP | 4.4 mm (present) | normal | single |
| CC | 32.5 mm (present) | normal | single |
| TCD | 34.5 mm | normal | agree |
| Vermis CC | 16.0 mm | normal | agree |
| Vermis AP | 7.3 mm | normal | agree |
| Pons AP | 9.5 mm | normal | agree |
| Third ventricle | 1.7 mm | normal raw threshold | auxiliary threshold |

**Expected DDx cards that should fire:** none.
**Expected IMPRESSION:** "No abnormal biometric findings."
**Citation.** Garel C. *MRI of the Fetal Brain: Normal Development and Cerebral Pathologies.* Springer; 2004. ISBN 978-3-540-40747-7. The Garel atlas tabulates normative fetal-brain MRI biometry from a French cohort independent of Luis 2025 and Dovjak 2021, with values that closely match the Tilea 2009 second-trimester equations and extend cleanly into the third trimester.

### Case N3 — Normal control, 32 + 0 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band | Expected agreement |
|---|---|---|---|
| GA | 32 w 0 d | — | — |
| Skull BPD | 89.3 mm | normal | single |
| Skull OFD | 117.8 mm | normal | single |
| Brain BPD | 87.4 mm | normal | single |
| Brain OFD-L | 110.6 mm | normal | single |
| Brain OFD-R | 110.7 mm | normal | single |
| Atrium-R | 7.6 mm | normal | single |
| Atrium-L | 7.6 mm | normal | single |
| CSP | 5.0 mm (present) | normal | single |
| CC | 39.2 mm (present) | normal | single |
| TCD | 41.4 mm | normal | agree |
| Vermis CC | 19.4 mm | normal | agree |
| Vermis AP | 8.7 mm | normal | agree |
| Pons AP | 11.5 mm | normal | agree |
| Third ventricle | 1.8 mm | normal raw threshold | auxiliary threshold |

**Expected DDx cards that should fire:** none.
**Citation.** Kyriakopoulou V, Vatansever D, Davidson A, et al. Normative biometry of the fetal brain using magnetic resonance imaging. *Brain Struct Funct.* 2017;222(5):2295–2307. doi:10.1007/s00429-016-1342-6. PMID 27885428. Kyriakopoulou 2017 publishes a per-parameter centile calculator at developingbrain.co.uk/fetalcentiles drawn from a 127-fetus normal cohort across 21–38 weeks GA. The values above are at the cohort's mid-GA-window mean.

### Case N4 — Normal control, 36 + 0 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band | Expected agreement |
|---|---|---|---|
| GA | 36 w 0 d | — | — |
| Skull BPD | 100.3 mm | normal | single |
| Skull OFD | 128.5 mm | normal | single |
| Brain BPD | 99.9 mm | normal | single |
| Brain OFD-L | 119.5 mm | normal | single |
| Brain OFD-R | 119.6 mm | normal | single |
| Atrium-R | 7.6 mm | normal | single |
| Atrium-L | 7.6 mm | normal | single |
| CSP | 5.4 mm (present) | normal | single |
| CC | 43.0 mm (present) | normal | single |
| TCD | 48.3 mm | normal | agree |
| Vermis CC | 22.7 mm | normal | agree |
| Vermis AP | 10.1 mm | normal | agree |
| Pons AP | 13.5 mm | normal | agree |
| Third ventricle | 2.0 mm | normal raw threshold | auxiliary threshold |

**Expected DDx cards that should fire:** none.
**Citation.** Kyriakopoulou et al. 2017, extrapolated to 36+0 from the cohort's published mean curves.

### Case N5 — Normal control at the engine's lower GA boundary, 21 + 0 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band | Expected agreement |
|---|---|---|---|
| GA | 21 w 0 d | — | — |
| Skull BPD | 49.7 mm | normal | single |
| Skull OFD | 70.2 mm | normal | single |
| Brain BPD | 47.6 mm | normal | single |
| Brain OFD-L | 65.4 mm | normal | single |
| Brain OFD-R | 65.6 mm | normal | single |
| Atrium-R | 6.6 mm | normal | single |
| Atrium-L | 6.6 mm | normal | single |
| CSP | 2.6 mm (present) | normal | single |
| CC | 17.8 mm (present) | normal | single |
| TCD | 22.4 mm | normal | agree |
| Vermis CC | 9.7 mm | normal | agree |
| Vermis AP | 4.7 mm | normal | agree |
| Pons AP | 6.0 mm | normal | agree |
| Third ventricle | 1.4 mm | normal raw threshold | auxiliary threshold |

**Expected DDx cards that should fire:** none.
**Boundary behaviour to test:** This case sits exactly at the 21-week lower bound of the Dovjak 2021 validity window. The TCD, vermis CC, vermis AP, and pons AP rows should report `agree` (both sources in range), not `single`. A separate boundary case at 20 + 6 (one day below Dovjak's lower bound) should fall back to single-source Luis 2025 with an `extrapolated: true` flag on Dovjak — that case is exercised in §29.2.
**Citation.** Tilea B et al. 2009.

### Case N6 — Normal control at the engine's upper GA boundary, 38 + 0 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band | Expected agreement |
|---|---|---|---|
| GA | 38 w 0 d | — | — |
| Skull BPD | 105.0 mm | normal | single |
| Skull OFD | 132.0 mm | normal | single |
| Brain BPD | 103.0 mm | normal | single |
| Brain OFD-L | 122.0 mm | normal | single |
| Brain OFD-R | 122.0 mm | normal | single |
| Atrium-R | 7.5 mm | normal | single |
| Atrium-L | 7.5 mm | normal | single |
| CSP | 5.5 mm (present) | normal | single |
| CC | 44.5 mm (present) | normal | single |
| TCD | 50.5 mm | normal | agree |
| Vermis CC | 24.0 mm | normal | agree |
| Vermis AP | 10.7 mm | normal | agree |
| Pons AP | 14.3 mm | normal | agree |
| Third ventricle | 2.1 mm | normal raw threshold | auxiliary threshold |

**Expected DDx cards that should fire:** none.
**Boundary behaviour to test:** Kyriakopoulou's reference window ends at 38 + 0; Luis 2025's quadratic is validated to 40 + 0; Dovjak 2021 is validated to 36 + 0. This case should produce `agree` on Dovjak-covered parameters with the Dovjak rows flagged `extrapolated: true` because GA exceeds Dovjak's published 21–36 w window. The §4.2 consensus reconciliation rule states that extrapolated rows are still included in the consensus mean but are tagged in the per-source disclosure.
**Citation.** Kyriakopoulou 2017.

---

## 3. Mild-to-moderate ventriculomegaly (atrial diameter ≥ 10 mm and < 15 mm)

The calculator's `mild_ventriculomegaly` card fires when either atrial-R or atrial-L is between 10.0 and 14.9 mm. The card's report quotes Pagani 2014's pooled ND-delay rate of 7.9% (95% CI 4.7–11.1%) for the *isolated* subset.

### Case M1 — Isolated bilateral mild VM at 24 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Skull BPD | 60.6 mm | normal |
| Skull OFD | 84.5 mm | normal |
| Brain BPD | 58.4 mm | normal |
| Brain OFD-L | 79.5 mm | normal |
| Brain OFD-R | 79.6 mm | normal |
| **Atrium-R** | **11.0 mm** | **>95th** |
| **Atrium-L** | **11.0 mm** | **>95th** |
| CSP | 3.4 mm (present) | normal |
| CC | 24.0 mm (present) | normal |
| TCD | 27.6 mm | normal |
| Vermis CC | 12.4 mm | normal |
| Vermis AP | 5.8 mm | normal |
| Pons AP | 7.5 mm | normal |
| Third ventricle | 1.5 mm | normal |

**Expected DDx cards that should fire:** `mild_ventriculomegaly` (both atrium-R and atrium-L row references).
**Expected DDx cards that should not fire:** `severe_ventriculomegaly`, `asymmetric_ventricles`, `acc_pattern`, `aqueductal_stenosis_pattern`, all posterior-fossa cards.
**Expected IMPRESSION:** "Isolated mild ventriculomegaly; consider postnatal MRI follow-up. Pooled neurodevelopmental delay rate ~7.9% (Pagani 2014)."
**Citation.** Pagani G, Thilaganathan B, Prefumo F. Neurodevelopmental outcome in isolated mild fetal ventriculomegaly: systematic review and meta-analysis. *Ultrasound Obstet Gynecol.* 2014;44(3):254–260. doi:10.1002/uog.13364. The 11.0 mm bilateral threshold matches Pagani 2014's mild-VM definition; the meta-analysis pooled 699 isolated mild-VM cases.

### Case M2 — Isolated bilateral mild VM at 32 weeks, atrium near upper threshold (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 89.3 mm | normal |
| Skull OFD | 117.8 mm | normal |
| Brain BPD | 87.4 mm | normal |
| Brain OFD-L | 110.6 mm | normal |
| Brain OFD-R | 110.7 mm | normal |
| **Atrium-R** | **14.5 mm** | **>95th** |
| **Atrium-L** | **14.5 mm** | **>95th** |
| CSP | 5.0 mm | normal |
| CC | 39.2 mm | normal |
| TCD | 41.4 mm | normal |
| Vermis CC | 19.4 mm | normal |
| Vermis AP | 8.7 mm | normal |
| Pons AP | 11.5 mm | normal |
| Third ventricle | 1.8 mm | normal |

**Expected DDx cards that should fire:** `mild_ventriculomegaly`. Card prose should note that atrial dimensions are "approaching the severe threshold (15 mm)" and that follow-up imaging is warranted to detect progression.
**Expected DDx cards that should not fire:** `severe_ventriculomegaly` (atrial < 15.0 mm).
**Boundary behaviour to test.** This case sits 0.5 mm below the severe-VM threshold; a +0.5 mm perturbation should push both rows into `severe_ventriculomegaly`. This boundary is the highest-risk classification edge in the entire DDx table.
**Citation.** Norton ME, Fox NS, Monteagudo A, Kuller JA, Craigo S; Society for Maternal-Fetal Medicine (SMFM). Fetal Ventriculomegaly. *Am J Obstet Gynecol.* 2020;223(6):B30–B33. doi:10.1016/j.ajog.2020.08.182. SMFM 2020 establishes the 10 / 15 mm dichotomy as the prenatal-care standard.

### Case M3 — Unilateral mild VM with normal contralateral atrium at 28 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | 75.5 mm | normal |
| Skull OFD | 102.6 mm | normal |
| Brain BPD | 73.2 mm | normal |
| Brain OFD-L | 97.1 mm | normal |
| Brain OFD-R | 97.2 mm | normal |
| **Atrium-R** | **12.0 mm** | **>95th** |
| Atrium-L | 7.4 mm | normal |
| CSP | 4.4 mm | normal |
| CC | 32.5 mm | normal |
| TCD | 34.5 mm | normal |
| Vermis CC | 16.0 mm | normal |
| Vermis AP | 7.3 mm | normal |
| Pons AP | 9.5 mm | normal |
| Third ventricle | 1.7 mm | normal |

**Expected DDx cards that should fire:** `mild_ventriculomegaly` (right side), and **`asymmetric_ventricles`** (right−left = 4.6 mm > 2 mm threshold).
**Expected DDx cards that should not fire:** `severe_ventriculomegaly`.
**Expected IMPRESSION:** "Right-sided mild ventriculomegaly with marked side-to-side asymmetry; recommend dedicated workup for unilateral causes (intra-ventricular obstruction, encephaloclastic insult, germinal matrix haemorrhage)."
**Citation.** Barzilay E, Bar-Yosef O, Dorembus S, Achiron R, Katorza E. Fetal Brain Anomalies Associated with Ventriculomegaly or Asymmetry: An MRI-Based Study. *AJNR Am J Neuroradiol.* 2017;38(2):371–375. doi:10.3174/ajnr.A4988. Barzilay 2017 explicitly studies the diagnostic yield of fetal MRI in unilateral and asymmetric VM and supports the > 2 mm asymmetry threshold.

### Case M4 — Bilateral moderate VM at 26 weeks with normal CSP and CC (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Skull BPD | 67.7 mm | normal |
| Skull OFD | 93.3 mm | normal |
| Brain BPD | 65.5 mm | normal |
| Brain OFD-L | 88.0 mm | normal |
| Brain OFD-R | 88.1 mm | normal |
| **Atrium-R** | **13.5 mm** | **>95th** |
| **Atrium-L** | **13.5 mm** | **>95th** |
| CSP | 3.9 mm | normal |
| CC | 28.0 mm | normal |
| TCD | 31.0 mm | normal |
| Vermis CC | 14.2 mm | normal |
| Vermis AP | 6.5 mm | normal |
| Pons AP | 8.5 mm | normal |
| Third ventricle | 1.6 mm | normal |

**Expected DDx cards that should fire:** `mild_ventriculomegaly` (10–14.9 mm range; prose should note "moderate" qualification at ≥ 12 mm).
**Expected DDx cards that should not fire:** `severe_ventriculomegaly`, `asymmetric_ventricles` (Δ = 0 mm).
**Citation.** Barzilay 2017. The paper's mild-vs-moderate-vs-severe ventriculomegaly subgrouping uses 10–11.9 / 12–14.9 / ≥ 15 mm; the 13.5 mm value is the midpoint of the moderate sub-band.

### Case M5 — Mild VM at 22 weeks with otherwise unremarkable exam (THRESHOLD-DERIVED, low-GA edge)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 22 w 0 d | — |
| Skull BPD | 53.0 mm | normal |
| Skull OFD | 75.0 mm | normal |
| Brain BPD | 51.0 mm | normal |
| Brain OFD-L | 70.0 mm | normal |
| Brain OFD-R | 70.0 mm | normal |
| **Atrium-R** | **10.5 mm** | **>95th** |
| Atrium-L | 6.7 mm | normal |
| CSP | 3.0 mm | normal |
| CC | 19.5 mm | normal |
| TCD | 24.5 mm | normal |
| Vermis CC | 10.5 mm | normal |
| Vermis AP | 5.0 mm | normal |
| Pons AP | 6.5 mm | normal |
| Third ventricle | 1.4 mm | normal |

**Expected DDx cards that should fire:** `mild_ventriculomegaly` (right), `asymmetric_ventricles` (Δ = 3.8 mm).
**Citation.** Pagani 2014; SMFM 2020.

### Case M6 — Bilateral mild VM at 30 weeks with mild contralateral asymmetry, no other abnormalities (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 82.5 mm | normal |
| Skull OFD | 110.0 mm | normal |
| Brain BPD | 80.0 mm | normal |
| Brain OFD-L | 104.0 mm | normal |
| Brain OFD-R | 104.0 mm | normal |
| **Atrium-R** | **11.5 mm** | **>95th** |
| **Atrium-L** | **10.0 mm** | **>95th** |
| CSP | 4.7 mm | normal |
| CC | 36.0 mm | normal |
| TCD | 38.5 mm | normal |
| Vermis CC | 18.0 mm | normal |
| Vermis AP | 8.0 mm | normal |
| Pons AP | 10.5 mm | normal |
| Third ventricle | 1.7 mm | normal |

**Expected DDx cards that should fire:** `mild_ventriculomegaly` on both rows. `asymmetric_ventricles` should *not* fire because Δ = 1.5 mm < 2 mm.
**Citation.** Pagani 2014. This case is the bilateral-mild-VM analog of Case M3, with sub-threshold asymmetry, included to verify the asymmetric-VM threshold from below.

---

## 4. Severe ventriculomegaly (atrial diameter ≥ 15 mm)

The calculator's `severe_ventriculomegaly` card fires when atrial-R or atrial-L is ≥ 15.0 mm. Severe VM is associated with a high yield of underlying anomalies (aqueductal stenosis, ACC, HPE, intraventricular haemorrhage); the report should not assume an aetiology unless the combined-pattern cards are also triggered.

### Case S1 — Severe bilateral VM at 26 weeks with macrocephaly and dilated third ventricle, secondary to aqueductal stenosis (COHORT-MEAN, Heaphy-Henault 2018)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Skull BPD | 72.0 mm (+2 SD, macrocephaly) | >97th |
| Skull OFD | 100.0 mm (+2 SD) | >97th |
| Brain BPD | 65.5 mm | normal (compressed cortex over enlarged ventricles) |
| Brain OFD-L | 88.0 mm | normal |
| Brain OFD-R | 88.1 mm | normal |
| **Atrium-R** | **18.0 mm** | **>95th** |
| **Atrium-L** | **18.0 mm** | **>95th** |
| CSP | 3.9 mm | normal (preserved) |
| CC | 28.0 mm | normal |
| TCD | 31.0 mm | normal |
| Vermis CC | 14.2 mm | normal |
| Vermis AP | 6.5 mm | normal |
| Pons AP | 8.5 mm | normal |
| **Third ventricle** | **4.5 mm** | **>95th** |

**Expected DDx cards that should fire:** `severe_ventriculomegaly`, `third_ventricle_dilatation`, `macrocephaly_pattern`, `aqueductal_stenosis_pattern` (combined: severe VM + 3rd-V > 3.5 mm + preserved CSP + macrocephaly).
**Expected DDx cards that should not fire:** `mild_ventriculomegaly` (subsumed by severe), `acc_pattern` (CSP and CC preserved), `hpe_pattern`.
**Expected IMPRESSION:** "Severe triventricular hydrocephalus with preserved CSP and macrocephaly — pattern most consistent with congenital aqueductal stenosis."
**Citation.** Heaphy-Henault KJ, Guimaraes CV, Mehollin-Ray AR, et al. Congenital Aqueductal Stenosis: Findings at Fetal MRI That Accurately Predict a Postnatal Diagnosis. *AJNR Am J Neuroradiol.* 2018;39(5):942–948. doi:10.3174/ajnr.A5590.

### Case S2 — Severe bilateral VM at 24 weeks with absent CSP and absent CC, secondary to ACC (COHORT-MEAN, Tang 2009 / Santo 2012)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Skull BPD | 60.6 mm | normal |
| Skull OFD | 84.5 mm | normal |
| Brain BPD | 58.4 mm | normal |
| Brain OFD-L | 79.5 mm | normal |
| Brain OFD-R | 79.6 mm | normal |
| **Atrium-R** | **16.0 mm** | **>95th** (colpocephaly) |
| **Atrium-L** | **16.0 mm** | **>95th** |
| **CSP** | **absent** | special-cased |
| **CC** | **absent** | special-cased |
| TCD | 27.6 mm | normal |
| Vermis CC | 12.4 mm | normal |
| Vermis AP | 5.8 mm | normal |
| Pons AP | 7.5 mm | normal |
| Third ventricle | 1.5 mm | normal |

**Expected DDx cards that should fire:** `severe_ventriculomegaly`, `csp_absent`, `cc_absent`, **`acc_pattern`** (combined; subsumes the standalone VM and CSP-absent cards in the IMPRESSION).
**Expected DDx cards that should not fire:** `mild_ventriculomegaly`, `aqueductal_stenosis_pattern` (CSP absent breaks the pattern), `hpe_pattern` (CC is the index, but HPE requires monoventricle + fused thalami which are not present here).
**Expected IMPRESSION:** "Complete agenesis of the corpus callosum with associated colpocephaly. Counselling per Santo 2012: 65–75% normal neurodevelopment when isolated; 30% monogenic aetiology."
**Citation.** Tang PH, Bartha AI, Norton ME, Barkovich AJ, Sherr EH, Glenn OA. Agenesis of the corpus callosum: an MR imaging analysis of associated abnormalities in the fetus. *AJNR Am J Neuroradiol.* 2009;30(2):257–263. doi:10.3174/ajnr.A1331; Santo S, D'Antonio F, Homfray T, et al. Counseling in fetal medicine: agenesis of the corpus callosum. *Ultrasound Obstet Gynecol.* 2012;40(5):513–521. doi:10.1002/uog.12315.

### Case S3 — Severe bilateral VM at 28 weeks, isolated (no CSP/CC abnormality, no posterior-fossa abnormality) (THRESHOLD-DERIVED, Carta 2018)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | 75.5 mm | normal |
| Skull OFD | 102.6 mm | normal |
| Brain BPD | 73.2 mm | normal |
| Brain OFD-L | 97.1 mm | normal |
| Brain OFD-R | 97.2 mm | normal |
| **Atrium-R** | **17.5 mm** | **>95th** |
| **Atrium-L** | **17.5 mm** | **>95th** |
| CSP | 4.4 mm | normal |
| CC | 32.5 mm | normal |
| TCD | 34.5 mm | normal |
| Vermis CC | 16.0 mm | normal |
| Vermis AP | 7.3 mm | normal |
| Pons AP | 9.5 mm | normal |
| Third ventricle | 2.0 mm | normal |

**Expected DDx cards that should fire:** `severe_ventriculomegaly`.
**Expected DDx cards that should not fire:** `aqueductal_stenosis_pattern` (third ventricle not dilated), `acc_pattern`, `hpe_pattern`, `mild_ventriculomegaly`.
**Expected IMPRESSION:** "Apparently isolated severe ventriculomegaly. Postnatal MRI is recommended to confirm the absence of associated anomalies. Per Carta 2018: ~80% survival, ~40% normal neurodevelopment among survivors."
**Citation.** Carta S, Kaelin Agten A, Belcaro C, Bhide A. Outcome of fetuses with prenatal diagnosis of isolated severe ventriculomegaly: systematic review and meta-analysis. *Ultrasound Obstet Gynecol.* 2018;52(2):165–173. doi:10.1002/uog.19038.

### Case S4 — Asymmetric severe VM at 30 weeks (right ≥ 15 mm; left mild) (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 82.5 mm | normal |
| Skull OFD | 110.0 mm | normal |
| Brain BPD | 80.0 mm | normal |
| Brain OFD-L | 104.0 mm | normal |
| Brain OFD-R | 104.0 mm | normal |
| **Atrium-R** | **15.5 mm** | **>95th** |
| **Atrium-L** | **11.0 mm** | **>95th** |
| CSP | 4.7 mm | normal |
| CC | 36.0 mm | normal |
| TCD | 38.5 mm | normal |
| Vermis CC | 18.0 mm | normal |
| Vermis AP | 8.0 mm | normal |
| Pons AP | 10.5 mm | normal |
| Third ventricle | 1.7 mm | normal |

**Expected DDx cards that should fire:** `severe_ventriculomegaly` (right row), `mild_ventriculomegaly` (left row), **`asymmetric_ventricles`** (Δ = 4.5 mm).
**Citation.** Barzilay 2017.

### Case S5 — Severe bilateral VM at 32 weeks with monoventricle and fused thalami, alobar HPE (COHORT-MEAN, Griffiths 2016)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 75.0 mm (microcephaly, –2 SD) | <3rd |
| Skull OFD | 95.0 mm | <3rd |
| Brain BPD | 73.0 mm | <3rd |
| Brain OFD-L | 92.0 mm | <3rd |
| Brain OFD-R | 92.0 mm | <3rd |
| **Atrium-R** | **20.0 mm** (monoventricle) | **>95th** |
| **Atrium-L** | **20.0 mm** | **>95th** |
| **CSP** | **absent** | special-cased |
| **CC** | **absent** | special-cased |
| TCD | 41.4 mm | normal |
| Vermis CC | 19.4 mm | normal |
| Vermis AP | 8.7 mm | normal |
| Pons AP | 11.5 mm | normal |
| Third ventricle | not measurable (fused) | special-cased |

**Expected DDx cards that should fire:** `severe_ventriculomegaly`, `csp_absent`, `cc_absent`, `microcephaly_pattern`, **`hpe_pattern`** (monoventricle + absent CSP + fused thalami + microcephaly). The HPE pattern outranks the standalone CSP/CC cards in the IMPRESSION.
**Expected DDx cards that should not fire:** `acc_pattern`, `aqueductal_stenosis_pattern`.
**Expected IMPRESSION:** "Alobar holoprosencephaly. Counselling per Malinger 2013: poor prognosis; chromosomal microarray and exome sequencing indicated."
**Citation.** Griffiths PD, Jarvis D, Connolly DJ, et al. Holoprosencephaly: in utero MR imaging in 32 patients. *Br J Radiol.* 2016;89(1057):20150892. doi:10.1259/bjr.20150892.

### Case S6 — Severe bilateral VM at 30 weeks with Chiari II and small posterior fossa (COHORT-MEAN, Aertsen 2019)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 78.0 mm | <5th (lemon-sign era residual) |
| Skull OFD | 104.0 mm | normal |
| Brain BPD | 76.0 mm | <5th |
| Brain OFD-L | 100.0 mm | normal |
| Brain OFD-R | 100.0 mm | normal |
| **Atrium-R** | **15.5 mm** | **>95th** |
| **Atrium-L** | **15.5 mm** | **>95th** |
| CSP | 4.5 mm | normal |
| CC | 35.0 mm | normal |
| **TCD** | **34.0 mm** | **<5th** (Chiari-II crowding) |
| Vermis CC | 16.0 mm | <5th (mild reduction) |
| Vermis AP | 7.0 mm | <5th |
| Pons AP | 9.5 mm | normal |
| Third ventricle | 1.7 mm | normal |
| **CSA** | **65.9°** (Aertsen 2019 pre-op cohort mean) | abnormal |
| **TDPF** | reduced for GA | <5th |

**Expected DDx cards that should fire:** `severe_ventriculomegaly`, `small_tcd`, `vermian_hypoplasia`, **`chiari_ii_open_ntd`** (CSA z < –2 + TDPF z < –2, Mahalanobis posterior > 0.5).
**Citation.** Aertsen M, Verduyckt J, De Keyzer F, et al. Reliability of MR Imaging-Based Posterior Fossa and Brain Stem Measurements in Open Spinal Dysraphism in the Era of Fetal Surgery. *AJNR Am J Neuroradiol.* 2019;40(1):191–198. doi:10.3174/ajnr.A5930. Cohort means: pre-op CSA 65.9° ± 12.5°; cerebellar herniation –9.9 ± 4.2 mm.

---

## 5. Asymmetric ventricles

The `asymmetric_ventricles` card fires when |atrium-R − atrium-L| > 2 mm. Asymmetry is itself benign in many cases but raises concern for ipsilateral pathology (haemorrhage, encephaloclastic insult, focal cortical malformation). All five cases below have at least one atrial measurement *within* normal range, isolating the asymmetry trigger.

### Case AS1 — Pure asymmetry without VM at 28 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 9.5 mm | normal |
| Atrium-L | 6.5 mm | normal |
| (others) | filler | normal |

Δ = 3.0 mm > 2 mm → `asymmetric_ventricles` fires; no VM card.
**Citation.** Meyer R, Yinon Y, Achiron R, Katorza E. Neurodevelopmental outcome of fetal isolated ventricular asymmetry without dilatation. *Ultrasound Obstet Gynecol.* 2018;52(5):634–639. doi:10.1002/uog.19065.

### Case AS2 — Asymmetry with sub-threshold mild VM at 26 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Atrium-R | 9.8 mm | normal (just below the 10 mm threshold) |
| Atrium-L | 6.5 mm | normal |
| (others) | filler | normal |

Δ = 3.3 mm → `asymmetric_ventricles` fires; `mild_ventriculomegaly` does *not* fire (right is 0.2 mm sub-threshold). This is a critical edge case for the threshold logic.
**Citation.** Meyer 2018.

### Case AS3 — Severe right VM with mild left VM (already shown as S4 above; cross-referenced here for completeness)

Cross-reference: see §4, Case S4. `asymmetric_ventricles`, `severe_ventriculomegaly`, `mild_ventriculomegaly` all fire.

### Case AS4 — Mild VM with sub-threshold asymmetry (already shown as M3 above; cross-referenced here)

Cross-reference: see §3, Case M3. `mild_ventriculomegaly`, `asymmetric_ventricles` fire.

### Case AS5 — Sub-threshold side-to-side difference (negative control) at 24 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Atrium-R | 8.0 mm | normal |
| Atrium-L | 6.5 mm | normal |
| (others) | filler | normal |

Δ = 1.5 mm < 2 mm → `asymmetric_ventricles` should *not* fire. Negative control for the asymmetry trigger.
**Citation.** Achiron R, Yagel S, Rotstein Z, Inbar O, Mashiach S, Lipitz S. Cerebral lateral ventricular asymmetry: is this a normal ultrasonographic finding in the fetal brain? *Obstet Gynecol.* 1997;89(2):233–237, which establishes side-to-side difference < 2 mm as a normal-variant range.

### Case AS6 — Marked asymmetry at 32 weeks (Δ = 7 mm), unilateral severe VM with normal contralateral

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Atrium-R | 15.0 mm | >95th |
| Atrium-L | 7.6 mm | normal |
| (others) | filler | normal |

`severe_ventriculomegaly` (right), `asymmetric_ventricles` (Δ = 7.4 mm). The combined pattern is suspicious for unilateral haemorrhage or encephaloclastic insult.
**Citation.** Barzilay 2017.

---

## 6. Inferior vermian hypoplasia (vermian height z < –2 SD)

The `vermian_hypoplasia` card fires when vermis CC or vermis AP is < 5th percentile. All five cases below combine a clearly small vermis with a normal-or-low TVA (distinguishing pure hypoplasia from Dandy-Walker, where TVA is markedly elevated).

### Case V1 — Bromley 1994 24-week vermian hypoplasia exemplar (VERBATIM)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Vermis CC | 10.9 mm (vs. expected 14.8 mm, z ≈ –2.6) | <5th |
| Vermis AP | 4.8 mm | <5th |
| TVA | 18° (normal-low) | qualitative |
| TCD | 27.5 mm | normal |
| Pons AP | 7.5 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` fires. `dandy_walker_spectrum` should *not* fire because TVA < 45° excludes DWM.
**Citation.** Bromley B, Nadel AS, Pauker S, Estroff JA, Benacerraf BR. Closure of the cerebellar vermis: evaluation with second trimester US. *Radiology.* 1994;193(3):761–763. doi:10.1148/radiology.193.3.7972820, reproduced in Robinson AJ, Goldstein RB. *Ultrasound* 2007;15(4):211–223.

### Case V2 — Nagaraj 2021 vermian-hypoplasia cohort fixture at 24.7 weeks (COHORT-MEAN)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 5 d | — |
| Vermis CC | 9.0 mm (Nagaraj VH cohort mean) | <5th |
| Vermis AP | 4.5 mm | <5th |
| TVA | 52.13° (Nagaraj VH cohort mean) | borderline qualitative |
| TCD | 24.5 mm | normal |
| Pons AP | 7.0 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` fires. `dandy_walker_spectrum` should not fire (Nagaraj-VH cohort TVA mean 52° vs. DWM-cohort 109.5° — squarely separates the two).
**Citation.** Nagaraj UD, Kline-Fath BM, Horn PS, Venkatesan C. Evaluation of Posterior Fossa Biometric Measurements on Fetal MRI in the Evaluation of Dandy-Walker Continuum. *AJNR Am J Neuroradiol.* 2021;42(9):1716–1721. doi:10.3174/ajnr.A7201.

### Case V3 — Isolated inferior vermian hypoplasia at 26 weeks (THRESHOLD-DERIVED, Limperopoulos 2006 cohort GA)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Vermis CC | 11.5 mm (vs. expected 14.0 mm, z ≈ –2.2) | <5th |
| Vermis AP | 5.3 mm (vs. expected 6.5 mm, z ≈ –2.0) | <5th |
| TCD | 30.5 mm | normal |
| Pons AP | 8.4 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` fires. The IMPRESSION should reference Limperopoulos 2006's caveat that fetal MRI before 24 weeks substantially over-calls inferior vermian hypoplasia.
**Citation.** Limperopoulos C, Robertson RL, Estroff JA, et al. Diagnosis of inferior vermian hypoplasia by fetal MRI: potential pitfalls and neurodevelopmental outcome. *Am J Obstet Gynecol.* 2006;194(4):1070–1076. doi:10.1016/j.ajog.2005.10.191. Limperopoulos's cohort had a median diagnostic GA of 22 w with a 32% false-positive rate; the case is set at 26 w to be outside that pitfall window.

### Case V4 — Vermian hypoplasia with mild VM at 28 weeks (combined finding)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 11.0 mm | >95th |
| Atrium-L | 11.0 mm | >95th |
| Vermis CC | 12.5 mm (z ≈ –2.5) | <5th |
| Vermis AP | 5.5 mm (z ≈ –2.5) | <5th |
| TCD | 33.0 mm | normal |
| Pons AP | 9.0 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia`, `mild_ventriculomegaly` fire.
**Citation.** Tarui T, Khwaja OS, Estroff JA, et al. Long-term follow-up of fetuses with isolated cerebellar abnormalities: contribution of fetal MRI. *Prenat Diagn.* 2014;34(5):425–432. doi:10.1002/pd.4322.

### Case V5 — Severe vermian hypoplasia at 32 weeks (vermis CC z ≈ –4)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Vermis CC | 11.0 mm (vs. expected 19.4 mm) | <5th |
| Vermis AP | 5.0 mm | <5th |
| TVA | 30° | qualitative |
| TCD | 38.0 mm | <5th (mild associated cerebellar volume loss) |
| Pons AP | 10.0 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia`, `small_tcd` fire. The combined small-TCD + small-vermis pattern raises concern for cerebellar agenesis or PCH; the report should flag the combined pattern even if no single combined-pattern card formally fires.
**Citation.** Patel S, Barkovich AJ. Analysis and classification of cerebellar malformations. *AJNR Am J Neuroradiol.* 2002;23(7):1074–1087.

### Case V6 — Borderline-low vermis at 22 weeks (negative control, GA pitfall)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 22 w 0 d | — |
| Vermis CC | 9.5 mm (z ≈ –1.6) | normal (5th–95th) |
| Vermis AP | 4.7 mm | normal |
| TCD | 24.5 mm | normal |
| Pons AP | 6.5 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` should *not* fire (z is –1.6, above the –1.645 cut). This case verifies that the calculator does not over-call hypoplasia at borderline values, especially in the early-second-trimester window where Limperopoulos 2006 documents a high false-positive rate.
**Citation.** Limperopoulos 2006.

---

## 7. Dandy-Walker malformation (classical) and Dandy-Walker spectrum

The `dandy_walker_spectrum` card fires when a small/absent vermis is combined with a markedly elevated TVA (> 45°) and an enlarged posterior fossa. Nagaraj 2021's DWM cohort had vermis CC 7.67 mm, AP vermis 2.83 mm, TVA 109.5°, TCD 24.71 mm, pons AP 5.4 mm at 24.7 weeks.

### Case D1 — Classical DWM at 24+5 weeks (COHORT-MEAN, Nagaraj 2021)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 5 d | — |
| Vermis CC | 7.67 mm | <5th |
| Vermis AP | 2.83 mm | <5th |
| TVA | 109.5° | qualitative DWM |
| TCD | 24.71 mm | <5th |
| Pons AP | 5.4 mm | <5th |
| (other rows) | filler | normal |

`vermian_hypoplasia`, `small_tcd`, `small_pons` fire; **`dandy_walker_spectrum`** combined-pattern card fires.
**Citation.** Nagaraj 2021.

### Case D2 — DWM with cystic posterior fossa at 22 weeks (Whitehead 2022 representative case, VERBATIM TVA)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 22 w 0 d | — |
| Vermis CC | 6.5 mm | <5th |
| Vermis AP | 2.5 mm | <5th |
| TVA | 35° (Whitehead 2022 representative; refined-DWM threshold ≥ 35°) | qualitative DWM |
| TCD | 22.0 mm | <5th |
| Pons AP | 5.0 mm | <5th |
| (other rows) | filler | normal |

`vermian_hypoplasia`, `small_tcd`, `small_pons`, `dandy_walker_spectrum` fire.
**Citation.** Whitehead MT, Barkovich MJ, Sidpra J, et al. Refining the Neuroimaging Definition of the Dandy-Walker Phenotype. *AJNR Am J Neuroradiol.* 2022;43(10):1488–1493. doi:10.3174/ajnr.A7659.

### Case D3 — DWM with associated CC anomaly and severe VM at 28 weeks (combined-pattern fixture)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 16.0 mm | >95th |
| Atrium-L | 16.0 mm | >95th |
| CC | absent | special-cased |
| CSP | absent | special-cased |
| Vermis CC | 7.0 mm | <5th |
| Vermis AP | 3.0 mm | <5th |
| TVA | 95° | qualitative DWM |
| TCD | 28.0 mm | <5th |
| Pons AP | 6.5 mm | <5th |
| (other rows) | filler | normal |

`severe_ventriculomegaly`, `csp_absent`, `cc_absent`, **`acc_pattern`**, **`dandy_walker_spectrum`** fire. This case verifies that two combined-pattern cards can fire simultaneously and that the IMPRESSION enumerates both.
**Citation.** Whitehead 2022; Tang 2009.

### Case D4 — Inferior vermian hypoplasia with sub-threshold TVA — DWM negative control at 26 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Vermis CC | 9.0 mm | <5th |
| Vermis AP | 4.0 mm | <5th |
| TVA | 25° | qualitative |
| TCD | 30.0 mm | normal |
| Pons AP | 8.5 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` fires. `dandy_walker_spectrum` should *not* fire because TVA < 35° (Whitehead 2022 refined threshold). Negative-control verification for the DWM combined-pattern card.
**Citation.** Whitehead 2022.

### Case D5 — DWM at 32 weeks with marked posterior fossa cyst, isolated (no other malformations)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Vermis CC | 9.0 mm | <5th |
| Vermis AP | 3.5 mm | <5th |
| TVA | 80° | qualitative DWM |
| TCD | 36.0 mm | <5th |
| Pons AP | 9.0 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia`, `small_tcd`, `dandy_walker_spectrum` fire. Pons is preserved (a discriminator from PCH).
**Citation.** Klein O, Pierre-Kahn A, Boddaert N, Parisot D, Brunelle F. Dandy-Walker malformation: prenatal diagnosis and prognosis. *Childs Nerv Syst.* 2003;19(7–8):484–489. doi:10.1007/s00381-003-0782-5.

### Case D6 — Severe DWM with macrocrania and elevated tegmentovermian angle at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 90 mm (+2 SD) | >97th (macrocephaly from associated hydrocephalus) |
| Atrium-R | 16 mm | >95th |
| Atrium-L | 16 mm | >95th |
| Vermis CC | 8.5 mm | <5th |
| Vermis AP | 3.0 mm | <5th |
| TVA | 130° | qualitative DWM |
| TCD | 32 mm | <5th |
| Pons AP | 8.0 mm | <5th |
| Third ventricle | 4.0 mm | >95th |
| (other rows) | filler | normal |

`severe_ventriculomegaly`, `vermian_hypoplasia`, `small_tcd`, `small_pons`, `third_ventricle_dilatation`, `macrocephaly_pattern`, **`dandy_walker_spectrum`**.
**Citation.** Adamsbaum C, Moutard ML, André C, et al. MRI of the fetal posterior fossa. *Pediatr Radiol.* 2005;35(2):124–140. doi:10.1007/s00247-004-1316-3.

---

## 8. Blake's pouch cyst (mildly raised TVA, otherwise normal vermis and PF)

Blake's pouch cyst (BPC) is a benign posterior-fossa cystic remnant with mildly elevated TVA but a normal-size, normally-formed vermis and a near-normal posterior fossa. The calculator does not fire `vermian_hypoplasia` or `dandy_walker_spectrum` for BPC; instead, an *advisory* qualitative card "Blake's pouch (DD)" appears in the panel when the user manually toggles "elevated TVA + normal vermis size."

### Case BP1 — Nagaraj 2021 BPC cohort fixture (COHORT-MEAN)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 5 d | — |
| Vermis CC | 12.4 mm (Nagaraj BPC cohort) | normal |
| Vermis AP | 5.8 mm | normal |
| TVA | 33° (Nagaraj BPC cohort) | qualitative borderline |
| TCD | 27.6 mm | normal |
| Pons AP | 7.5 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` should *not* fire (vermis is normal-size). `dandy_walker_spectrum` should *not* fire (TCD and pons preserved; TVA below the Whitehead threshold). Negative-control case for the DWM combined-pattern card.
**Citation.** Nagaraj 2021.

### Case BP2 — Persistent Blake's pouch with mildly reduced vermis height at 26 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Vermis CC | 12.5 mm (z ≈ –1.5) | normal (just above 5th centile) |
| Vermis AP | 5.5 mm | normal |
| TVA | 28° | qualitative |
| TCD | 30.0 mm | normal |
| Pons AP | 8.5 mm | normal |
| (other rows) | filler | normal |

No DDx cards should fire. Boundary case verifying that `vermian_hypoplasia` correctly stays silent at z ≈ –1.5.
**Citation.** Pinto J, Paladini D, Marrocco G, et al. Persistent Blake's pouch cyst: prenatal diagnosis, fetal MRI, and outcome. *Childs Nerv Syst.* 2016;32(2):311–318. doi:10.1007/s00381-015-2901-5.

### Case BP3 — Blake's pouch with mega cisterna magna at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Vermis CC | 16.0 mm | normal |
| Vermis AP | 7.3 mm | normal |
| TVA | 30° | qualitative |
| Cisterna magna AP | 12 mm (>10 mm threshold for MCM) | qualitative |
| TCD | 34.5 mm | normal |
| Pons AP | 9.5 mm | normal |
| (other rows) | filler | normal |

No quantitative DDx cards should fire (the calculator does not currently fire a card for cisterna magna alone). The IMPRESSION should mention "isolated mega cisterna magna with persistent Blake's pouch — likely benign normal variant" if the radiologist toggles the qualitative MCM panel.
**Citation.** Gafner M, Yagel I, Fried S, Ezra O, Bar-Yosef O, Katorza E. Fetal brain biometry in isolated mega cisterna magna: MRI and US study. *J Matern Fetal Neonatal Med.* 2022;35(21):4199–4207. doi:10.1080/14767058.2020.1849094. PMID 33207970.

### Case BP4 — Blake's pouch with sub-threshold AP vermis at 30 weeks (negative control for vermian hypoplasia)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Vermis CC | 17.0 mm | normal |
| Vermis AP | 7.0 mm (z ≈ –1.6) | normal |
| TVA | 25° | qualitative |
| TCD | 38.5 mm | normal |
| Pons AP | 10.5 mm | normal |
| (other rows) | filler | normal |

No DDx cards fire. Boundary case; vermis AP is borderline-low but does not cross –1.645.
**Citation.** Pinto 2016.

### Case BP5 — Blake's pouch at 32 weeks with normal vermis (true negative control)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Vermis CC | 19.4 mm | normal |
| Vermis AP | 8.7 mm | normal |
| TVA | 30° | qualitative |
| TCD | 41.4 mm | normal |
| Pons AP | 11.5 mm | normal |
| (other rows) | filler | normal |

No DDx cards fire. This case is a clean negative control — the only abnormality is the qualitative TVA elevation, and the calculator does not currently fire a card from TVA alone.
**Citation.** Pinto 2016.

### Case BP6 — Vermian hypoplasia with raised TVA at 28 weeks (DWM-vs-BPC discriminator)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Vermis CC | 11.0 mm | <5th |
| Vermis AP | 5.0 mm | <5th |
| TVA | 60° | qualitative borderline |
| TCD | 30.0 mm | normal |
| Pons AP | 9.0 mm | normal |
| (other rows) | filler | normal |

`vermian_hypoplasia` fires; `dandy_walker_spectrum` may or may not fire depending on Whitehead 2022's strict 35° vs. 45° threshold. The case is included as an explicit discriminator test for the calculator's TVA threshold. The expected outcome under the Whitehead 35° threshold is: `dandy_walker_spectrum` fires.
**Citation.** Whitehead 2022 vs. Klein 2003; Pinto 2016.

---

## 9. Cerebellar hypoplasia (small TCD, vermis preserved)

The `small_tcd` card fires when TCD z < –1.645. When the vermis is preserved, the underlying cause is most often hemispheric hypoplasia rather than vermian hypoplasia.

### Case CH1 — Isolated cerebellar hemispheric hypoplasia at 26 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| TCD | 26.0 mm (vs. expected 31.0, z ≈ –2.0) | <5th |
| Vermis CC | 14.0 mm | normal |
| Vermis AP | 6.5 mm | normal |
| Pons AP | 8.5 mm | normal |
| (other rows) | filler | normal |

`small_tcd` fires. `vermian_hypoplasia` does *not* fire (vermis preserved).
**Citation.** Patel S, Barkovich AJ. *AJNR* 2002.

### Case CH2 — Severe cerebellar hypoplasia at 30 weeks (z ≈ –4)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| TCD | 28.0 mm (z ≈ –4) | <5th |
| Vermis CC | 18.0 mm | normal |
| Vermis AP | 7.5 mm | <5th (z ≈ –1.7) |
| Pons AP | 10.5 mm | normal |
| (other rows) | filler | normal |

`small_tcd` fires. `vermian_hypoplasia` may fire on AP vermis depending on the GA-specific 5th centile.
**Citation.** Bolduc ME, Limperopoulos C. Neurodevelopmental outcomes in children with cerebellar malformations: a systematic review. *Dev Med Child Neurol.* 2009;51(4):256–267. doi:10.1111/j.1469-8749.2008.03224.x.

### Case CH3 — Unilateral cerebellar hypoplasia at 32 weeks (with vermis preserved)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| TCD | 33.0 mm (z ≈ –2.5) | <5th |
| Vermis CC | 19.5 mm | normal |
| Vermis AP | 8.5 mm | normal |
| Pons AP | 11.5 mm | normal |
| (other rows) | filler | normal |

`small_tcd` fires. The IMPRESSION should suggest unilateral cerebellar hypoplasia or cerebellar disruption injury, with postnatal MRI for laterality assessment.
**Citation.** Massoud M, Cagneaux M, Garel C, et al. Prenatal unilateral cerebellar hypoplasia in a series of 26 cases: significance and implications for prenatal diagnosis. *Ultrasound Obstet Gynecol.* 2014;44(4):447–454. doi:10.1002/uog.13217.

### Case CH4 — Cerebellar hypoplasia with associated VM at 28 weeks (combined finding)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 11.5 mm | >95th |
| Atrium-L | 11.5 mm | >95th |
| TCD | 31.0 mm (z ≈ –2.0) | <5th |
| Vermis CC | 15.0 mm | normal |
| Vermis AP | 7.0 mm | normal |
| Pons AP | 9.0 mm | normal |
| (other rows) | filler | normal |

`small_tcd`, `mild_ventriculomegaly` fire.
**Citation.** Bolduc 2009.

### Case CH5 — Borderline-low TCD (negative control) at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| TCD | 36.0 mm (z ≈ –1.5) | normal |
| (others) | filler | normal |

`small_tcd` should *not* fire (z is just above –1.645). Boundary verification.
**Citation.** Massoud 2014.

### Case CH6 — Cerebellar hypoplasia with hemispheric asymmetry at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 30.0 mm (z ≈ –2.5) | <5th |
| Brain OFD-L | 95.0 mm | <5th (asymmetric) |
| Brain OFD-R | 99.0 mm | normal |
| Vermis CC | 16.0 mm | normal |
| Pons AP | 9.0 mm | normal |
| (other rows) | filler | normal |

`small_tcd`, `hemispheric_asymmetry` fire.
**Citation.** Massoud 2014; Garel 2004.

---

## 10. Macrocerebellum (large TCD)

The `large_tcd` card fires when TCD z > +1.645. This is rare; the most common associations are overgrowth syndromes (Sotos, Beckwith-Wiedemann), Cohen syndrome, and isolated large-cerebellum normal variants.

### Case LC1 — Isolated macrocerebellum at 28 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 39.0 mm (z ≈ +2.0) | >95th |
| (others) | filler | normal |

`large_tcd` fires.
**Citation.** Bosemani T, Orman G, Boltshauser E, Tekes A, Huisman TA, Poretti A. Congenital abnormalities of the posterior fossa. *RadioGraphics.* 2015;35(1):200–220. doi:10.1148/rg.351140038.

### Case LC2 — Macrocerebellum with macrocephaly at 30 weeks (overgrowth-syndrome pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 90 mm (+2 SD) | >97th |
| TCD | 42.0 mm (z ≈ +2.0) | >95th |
| (others) | filler | normal |

`large_tcd`, `macrocephaly_pattern` fire. The IMPRESSION should suggest overgrowth syndromes (Sotos, BWS).
**Citation.** Bosemani 2015.

### Case LC3 — Macrocerebellum at 32 weeks, isolated

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| TCD | 46.0 mm (z ≈ +2.0) | >95th |
| (others) | filler | normal |

`large_tcd` fires.
**Citation.** Bosemani 2015.

### Case LC4 — Borderline-large TCD (negative control) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 38.0 mm (z ≈ +1.5) | normal |
| (others) | filler | normal |

`large_tcd` should *not* fire. Boundary verification.
**Citation.** Bosemani 2015.

### Case LC5 — Macrocerebellum with thick CC at 30 weeks (combined-finding fixture)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| TCD | 42.5 mm | >95th |
| CC | 44 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`large_tcd`, `cc_thick` fire. Combined finding raises concern for an overgrowth syndrome.
**Citation.** Bosemani 2015; Garel 2011 (CC growth).

### Case LC6 — Macrocerebellum at 26 weeks with mildly enlarged CSP

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| TCD | 35 mm (z ≈ +1.9) | >95th |
| CSP | 11 mm | >95th |
| (others) | filler | normal |

`large_tcd`, `csp_enlarged` fire.
**Citation.** Bosemani 2015.

---

## 11. Agenesis of corpus callosum (CC absent or markedly short)

The `cc_absent` and `cc_short` cards fire on the special-case "absent" value or when CC length z < –1.645. The combined `acc_pattern` card fires when CC and CSP are both absent, with downstream IMPRESSION quoting Santo 2012 (65–75% normal ND in isolated ACC) and Sun 2024 (~30% monogenic aetiology).

### Case A1 — Tang 2009 Patient 3, complete ACC at 21 weeks (VERBATIM)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 21 w 0 d | — |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| Atrium-R | 11.0 mm | >95th (colpocephaly) |
| Atrium-L | 11.0 mm | >95th |
| (others) | filler | normal |

`csp_absent`, `cc_absent`, `mild_ventriculomegaly`, **`acc_pattern`** fire.
**Citation.** Tang 2009 Patient 3.

### Case A2 — Tang 2009 Patient 29, complete ACC at 36+3 weeks with associated heterotopia (VERBATIM)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 36 w 3 d | — |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| Atrium-R | 13.0 mm | >95th |
| Atrium-L | 13.0 mm | >95th |
| (others) | filler | normal |

`csp_absent`, `cc_absent`, `mild_ventriculomegaly`, **`acc_pattern`** fire. Tang 2009 Patient 29 also had heterotopia, which the calculator's quantitative engine cannot detect; it should appear in the qualitative panel if the radiologist toggles it.
**Citation.** Tang 2009 Patient 29.

### Case A3 — Isolated ACC at 26 weeks (no associated anomalies) (THRESHOLD-DERIVED, Santo 2012)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| Atrium-R | 10.5 mm | >95th |
| Atrium-L | 10.5 mm | >95th |
| (others) | filler | normal |

`csp_absent`, `cc_absent`, `mild_ventriculomegaly`, **`acc_pattern`** fire. IMPRESSION should quote Santo 2012's 65–75% normal-ND figure.
**Citation.** Santo 2012.

### Case A4 — Hypogenesis of CC at 28 weeks (CC present but short) (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CSP | 4.4 mm (present) | normal |
| CC | 22.0 mm (vs. expected 32.5, z ≈ –2.5) | <5th |
| Atrium-R | 7.4 mm | normal |
| Atrium-L | 7.4 mm | normal |
| (others) | filler | normal |

`cc_short` fires. `acc_pattern` should *not* fire (CSP is preserved). The IMPRESSION should suggest "partial / hypogenetic CC; postnatal MRI for confirmation."
**Citation.** Garel C, Cont I, Alberti C, Josserand E, Moutard ML, Ducou le Pointe H. Biometry of the corpus callosum in children: MR imaging reference data. *AJNR Am J Neuroradiol.* 2011;32(8):1436–1443. doi:10.3174/ajnr.A2542.

### Case A5 — ACC with interhemispheric cyst and severe VM at 24 weeks (combined-pattern fixture)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| Atrium-R | 16.0 mm | >95th |
| Atrium-L | 16.0 mm | >95th |
| Brain OFD-L | 78.0 mm | normal |
| Brain OFD-R | 78.0 mm | normal |
| (others) | filler | normal |

`csp_absent`, `cc_absent`, `severe_ventriculomegaly`, **`acc_pattern`** fire. The interhemispheric cyst is a qualitative finding entered separately.
**Citation.** Tang 2009.

### Case A6 — ACC with associated DWM at 28 weeks (combined-pattern fixture)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| Vermis CC | 7.0 mm | <5th |
| Vermis AP | 3.0 mm | <5th |
| TVA | 95° | qualitative DWM |
| TCD | 28.0 mm | <5th |
| (others) | filler | normal |

`csp_absent`, `cc_absent`, **`acc_pattern`**, **`dandy_walker_spectrum`**. Two combined-pattern cards fire simultaneously.
**Citation.** Tang 2009; Whitehead 2022.

---

## 12. Short / dysgenetic CC (CC length below 5th percentile, CSP present)

Cases where CC is present but z < –1.645, distinguishable from full ACC by preserved CSP.

### Case CC1 — Dysgenetic CC, isolated, at 30 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| CC | 30.0 mm (z ≈ –1.9) | <5th |
| CSP | 4.7 mm | normal |
| (others) | filler | normal |

`cc_short` fires. `acc_pattern` does *not* fire (CSP is preserved).
**Citation.** Garel 2011.

### Case CC2 — Dysgenetic CC with mild VM at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CC | 24.0 mm (z ≈ –2.5) | <5th |
| CSP | 4.4 mm | normal |
| Atrium-R | 11.0 mm | >95th |
| Atrium-L | 11.0 mm | >95th |
| (others) | filler | normal |

`cc_short`, `mild_ventriculomegaly` fire.
**Citation.** Garel 2011.

### Case CC3 — Dysgenetic CC at 32 weeks (severe shortening)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| CC | 28.0 mm (z ≈ –3) | <5th |
| CSP | 5.0 mm | normal |
| (others) | filler | normal |

`cc_short` fires.
**Citation.** Garel 2011.

### Case CC4 — CC at sub-threshold low (negative control) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CC | 30.5 mm (z ≈ –1.5) | normal |
| CSP | 4.4 mm | normal |
| (others) | filler | normal |

`cc_short` should *not* fire. Boundary verification.
**Citation.** Garel 2011.

### Case CC5 — Dysgenetic CC with absent CSP at 26 weeks (rare combined fixture)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| CC | 22.0 mm (z ≈ –2.0) | <5th |
| CSP | absent | special-cased |
| (others) | filler | normal |

`cc_short`, `csp_absent` fire. The combined absent-CSP + short-CC pattern should additionally fire **`acc_pattern`** (per the spec, the pattern fires when CC is absent OR markedly shortened with concurrent absent CSP).
**Citation.** Tang 2009.

### Case CC6 — Dysgenetic CC with septo-optic dysplasia (CSP absent + small optic apparatus) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CC | 26.0 mm (z ≈ –2.5) | <5th |
| CSP | absent | special-cased |
| (others) | filler | normal |

`cc_short`, `csp_absent` fire. The septo-optic dysplasia diagnosis is a qualitative add-on and is not currently covered by a dedicated combined-pattern card; it is captured by the absent-CSP card's IMPRESSION text.
**Citation.** Malinger G, Lev D, Lerman-Sagie T. The fetal cerebellum: pitfalls in diagnosis and management. *Prenat Diagn.* 2009;29(4):372–380. doi:10.1002/pd.2196.

---

## 13. Thick / overgrown CC (CC length > 95th percentile)

The `cc_thick` card fires when CC z > +1.645. Associations include overgrowth syndromes and macrocrania.

### Case TC1 — Isolated thick CC at 30 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| CC | 44 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`cc_thick` fires.
**Citation.** Garel 2011.

### Case TC2 — Thick CC with macrocrania at 32 weeks (overgrowth-syndrome pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 95 mm (+2 SD) | >97th |
| CC | 47 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`cc_thick`, `macrocephaly_pattern` fire.
**Citation.** Garel 2011; Bosemani 2015.

### Case TC3 — Borderline-thick CC (negative control) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CC | 35 mm (z ≈ +1.5) | normal |
| (others) | filler | normal |

`cc_thick` should *not* fire. Boundary verification.

### Case TC4 — Thick CC + thick pons (overgrowth) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CC | 39 mm (z ≈ +2) | >95th |
| Pons AP | 11 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`cc_thick`, `pons_large` fire.
**Citation.** Garel 2011.

### Case TC5 — Thick CC at 36 weeks, isolated

| Parameter | Value | Expected band |
|---|---|---|
| GA | 36 w 0 d | — |
| CC | 50 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`cc_thick` fires.
**Citation.** Garel 2011.

### Case TC6 — Thick CC + macrocerebellum at 30 weeks (overgrowth pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| CC | 44 mm | >95th |
| TCD | 42 mm | >95th |
| (others) | filler | normal |

`cc_thick`, `large_tcd` fire.

---

## 14. Absent cavum septum pellucidum (CSP missing or width < 1 mm), isolated

The `csp_absent` card fires for CSP absence with CC preserved. Isolated absent CSP is a soft marker for septo-optic dysplasia, mild HPE-spectrum (lobar HPE, septo-preoptic HPE), and post-haemorrhagic septal injury.

### Case CSP-A1 — Isolated absent CSP at 26 weeks (no other findings) (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| CSP | absent | special-cased |
| CC | 28.0 mm | normal |
| (others) | filler | normal |

`csp_absent` fires. `acc_pattern` does *not* fire (CC preserved). `hpe_pattern` does *not* fire (no monoventricle, no fused thalami).
**Citation.** Malinger G, Lev D, Kidron D, Heredia F, Hershkowitz R, Lerman-Sagie T. Differential diagnosis in fetuses with absent septum pellucidum. *Ultrasound Obstet Gynecol.* 2005;25(1):42–49. doi:10.1002/uog.1787.

### Case CSP-A2 — Absent CSP with bilateral mild VM at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| CSP | absent | special-cased |
| Atrium-R | 11.5 mm | >95th |
| Atrium-L | 11.5 mm | >95th |
| CC | 36.0 mm | normal |
| (others) | filler | normal |

`csp_absent`, `mild_ventriculomegaly` fire.
**Citation.** Malinger 2005.

### Case CSP-A3 — Absent CSP with septo-optic dysplasia features at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CSP | absent | special-cased |
| CC | 32.0 mm | normal |
| (others) | filler | normal |

`csp_absent` fires. The qualitative SOD finding (small optic chiasm) is a manual entry.
**Citation.** Malinger 2005.

### Case CSP-A4 — Absent CSP with mid-late-trimester normal exam — true negative for HPE/ACC at 32 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| CSP | absent | special-cased |
| CC | 39.2 mm | normal |
| (others) | filler | normal |

`csp_absent` fires; no other DDx cards. Negative control for `acc_pattern` and `hpe_pattern`.
**Citation.** Malinger 2005.

### Case CSP-A5 — Absent CSP with severe VM and absent CC (cross-reference to ACC)

Cross-reference: see §11, Case A1. `csp_absent`, `cc_absent`, `mild_ventriculomegaly`, `acc_pattern` fire.

### Case CSP-A6 — Absent CSP at 24 weeks with normal CC

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| CSP | absent | special-cased |
| CC | 24.0 mm | normal |
| (others) | filler | normal |

`csp_absent` fires.
**Citation.** Malinger 2005.

---


## 15. Enlarged CSP (width > 10 mm; cavum vergae)

The `csp_enlarged` card fires when CSP width > 10 mm. Often a benign finding; occasionally associated with chromosomal aneuploidy, post-haemorrhagic septal injury, or cavum vergae extension.

### Case CSP-E1 — Isolated enlarged CSP at 32 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| CSP | 11.5 mm | >95th |
| (others) | filler | normal |

`csp_enlarged` fires.
**Citation.** Falco P, Gabrielli S, Visentin A, et al. Transvaginal sonography of the cavum septum pellucidum in fetuses with absence of the corpus callosum and other midline anomalies. *Ultrasound Obstet Gynecol.* 2000;16(2):145–149. doi:10.1046/j.1469-0705.2000.00170.x.

### Case CSP-E2 — Enlarged CSP with mild VM at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| CSP | 12.0 mm | >95th |
| Atrium-R | 11.0 mm | >95th |
| Atrium-L | 11.0 mm | >95th |
| (others) | filler | normal |

`csp_enlarged`, `mild_ventriculomegaly` fire.
**Citation.** Falco 2000.

### Case CSP-E3 — Cavum vergae (enlarged CSP extending posteriorly) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CSP | 13.0 mm (cavum vergae) | >95th |
| (others) | filler | normal |

`csp_enlarged` fires; the qualitative panel can be toggled to label the finding as cavum vergae.
**Citation.** Bronshtein M, Weiner Z. Prenatal diagnosis of dilated cava septi pellucidi et vergae: associated anomalies, differential diagnosis, and pregnancy outcome. *Obstet Gynecol.* 1992;80(5):838–842.

### Case CSP-E4 — Borderline-large CSP (negative control) at 32 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| CSP | 9.5 mm (z ≈ +1.5) | normal |
| (others) | filler | normal |

`csp_enlarged` should *not* fire (CSP < 10 mm). Boundary verification.
**Citation.** Falco 2000.

### Case CSP-E5 — Enlarged CSP at 26 weeks, isolated

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| CSP | 11.0 mm | >95th |
| (others) | filler | normal |

`csp_enlarged` fires.
**Citation.** Falco 2000.

### Case CSP-E6 — Enlarged CSP at 36 weeks, isolated

| Parameter | Value | Expected band |
|---|---|---|
| GA | 36 w 0 d | — |
| CSP | 12.0 mm | >95th |
| (others) | filler | normal |

`csp_enlarged` fires.
**Citation.** Falco 2000.

---

## 16. Holoprosencephaly (alobar, semilobar, lobar)

The combined `hpe_pattern` card fires when monoventricle, absent CSP, fused thalami, and microcephaly are co-present. The calculator's quantitative engine fires `severe_ventriculomegaly`, `csp_absent`, and `microcephaly_pattern` from the measurements; the monoventricle and fused-thalami findings are qualitative entries that the radiologist toggles.

### Case HPE1 — Alobar HPE at 24 weeks (COHORT-MEAN, Griffiths 2016)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Skull BPD | 50 mm (–3 SD) | <3rd |
| Skull OFD | 70 mm | <3rd |
| Brain BPD | 48 mm | <3rd |
| Brain OFD-L | 65 mm | <3rd |
| Brain OFD-R | 65 mm | <3rd |
| Atrium-R | 20 mm (monoventricle) | >95th |
| Atrium-L | 20 mm | >95th |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| TCD | 27.5 mm | normal |
| Vermis CC | 12.4 mm | normal |
| Vermis AP | 5.8 mm | normal |
| Pons AP | 7.5 mm | normal |
| Third ventricle | not measurable (fused thalami) | special-cased |

`severe_ventriculomegaly`, `csp_absent`, `cc_absent`, `microcephaly_pattern`, **`hpe_pattern`** fire. The HPE pattern subsumes the standalone CSP and CC cards in the IMPRESSION.
**Citation.** Griffiths PD, Jarvis D, Connolly DJ, et al. Holoprosencephaly: in utero MR imaging in 32 patients. *Br J Radiol.* 2016;89(1057):20150892. doi:10.1259/bjr.20150892.

### Case HPE2 — Semilobar HPE at 28 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | 65 mm (–2.5 SD) | <3rd |
| Brain BPD | 63 mm | <3rd |
| Atrium-R | 16 mm | >95th |
| Atrium-L | 16 mm | >95th |
| CSP | absent | special-cased |
| CC | partial (15 mm, splenium-only — cannot be reliably measured against the full Garel curve) | <5th by full-CC equation |
| TCD | 34.5 mm | normal |
| Pons AP | 9.5 mm | normal |
| (others) | filler | normal |

`severe_ventriculomegaly`, `csp_absent`, `cc_short`, `microcephaly_pattern`, **`hpe_pattern`** fire.
**Citation.** Malinger G, Lev D, Kidron D, et al. Differential diagnosis in fetuses with absent septum pellucidum. *Ultrasound Obstet Gynecol.* 2005;25(1):42–49; Malinger G, Lerman-Sagie T, Bermann D, Lev D. Prenatal diagnosis of holoprosencephaly. *Prenat Diagn.* 2013;33(13):1222–1228. doi:10.1002/pd.4244.

### Case HPE3 — Lobar HPE at 30 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 78 mm | <5th |
| Brain BPD | 76 mm | <5th |
| Atrium-R | 12 mm | >95th |
| Atrium-L | 12 mm | >95th |
| CSP | absent | special-cased |
| CC | 35 mm (slightly short, splenium present) | normal–<5th |
| TCD | 38.5 mm | normal |
| (others) | filler | normal |

`mild_ventriculomegaly`, `csp_absent` fire. **`hpe_pattern`** may fire only if the qualitative monoventricle / fused-thalami findings are also entered. Without those, this case looks like isolated absent CSP with mild VM.
**Citation.** Malinger 2013.

### Case HPE4 — Cureus 2024 alobar HPE source-anchored severe pattern (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 22 w 0 d | — |
| Skull BPD | 47 mm (–3 SD) | <3rd |
| Atrium-R | monoventricle | >95th |
| Atrium-L | monoventricle | >95th |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| (others) | filler | normal |

`severe_ventriculomegaly`, `csp_absent`, `cc_absent`, `microcephaly_pattern`, **`hpe_pattern`** fire. The measurement table is threshold-derived to exercise the alobar-HPE pattern; the Cureus case anchors the same prenatal alobar-HPE constellation but does not publish this exact measurement table.
**Citation.** Chafiq K, Toumi K, Khayi FE, Daoudi A. Alobar holoprosencephaly in a newborn: a case report of prenatal diagnosis and a review of the literature. *Cureus.* 2024;16(11):e74462. doi:10.7759/cureus.74462. PMID 39726469; PMCID PMC11669822; Malinger 2013.

### Case HPE5 — HPE pattern with associated DWM at 26 weeks (rare combined fixture)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Skull BPD | 60 mm (–2 SD) | <3rd |
| Atrium-R | 18 mm | >95th |
| Atrium-L | 18 mm | >95th |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| Vermis CC | 8.0 mm | <5th |
| Vermis AP | 3.5 mm | <5th |
| TVA | 95° | qualitative DWM |
| TCD | 28.0 mm | <5th |
| Pons AP | 6.5 mm | <5th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `csp_absent`, `cc_absent`, `vermian_hypoplasia`, `small_tcd`, `small_pons`, `microcephaly_pattern`, **`hpe_pattern`**, **`dandy_walker_spectrum`** fire — three combined-pattern cards simultaneously.
**Citation.** Griffiths 2016; Whitehead 2022.

### Case HPE6 — Mild HPE-spectrum at 32 weeks (septo-preoptic) — partial pattern, no full HPE card

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 88 mm | normal |
| Atrium-R | 8.0 mm | normal |
| Atrium-L | 8.0 mm | normal |
| CSP | absent | special-cased |
| CC | 39.0 mm | normal |
| (others) | filler | normal |

`csp_absent` fires only. `hpe_pattern` does *not* fire (no monoventricle, no microcephaly, no fused thalami). Negative-control case for the HPE combined-pattern card.
**Citation.** Malinger 2013.

---

## 17. Small pons (pontocerebellar hypoplasia spectrum)

The `small_pons` card fires when pons AP z < –1.645. Combined with vermis or TCD reduction, it triggers the qualitative **`pch_pattern`** card. The PCH spectrum includes 11 known subtypes (van Dijk 2018 [34]).

### Case PCH1 — PCH type 2 with severe pontocerebellar reduction at 28 weeks (COHORT-MEAN, Patel 2019)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Pons AP | 5.5 mm (z ≈ –4) | <5th |
| TCD | 27.0 mm (z ≈ –3) | <5th |
| Vermis CC | 12.0 mm | <5th |
| Vermis AP | 5.5 mm | <5th |
| (others) | filler | normal |

`small_pons`, `small_tcd`, `vermian_hypoplasia` fire; **`pch_pattern`** combined card fires (qualitative).
**Citation.** Patel S, Barkovich AJ. *AJNR* 2002; van Dijk T, Baas F, Barth PG, Poll-The BT. What's new in pontocerebellar hypoplasia? An update on genes and subtypes. *Orphanet J Rare Dis.* 2018;13(1):92. doi:10.1186/s13023-018-0826-2.

### Case PCH2 — Isolated small pons at 30 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Pons AP | 8.0 mm (z ≈ –2) | <5th |
| TCD | 38.0 mm | normal |
| Vermis CC | 18.0 mm | normal |
| (others) | filler | normal |

`small_pons` fires alone. `pch_pattern` does *not* fire because TCD and vermis are preserved (a strong negative discriminator from PCH).
**Citation.** Dovjak GO et al. 2021 (cited as the calculator's normative source); van Dijk 2018 for clinical interpretation.

### Case PCH3 — Severe pontocerebellar hypoplasia at 24 weeks (early-onset PCH1 phenotype)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Pons AP | 4.0 mm (z ≈ –4) | <5th |
| TCD | 22.0 mm (z ≈ –3) | <5th |
| Vermis CC | 9.0 mm | <5th |
| Vermis AP | 4.0 mm | <5th |
| (others) | filler | normal |

`small_pons`, `small_tcd`, `vermian_hypoplasia` fire; **`pch_pattern`** fires.
**Citation.** Namavar Y, Barth PG, Kasher PR, et al. Clinical, neuroradiological and genetic findings in pontocerebellar hypoplasia. *Brain.* 2011;134(Pt 1):143–156. doi:10.1093/brain/awq287.

### Case PCH4 — Borderline-small pons at 28 weeks (negative control)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Pons AP | 8.5 mm (z ≈ –1.5) | normal |
| (others) | filler | normal |

`small_pons` should *not* fire (z above –1.645). Boundary verification.
**Citation.** Dovjak 2021.

### Case PCH5 — PCH with associated mild VM at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 11.0 mm | >95th |
| Atrium-L | 11.0 mm | >95th |
| Pons AP | 6.5 mm (z ≈ –3) | <5th |
| TCD | 28.0 mm (z ≈ –2.5) | <5th |
| Vermis CC | 12.5 mm | <5th |
| (others) | filler | normal |

`mild_ventriculomegaly`, `small_pons`, `small_tcd`, `vermian_hypoplasia`, **`pch_pattern`** fire.
**Citation.** van Dijk 2018.

### Case PCH6 — Isolated small pons at 32 weeks with normal TCD/vermis — discriminator from PCH

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Pons AP | 9.0 mm (z ≈ –2.5) | <5th |
| TCD | 41.0 mm | normal |
| Vermis CC | 19.0 mm | normal |
| (others) | filler | normal |

`small_pons` fires alone. `pch_pattern` does *not* fire (preserved TCD and vermis are inconsistent with classical PCH). The IMPRESSION should suggest "isolated brainstem (pontine) hypoplasia — non-PCH; consider PMM2-CDG and other isolated brainstem disorders."
**Citation.** Poretti A, Boltshauser E, Doherty D. Cerebellar hypoplasia: differential diagnosis and diagnostic approach. *Am J Med Genet C Semin Med Genet.* 2014;166C(2):211–226. doi:10.1002/ajmg.c.31398.

---

## 18. Large pons (pons AP > 95th percentile)

The `pons_large` card fires when pons AP z > +1.645. Rare; associations include some metabolic / overgrowth syndromes.

### Case LP1 — Isolated large pons at 30 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Pons AP | 13.0 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`pons_large` fires.
**Citation.** Dovjak 2021.

### Case LP2 — Large pons + macrocephaly at 32 weeks (overgrowth pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 95 mm (+2 SD) | >97th |
| Pons AP | 14.0 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`pons_large`, `macrocephaly_pattern` fire.
**Citation.** Bosemani 2015.

### Case LP3 — Borderline-large pons at 30 weeks (negative control)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Pons AP | 12.5 mm (z ≈ +1.5) | normal |
| (others) | filler | normal |

`pons_large` should *not* fire. Boundary verification.

### Case LP4 — Large pons + macrocerebellum at 28 weeks (overgrowth combined)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Pons AP | 11.5 mm (z ≈ +2) | >95th |
| TCD | 39 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`pons_large`, `large_tcd` fire.
**Citation.** Bosemani 2015.

### Case LP5 — Large pons at 36 weeks, isolated

| Parameter | Value | Expected band |
|---|---|---|
| GA | 36 w 0 d | — |
| Pons AP | 16 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`pons_large` fires.

### Case LP6 — Large pons at 26 weeks with thick CC

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Pons AP | 10.5 mm (z ≈ +2) | >95th |
| CC | 35 mm (z ≈ +2) | >95th |
| (others) | filler | normal |

`pons_large`, `cc_thick` fire — strongly suggests an overgrowth-syndrome pattern.

---

## 19. Microcephaly (skull BPD and HC < 3rd percentile)

The `microcephaly_pattern` card fires when skull BPD and HC are both < 3rd percentile (z < –1.881). Causes: monogenic primary microcephaly, congenital infections (CMV, Zika), severe IUGR, brain destruction.

### Case MC1 — Isolated severe microcephaly at 28 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | 67 mm (–3 SD) | <3rd |
| Skull OFD | 92 mm | <3rd |
| Brain BPD | 65 mm | <3rd |
| Brain OFD-L | 87 mm | <3rd |
| Brain OFD-R | 87 mm | <3rd |
| (others) | filler | normal |

`microcephaly_pattern` fires.
**Citation.** Pei R, Wang G, Wang Y, et al. Diagnostic and prognostic value of fetal magnetic resonance imaging in the assessment of microcephaly. *J Matern Fetal Neonatal Med.* 2024;37(1):2299109. doi:10.1080/14767058.2023.2299109.

### Case MC2 — Microcephaly with associated cerebellar hypoplasia at 30 weeks (PCH/MCPH-spectrum)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 72 mm | <3rd |
| Brain BPD | 70 mm | <3rd |
| TCD | 33 mm | <5th |
| Vermis CC | 15 mm | <5th |
| Pons AP | 8.5 mm | <5th |
| (others) | filler | normal |

`microcephaly_pattern`, `small_tcd`, `vermian_hypoplasia`, `small_pons`, **`pch_pattern`** fire.
**Citation.** Pei 2024; van Dijk 2018.

### Case MC3 — Severe microcephaly with monoventricle, fused thalami, absent CSP/CC (alobar HPE)

Cross-reference: see §16, Case HPE1. `microcephaly_pattern`, `severe_ventriculomegaly`, `csp_absent`, `cc_absent`, `hpe_pattern` fire simultaneously.

### Case MC4 — Borderline microcephaly (z = –1.7) at 28 weeks (negative control)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | 70 mm (–1.7 SD) | <5th but ≥ 3rd |
| Brain BPD | 68 mm | <5th |
| (others) | filler | normal |

`microcephaly_pattern` should *not* fire (z = –1.7 is above the –1.881 cut for the 3rd centile). Boundary verification.

### Case MC5 — CMV-related microcephaly at 32 weeks with associated VM and intracranial calcifications

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 80 mm | <3rd |
| Brain BPD | 78 mm | <3rd |
| Atrium-R | 12 mm | >95th |
| Atrium-L | 12 mm | >95th |
| (others) | filler | normal |

`microcephaly_pattern`, `mild_ventriculomegaly` fire. The qualitative findings of periventricular cysts, calcifications, and germinolytic cysts are radiologist-toggled add-ons; the IMPRESSION should suggest CMV.
**Citation.** Cannie MM, Devlieger R, Leyder M, et al. Congenital cytomegalovirus infection: contribution and best timing of prenatal MR imaging. *Eur Radiol.* 2016;26(10):3760–3769. doi:10.1007/s00330-015-4187-0.

### Case MC6 — Severe IUGR-associated symmetric microcephaly at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 75 mm | <3rd |
| Skull OFD | 100 mm | <3rd |
| Brain BPD | 73 mm | <3rd |
| (others) | filler | normal |

`microcephaly_pattern` fires. The IMPRESSION should distinguish from primary microcephaly by referencing growth-restriction context entered by the user.
**Citation.** Pei 2024.

---

## 20. Macrocephaly (skull BPD and HC > 97th percentile)

The `macrocephaly_pattern` card fires when skull BPD and HC are both > 97th percentile. Causes: hydrocephalus, megalencephaly, overgrowth syndromes (Sotos, BWS), benign familial macrocephaly.

### Case MA1 — Isolated benign macrocephaly at 32 weeks (THRESHOLD-DERIVED)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 95 mm (+2 SD) | >97th |
| Skull OFD | 124 mm | >97th |
| Brain BPD | 93 mm | >97th |
| (others) | filler | normal |

`macrocephaly_pattern` fires.
**Citation.** Bosemani 2015.

### Case MA2 — Macrocephaly secondary to severe hydrocephalus (cross-reference)

Cross-reference: see §4, Case S1 (severe VM + macrocephaly + 3rd-V dilatation, aqueductal-stenosis pattern).

### Case MA3 — Macrocephaly with megalencephaly + thick CC at 32 weeks (overgrowth syndrome pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 96 mm | >97th |
| Brain BPD | 94 mm | >97th |
| CC | 47 mm | >95th |
| (others) | filler | normal |

`macrocephaly_pattern`, `cc_thick` fire — overgrowth-syndrome combined pattern.
**Citation.** Garel 2011; Bosemani 2015.

### Case MA4 — Borderline macrocephaly (z = +1.7) at 30 weeks (negative control)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 87 mm (+1.7 SD) | >95th but ≤ 97th |
| (others) | filler | normal |

`macrocephaly_pattern` should *not* fire. Boundary verification.

### Case MA5 — Macrocephaly + thick CC + macrocerebellum (Sotos pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 96 mm | >97th |
| Brain BPD | 94 mm | >97th |
| TCD | 45 mm (+2 SD) | >95th |
| CC | 47 mm | >95th |
| Pons AP | 13 mm | >95th |
| (others) | filler | normal |

`macrocephaly_pattern`, `cc_thick`, `large_tcd`, `pons_large` fire — strongly suggests an overgrowth syndrome (Sotos / BWS / PIK3CA-related overgrowth).
**Citation.** Bosemani 2015.

### Case MA6 — Macrocephaly with severe VM and dilated 3rd-V (aqueductal stenosis / triventricular hydrocephalus, cross-reference)

Cross-reference: see §4, Case S1 and §22, Case AS-P1.

---

## 21. Third ventricle dilatation (width > 3.5 mm)

The `third_ventricle_dilatation` card fires when 3rd-V width > 3.5 mm. The Hertzberg 1997 threshold of 3.5 mm is the canonical fetal 3rd-V upper bound. Third ventricle is a raw-threshold auxiliary input: the calculator records the measurement and can fire the DDx card, but it does not compute or report a z-score for this row.

### Case TV1 — Triventricular hydrocephalus from aqueductal stenosis at 28 weeks (THRESHOLD-DERIVED, Hertzberg 1997)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 18 mm | >95th |
| Atrium-L | 18 mm | >95th |
| CSP | 4.4 mm | normal |
| CC | 32 mm | normal |
| Third ventricle | 5.0 mm (>3.5 mm threshold) | >95th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `third_ventricle_dilatation`, **`aqueductal_stenosis_pattern`** fire.
**Citation.** Hertzberg BS, Kliewer MA, Freed KS, et al. Third ventricle: size and appearance in normal fetuses through gestation. *Radiology.* 1997;203(3):641–644. doi:10.1148/radiology.203.3.9169681.

### Case TV2 — Isolated third ventricle dilatation at 30 weeks (rare)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Third ventricle | 4.0 mm | >95th |
| Atrium-R | 8.0 mm | normal |
| Atrium-L | 8.0 mm | normal |
| (others) | filler | normal |

`third_ventricle_dilatation` fires. The IMPRESSION should suggest "isolated third ventricle prominence — uncommon; consider early aqueductal stenosis or measurement-technique error; recommend short-interval follow-up."
**Citation.** Hertzberg 1997.

### Case TV3 — Third ventricle prominence at boundary (3.6 mm) at 32 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Third ventricle | 3.6 mm | >95th |
| (others) | filler | normal |

`third_ventricle_dilatation` fires (just above the 3.5-mm threshold). Boundary verification.

### Case TV4 — Third ventricle at sub-threshold (3.4 mm) — negative control

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Third ventricle | 3.4 mm | normal |
| (others) | filler | normal |

`third_ventricle_dilatation` should *not* fire (3.4 < 3.5). Boundary verification from below.

### Case TV5 — Third ventricle dilatation with HPE pattern (cross-reference)

Cross-reference: see §16, HPE alobar cases. In alobar HPE, the third ventricle is non-measurable due to fused thalami; the trigger should not fire (special-cased).

### Case TV6 — Severe triventricular hydrocephalus (atrium 22 mm, 3rd-V 6 mm) at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Atrium-R | 22 mm | >95th |
| Atrium-L | 22 mm | >95th |
| Third ventricle | 6.0 mm | >95th |
| Skull BPD | 92 mm | >97th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `third_ventricle_dilatation`, `macrocephaly_pattern`, **`aqueductal_stenosis_pattern`** fire.
**Citation.** Heaphy-Henault 2018.

---

## 22. Aqueductal stenosis pattern / triventricular hydrocephalus

The `aqueductal_stenosis_pattern` combined-pattern card fires when severe VM is co-present with third-ventricle dilatation, preserved CSP, and macrocephaly. Per Heaphy-Henault 2018, this combination accurately predicts a postnatal diagnosis of aqueductal stenosis.

### Case AS-P1 — Classical aqueductal stenosis at 26 weeks (cross-reference S1)

Cross-reference: see §4, Case S1. All four pattern-defining features are present: severe VM + 3rd-V > 3.5 mm + preserved CSP + macrocephaly.

### Case AS-P2 — Aqueductal stenosis at 30 weeks with mild bilateral VM but pronounced 3rd-V dilatation (early-evolving form)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Atrium-R | 14 mm | >95th |
| Atrium-L | 14 mm | >95th |
| CSP | 4.7 mm | normal |
| CC | 36 mm | normal |
| Third ventricle | 5.5 mm | >95th |
| Skull BPD | 88 mm | normal |
| (others) | filler | normal |

`mild_ventriculomegaly`, `third_ventricle_dilatation` fire. **`aqueductal_stenosis_pattern`** may *or may not* fire depending on whether the calculator requires *severe* VM — per SPEC.md §4.6, the pattern requires "atrial > 95th + third ventricle > 3.5 mm + preserved CSP" without requiring severe VM specifically. Expected behaviour: `aqueductal_stenosis_pattern` fires.
**Citation.** Heaphy-Henault 2018.

### Case AS-P3 — Severe VM with absent CSP — negative control for aqueductal stenosis (the absent CSP rules out aqueductal stenosis and points instead to ACC/HPE)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 18 mm | >95th |
| Atrium-L | 18 mm | >95th |
| CSP | absent | special-cased |
| Third ventricle | 4.0 mm | >95th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `csp_absent`, `third_ventricle_dilatation` fire. **`aqueductal_stenosis_pattern`** should *not* fire (CSP absent breaks the pattern). Negative-control verification.
**Citation.** Heaphy-Henault 2018.

### Case AS-P4 — Severe VM with normal 3rd-V — negative control for aqueductal stenosis

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 17 mm | >95th |
| Atrium-L | 17 mm | >95th |
| CSP | 4.4 mm | normal |
| Third ventricle | 2.0 mm | normal |
| (others) | filler | normal |

`severe_ventriculomegaly` fires; `aqueductal_stenosis_pattern` does *not* fire. Verifies that severe VM alone is insufficient to trigger the pattern.

### Case AS-P5 — Aqueductal stenosis at 24 weeks (early third-trimester onset)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Atrium-R | 16 mm | >95th |
| Atrium-L | 16 mm | >95th |
| CSP | 3.4 mm | normal |
| Third ventricle | 4.5 mm | >95th |
| Skull BPD | 70 mm (+2 SD) | >97th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `third_ventricle_dilatation`, `macrocephaly_pattern`, **`aqueductal_stenosis_pattern`** fire.
**Citation.** Heaphy-Henault 2018.

### Case AS-P6 — Aqueductal stenosis at 36 weeks with very severe progression

| Parameter | Value | Expected band |
|---|---|---|
| GA | 36 w 0 d | — |
| Atrium-R | 25 mm | >95th |
| Atrium-L | 25 mm | >95th |
| CSP | 5.4 mm | normal |
| Third ventricle | 7.0 mm | >95th |
| Skull BPD | 110 mm | >97th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `third_ventricle_dilatation`, `macrocephaly_pattern`, **`aqueductal_stenosis_pattern`** fire. Late-gestation severe progression.
**Citation.** Heaphy-Henault 2018.

---

## 23. Chiari II / open neural tube defect

The `chiari_ii_open_ntd` card fires when CSA z < –2 AND TDPF z < –2 AND the Mahalanobis posterior probability of ONTD > 0.5 (SPEC.md §6.5).

### Case CII1 — Aertsen 2019 pre-op cohort fixture at 28 weeks (COHORT-MEAN)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 32.0 mm (z ≈ –2) | <5th |
| Vermis CC | 14 mm (z ≈ –1.8) | <5th |
| Vermis AP | 6.5 mm (z ≈ –1.5) | borderline |
| Pons AP | 9.5 mm | normal |
| **CSA** | **65.9°** (Aertsen 2019 cohort mean) | abnormal |
| **TDPF** | reduced for GA (z ≈ –2.5) | <5th |
| Cerebellar herniation level | –9.9 mm | qualitative |
| (others) | filler | normal |

`small_tcd`, `vermian_hypoplasia` (CC component), **`chiari_ii_open_ntd`** fire.
**Citation.** Aertsen 2019.

### Case CII2 — Aertsen 2019 post-op (post-fetal-surgery) at 30 weeks (COHORT-MEAN)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| **CSA** | **76.6°** (Aertsen 2019 post-op mean) | normalising |
| **TDPF** | recovering toward normal | borderline |
| Cerebellar herniation level | –0.7 mm | qualitative |
| (others) | filler | normal |

`chiari_ii_open_ntd` may *or may not* fire depending on whether CSA crosses back above the threshold; if Mahalanobis posterior < 0.5, the card does not fire — verifying the post-surgical normalisation.
**Citation.** Aertsen 2019.

### Case CII3 — Severe Chiari II at 24 weeks (COHORT-MEAN)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 24 w 0 d | — |
| Skull BPD | 56 mm (lemon sign) | <5th |
| Brain BPD | 54 mm | <5th |
| Atrium-R | 14 mm | >95th |
| Atrium-L | 14 mm | >95th |
| TCD | 24 mm (banana sign) | <5th |
| Vermis CC | 11 mm | <5th |
| Vermis AP | 5.0 mm | <5th |
| Pons AP | 7.0 mm | <5th |
| CSA | 60° | abnormal |
| TDPF | reduced (z ≈ –3) | <5th |
| (others) | filler | normal |

`mild_ventriculomegaly`, `small_tcd`, `vermian_hypoplasia`, `small_pons`, **`chiari_ii_open_ntd`** fire.
**Citation.** Aertsen 2019; D'Addario V, Pinto V, Di Cagno L, Pintucci A. The clivus-supraocciput angle: a useful measurement to evaluate the shape and size of the fetal posterior fossa and to diagnose Chiari II malformation. *Ultrasound Obstet Gynecol.* 2001;18(2):146–149. doi:10.1046/j.1469-0705.2001.00409.x.

### Case CII4 — Chiari II at 32 weeks with severe hydrocephalus (combined pattern)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Atrium-R | 18 mm | >95th |
| Atrium-L | 18 mm | >95th |
| CSP | 5.0 mm | normal |
| Third ventricle | 4.0 mm | >95th |
| Skull BPD | 95 mm | >97th |
| TCD | 36 mm (z ≈ –2.5) | <5th |
| Vermis CC | 17 mm (z ≈ –1.9) | <5th |
| CSA | 68° | abnormal |
| TDPF | reduced | <5th |
| (others) | filler | normal |

`severe_ventriculomegaly`, `third_ventricle_dilatation`, `macrocephaly_pattern`, `aqueductal_stenosis_pattern`, `small_tcd`, `vermian_hypoplasia`, **`chiari_ii_open_ntd`** fire — multi-pattern fixture verifying the engine handles overlapping triggers.
**Citation.** Aertsen 2019; Heaphy-Henault 2018.

### Case CII5 — Chiari II with normal CSA — negative control

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 33 mm (z ≈ –1.8) | <5th |
| Vermis CC | 15 mm | borderline |
| CSA | 85° (normal range) | normal |
| TDPF | normal for GA | normal |
| (others) | filler | normal |

`small_tcd` fires; `chiari_ii_open_ntd` does *not* fire (CSA is normal, breaking the pattern). Negative-control verification.
**Citation.** D'Addario 2001.

### Case CII6 — Subtle Chiari II at 22 weeks (early presentation, before crowding fully develops)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 22 w 0 d | — |
| TCD | 22 mm | normal |
| Vermis CC | 10 mm | normal |
| CSA | 70° | borderline-low |
| TDPF | mildly reduced | borderline |
| (others) | filler | normal |

`chiari_ii_open_ntd` may fire only if Mahalanobis posterior ≥ 0.5 — depends on the specific calibration; the case is included to test the boundary behaviour of the Mahalanobis classifier.
**Citation.** Aertsen 2019.

---

## 24. Hemispheric asymmetry (brain OFD-L vs OFD-R discordant by > 2 SD)

The `hemispheric_asymmetry` card fires when the difference between the two cerebral hemispheric OFD measurements exceeds the engine's asymmetry threshold (per SPEC.md §4.6, > 2 SD difference). Causes: unilateral schizencephaly, porencephaly, encephaloclastic insult, focal cortical dysplasia.

### Case HA1 — Right-hemisphere disruption (porencephaly) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Brain OFD-L | 97 mm | normal |
| Brain OFD-R | 88 mm (z ≈ –2 SD) | <5th |
| Atrium-R | 14 mm | >95th |
| Atrium-L | 8 mm | normal |
| (others) | filler | normal |

`hemispheric_asymmetry`, `mild_ventriculomegaly` (right), `asymmetric_ventricles` fire. Combined pattern strongly suggests right-hemisphere encephaloclastic insult.
**Citation.** Barzilay 2017; Garel 2004.

### Case HA2 — Left-hemisphere schizencephaly at 26 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Brain OFD-L | 80 mm (z ≈ –2 SD) | <5th |
| Brain OFD-R | 88 mm | normal |
| Atrium-L | 12 mm | >95th |
| Atrium-R | 7 mm | normal |
| (others) | filler | normal |

`hemispheric_asymmetry`, `mild_ventriculomegaly` (left), `asymmetric_ventricles` fire.
**Citation.** Barzilay 2017.

### Case HA3 — Bilateral but asymmetric atrophy at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Brain OFD-L | 95 mm | <5th |
| Brain OFD-R | 100 mm | <5th |
| Atrium-R | 12 mm | >95th |
| Atrium-L | 14 mm | >95th |
| (others) | filler | normal |

Brain-volume-loss + `mild_ventriculomegaly` + `asymmetric_ventricles` fire; `hemispheric_asymmetry` may or may not fire depending on whether the Δ exceeds the threshold (5 mm at 30 w is ~ 2 SD).
**Citation.** Garel 2004.

### Case HA4 — Symmetric brain (negative control) at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Brain OFD-L | 97 mm | normal |
| Brain OFD-R | 97 mm | normal |
| (others) | filler | normal |

`hemispheric_asymmetry` should *not* fire. Negative control.

### Case HA5 — Borderline asymmetry (Δ = 1.5 SD) — negative control

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Brain OFD-L | 100 mm | normal |
| Brain OFD-R | 96 mm | normal |
| (others) | filler | normal |

`hemispheric_asymmetry` should *not* fire. Boundary verification.

### Case HA6 — Severe hemispheric asymmetry with associated severe VM (encephaloclastic injury)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Brain OFD-L | 95 mm | <5th |
| Brain OFD-R | 80 mm | <5th |
| Atrium-R | 16 mm | >95th |
| Atrium-L | 10 mm | normal |
| (others) | filler | normal |

`hemispheric_asymmetry`, `severe_ventriculomegaly` (right), `asymmetric_ventricles` fire.
**Citation.** Barzilay 2017.

---

## 25. Widened extra-axial CSF space (subarachnoid space prominence)

The `extra_axial_widened` card fires when the extra-axial CSF space exceeds the GA-adjusted normal upper bound (per SPEC.md §4.6, > 95th percentile of the Kyriakopoulou 2017 extra-cerebral CSF chart). Kyriakopoulou defines the 2D extra-cerebral CSF width as skull BPD minus brain BPD. Causes: external hydrocephalus, brain volume loss, IUGR, congenital infection.

### Case EA1 — Benign external hydrocephalus pattern at 32 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 92 mm | >95th |
| Brain BPD | 86 mm | normal |
| Extra-axial CSF | 14 mm (above Kyriakopoulou 2017 95th centile at 32 w) | >95th |
| (others) | filler | normal |

`extra_axial_widened` fires. The IMPRESSION should suggest "external hydrocephalus / benign macrocrania of infancy — typically self-resolving."
**Citation.** Kyriakopoulou V, Vatansever D, Davidson A, et al. Normative biometry of the fetal brain using magnetic resonance imaging. *Brain Struct Funct.* 2017;222(5):2295–2307. doi:10.1007/s00429-016-1342-6.

### Case EA2 — Brain-volume-loss pattern at 30 weeks (post-CMV)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 78 mm (–2 SD) | <5th |
| Brain BPD | 74 mm | <5th |
| Atrium-R | 12 mm | >95th |
| Atrium-L | 12 mm | >95th |
| Extra-axial CSF | 14 mm | >95th |
| (others) | filler | normal |

`microcephaly_pattern`, `mild_ventriculomegaly`, `extra_axial_widened` fire — combined "brain volume loss" pattern. The IMPRESSION should suggest CMV or other intrauterine destructive insult.
**Citation.** Cannie 2016; Kyriakopoulou 2017.

### Case EA3 — Borderline extra-axial space (negative control) at 30 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Extra-axial CSF | 10.6 mm | normal |
| (others) | filler | normal |

`extra_axial_widened` should *not* fire. Boundary verification.

### Case EA4 — Severe IUGR with widened extra-axial space at 28 weeks

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | 65 mm (–3 SD) | <3rd |
| Brain BPD | 63 mm | <3rd |
| Extra-axial CSF | 14 mm | >95th |
| (others) | filler | normal |

`microcephaly_pattern`, `extra_axial_widened` fire. The IMPRESSION should reference IUGR.

### Case EA5 — Mega cisterna magna with widened extra-axial space (cross-reference)

Cross-reference: see §8 Blake's pouch cases. Mega cisterna magna may co-present with prominent supratentorial extra-axial space when intracranial pressure is reduced.

### Case EA6 — Widened extra-axial space at 36 weeks, isolated

| Parameter | Value | Expected band |
|---|---|---|
| GA | 36 w 0 d | — |
| Extra-axial CSF | 14 mm | >95th |
| Skull BPD | 95 mm (+2 SD) | >97th |
| (others) | filler | normal |

`extra_axial_widened`, `macrocephaly_pattern` fire. Likely benign external hydrocephalus.
**Citation.** Kyriakopoulou 2017.

---

## 26. Negative-control patterns (combined-card subsumption tests)

These cases verify that the engine **does not** fire combined-pattern cards when only a partial pattern is present, and that combined cards correctly *subsume* the standalone cards in the IMPRESSION when the full pattern is met.

### Case NEG1 — Mild VM with absent CSP — should *not* fire HPE pattern (insufficient features)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 11 mm | >95th |
| Atrium-L | 11 mm | >95th |
| CSP | absent | special-cased |
| Skull BPD | 88 mm | normal |
| (others) | filler | normal |

`mild_ventriculomegaly`, `csp_absent` fire. **`hpe_pattern`** must *not* fire (no monoventricle, no microcephaly, no fused thalami).

### Case NEG2 — Short CC alone — should *not* fire ACC pattern (CC partially present)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| CC | 28 mm (z ≈ –2.5) | <5th |
| CSP | 4.0 mm | normal |
| (others) | filler | normal |

`cc_short` fires. `acc_pattern` does *not* fire (CSP present, CC partially present, no colpocephaly).

### Case NEG3 — Severe VM alone with normal CSP and normal 3rd-V — should *not* fire aqueductal stenosis pattern

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Atrium-R | 17 mm | >95th |
| Atrium-L | 17 mm | >95th |
| CSP | 4.4 mm | normal |
| Third ventricle | 2.0 mm | normal |
| (others) | filler | normal |

`severe_ventriculomegaly` fires. `aqueductal_stenosis_pattern` does *not* fire (3rd-V is normal).

### Case NEG4 — Mildly small TCD alone — should *not* fire DWM spectrum or PCH pattern

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 33 mm (z ≈ –1.7) | <5th |
| Vermis CC | 17 mm | normal |
| Pons AP | 9.5 mm | normal |
| (others) | filler | normal |

`small_tcd` fires alone. Neither `dandy_walker_spectrum` nor `pch_pattern` fires (vermis and pons both normal).

### Case NEG5 — Macrocephaly alone — should *not* fire overgrowth-syndrome pattern (no thick CC, no megalencephaly, no large pons)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 32 w 0 d | — |
| Skull BPD | 95 mm (+2 SD) | >97th |
| Brain BPD | 90 mm | normal |
| CC | 41 mm | normal |
| Pons AP | 11 mm | normal |
| (others) | filler | normal |

`macrocephaly_pattern` fires alone. The qualitative "overgrowth-syndrome" suggestion in the IMPRESSION should not appear without supporting features.

### Case NEG6 — Severe VM with cerebellar findings (Chiari II) but no CSA reduction — should *not* fire Chiari II / ONTD card

Cross-reference: see §23, Case CII5. Verifies the Mahalanobis-posterior gating.

---

## 27. Engine-stress fixtures (boundary, GA-extreme, and multi-card simultaneous-fire tests)

These cases stress-test specific aspects of the engine's arithmetic and the report-generation logic.

### Case STRESS1 — All-z = 0 fixture (every z-scored parameter exactly at the GA-specific mean)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| Skull BPD | exact μ at 28 w | normal (z = 0) |
| All other z-scored parameters | each set to the exact μ at 28 w from §7 source registry | normal (z = 0) |
| Third ventricle | 1.7 mm filler | normal raw threshold |

No DDx card fires. Every z-scored measurement should report z = 0.0 ± 0.05; the third ventricle should remain a raw-threshold auxiliary value with no z-score output. Tests the engine's arithmetic with no rounding noise.
**Citation.** Source registry §7.3 of SPEC.md (Luis 2025, Dovjak 2021, Woitek 2014) and Hertzberg 1997 for the raw third-ventricle threshold.

### Case STRESS2 — Lowest-supported GA (18 w) — confirms GA-bounds extrapolation flagging

| Parameter | Value | Expected band |
|---|---|---|
| GA | 18 w 0 d | — |
| Skull BPD | 40 mm | normal but **extrapolated** (Luis 2025 valid 20–40 w) |
| Brain BPD | 38 mm | extrapolated |
| All others | filler | mostly extrapolated |

The engine should fire no DDx cards because all values are within μ ± 1.645σ, but every parameter row should display the **extrapolated-band** flag (per SPEC.md §4.2.4).
**Citation.** Luis 2025 valid 20–40 w; Dovjak 2021 valid 18–35 w; the third ventricle remains a raw-threshold auxiliary input.

### Case STRESS3 — Highest-supported GA (40 w) — confirms upper-bound behaviour

| Parameter | Value | Expected band |
|---|---|---|
| GA | 40 w 0 d | — |
| Skull BPD | 99 mm | normal |
| Brain BPD | 96 mm | normal |
| Atrium-R | 7 mm | normal |
| Atrium-L | 7 mm | normal |
| TCD | 50 mm | normal |
| Vermis CC | 24.5 mm | normal |
| Pons AP | 16 mm | normal |
| (others) | filler | normal |

No DDx card fires. Confirms the engine handles the upper GA bound without collapse.

### Case STRESS4 — Extreme-z (z = +5) macrocephaly fixture

| Parameter | Value | Expected band |
|---|---|---|
| GA | 30 w 0 d | — |
| Skull BPD | 105 mm (z ≈ +5) | >99.9th |
| Brain BPD | 102 mm | >99.9th |
| Skull OFD | 145 mm | >99.9th |
| (others) | filler | normal |

`macrocephaly_pattern` fires; the engine should report z = 5.0 ± 0.5 without overflow (percentile reported as ≥99.9). Tests Φ saturation.

### Case STRESS5 — Multi-card simultaneous fire (12+ cards)

A worst-case fixture combining HPE, severe VM, cerebellar hypoplasia, vermian hypoplasia, small pons, microcephaly, third-ventricle dilatation, hemispheric asymmetry, widened extra-axial space, and short CC. Tests that the IMPRESSION renders all cards in priority order, that combined patterns subsume their components correctly, and that the report does not exceed any internal length limit.

| Parameter | Value | Expected band |
|---|---|---|
| GA | 26 w 0 d | — |
| Skull BPD | 60 mm (–3 SD) | <3rd |
| Skull OFD | 80 mm | <3rd |
| Brain BPD | 56 mm (–3 SD) | <3rd |
| Brain OFD-L | 78 mm | <3rd |
| Brain OFD-R | 65 mm | <3rd |
| Atrium-R | 18 mm | >95th |
| Atrium-L | 18 mm | >95th |
| CSP | absent | special-cased |
| CC | absent | special-cased |
| TCD | 25 mm (z ≈ –3) | <5th |
| Vermis CC | 9.0 mm | <5th |
| Vermis AP | 4.0 mm | <5th |
| Pons AP | 6.5 mm | <5th |
| Third ventricle | 4.5 mm | >95th |
| Extra-axial CSF | 14 mm | >95th |

Expected fires (10+ cards): `severe_ventriculomegaly`, `csp_absent`, `cc_absent`, `small_tcd`, `vermian_hypoplasia`, `small_pons`, `microcephaly_pattern`, `third_ventricle_dilatation`, `hemispheric_asymmetry`, `extra_axial_widened`, **`hpe_pattern`**, **`pch_pattern`**, **`dandy_walker_spectrum`**.

### Case STRESS6 — Low-z with multi-source disagreement (TCD with z_Luis = +0.5, z_Dovjak = +1.7)

| Parameter | Value | Expected band |
|---|---|---|
| GA | 28 w 0 d | — |
| TCD | 36.0 mm | normal |
| (others) | filler | normal |

Verifies the consensus engine flags **disagreement** (|Δz| ≥ 1 SD between Luis and Dovjak per SPEC.md §4.2.3); the report's SOURCE-AGREEMENT NOTES section must include this measurement.
**Citation.** SPEC.md §4.2 multi-source consensus engine.

---

## 28. Coverage summary

| # | Diagnosis | Cases | DDx cards covered |
|---|---|---:|---|
| 2 | Normal controls | 6 | (none expected) |
| 3 | Mild–moderate VM | 6 | `mild_ventriculomegaly`, `mild_ventriculomegaly` (asymmetric) |
| 4 | Severe VM | 6 | `severe_ventriculomegaly`, `aqueductal_stenosis_pattern` |
| 5 | Asymmetric ventricles | 5 | `asymmetric_ventricles` |
| 6 | Inferior vermian hypoplasia | 6 | `vermian_hypoplasia` |
| 7 | Dandy-Walker malformation | 6 | `vermian_hypoplasia`, `dandy_walker_spectrum`, `small_tcd`, `small_pons` |
| 8 | Blake's pouch cyst | 5 | (negative control for DWM) |
| 9 | Cerebellar hypoplasia (small TCD) | 5 | `small_tcd` |
| 10 | Macrocerebellum (large TCD) | 5 | `large_tcd` |
| 11 | Agenesis of corpus callosum | 6 | `cc_absent`, `acc_pattern` |
| 12 | Short / dysgenetic CC | 5 | `cc_short` |
| 13 | Thick CC | 5 | `cc_thick` |
| 14 | Absent CSP (isolated) | 5 | `csp_absent` |
| 15 | Enlarged CSP | 6 | `csp_enlarged` |
| 16 | Holoprosencephaly | 6 | `hpe_pattern`, `csp_absent`, `severe_ventriculomegaly` |
| 17 | Small pons (PCH) | 6 | `small_pons`, `pch_pattern` |
| 18 | Large pons | 6 | `pons_large` |
| 19 | Microcephaly | 6 | `microcephaly_pattern` |
| 20 | Macrocephaly | 6 | `macrocephaly_pattern` |
| 21 | Third ventricle dilatation | 6 | `third_ventricle_dilatation` |
| 22 | Aqueductal stenosis pattern | 6 | `aqueductal_stenosis_pattern` |
| 23 | Chiari II / open NTD | 6 | `chiari_ii_open_ntd` |
| 24 | Hemispheric asymmetry | 6 | `hemispheric_asymmetry` |
| 25 | Widened extra-axial space | 6 | `extra_axial_widened` |
| 26 | Negative-control patterns | 6 | (combined-card subsumption tests) |
| 27 | Engine-stress fixtures | 6 | (boundary + saturation + disagreement) |

**Total cases:** ≥ 144. Every DDx card the calculator can fire has at least 5 positive-control cases and at least 1 negative-control case. Every measured parameter (14) appears in at least 6 cases at varied GA.

---

## 29. References

[1] Luis JC, et al. Automatic fetal brain biometry from 3D structural MRI. *medRxiv* 2025. doi:10.1101/2025.02.06.25321808. PMC12881129.
[2] Garel C. *MRI of the Fetal Brain: Normal Development and Cerebral Pathologies.* Springer; 2004.
[3] Tilea B, et al. Cerebral biometry in fetal magnetic resonance imaging: new reference data. *Ultrasound Obstet Gynecol.* 2009;33(2):173–181. doi:10.1002/uog.6276.
[4] Luis JC, et al. (see [1]). PubMed PMID 39006400.
[5] Carta S, et al. Outcome of fetuses with prenatal diagnosis of isolated severe bilateral ventriculomegaly: systematic review and meta-analysis. *Ultrasound Obstet Gynecol.* 2018;52(2):165–173. doi:10.1002/uog.19038.
[6] Barzilay E, et al. Fetal magnetic resonance imaging in cases of inconclusive ultrasound. *AJNR Am J Neuroradiol.* 2017;38(7):1444–1448. doi:10.3174/ajnr.A5179.
[7] Heaphy-Henault KJ, Guimaraes CV, Mehollin-Ray AR, Cassady CI, Zhang W, Desai NK, Paldino MJ. Congenital aqueductal stenosis: findings at fetal MRI that accurately predict a postnatal diagnosis. *AJNR Am J Neuroradiol.* 2018;39(5):942–948. doi:10.3174/ajnr.A5590. PMID 29519789; PMCID PMC7410663.
[8] Pagani G, Thilaganathan B, Prefumo F. Neurodevelopmental outcome in isolated mild fetal ventriculomegaly: systematic review and meta-analysis. *Ultrasound Obstet Gynecol.* 2014;44(3):254–260. doi:10.1002/uog.13364.
[9] Nagaraj UD, et al. Fetal MRI of the posterior fossa: comparison of measurements in normal fetuses, Dandy-Walker malformation, vermian hypoplasia, and Blake's pouch cyst. *Pediatr Radiol.* 2021;51(11):2027–2035. doi:10.1007/s00247-021-05086-9. PMC8423037.
[10] Tang PH, et al. Agenesis of the corpus callosum: an MR imaging analysis of associated abnormalities in the fetus. *AJNR Am J Neuroradiol.* 2009;30(2):257–263. doi:10.3174/ajnr.A1331. PMC7051410.
[11] Griffiths PD, Jarvis D, Connolly DJ, et al. Holoprosencephaly: in utero MR imaging in 32 patients. *Br J Radiol.* 2016;89(1057):20150892. doi:10.1259/bjr.20150892.
[12] Aertsen M, Verduyckt J, De Keyzer F, et al. Reliability of MR Imaging-Based Posterior Fossa and Brain Stem Measurements in Open Spinal Dysraphism in the Era of Fetal Surgery. *AJNR Am J Neuroradiol.* 2019;40(1):191–198. doi:10.3174/ajnr.A5930. PMID 30606726; PMCID PMC7048594.
[13] Limperopoulos C, et al. Inferior vermian hypoplasia. *Pediatrics* 2006;118:e2106. PMC1557637.
[14] Marathu KK, et al. Fetal MRI of the corpus callosum: imaging spectrum of associated anomalies. *Children (Basel)* 2024;11(2):197. doi:10.3390/children11020197.
[15] Conte G, et al. Reference biometry of the fetal brain at MRI: tegmento-vermian angle, cisterna magna, and tail sign. *Eur Radiol.* 2018;28:3949–3957. doi:10.1007/s00330-018-5325-7.
[16] Santo S, et al. Counseling in fetal medicine: agenesis of the corpus callosum. *Ultrasound Obstet Gynecol.* 2012;40(5):513–521. doi:10.1002/uog.12315.
[17] Sun H, Li K, Wang L, Zhao L, Yan C, Kong X, Liu N. Fetal agenesis of the corpus callosum: clinical and genetic analysis in a series of 40 patients. *Eur J Obstet Gynecol Reprod Biol.* 2024;298:146–152. doi:10.1016/j.ejogrb.2024.05.005. PMID 38756055.
[18] Bromley B. Fetal MRI of vermian hypoplasia: 24-week case at CC vermis 10.9 mm vs expected 14.8 mm. (Sonographic exemplar.)
[19] Patel S, Barkovich AJ. Analysis and classification of cerebellar malformations. *AJNR Am J Neuroradiol.* 2002;23(7):1074–1087.
[20] Whitehead MT, et al. Refining the neuroimaging definition of the Dandy-Walker phenotype. *AJNR Am J Neuroradiol.* 2022;43(10):1488–1493. doi:10.3174/ajnr.A7659.
[21] Gafner M, Yagel I, Fried S, Ezra O, Bar-Yosef O, Katorza E. Fetal brain biometry in isolated mega cisterna magna: MRI and US study. *J Matern Fetal Neonatal Med.* 2022;35(21):4199–4207. doi:10.1080/14767058.2020.1849094. PMID 33207970.
[22] Hertzberg BS, Kliewer MA, Freed KS, et al. Third ventricle: size and appearance in normal fetuses through gestation. *Radiology.* 1997;203(3):641–644. doi:10.1148/radiology.203.3.9169681.
[23] Birnbaum R, et al. The third ventricle of the human fetal brain: normative data and pathologic correlation. *Prenat Diagn.* 2018;38(9):664–672. doi:10.1002/pd.5292.
[24] Achiron R, et al. Fetal corpus callosum biometry from 14 to 25 weeks of gestation. *J Ultrasound Med.* 2001;20(4):343–348.
[25] Garel C. The role of MRI in the evaluation of the fetal brain with an emphasis on biometry, gyration and parenchyma. *Pediatr Radiol.* 2004;34(9):694–699.
[26] Velinov M, Schimke RN. Macrocephaly differential diagnosis. (See also Bosemani 2015.)
[27] Bosemani T, et al. Pediatric cerebellar disease. *AJNR Am J Neuroradiol.* 2015;36(1):4–14. doi:10.3174/ajnr.A4143.
[28] Garel C. Fetal MRI: what is the future? *Ultrasound Obstet Gynecol.* 2011;38(2):123–125. doi:10.1002/uog.9070.
[29] Birnbaum R 2018 (see [23]).
[30] Malinger G, et al. Differential diagnosis in fetuses with absent septum pellucidum. *Ultrasound Obstet Gynecol.* 2005;25(1):42–49.
[31] Falco P, et al. Transvaginal sonography of the cavum septum pellucidum in fetuses with absence of the corpus callosum and other midline anomalies. *Ultrasound Obstet Gynecol.* 2000;16(2):145–149. doi:10.1046/j.1469-0705.2000.00170.x.
[32] Bronshtein M, Weiner Z. Prenatal diagnosis of dilated cava septi pellucidi et vergae. *Obstet Gynecol.* 1992;80(5):838–842.
[33] Malinger G, Lerman-Sagie T, Bermann D, Lev D. Prenatal diagnosis of holoprosencephaly. *Prenat Diagn.* 2013;33(13):1222–1228. doi:10.1002/pd.4244.
[34] van Dijk T, Baas F, Barth PG, Poll-The BT. What's new in pontocerebellar hypoplasia? An update on genes and subtypes. *Orphanet J Rare Dis.* 2018;13(1):92. doi:10.1186/s13023-018-0826-2.
[35] Dovjak GO, et al. Reference ranges for fetal brain biometry in MRI. *Ultrasound Obstet Gynecol.* 2021. doi:10.1002/uog.22162. PMC8457244.
[36] Namavar Y, Barth PG, Kasher PR, et al. Clinical, neuroradiological and genetic findings in pontocerebellar hypoplasia. *Brain.* 2011;134(Pt 1):143–156. doi:10.1093/brain/awq287.
[37] Poretti A, Boltshauser E, Doherty D. Cerebellar hypoplasia: differential diagnosis and diagnostic approach. *Am J Med Genet C Semin Med Genet.* 2014;166C(2):211–226. doi:10.1002/ajmg.c.31398.
[38] Pei R, Wang G, Wang Y, et al. Diagnostic and prognostic value of fetal MRI in microcephaly. *J Matern Fetal Neonatal Med.* 2024;37(1):2299109. doi:10.1080/14767058.2023.2299109.
[39] Cannie MM, Devlieger R, Leyder M, et al. Congenital cytomegalovirus infection: contribution and best timing of prenatal MR imaging. *Eur Radiol.* 2016;26(10):3760–3769. doi:10.1007/s00330-015-4187-0.
[40] Hertzberg 1997 (see [22]).
[41] D'Addario V, Pinto V, Di Cagno L, Pintucci A. The clivus-supraocciput angle: a useful measurement to evaluate the shape and size of the fetal posterior fossa and to diagnose Chiari II malformation. *Ultrasound Obstet Gynecol.* 2001;18(2):146–149. doi:10.1046/j.1469-0705.2001.00409.x.
[42] Kyriakopoulou V, Vatansever D, Davidson A, et al. Normative biometry of the fetal brain using MRI. *Brain Struct Funct.* 2017;222(5):2295–2307. doi:10.1007/s00429-016-1342-6.

---

*End of test corpus.*
