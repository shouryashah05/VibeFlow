import type { EvaluateResponse } from '../../../lib/jury/api';

interface ResultViewProps {
  result: EvaluateResponse;
}

export const ResultView = ({ result }: ResultViewProps) => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
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
          <div className="grid gap-4 md:grid-cols-2">
            {result.grey_areas.map((area, index) => (
              <div key={index} className="rounded-2xl bg-[#202020] p-6">
                {/* Topic Badge */}
                <div className="mb-3 inline-block rounded-full bg-electric/20 px-3 py-1 text-xs font-semibold text-electric">
                  {area.topic}
                </div>

                {/* Micro Lesson */}
                <p className="mb-4 text-sm leading-relaxed text-slate-300">{area.micro_lesson}</p>

                {/* Before/After Code */}
                <div className="space-y-3">
                  {/* Before */}
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-400">
                      Before
                    </div>
                    <pre className="overflow-x-auto rounded-lg bg-[#181818] p-3 text-xs text-slate-400">
                      {area.before_after.before}
                    </pre>
                  </div>

                  {/* After */}
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-400">
                      After
                    </div>
                    <pre className="overflow-x-auto rounded-lg bg-[#181818] p-3 text-xs text-slate-400">
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
