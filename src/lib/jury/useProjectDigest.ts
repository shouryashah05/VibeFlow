import { useMemo } from 'react';
import type { ProcessedProject } from '../../types';

interface ProjectDigest {
  digest: string;
  hash: string;
}

// Simple hash function for caching
const hashString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

const digestCache = new Map<string, ProjectDigest>();

const buildDigest = (project: ProcessedProject): ProjectDigest => {
  // Create a content signature for caching
  const contentKey = JSON.stringify({
    totalFiles: project.summary.totalFiles,
    totalLines: project.summary.totalLines,
  });

  const cached = digestCache.get(contentKey);
  if (cached) return cached;

  // Extract key constructs
  const allCode = project.files.map((f) => f.content).join('\n');
  
  const loopCount = (allCode.match(/\b(for|while|forEach|map)\b/g) || []).length;
  const asyncCount = (allCode.match(/\b(async|await|Promise)\b/g) || []).length;
  const classCount = (allCode.match(/\bclass\s+\w+/g) || []).length;
  const functionCount = (allCode.match(/\bfunction\s+\w+/g) || []).length;

  // Build lightweight summary
  const fileNames = project.files.slice(0, 10).map((f) => f.path).join(', ');
  const entryPoint = project.files.find((f) => f.path.includes('main') || f.path.includes('index'))?.path || 'unknown';

  const digest = `
PROJECT OVERVIEW:
- Files: ${project.summary.totalFiles}
- Total Lines: ${project.summary.totalLines}
- Entry Point: ${entryPoint}

CODE CONSTRUCTS:
- Loops: ${loopCount}
- Async Operations: ${asyncCount}
- Classes: ${classCount}
- Functions: ${functionCount}

FILE LIST (top 10):
${fileNames}

EXTENSIONS:
${project.summary.extensionHistogram.map((e) => `${e.extension}: ${e.count}`).join(', ')}
`.trim();

  const result = {
    digest: digest.slice(0, 2000), // Keep under 2000 chars
    hash: hashString(contentKey),
  };

  digestCache.set(contentKey, result);
  return result;
};

export const useProjectDigest = (project: ProcessedProject | null): ProjectDigest | null => {
  return useMemo(() => {
    if (!project) return null;
    return buildDigest(project);
  }, [project]);
};
