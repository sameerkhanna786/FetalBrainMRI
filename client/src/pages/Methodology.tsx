/*
 * Design: "Editorial Clinical" — a self-contained editorial explaining
 * z-scores and the calculator's math. Mirrors the tone of the "Z-Scores,
 * Normal Distributions, and Fetal MRI" primer (Khanna 2026).
 */
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import ZScoreBar from "@/components/ZScoreBar";

export default function Methodology() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[color:var(--rule)]">
        <div className="container py-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--teal)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to calculator
          </Link>
          <div className="smallcaps text-[color:var(--ink-soft)]">
            Methodology
          </div>
        </div>
      </header>

      <main className="container max-w-[760px] py-16">
        <div className="smallcaps text-[color:var(--teal)] mb-4">
          Prepared as a methods note
        </div>
        <h1 className="font-display text-[52px] leading-[1.05] tracking-tight mb-4">
          Turning fetal brain measurements into clinical meaning
        </h1>
        <p className="text-[color:var(--ink-soft)] text-lg leading-relaxed mb-10">
          A single number, on its own, almost never tells you whether something
          is normal. This calculator converts every biometric measurement into
          a <em>z-score</em> — a common, unit-free language that lets a 22-week
          vermis and a 34-week corpus callosum be judged on the same ruler.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="font-display text-2xl">What a z-score is</h2>
          <p>
            Every normative fetal-MRI dataset tells us, for a given gestational
            age, what the <em>typical</em> measurement (μ) and the <em>spread</em> (σ)
            of that measurement are. The z-score is simply:
          </p>
          <div className="border border-[color:var(--rule)] rounded-sm p-6 flex items-center justify-center font-numeric text-2xl text-[color:var(--teal)]">
            z = (x − μ) / σ
          </div>
          <p>
            A z of 0 means the measurement sits exactly at the mean. A z of +1
            means one standard deviation above, −1 means one below. Because
            z-scores are unitless, they allow every parameter in the study to
            be compared on the same chart, regardless of scale.
          </p>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="font-display text-2xl">
            How the size of z maps to how rare something is
          </h2>
          <div className="border border-[color:var(--rule)] rounded-sm divide-y divide-[color:var(--rule)]">
            {[
              {
                z: "|z| ≤ 1",
                rarity: "Within the most common 68%",
                note: "Unremarkable",
                band: "normal" as const,
                zv: 0.5,
              },
              {
                z: "1 < |z| ≤ 2",
                rarity: "Outside central 68%, inside central 95%",
                note: "Worth noting",
                band: "note" as const,
                zv: 1.4,
              },
              {
                z: "2 < |z| ≤ 3",
                rarity: "In the outer 5%",
                note: "Uncommon — take a closer look",
                band: "watch" as const,
                zv: 2.4,
              },
              {
                z: "|z| > 3",
                rarity: "In the outermost 0.3%",
                note: "Genuinely rare — triggers further evaluation",
                band: "rare" as const,
                zv: 3.1,
              },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 p-4 items-center"
              >
                <div className="col-span-3 font-numeric text-sm">{row.z}</div>
                <div className="col-span-2">
                  <ZScoreBar z={row.zv} band={row.band} compact />
                </div>
                <div className="col-span-4 text-sm">{row.rarity}</div>
                <div className="col-span-3 smallcaps text-[color:var(--ink-soft)]">
                  {row.note}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-[color:var(--ink-soft)]">
            This mapping is simply the familiar 68-95-99.7 rule, re-expressed
            as a decision aid for reading-room workflow.
          </p>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="font-display text-2xl">
            Where the reference curves come from
          </h2>
          <p>
            Every μ(GA) and σ(GA) curve in the calculator is taken verbatim
            from a peer-reviewed paper, with no spline smoothing or simplified
            re-fitting. Three model forms are used:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Luis 2025</strong> (auto-proc-SVRTK pipeline; n = 406
              fetuses, 20–40 weeks GA) provides quadratic-mean / linear-SD
              coefficients for all 13 standard parameters. μ(GA) =
              a·GA² + b·GA + c, σ(GA) = a₅·GA + b₅.
            </li>
            <li>
              <strong>Dovjak 2021</strong> publishes per-percentile linear
              equations for transcerebellar diameter, vermian height,
              vermian AP, and pons AP, validated 14–40 weeks. μ(GA) is
              taken as the midpoint of the 5th and 95th centile lines and
              σ(GA) as (p₉₅ − p₅) / (2·1.6449), assuming Gaussianity.
            </li>
            <li>
              <strong>Birnbaum 2018</strong> drives the third-ventricle
              width with a linear mean and a constant standard deviation.
            </li>
          </ul>
          <p>
            The <em>Reference set</em> control on the calculator lets you
            choose between two interchangeable strategies for assembling these
            curves:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Multi-source (best per-parameter evidence)</strong>:
              Luis 2025 for the global, ventricular, and midline parameters;
              Dovjak 2021 for the posterior fossa and brainstem; Birnbaum
              2018 for the third ventricle. This is the default and gives
              each parameter the model best supported by its primary
              literature.
            </li>
            <li>
              <strong>Luis 2025 only (single-cohort consistency)</strong>:
              every parameter Luis publishes is computed from the Luis
              quadratic-mean / linear-SD coefficients, including TCD, vermis
              height, vermis AP, and pons AP. This trades parameter-specific
              evidence for a single internally-consistent normative cohort.
              Birnbaum 2018 is retained for the third ventricle because Luis
              does not publish it.
            </li>
          </ul>
          <p>
            Each parameter row in the calculator labels which paper drove its
            z-score under the active reference set, and the structured report
            records the same provenance per measurement.
          </p>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="font-display text-2xl">
            Differential-diagnosis engine
          </h2>
          <p>
            When a measurement crosses a clinically recognized threshold —
            ventriculomegaly at 10 mm, for example, or an absent cavum septum
            pellucidum — the calculator surfaces a curated, citation-grounded
            differential diagnosis drawn from peer-reviewed literature
            (Malinger 2005, Pagani 2014, Giorgione 2022, van Dijk 2018, Sun
            2024, Hertzberg 1997, and others). Every likelihood shown is
            accompanied by its primary source so the clinician can audit the
            reasoning before dictating a report.
          </p>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="font-display text-2xl">Privacy &amp; workflow</h2>
          <p>
            The prototype is entirely client-side. No patient data is ever
            transmitted, stored, or logged. Refreshing the page clears every
            input. Because no PHI is handled, the calculator sits outside HIPAA
            data-hosting scope — which is what makes the TI-RADS-style
            workflow-integration model feasible at scale.
          </p>
        </section>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[color:var(--teal)] border-b border-[color:var(--teal)]/40 pb-0.5 hover:border-[color:var(--teal)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the calculator
        </Link>
      </main>
    </div>
  );
}
