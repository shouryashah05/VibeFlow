// Jury Mode API client

export interface CodeMetrics {
  memory_management: number; // 0-10
  algorithmic_complexity: number; // 0-10 (0=best, 10=worst)
  runtime_efficiency: number; // 0-10
  security: 'Low' | 'Medium' | 'High'; // Risk level
  reliability: { handled: number; unhandled: number }; // Error handling
  maintainability: 'Good' | 'Fair' | 'Poor';
  scalability: number; // 0-10
}

export interface AnalyzeResponse {
  metrics: CodeMetrics;
  summary: string;
  concepts: string[];
  questions: string[];
}

export interface Answer {
  question: string;
  answer: string;
}

export interface GreyArea {
  topic: string;
  micro_lesson: string;
  before_after: {
    before: string;
    after: string;
  };
}

export interface EvaluateResponse {
  overall_feedback: string;
  overall_score: number;
  coding_understanding: number;
  grey_areas: GreyArea[];
}

const API_BASE = import.meta.env.VITE_JURY_API_URL || 'http://localhost:3001';

export const analyzeProject = async (projectDigest: string): Promise<AnalyzeResponse> => {
  const response = await fetch(`${API_BASE}/jury/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ project_digest: projectDigest }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const evaluateAnswers = async (
  projectSummary: string,
  answers: Answer[],
): Promise<EvaluateResponse> => {
  const response = await fetch(`${API_BASE}/jury/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project_summary: projectSummary,
      answers,
    }),
  });

  if (!response.ok) {
    throw new Error(`Evaluation failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
