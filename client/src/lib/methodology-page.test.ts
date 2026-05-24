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
    expect(checklist).toContain("FeTA 2024");
    expect(checklist).toContain("reader-study timing");
    expect(checklist).toContain("source-data final lock");
    expect(checklist).toContain("Go / no-go");
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
