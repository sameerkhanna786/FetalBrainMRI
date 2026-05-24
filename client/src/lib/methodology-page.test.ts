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
    expect(checklist).toContain("STARD-AI");
    expect(checklist).toContain("DECIDE-AI");
    expect(checklist).toContain("CONSORT-AI");
    expect(checklist).toContain("Manuscript section");
    expect(checklist).toContain("Required evidence");
    expect(checklist).toContain("Owner");
    expect(checklist).toContain("calibration-in-the-large");
    expect(checklist).toContain("decision-curve net benefit");
    expect(checklist).toContain("client/src/lib/validation-metrics.ts");
    expect(checklist).toContain("FeTA 2024");
    expect(checklist).toContain("reader-study timing");
    expect(checklist).toContain("source-data final lock");
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
