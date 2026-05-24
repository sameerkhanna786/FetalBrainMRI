/*
 * Optional GenAI/RAG scaffold from SPEC §4.11.
 *
 * This module intentionally contains only deterministic metadata and prompt /
 * query construction. It does not execute LLM inference, PubMed requests, or
 * browser/network calls, preserving the client-side privacy posture while
 * making the required guardrails auditable in tests.
 */

export const GENAI_KNOWLEDGE_BANK_SCOPE = [
  "~36 peer-reviewed papers cited in SPEC.md",
  "ISUOG guidelines",
  "ESPR guidelines",
  "authoritative fetal neuroradiology textbooks",
] as const;

export const RAG_SYSTEM_PROMPT =
  "You must only use the provided numerical data and retrieved literature to generate the report. Do not introduce external medical claims.";

export const GENAI_GUARDRAILS = {
  deterministicFindings: true,
  llmScope: "impression synthesis only",
  citationGrounding: "inline citation required for every Impression diagnosis",
  postGenerationVerification:
    "judge cross-checks generated report against numeric inputs",
  fallback: "safe deterministic template",
} as const;

export const GENAI_BACKENDS = {
  local: [
    "llama.cpp",
    "Gemma 4 (4B)",
    "MedGemma 1.5",
    "Llama 4 Scout",
    "Phi-3.5-mini",
  ],
  freeTierCloud: [
    "Google AI Studio",
    "Groq Cloud",
    "Hugging Face Serverless Inference API",
    "OpenRouter",
  ],
  networkCallsEnabled: false,
} as const;

export type AgenticSearchPlan = {
  api: "Bio.Entrez";
  query: string;
  maxAbstracts: 3;
  contextInjection: "temporary abstracts only";
  requiresRadiologistReview: true;
  transparencySource: "PMID hyperlink required for every agentic claim";
};

const normalizeFinding = (finding: string): string =>
  finding.trim().replace(/\s+/g, " ");

export function buildAgenticSearchPlan(findings: string[]): AgenticSearchPlan {
  const normalizedFindings = findings
    .map(normalizeFinding)
    .filter(finding => finding.length > 0);

  if (normalizedFindings.length === 0) {
    throw new Error("At least one abnormal finding is required");
  }

  return {
    api: "Bio.Entrez",
    query: `${normalizedFindings.join(
      " AND "
    )} AND fetal MRI AND differential diagnosis`,
    maxAbstracts: 3,
    contextInjection: "temporary abstracts only",
    requiresRadiologistReview: true,
    transparencySource: "PMID hyperlink required for every agentic claim",
  };
}
