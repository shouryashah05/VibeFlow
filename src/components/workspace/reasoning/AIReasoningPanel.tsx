import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, ProcessedProject } from '../../../types';
import { sendToDeepSeek } from '../../../lib/deepseekClient';

interface AIReasoningPanelProps {
  project: ProcessedProject | null;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  isSending: boolean;
  setIsSending: Dispatch<SetStateAction<boolean>>;
  setLastError: Dispatch<SetStateAction<string | null>>;
  createMessage: (role: ChatMessage['role'], content: string) => ChatMessage;
}

const generateFallbackResponse = (
  project: ProcessedProject | null,
  prompt: string,
) => {
  if (project) {
    const topFile = project.topFilesByLines[0];
    return [
      'DeepSeek is unavailable right now, but here is a quick local insight:',
      `• Project contains ${project.summary.totalFiles} files and ${project.summary.totalLines} total lines.`,
      topFile ? `• ${topFile.path} leads with ${topFile.lines} lines of code.` : null,
      `• You asked: "${prompt}" — try again once the API key is configured via VITE_DEEPSEEK_API_KEY.`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  return `DeepSeek is offline and no project context is loaded yet. Upload a folder first, then ask: "${prompt}"`;
};

export const AIReasoningPanel = ({
  project,
  messages,
  setMessages,
  isSending,
  setIsSending,
  setLastError,
  createMessage,
}: AIReasoningPanelProps) => {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  const visibleMessages = useMemo(
    () => messages.filter((message) => message.role !== 'system'),
    [messages],
  );

  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [visibleMessages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    setLastError(null);

    try {
      const historyForApi = [...messages, userMessage];
      const assistantContent = await sendToDeepSeek(historyForApi);
      const assistantMessage = createMessage('assistant', assistantContent);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = createMessage(
        'assistant',
        generateFallbackResponse(project, trimmed),
      );
      setMessages((prev) => [...prev, assistantMessage]);
      setLastError(error instanceof Error ? error.message : 'Unknown DeepSeek error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-6">
      <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/70 via-slate-950 to-slate-950/90 p-6 shadow-[0_0_45px_rgba(14,111,255,0.12)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Reasoning</h2>
            <p className="text-sm text-slate-400">
              Powered by DeepSeek. Share a prompt and explore your codebase with conversational context.
            </p>
          </div>
          <div className="rounded-2xl border border-cobalt/40 bg-cobalt/10 px-4 py-2 text-xs text-cobalt">
            {project
              ? `Loaded ${project.summary.totalFiles} files • ${project.summary.totalLines} LOC`
              : 'Awaiting project upload'}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-3xl border border-slate-800/70 bg-slate-950/60">
        <div
          ref={listRef}
          className="flex-1 space-y-4 overflow-y-auto px-6 py-6"
        >
          {visibleMessages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 p-6 text-sm text-slate-400">
              Ask about architectural hotspots, dependency risks, or request a summary once a project is loaded.
            </div>
          ) : (
            visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-3xl border px-4 py-3 text-sm leading-6 shadow transition ${
                  message.role === 'user'
                    ? 'ml-auto border-cobalt/50 bg-cobalt/20 text-cobalt'
                    : 'mr-auto border-slate-800 bg-slate-900/70 text-slate-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="mt-2 block text-[10px] uppercase tracking-[0.35em] text-slate-500">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-800/60 p-4">
          <div className="flex items-center gap-3 rounded-full border border-slate-800/70 bg-slate-900/70 px-4 py-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={project ? 'Ask VibeFlow about your repo…' : 'Upload a project to unlock tailored responses…'}
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || (!project && visibleMessages.length === 0)}
              className="flex items-center gap-2 rounded-full bg-neon/20 px-4 py-2 text-sm font-medium text-neon transition hover:bg-neon/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? 'Sending…' : 'Send'}
              <span aria-hidden>{isSending ? '🚀' : '✨'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
