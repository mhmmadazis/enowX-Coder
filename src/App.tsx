import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSessionStore } from '@/stores/useSessionStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { generateId } from '@/lib/utils';

function App() {
  const providers = useSettingsStore((s) => s.providers);
  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem('onboarding-done') === 'true';
  });

  const addSession = useSessionStore((s) => s.addSession);
  const setActiveSessionId = useSessionStore((s) => s.setActiveSessionId);
  const activeProjectId = useProjectStore((s) => s.activeProjectId);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding-done', 'true');
    setOnboardingDone(true);
    const session = {
      id: generateId(),
      projectId: activeProjectId ?? 'default',
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSession(session);
    setActiveSessionId(session.id);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key === 'n') {
        e.preventDefault();
        const session = {
          id: generateId(),
          projectId: activeProjectId ?? 'default',
          title: 'New Chat',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addSession(session);
        setActiveSessionId(session.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProjectId, addSession, setActiveSessionId]);

  const showOnboarding = !onboardingDone || providers.length === 0;

  return (
    <>
      <AppShell />
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
    </>
  );
}

export default App;
