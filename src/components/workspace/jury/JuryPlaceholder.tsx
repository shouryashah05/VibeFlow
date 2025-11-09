import { useState } from 'react';
import type { ProcessedProject } from '../../../types';
import { useProjectDigest } from '../../../lib/jury/useProjectDigest';
import { analyzeProject, evaluateAnswers, type Answer, type AnalyzeResponse, type EvaluateResponse } from '../../../lib/jury/api';
import { LoadingStatus } from './LoadingStatus';
import { QuestionsForm } from './QuestionsForm';
import { ResultView } from './ResultView';

interface JuryPlaceholderProps {
  project: ProcessedProject | null;
}

type JuryState = 'idle' | 'analyzing' | 'questions' | 'evaluating' | 'result';

export const JuryPlaceholder = ({ project }: JuryPlaceholderProps) => {
  const [state, setState] = useState<JuryState>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const digest = useProjectDigest(project);

  const handleBeginJuryMode = async () => {
    if (!digest || cooldown) return;

    setError(null);
    setState('analyzing');
    setCooldown(true);

    try {
      const result = await analyzeProject(digest.digest);
      setAnalysisResult(result);
      setState('questions');
    } catch {
      setError('Couldn\'t analyze project. Try again.');
      setState('idle');
    } finally {
      // Cooldown to respect 10 RPM limit
      setTimeout(() => setCooldown(false), 7000);
    }
  };

  const handleSubmitAnswers = async (answers: Answer[]) => {
    if (!analysisResult || cooldown) return;

    setError(null);
    setState('evaluating');
    setCooldown(true);

    try {
      const result = await evaluateAnswers(analysisResult.summary, answers);
      setEvaluationResult(result);
      setState('result');
    } catch {
      setError('Couldn\'t generate result. Answers are saved — try again.');
      setState('questions');
    } finally {
      // Cooldown to respect 10 RPM limit
      setTimeout(() => setCooldown(false), 7000);
    }
  };

  // No project loaded
  if (!project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-400">Upload code to begin Jury Mode.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
        {state === 'idle' && (
          <div className="text-center">
            <button
              onClick={handleBeginJuryMode}
              disabled={cooldown}
              className="rounded-full bg-electric px-8 py-3 font-medium text-white shadow-glow transition hover:bg-cobalt hover:shadow-[0_0_35px_rgba(127,90,240,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cooldown ? 'Wait a moment...' : 'Begin Jury Mode'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Analyzing state
  if (state === 'analyzing') {
    return <LoadingStatus phase="analyzing" />;
  }

  // Questions state
  if (state === 'questions' && analysisResult) {
    return (
      <QuestionsForm
        summary={analysisResult.summary}
        questions={analysisResult.questions}
        onSubmit={handleSubmitAnswers}
        disabled={cooldown}
      />
    );
  }

  // Evaluating state
  if (state === 'evaluating') {
    return <LoadingStatus phase="evaluating" />;
  }

  // Result state
  if (state === 'result' && evaluationResult) {
    return <ResultView result={evaluationResult} />;
  }

  // Idle state - show begin button
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <button
          onClick={handleBeginJuryMode}
          disabled={cooldown}
          className="rounded-full bg-electric px-8 py-3 font-medium text-white shadow-glow transition hover:bg-cobalt hover:shadow-[0_0_35px_rgba(127,90,240,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cooldown ? 'Wait a moment...' : 'Begin Jury Mode'}
        </button>
      </div>
    </div>
  );
};

