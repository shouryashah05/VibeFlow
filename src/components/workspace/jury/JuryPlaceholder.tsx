export const JuryPlaceholder = () => (
  <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-12 text-center shadow-[0_0_35px_rgba(127,90,240,0.08)]">
    <span className="text-4xl">🧑‍⚖️</span>
    <h2 className="mt-4 text-2xl font-semibold text-white">Jury Mode is arriving soon</h2>
    <p className="mt-4 text-sm leading-6 text-slate-400">
      We are building an AI-led evaluation bench that can score your codebase for maintainability, security posture, and delivery readiness. Soon you will be able to invite multiple AI jurors for a roundtable verdict.
    </p>
    <div className="mt-8 flex flex-col items-center gap-3 text-sm text-slate-300">
      <p>Planned capabilities:</p>
      <ul className="space-y-2 text-left">
        <li>• Architecture walkthroughs</li>
        <li>• Code quality heuristics and scoring</li>
        <li>• PR-ready summaries and risk flags</li>
      </ul>
    </div>
  </div>
);
