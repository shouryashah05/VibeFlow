import { useEffect, useState } from 'react';
import type { ActiveWorkspaceTab, ProcessedProject } from '../../types';
import { FolderUploader } from '../FolderUploader';
import { processProjectFiles } from '../../lib/projectProcessing';
import { VisualizePanel } from './VisualizePanel';
import { JuryPlaceholder } from './jury/JuryPlaceholder';

const tabDefinitions: Array<{
  id: ActiveWorkspaceTab;
  label: string;
  icon: string;
  subtitle?: string;
}> = [
  { id: 'visualize', label: 'Visualize', icon: '📊', subtitle: 'Graph your codebase' },
  { id: 'jury', label: 'Jury Mode', icon: '🧑‍⚖️', subtitle: 'Analyze your coding skills' },
];

interface WorkspaceProps {
  onBackToLanding: () => void;
  initialTab?: ActiveWorkspaceTab;
}

export const Workspace = ({ onBackToLanding, initialTab = 'visualize' }: WorkspaceProps) => {
  const [activeTab, setActiveTab] = useState<ActiveWorkspaceTab>(initialTab);
  const [project, setProject] = useState<ProcessedProject | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleFolderSelect = async (files: FileList) => {
    setIsUploading(true);
    setLastError(null);
    try {
      const processed = await processProjectFiles(files);
      setProject(processed);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown parsing error';
      setLastError(reason);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181818] text-slate-100">
      <aside className="hidden w-64 flex-col bg-[#181818] px-6 py-10 lg:flex">
        <h2 className="text-xs uppercase tracking-[0.35em] text-slate-500">Modes</h2>
        <nav className="mt-6 space-y-3">
          {tabDefinitions.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full flex-col rounded-2xl px-4 py-3 text-left transition ${
                  isActive
                    ? 'bg-[#242424] text-white shadow-glow'
                    : 'bg-[#202020] text-slate-300 hover:bg-[#262626]'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="mt-2 text-sm font-semibold">{tab.label}</span>
                {tab.subtitle ? (
                  <span className="text-xs text-slate-400">{tab.subtitle}</span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="flex flex-col gap-6 bg-[#181818] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            
            <h1 className="text-2xl font-semibold text-white">VibeFlow Workspace</h1>
          
          </div>

          <div className="flex flex-col items-stretch gap-5 md:flex-row md:items-center">
            <div className="mt-[20px]">
              <FolderUploader
                disabled={isUploading}
                onSelect={handleFolderSelect}
                helperText={project ? `${project.summary.totalFiles} files loaded` : 'Upload a folder'}
              />
            </div>
          </div>
        </header>

        {lastError ? (
          <div className="bg-red-500/10 px-6 py-3 text-sm text-red-200">
            {lastError}
          </div>
        ) : null}

        <section className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
          {activeTab === 'visualize' ? (
            <VisualizePanel project={project} isUploading={isUploading} />
          ) : null}

          {activeTab === 'jury' ? <JuryPlaceholder project={project} /> : null}
        </section>
      </main>
    </div>
  );
};
