import { useState } from 'react';
import type { Answer } from '../../../lib/jury/api';

interface QuestionsFormProps {
  summary: string;
  questions: string[];
  onSubmit: (answers: Answer[]) => void;
  disabled?: boolean;
}

export const QuestionsForm = ({ summary, questions, onSubmit, disabled }: QuestionsFormProps) => {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const handleSubmit = () => {
    const formattedAnswers: Answer[] = questions.map((q, i) => ({
      question: q,
      answer: answers[i],
    }));
    onSubmit(formattedAnswers);
  };

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Project Summary */}
      <div className="rounded-2xl bg-[#202020] p-6">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-electric">
          Project Summary
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Answer the following questions:</h3>
        {questions.map((question, index) => {
          const isCodingQuestion = index >= 7; // Last 3 are coding questions
          return (
            <div key={index} className="rounded-2xl bg-[#202020] p-6">
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-electric/20 text-sm font-bold text-electric">
                  Q{index + 1}
                </span>
                <div className="flex-1">
                  <p className="pt-0.5 text-sm font-medium text-white">{question}</p>
                  {isCodingQuestion && (
                    <span className="mt-2 inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                      💻 Coding Question
                    </span>
                  )}
                </div>
              </div>
              <textarea
                value={answers[index]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value;
                  setAnswers(newAnswers);
                }}
                placeholder={isCodingQuestion ? "Write your code here..." : "Type your answer here..."}
                className="w-full rounded-xl border border-slate-700 bg-[#181818] px-4 py-3 font-mono text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-electric focus:ring-2 focus:ring-electric/20"
                rows={isCodingQuestion ? 6 : 4}
              />
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || disabled}
          className="rounded-full bg-electric px-8 py-3 font-medium text-white shadow-glow transition hover:bg-cobalt hover:shadow-[0_0_35px_rgba(127,90,240,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? 'Submitting...' : 'Submit Answers'}
        </button>
      </div>
    </div>
  );
};
