// Jury Mode API client

export interface AnalyzeResponse {
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
