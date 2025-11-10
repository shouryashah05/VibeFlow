/**
 * CODE ANALYSIS METRICS COMPONENT
 * Displays visual metrics for code quality before showing questions
 * Shows 7 different metrics with various visualization styles
 */

import type { CodeMetrics } from '../../../lib/jury/api';

interface CodeAnalysisProps {
  metrics: CodeMetrics;  // The metrics data from backend
}

/**
 * CIRCULAR PROGRESS COMPONENT
 * Shows a score out of 10 as a circular progress bar
 */
const CircularMetric = ({ score, label, color = '#7F5AF0' }: { score: number; label: string; color?: string }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        {/* Background circle (gray) */}
        <svg className="h-24 w-24 -rotate-90 transform">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#374151"
            strokeWidth="6"
            fill="none"
          />
          {/* Progress circle (colored) */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{score}/10</span>
        </div>
      </div>
      {/* Label below circle */}
      <p className="mt-2 text-center text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
};

/**
 * GRADIENT BAR COMPONENT
 * Shows algorithmic complexity as a horizontal bar (green to red)
 */
const ComplexityBar = ({ score }: { score: number }) => {
  // Convert score (0-10) to percentage
  const percentage = (score / 10) * 100;
  
  // Determine complexity label based on score
  let label = 'O(1) - Constant';
  if (score >= 8) label = 'O(n!) - Factorial';
  else if (score >= 6) label = 'O(2ⁿ) - Exponential';
  else if (score >= 4) label = 'O(n²) - Quadratic';
  else if (score >= 2) label = 'O(n log n)';
  else if (score >= 1) label = 'O(n) - Linear';

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-400">Algorithmic Complexity</p>
      {/* Bar container */}
      <div className="relative h-8 overflow-hidden rounded-lg bg-slate-800">
        {/* Gradient fill */}
        <div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        ></div>
        {/* Label overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-lg">{label}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * SECURITY BADGE COMPONENT
 * Shows security risk level with colored shield icon
 */
const SecurityBadge = ({ risk }: { risk: 'Low' | 'Medium' | 'High' }) => {
  // Colors based on risk level
  const colors = {
    Low: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    Medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    High: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  };

  return (
    <div className="flex flex-col items-center">
      {/* Shield icon */}
      <div className={`mb-2 flex h-20 w-20 items-center justify-center rounded-full ${colors[risk].bg} border-2 ${colors[risk].border}`}>
        <span className="text-4xl">🛡️</span>
      </div>
      {/* Risk badge */}
      <div className={`rounded-full ${colors[risk].bg} px-4 py-1 ${colors[risk].border} border`}>
        <span className={`text-xs font-bold uppercase ${colors[risk].text}`}>
          {risk} Risk
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-400">Security</p>
    </div>
  );
};

/**
 * RELIABILITY BARS COMPONENT
 * Shows handled vs unhandled errors as stacked bars
 */
const ReliabilityBars = ({ handled, unhandled }: { handled: number; unhandled: number }) => {
  const total = handled + unhandled || 1; // Avoid division by zero
  const handledPercent = (handled / total) * 100;
  const unhandledPercent = (unhandled / total) * 100;

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-400">Reliability</p>
      {/* Handled errors bar (green) */}
      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-green-400">✓ Handled</span>
          <span className="text-slate-400">{handled}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-green-500 transition-all duration-1000"
            style={{ width: `${handledPercent}%` }}
          ></div>
        </div>
      </div>
      {/* Unhandled errors bar (red) */}
      <div>
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-red-400">✗ Unhandled</span>
          <span className="text-slate-400">{unhandled}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-red-500 transition-all duration-1000"
            style={{ width: `${unhandledPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

/**
 * MAINTAINABILITY TAG COMPONENT
 * Shows code quality as a colored tag
 */
const MaintainabilityTag = ({ quality }: { quality: 'Good' | 'Fair' | 'Poor' }) => {
  const colors = {
    Good: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '✓' },
    Fair: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '~' },
    Poor: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '✗' },
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`mb-2 rounded-xl ${colors[quality].bg} border ${colors[quality].border} px-6 py-4`}>
        <div className="text-center">
          <div className="mb-1 text-3xl">{colors[quality].icon}</div>
          <span className={`text-sm font-bold uppercase ${colors[quality].text}`}>
            {quality}
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-400">Maintainability</p>
    </div>
  );
};

/**
 * MAIN CODE ANALYSIS COMPONENT
 * Displays all metrics in a grid layout
 */
export const CodeAnalysis = ({ metrics }: CodeAnalysisProps) => {
  return (
    <div className="mb-8 rounded-2xl bg-[#202020] p-6">
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl">📊</span>
        <div>
          <h3 className="text-lg font-bold text-white">Code Analysis</h3>
          <p className="text-xs text-slate-400">Quality metrics for your project</p>
        </div>
      </div>

      {/* Metrics grid - responsive layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Memory Management - circular */}
        <div className="rounded-xl bg-[#181818] p-4">
          <CircularMetric
            score={metrics.memory_management}
            label="Memory Management"
            color="#10b981"
          />
        </div>

        {/* Runtime Efficiency - circular */}
        <div className="rounded-xl bg-[#181818] p-4">
          <CircularMetric
            score={metrics.runtime_efficiency}
            label="Runtime Efficiency"
            color="#3b82f6"
          />
        </div>

        {/* Scalability - circular */}
        <div className="rounded-xl bg-[#181818] p-4">
          <CircularMetric
            score={metrics.scalability}
            label="Scalability"
            color="#8b5cf6"
          />
        </div>

        {/* Algorithmic Complexity - gradient bar */}
        <div className="rounded-xl bg-[#181818] p-4">
          <ComplexityBar score={metrics.algorithmic_complexity} />
        </div>

        {/* Security - shield badge */}
        <div className="rounded-xl bg-[#181818] p-4">
          <SecurityBadge risk={metrics.security} />
        </div>

        {/* Maintainability - tag */}
        <div className="rounded-xl bg-[#181818] p-4">
          <MaintainabilityTag quality={metrics.maintainability} />
        </div>
      </div>

      {/* Reliability - full width at bottom */}
      <div className="mt-6 rounded-xl bg-[#181818] p-4">
        <ReliabilityBars
          handled={metrics.reliability.handled}
          unhandled={metrics.reliability.unhandled}
        />
      </div>
    </div>
  );
};
