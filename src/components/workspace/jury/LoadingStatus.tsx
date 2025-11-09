import { useEffect, useState } from 'react';

interface LoadingStatusProps {
  phase: 'analyzing' | 'evaluating';
}

const ANALYZING_MESSAGES = [
  '🔍 Peeking inside your code\'s brain...',
  '🧠 Mapping your logic pathways...',
  '📚 Studying your coding patterns...',
  '🎯 Preparing personalized questions...',
];

const EVALUATING_MESSAGES = [
  '✍️ Reading your answers carefully...',
  '🧪 Testing your understanding...',
  '💡 Identifying grey areas...',
  '📝 Crafting your feedback...',
];

export const LoadingStatus = ({ phase }: LoadingStatusProps) => {
  const messages = phase === 'analyzing' ? ANALYZING_MESSAGES : EVALUATING_MESSAGES;
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mb-6 inline-block h-12 w-12 animate-spin rounded-full border-4 border-electric/20 border-t-electric"></div>
        <p className="text-lg text-slate-300">{messages[messageIndex]}</p>
      </div>
    </div>
  );
};
