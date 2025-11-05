import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/workspace/Workspace';
import type { ActiveWorkspaceTab } from './types';

type AppView = 'landing' | 'workspace';

const App = () => {
  const [view, setView] = useState<AppView>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initialTab, setInitialTab] = useState<ActiveWorkspaceTab>('visualize');

  const handleNavigateToWorkspace = (tab?: ActiveWorkspaceTab) => {
    setIsTransitioning(true);
    if (tab) {
      setInitialTab(tab);
    }
    setTimeout(() => {
      setView('workspace');
      setIsTransitioning(false);
    }, 500);
  };

  const handleBackToLanding = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setView('landing');
      setIsTransitioning(false);
    }, 500);
  };

  if (view === 'landing') {
    return (
      <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <LandingPage onGetStarted={handleNavigateToWorkspace} />
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <Workspace onBackToLanding={handleBackToLanding} initialTab={initialTab} />
    </div>
  );
};

export default App;

