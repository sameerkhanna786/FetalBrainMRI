import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("SPEC §4.10 QI deployment protocol", () => {
  it("surfaces the pre/intervention/post report-audit endpoints on the Methodology page", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Methodology.tsx"),
      "utf8"
    );

    expect(source).toContain("100 historical fetal MRI reports");
    expect(source).toContain("100 new reports");
    expect(source).toContain("average time to report");
    expect(source).toContain("measurement completeness");
    expect(source).toContain("z-score and percentile documentation");
  });
});

describe("SPEC §7.5 source verification dossier", () => {
  it("cross-lists the clinician-owned verification action items with statuses", () => {
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );

    expect(dossier).toContain("Dovjak 2021 Table 1");
    expect(dossier).toContain("Woitek 2014 Table 3");
    expect(dossier).toContain("third-ventricle policy");
    expect(dossier).toContain("Section 7.4 citation pass");
    expect(dossier).toContain("Chiari II / ONTD calibration");
    expect(dossier).toContain("Status");
    expect(dossier).toContain("Open");
    expect(dossier).toContain("Closed");
  });
});

describe("publication-readiness source-document consistency", () => {
  it("keeps the third-ventricle policy raw-threshold-only outside the app code", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");
    const home = readFileSync(
      resolve(process.cwd(), "client/src/pages/Home.tsx"),
      "utf8"
    );

    expect(spec).toContain(
      "Third Ventricle Width (third_ventricle) -- raw-threshold auxiliary input"
    );
    expect(spec).toContain("z-score reporting is disabled");
    expect(spec).toContain("extra-axial CSF");
    expect(spec).not.toContain(
      "The third-ventricle z-score should be treated as ordinal"
    );
    expect(spec).not.toContain(
      "applies to the third-ventricle linear-mean / constant-SD model"
    );
    expect(spec).not.toContain("encoded `(0.02, 1.2, 0.6)`");
    expect(testCorpus).toContain(
      "Third ventricle is a raw-threshold auxiliary input"
    );
    expect(testCorpus).not.toContain(
      "third-ventricle z-score is computed from a hand-fitted approximation"
    );
    expect(home).not.toContain("Birnbaum&nbsp;2018");
    expect(home).toContain("third-ventricle raw-threshold checks");
  });

  it("keeps the Dandy-Walker combined-pattern manifest aligned to the TVA trigger", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain("| DWM pattern | Small vermis + elevated TVA |");
    expect(spec).not.toContain(
      "| DWM pattern | Small vermis + dilated 3rd V |"
    );
  });

  it("keeps the closed Section 7.4 citation-pass policy aligned across source documents", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );

    expect(dossier).toContain("| Section 7.4 citation pass");
    expect(dossier).toContain("| Closed | Implementation");
    expect(spec).toContain("report output surfaces qualitative labels");
    expect(spec).not.toContain("citation correction recommended");
    expect(spec).not.toContain("Fifth, run a citation pass over Section 7.4");
  });

  it("tracks literature-derived publication blockers in the handoff dossier", () => {
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );

    expect(dossier).toContain("TRIPOD+AI");
    expect(dossier).toContain("CLAIM");
    expect(dossier).toContain("DECIDE-AI");
    expect(dossier).toContain("FeTA 2024 biometry gap");
    expect(dossier).toContain("decision-curve net benefit");
    expect(dossier).toContain("IRB");
    expect(dossier).toContain("radiologist handoff");
  });

  it("keeps publication-critical TEST.md citations traceable and non-placeholder", () => {
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");
    const biometry = readFileSync(
      resolve(process.cwd(), "client/src/lib/biometry.ts"),
      "utf8"
    );

    expect(testCorpus).not.toMatch(
      /full citation pending|citation pending|pending citation/i
    );
    expect(testCorpus).toContain("10.7759/cureus.74462");
    expect(testCorpus).toContain("PMID 39726469");
    expect(testCorpus).toContain("10.1080/14767058.2020.1849094");
    expect(testCorpus).toContain("PMID 33207970");
    expect(testCorpus).not.toContain(
      "Cureus 2024 alobar HPE single-case fetus at 22 weeks (VERBATIM)"
    );
    expect(biometry).toContain("10.1080/14767058.2020.1849094");
    expect(biometry).not.toContain(
      "Mega Cisterna Magna: Current Perspectives and Future Directions. Cureus. 2025"
    );
  });

  it("keeps TEST.md citation lines free of stale numeric reference brackets", () => {
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");
    const citationLines = testCorpus
      .split("\n")
      .filter(line => line.startsWith("**Citation.**"));

    expect(citationLines.length).toBeGreaterThan(100);
    expect(citationLines.join("\n")).not.toMatch(/\[[0-9]+[a-z]?\]/);
  });

  it("locks Aertsen 2019 citation metadata to the PMC AJNR article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");

    expect(spec).toContain("10.3174/ajnr.A5930");
    expect(spec).not.toContain("10.3174/ajnr.A5921");
    expect(testCorpus).toContain(
      "Aertsen M, Verduyckt J, De Keyzer F, et al. Reliability of MR Imaging-Based Posterior Fossa and Brain Stem Measurements in Open Spinal Dysraphism in the Era of Fetal Surgery."
    );
    expect(testCorpus).toContain("10.3174/ajnr.A5930");
    expect(testCorpus).not.toContain("10.1002/uog.20214");
  });

  it("locks D'Addario 2001 citation metadata to the clivus-supraocciput article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");

    expect(spec).toContain("10.1046/j.1469-0705.2001.00409.x");
    expect(testCorpus).toContain("10.1046/j.1469-0705.2001.00409.x");
    expect(testCorpus).toContain("Di Cagno L, Pintucci A");
    expect(testCorpus).not.toContain("10.1046/j.1469-0705.2001.00472.x");
  });

  it("locks Sun 2024 ACC citation metadata to the PubMed and Crossref article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");
    const biometry = readFileSync(
      resolve(process.cwd(), "client/src/lib/biometry.ts"),
      "utf8"
    );

    expect(spec).toContain("10.1016/j.ejogrb.2024.05.005");
    expect(spec).toContain("38756055");
    expect(spec).toContain("S0301211524002264");
    expect(spec).not.toContain("10.1016/j.ejogrb.2024.05.022");
    expect(spec).not.toContain("S030121152400239X");
    expect(spec).not.toMatch(/precise yield requires eyes on Table 2/i);
    expect(testCorpus).toContain("Sun H");
    expect(testCorpus).toContain("10.1016/j.ejogrb.2024.05.005");
    expect(testCorpus).not.toContain("Sun L");
    expect(testCorpus).not.toContain("10.1016/j.ejogrb.2024.05.022");
    expect(biometry).toContain("10.1016/j.ejogrb.2024.05.005");
  });

  it("locks Heaphy-Henault 2018 aqueductal stenosis metadata to the AJNR article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");

    expect(spec).toContain("10.3174/ajnr.A5590");
    expect(spec).toContain("29519789");
    expect(spec).toContain("PMC7410663");
    expect(spec).not.toContain("29545253");
    expect(spec).not.toContain('citation correction: was "Garel 2018"');
    expect(spec).not.toContain(
      "Most common cause of obstructive hydrocephalus (Garel 2018)."
    );
    expect(testCorpus).toContain("PMID 29519789");
  });

  it("locks Corroenne 2023 corpus-callosum review metadata to the UOG article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain("10.1002/uog.26187");
    expect(spec).toContain("36864530");
    expect(spec).not.toContain("10.1002/uog.26280");
    expect(spec).not.toContain("36786414");
    expect(spec).not.toContain("PMC10464495");
    expect(spec).toContain(
      "Corpus callosal reference ranges: systematic review of methodology of biometric chart construction and measurements obtained"
    );
  });

  it("locks Ma 2019 atrial-diameter metadata to the Medicine fetal-MRI article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain("10.1097/MD.0000000000016118");
    expect(spec).toContain("31261528");
    expect(spec).toContain("PMC6616102");
    expect(spec).toContain(
      "Volume growth trend and correlation of atrial diameter with lateral ventricular volume in normal fetus and fetus with ventriculomegaly"
    );
    expect(spec).not.toContain("10.1002/jum.15003");
    expect(spec).not.toContain(
      "Ultrasound and Histopathologic Correlation of Ovarian Cystadenofibromas"
    );
    expect(spec).not.toContain(
      "Reference values for fetal lateral ventricular atrial diameter on MRI between 18 and 38 gestational weeks"
    );
  });

  it("locks Vatansever 2013 posterior-fossa metadata to the Cerebellum article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const biometry = readFileSync(
      resolve(process.cwd(), "client/src/lib/biometry.ts"),
      "utf8"
    );

    expect(spec).toContain("10.1007/s12311-013-0470-2");
    expect(spec).toContain("23553467");
    expect(spec).toContain(
      "Multidimensional Analysis of Fetal Posterior Fossa in Health and Disease"
    );
    expect(spec).toContain(
      "| VATANSEVER_2013 | Vatansever D, Kyriakopoulou V, Allsop JM, Fox M, Chew A, Hajnal JV, Rutherford MA."
    );
    expect(spec).not.toContain(
      "| VATANSEVER_2013 | Vatansever D et al. Normative MR biometry of the fetal cerebellum."
    );
    expect(biometry).toContain("10.1007/s12311-013-0470-2");
    expect(biometry).toContain("PMID 23553467");
  });

  it("locks Malinger 2005 metadata to the absent-septum-pellucidum article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const biometry = readFileSync(
      resolve(process.cwd(), "client/src/lib/biometry.ts"),
      "utf8"
    );

    expect(spec).toContain("10.1002/uog.1787");
    expect(spec).toContain("15593321");
    expect(spec).toContain(
      "Differential diagnosis in fetuses with absent septum pellucidum"
    );
    expect(spec).toContain(
      "| MALINGER_2005 | Malinger G, Lev D, Kidron D, Heredia F, Hershkovitz R, Lerman-Sagie T."
    );
    expect(spec).not.toContain(
      "| MALINGER_2005 | Malinger G, Lev D, Lerman-Sagie T. *Fetal cerebellar pitfalls in diagnosis and management.*"
    );
    expect(spec).not.toContain("(publisher landing page)");
    expect(biometry).toContain("doi:10.1002/uog.1787");
    expect(biometry).toContain("PMID 15593321");
  });

  it("locks Kertes 2021 CSP metadata to the European Journal of Radiology article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const biometry = readFileSync(
      resolve(process.cwd(), "client/src/lib/biometry.ts"),
      "utf8"
    );

    expect(spec).toContain("10.1016/j.ejrad.2020.109470");
    expect(spec).toContain("33338761");
    expect(spec).toContain(
      "The normal fetal Cavum Septum Pellucidum in MR imaging - New biometric data"
    );
    expect(spec).toContain(
      "| KERTES_2021 | Kertes I, Hoffman D, Yahal O, Berknstadt M, Bar-Yosef O, Ezra O, Katorza E."
    );
    expect(spec).not.toContain("(ScienceDirect S0720048X20306604)");
    expect(spec).not.toContain("Hoffman C, Yagel S");
    expect(spec).not.toContain(
      "Cavum septi pellucidi width on fetal MRI: normal values and reference range from 28 to 37 weeks"
    );
    expect(biometry).toContain("doi:10.1016/j.ejrad.2020.109470");
    expect(biometry).toContain("PMID 33338761");
  });

  it("locks Harreld 2011 corpus-callosum metadata to the AJNR fetal-MRI article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain(
      "| HARRELD_2011 | Harreld JH, Bhore R, Chason DP, Twickler DM."
    );
    expect(spec).toContain("10.3174/ajnr.A2310");
    expect(spec).toContain("21183616");
    expect(spec).toContain("PMC8013091");
    expect(spec).not.toContain("21183617");
    expect(spec).not.toContain("PMC7965598");
  });

  it("locks NCBI-audited source-inventory identifiers to their stated articles", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain(
      "| TILEA_2009 | Tilea B, Alberti C, Adamsbaum C, et al."
    );
    expect(spec).toContain(
      "| MRI | 10.1002/uog.6276 | 19172662 | (not in PMC) |"
    );
    expect(spec).toContain(
      "| KATORZA_2016 | Katorza E, Bertucci E, Perlman S, et al."
    );
    expect(spec).toContain(
      "| MRI | 10.3174/ajnr.A4725 | 27032974 | PMC7960333 |"
    );
    expect(spec).toContain(
      "| CONTE_2018 | Conte G, Milani S, Palumbo G, et al."
    );
    expect(spec).toContain(
      "| MRI | 10.3174/ajnr.A5574 | 29519792 | PMC7410661 |"
    );
    expect(spec).toContain(
      "| WOITEK_2014 | Woitek R, Dvorak A, Weber M, et al."
    );
    expect(spec).toContain(
      "| MRI | 10.1371/journal.pone.0112585 | 25393279 | PMC4231033 |"
    );
    expect(spec).toContain(
      "| AERTSEN_2019 | Aertsen M, Verduyckt J, De Keyzer F, et al."
    );
    expect(spec).toContain(
      "| MRI | 10.3174/ajnr.A5930 | 30591508 | PMC7048594 |"
    );
    expect(spec).toContain(
      "| DADDARIO_2001 | D'Addario V, Pinto V, Di Cagno L, Pintucci A."
    );
    expect(spec).toContain(
      "| US (CSA originally) | 10.1046/j.1469-0705.2001.00409.x | 11529995 | (not in PMC) |"
    );
    expect(spec).toContain("| SMFM_2020_CSP | SMFM; Ward A, Monteagudo A.");
    expect(spec).toContain(
      "| (DDx layer) | 10.1016/j.ajog.2020.08.180 | 33168214 | (not in PMC) |"
    );
    expect(spec).toContain(
      "| SANTO_2012 | Santo S, D'Antonio F, Homfray T, et al."
    );
    expect(spec).toContain("| 10.1002/uog.12315 | 23024003 | (not in PMC) |");
    expect(spec).toContain(
      "| GAREL_2003 | Garel C, Luton D, Oury JF, Gressens P."
    );
    expect(spec).toContain(
      "| (DDx layer review) | 10.1007/s00381-003-0795-0 | 12879346 | (not in PMC) |"
    );
    expect(spec).not.toContain("19173238");
    expect(spec).not.toContain("26988817");
    expect(spec).not.toContain("PMC7960174");
    expect(spec).not.toContain("29545254");
    expect(spec).not.toContain("PMC7410554");
    expect(spec).not.toContain("25393026");
    expect(spec).not.toContain("30606726");
    expect(spec).not.toContain("11529997");
    expect(spec).not.toContain("10.1016/j.ajog.2020.02.033");
    expect(spec).not.toContain("32114082");
    expect(spec).not.toContain("23024028");
    expect(spec).not.toContain("12879338");
  });

  it("locks Bahlmann 2015 spina-bifida metadata to the Prenatal Diagnosis article", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain("10.1002/pd.4524");
    expect(spec).toContain("25346419");
    expect(spec).toContain(
      "Cranial and cerebral signs in the diagnosis of spina bifida between 18 and 22 weeks of gestation"
    );
    expect(spec).not.toContain("25333768");
    expect(spec).not.toContain("10.1021/nl502994y");
  });

  it("uses explicit PMCID absence labels in the source inventory", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).not.toContain("(NA)");
    expect(spec).toContain(
      "| CORROENNE_2023 | Corroenne R, Grevent D, Kasprian G, Stirnemann J, Ville Y, Mahallati H, Salomon LJ."
    );
    expect(spec).toContain(
      "| SMFM_2018 | Society for Maternal-Fetal Medicine."
    );
    expect(spec).toContain("| SMFM_2020_CSP | SMFM; Ward A, Monteagudo A.");
    expect(spec).toContain("| SUN_2024 | Sun H, Li K, Wang L");
    expect(spec).toContain("| GAREL_2003 | Garel C, Luton D, Oury JF");
  });

  it("keeps the SPEC reference labels unique and numeric", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const labels = [...spec.matchAll(/^\[([0-9]+[a-z]?)\]/gm)].map(
      ([, label]) => label
    );
    const duplicateLabels = labels.filter(
      (label, index) => labels.indexOf(label) !== index
    );

    expect(labels.filter(label => /[a-z]/.test(label))).toEqual([]);
    expect(duplicateLabels).toEqual([]);
    expect(spec).toContain("[43] Zalevskyi V, Sanchez T, Kaandorp M, et al.");
    expect(spec).toContain("[46] Woitek R, Dvorak A, Weber M, et al.");
    expect(spec).toContain("[49] Bahlmann F, Reinhard I, Schramm T");
    expect(spec).not.toContain("Woitek R, Prayer D, Weber M");
  });

  it("keeps Dovjak 2021 gestational-age ranges aligned to the audited source", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const testCorpus = readFileSync(resolve(process.cwd(), "TEST.md"), "utf8");
    const methodology = readFileSync(
      resolve(process.cwd(), "client/src/pages/Methodology.tsx"),
      "utf8"
    );
    const biometry = readFileSync(
      resolve(process.cwd(), "client/src/lib/biometry.ts"),
      "utf8"
    );

    expect(spec).toContain(
      "Dovjak 2021 source range audit performed on 2026-05-23: PMC8457244 and PubMed PMID 32730667 state a cohort range of 14+0 to 39+2 weeks"
    );
    expect(testCorpus).toContain(
      "Dovjak 2021 source range audit: 14+0 to 39+2 weeks (encoded as 14.0-39.3 weeks)"
    );
    expect(methodology).toContain("validated 14.0-39.3 weeks");
    expect(biometry).toContain(
      "Dovjak GO, Schmidbauer V, Brugger PC, et al. Normal human brainstem development in vivo: a quantitative fetal MRI study. Ultrasound Obstet Gynecol. 2021;58(2):254-263. doi:10.1002/uog.22162. PMID 32730667."
    );
    expect(spec).toContain(
      "[11] Dovjak GO, Schmidbauer V, Brugger PC, et al. Normal human brainstem development in vivo: a quantitative fetal MRI study. *Ultrasound Obstet Gynecol*. 2021;58(2):254-263."
    );
    expect(spec).not.toContain("2021;58(2):254-262");
    expect(spec).toContain("n = 161 normal fetuses; 1.5 T T2 fetal MRI");
    expect(spec).not.toContain("n = 180 normal fetuses");
    for (const staleRange of [
      "Dovjak 2021 valid 18",
      "Dovjak 2021 validity window",
      "Dovjak 2021 is validated to 36",
      "published 21–36 w window",
      "validated 14–40 w",
    ]) {
      expect(spec).not.toContain(staleRange);
      expect(testCorpus).not.toContain(staleRange);
    }
  });

  it("locks the Woitek 2014 Table 3 control rows to the PMC source audit", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );
    const finalLock = readFileSync(
      resolve(process.cwd(), "source_data_final_lock.md"),
      "utf8"
    );

    expect(spec).toContain("| 21 | 26.9 | 2.6 | 74.2 | 5.1 |");
    expect(spec).toContain("| 37 | 54.4 | 1.9 | 90.3 | 3.6 |");
    expect(spec).not.toContain("| 21 | 3 | 20.5 | 1.9 | 73.7 | 5.5 |");
    expect(spec).toContain("PMC4231033 Table 3 byte-check");
    expect(dossier).toContain("PMC Table 3 byte-checked");
    expect(finalLock).toContain("Implementation byte-check complete");
  });

  it("locks the Dovjak 2021 Table 1 equations to the PMC source audit", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );
    const finalLock = readFileSync(
      resolve(process.cwd(), "source_data_final_lock.md"),
      "utf8"
    );

    expect(spec).toContain("PMC8457244 Table 1 byte-checked");
    expect(spec).toContain("TCD: p5 = 1.52·GA - 12.48");
    expect(spec).toContain("total pons AP: p5 = 0.33·GA - 0.59");
    expect(spec).not.toContain("numeric pairs require eyes-on-paper");
    expect(dossier).toContain("PMC Table 1 byte-checked");
    expect(finalLock).toContain("Dovjak 2021 Table 1 status");
    expect(finalLock).toMatch(
      /Dovjak 2021 Table 1 status\s+\|\s+Implementation byte-check complete/
    );
  });

  it("locks extra-axial CSF to exact Kyriakopoulou workbook coefficients", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );
    const finalLock = readFileSync(
      resolve(process.cwd(), "source_data_final_lock.md"),
      "utf8"
    );

    expect(spec).toContain("Kyriakopoulou 2017 supplementary workbook row 19");
    expect(spec).toContain("a = -0.0604400737108953");
    expect(spec).toContain("a5 = 0.0736569049728816");
    expect(spec).not.toContain(
      "extra-axial CSF quadratic curve currently used"
    );
    expect(dossier).toContain("extra-axial CSF coefficient decision");
    expect(dossier).toContain("Closed");
    expect(finalLock).toMatch(
      /extra-axial CSF coefficient decision\s+\|\s+Implementation exact coefficients encoded/
    );
  });

  it("keeps the SPEC 4.2.2 source-registry table aligned with extra-axial CSF", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain(
      "| Extra-cerebral CSF width | Kyriakopoulou 2017 [3] | Quadratic mean / linear SD | 21-38 weeks | n = 108 fetuses; fetal MRI |"
    );
    expect(spec).toContain(
      "The Kyriakopoulou 2017 extra-cerebral CSF coefficients are transcribed from supplementary workbook row 19"
    );
  });

  it("aligns SPEC Part 2 normative-source dossier with the active registry", () => {
    const spec = readFileSync(resolve(process.cwd(), "SPEC.md"), "utf8");

    expect(spec).toContain(
      "| Global brain / skull growth | Luis et al. (2025) [2] | Active computational source for skull BPD/OFD and brain BPD/OFD; Tilea and Kyriakopoulou remain teaching or cross-validation references. |"
    );
    expect(spec).toContain(
      "| Extra-cerebral CSF width | Kyriakopoulou et al. (2017) [3] | Supplementary workbook row 19 exact quadratic mean / linear SD coefficients. |"
    );
    expect(spec).toContain(
      "| Third ventricle width | Hertzberg 1997 threshold [36] | Raw >3.5 mm threshold only; no Phase 1 z-score model. |"
    );
    expect(spec).not.toContain("| Skull BPD & OFD | Tilea et al. (2009) [7]");
    expect(spec).not.toContain(
      "| TCD & Vermis | Vatansever et al. (2013) [10]"
    );
  });
});

describe("publication handoff checklist", () => {
  it("maps reporting standards to manuscript sections, owners, and required evidence", () => {
    const checklist = readFileSync(
      resolve(process.cwd(), "publication_handoff_checklist.md"),
      "utf8"
    );

    expect(checklist).toContain("TRIPOD+AI");
    expect(checklist).toContain("CLAIM");
    expect(checklist).toContain("SQUIRE 2.0");
    expect(checklist).toContain("STARD-AI");
    expect(checklist).toContain("DECIDE-AI");
    expect(checklist).toContain("CONSORT-AI");
    expect(checklist).toContain("Manuscript section");
    expect(checklist).toContain("Required evidence");
    expect(checklist).toContain("Owner");
    expect(checklist).toContain("calibration-in-the-large");
    expect(checklist).toContain("Wilson confidence intervals");
    expect(checklist).toContain("decision-curve net benefit");
    expect(checklist).toContain("client/src/lib/validation-metrics.ts");
    expect(checklist).toContain("FeTA 2024");
    expect(checklist).toContain("reader-study timing");
    expect(checklist).toContain("source-data final lock");
    expect(checklist).toContain("pre/post report-audit metrics");
    expect(checklist).toContain("Go / no-go");
  });
});

describe("reader-study protocol handoff", () => {
  it("captures the IRB, de-identification, timing, usability, and report-quality fields radiologists need", () => {
    const protocol = readFileSync(
      resolve(process.cwd(), "reader_study_protocol.md"),
      "utf8"
    );
    const checklist = readFileSync(
      resolve(process.cwd(), "publication_handoff_checklist.md"),
      "utf8"
    );
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );

    expect(protocol).toContain("IRB / QI determination");
    expect(protocol).toContain("waiver of consent");
    expect(protocol).toContain("de-identification workflow");
    expect(protocol).toContain("secure re-identification crosswalk");
    expect(protocol).toContain("two-week washout");
    expect(protocol).toContain("counter-balanced");
    expect(protocol).toContain("reader-study timing");
    expect(protocol).toContain("NASA Task Load Index");
    expect(protocol).toContain("System Usability Scale");
    expect(protocol).toContain("report-completeness endpoint");
    expect(checklist).toContain("reader_study_protocol.md");
    expect(dossier).toContain("reader_study_protocol.md");
    expect(dossier).toContain("Prepared");
  });
});

describe("source-data final-lock handoff", () => {
  it("gives clinician collaborators a signoff packet for source verification before clinical reliance", () => {
    const lock = readFileSync(
      resolve(process.cwd(), "source_data_final_lock.md"),
      "utf8"
    );
    const checklist = readFileSync(
      resolve(process.cwd(), "publication_handoff_checklist.md"),
      "utf8"
    );
    const dossier = readFileSync(
      resolve(process.cwd(), "source_verification_dossier.md"),
      "utf8"
    );

    expect(lock).toContain("Dovjak 2021 Table 1");
    expect(lock).toContain("Woitek 2014 Table 3");
    expect(lock).toContain("extra-axial CSF coefficient decision");
    expect(lock).toContain("third-ventricle raw-threshold policy");
    expect(lock).toContain("Chiari II / ONTD calibration");
    expect(lock).toContain("Mismatch Handling");
    expect(lock).toContain("Clinician Signoff");
    expect(checklist).toContain("source_data_final_lock.md");
    expect(dossier).toContain("source_data_final_lock.md");
  });
});

describe("SPEC §4.8 clinical integration workflow", () => {
  it("surfaces the Epic Radiant launch path, SMART deferral, and PowerScribe paste workflow", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Methodology.tsx"),
      "utf8"
    );

    expect(source).toContain("Epic Radiant");
    expect(source).toContain("Learning Home");
    expect(source).toContain("default system browser");
    expect(source).toContain("SMART-on-FHIR");
    expect(source).toContain("PowerScribe");
    expect(source).toContain("Ctrl+V");
    expect(source).toContain("plain text");
  });
});

describe("SPEC §4.11 GenAI/RAG methodology exposure", () => {
  it("surfaces the optional module guardrails, PubMed fallback, and backend recommendations", () => {
    const source = readFileSync(
      resolve(process.cwd(), "client/src/pages/Methodology.tsx"),
      "utf8"
    );

    expect(source).toContain("Optional GenAI / RAG report module");
    expect(source).toContain("Do not introduce external medical claims");
    expect(source).toContain("Bio.Entrez");
    expect(source).toContain("top 3 abstracts");
    expect(source).toContain("temporary abstracts only");
    expect(source).toContain("PMID hyperlink");
    expect(source).toContain("safe deterministic template");
    expect(source).toContain("llama.cpp");
    expect(source).toContain("Google AI Studio");
    expect(source).toContain("networkCallsEnabled");
  });
});
