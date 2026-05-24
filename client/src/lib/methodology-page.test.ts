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
