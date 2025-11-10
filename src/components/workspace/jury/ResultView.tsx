import type { EvaluateResponse } from '../../../lib/jury/api';

interface ResultViewProps {
  result: EvaluateResponse;
}

const CircularProgress = ({ score, label }: { score: number; label: string }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        <svg className="h-32 w-32 -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#7F5AF0"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}/10</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-slate-400">{label}</p>
    </div>
  );
};

export const ResultView = ({ result }: ResultViewProps) => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Score Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-[#202020] p-6">
          <CircularProgress score={result.overall_score} label="Overall Score" />
        </div>
        <div className="rounded-2xl bg-[#202020] p-6">
          <CircularProgress score={result.coding_understanding} label="Coding Understanding" />
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="rounded-2xl bg-[#202020] p-6">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-electric">
          Overall Feedback
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">{result.overall_feedback}</p>
      </div>

      {/* Grey Areas (Flash Cards) */}
      {result.grey_areas.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-medium text-white">Areas to Improve:</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.grey_areas.map((area, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#202020] to-[#181818] p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(127,90,240,0.3)]"
              >
                {/* Accent line */}
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-electric to-cobalt"></div>

                {/* Topic Badge */}
                <div className="mb-4 inline-block rounded-full bg-electric/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-electric">
                  {area.topic}
                </div>

                {/* Micro Lesson */}
                <p className="mb-5 text-sm leading-relaxed text-slate-300">{area.micro_lesson}</p>

                {/* Before/After Code */}
                <div className="space-y-3">
                  {/* Before */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">❌ Before</span>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-red-500/20 bg-[#0d0d0d] p-3 text-xs leading-relaxed text-red-300/90">
                      {area.before_after.before}
                    </pre>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <span className="text-electric">↓</span>
                  </div>

                  {/* After */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-400">✓ After</span>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-green-500/20 bg-[#0d0d0d] p-3 text-xs leading-relaxed text-green-300/90">
                      {area.before_after.after}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
