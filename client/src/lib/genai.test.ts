import { describe, expect, it } from "vitest";

import {
  GENAI_BACKENDS,
  GENAI_GUARDRAILS,
  GENAI_KNOWLEDGE_BANK_SCOPE,
  RAG_SYSTEM_PROMPT,
  buildAgenticSearchPlan,
  verifyGeneratedReportAgainstNumericInputs,
} from "./genai";

describe("SPEC §4.11.2 RAG knowledge bank and prompt guardrail", () => {
  it("exposes the curated knowledge-bank scope and exact no-external-claims prompt", () => {
    expect(GENAI_KNOWLEDGE_BANK_SCOPE).toEqual(
      expect.arrayContaining([
        "~36 peer-reviewed papers cited in SPEC.md",
        "ISUOG guidelines",
        "ESPR guidelines",
        "authoritative fetal neuroradiology textbooks",
      ])
    );
    expect(RAG_SYSTEM_PROMPT).toContain(
      "You must only use the provided numerical data and retrieved literature to generate the report. Do not introduce external medical claims."
    );
  });
});

describe("SPEC §4.11.3 agentic search fallback", () => {
  it("builds the PubMed query shape, top-3 retrieval plan, and transparency metadata", () => {
    const plan = buildAgenticSearchPlan([
      "absent CSP",
      "cerebellar hypoplasia",
    ]);

    expect(plan).toMatchObject({
      api: "Bio.Entrez",
      query:
        "absent CSP AND cerebellar hypoplasia AND fetal MRI AND differential diagnosis",
      maxAbstracts: 3,
      contextInjection: "temporary abstracts only",
      requiresRadiologistReview: true,
      transparencySource: "PMID hyperlink required for every agentic claim",
    });
  });
});

describe("SPEC §4.11.4 hallucination guardrails", () => {
  it("declares deterministic findings, citation grounding, judge verification, and safe fallback", () => {
    expect(GENAI_GUARDRAILS).toMatchObject({
      deterministicFindings: true,
      llmScope: "impression synthesis only",
      citationGrounding:
        "inline citation required for every Impression diagnosis",
      postGenerationVerification:
        "judge cross-checks generated report against numeric inputs",
      fallback: "safe deterministic template",
    });
  });

  it("fails generated-report verification when the original numeric anchor is missing", () => {
    const result = verifyGeneratedReportAgainstNumericInputs(
      "FINDINGS\nThe left atrium measures 22.0 mm.",
      [{ label: "Left atrium", value: 12, unit: "mm" }]
    );

    expect(result).toMatchObject({
      ok: false,
      fallback: "safe deterministic template",
      failures: [
        {
          label: "Left atrium",
          expectedAnchor: "Left atrium: 12.0 mm",
        },
      ],
    });
  });

  it("passes generated-report verification when every numeric anchor is preserved", () => {
    const result = verifyGeneratedReportAgainstNumericInputs(
      "FINDINGS\nLeft atrium: 12.0 mm.\nCSA: 55.0 degrees.",
      [
        { label: "Left atrium", value: 12, unit: "mm" },
        { label: "CSA", value: 55, unit: "degrees" },
      ]
    );

    expect(result).toEqual({
      ok: true,
      failures: [],
      fallback: null,
    });
  });
});

describe("SPEC §4.11.5 accessible backend recommendations", () => {
  it("lists local zero-cost and free-tier cloud backend options without enabling network calls", () => {
    expect(GENAI_BACKENDS.local).toEqual(
      expect.arrayContaining([
        "llama.cpp",
        "Gemma 4 (4B)",
        "MedGemma 1.5",
        "Llama 4 Scout",
        "Phi-3.5-mini",
      ])
    );
    expect(GENAI_BACKENDS.freeTierCloud).toEqual(
      expect.arrayContaining([
        "Google AI Studio",
        "Groq Cloud",
        "Hugging Face Serverless Inference API",
        "OpenRouter",
      ])
    );
    expect(GENAI_BACKENDS.networkCallsEnabled).toBe(false);
  });
});
