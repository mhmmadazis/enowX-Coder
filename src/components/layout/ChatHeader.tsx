import React from 'react';
import { useSessionStore } from '@/stores/useSessionStore';
import { PencilSimple, DotsThreeVertical, ShareNetwork } from '@phosphor-icons/react';

export const ChatHeader: React.FC = () => {
  const { activeSessionId, sessions } = useSessionStore();
  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-sm font-bold truncate tracking-tight">
          {activeSession ? activeSession.title : 'Chat'}
        </h1>
        <button className="p-1 rounded hover:bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors">
          <PencilSimple size={14} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 bg-[var(--surface-2)]/50 px-3 py-1.5 rounded-full border border-[var(--border)]">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Ollama / DeepSeek-V3</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <ShareNetwork size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <DotsThreeVertical size={20} weight="bold" />
          </button>
        </div>
      </div>
    </header>
  );
};
