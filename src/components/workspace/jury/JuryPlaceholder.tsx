import { useState } from 'react';
import type { ProcessedProject } from '../../../types';
import { useProjectDigest } from '../../../lib/jury/useProjectDigest';
import { analyzeProject, evaluateAnswers, type Answer, type AnalyzeResponse, type EvaluateResponse } from '../../../lib/jury/api';
import { LoadingStatus } from './LoadingStatus';
import { QuestionsForm } from './QuestionsForm';
import { ResultView } from './ResultView';
import { DisclaimerModal } from './DisclaimerModal';
import { CodeAnalysis } from './CodeAnalysis';

interface JuryPlaceholderProps {
  project: ProcessedProject | null;
}

type JuryState = 'idle' | 'analyzing' | 'questions' | 'evaluating' | 'result';

export const JuryPlaceholder = ({ project }: JuryPlaceholderProps) => {
  const [state, setState] = useState<JuryState>('idle');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const digest = useProjectDigest(project);

  const handleBeginClick = () => {
    // Show disclaimer modal first
    setShowDisclaimer(true);
  };

  const handleDisclaimerAccept = async () => {
    // User accepted disclaimer, close modal and start analysis
    setShowDisclaimer(false);
    
    if (!digest || cooldown) return;

    setError(null);
    setState('analyzing');
    setCooldown(true);

    try {
      const result = await analyzeProject(digest.digest);
      setAnalysisResult(result);
      setState('questions');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Couldn't analyze project. Try again. (${err instanceof Error ? err.message : 'Unknown error'})`);
      setState('idle');
    } finally {
      // Cooldown to respect 10 RPM limit
      setTimeout(() => setCooldown(false), 7000);
    }
  };

  const handleDisclaimerCancel = () => {
    // User cancelled, just close modal
    setShowDisclaimer(false);
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
              onClick={handleBeginClick}
              disabled={cooldown}
              className="group relative overflow-hidden rounded-full bg-black px-10 py-4 font-semibold text-white transition-all duration-300 hover:bg-electric hover:shadow-[0_0_40px_rgba(127,90,240,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                {cooldown ? 'Wait a moment...' : 'Begin Jury Mode'}
              </span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-electric to-cobalt opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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
      <div className="mx-auto max-w-4xl">
        {/* Code Analysis Metrics */}
        <CodeAnalysis metrics={analysisResult.metrics} />
        
        {/* Questions Form */}
        <QuestionsForm
          summary={analysisResult.summary}
          questions={analysisResult.questions}
          onSubmit={handleSubmitAnswers}
          disabled={cooldown}
        />
      </div>
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
    <>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <button
            onClick={handleBeginClick}
            disabled={cooldown}
            className="group relative overflow-hidden rounded-full bg-black px-10 py-4 font-semibold text-white transition-all duration-300 hover:bg-electric hover:shadow-[0_0_40px_rgba(127,90,240,0.6)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              {cooldown ? 'Wait a moment...' : 'Begin Jury Mode'}
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-electric to-cobalt opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <DisclaimerModal
          onAccept={handleDisclaimerAccept}
          onCancel={handleDisclaimerCancel}
        />
      )}
    </>
  );
};

