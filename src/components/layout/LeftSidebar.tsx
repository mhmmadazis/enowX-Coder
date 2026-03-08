import React from 'react';
import { ProjectSwitcher } from '@/components/sidebar/ProjectSwitcher';
import { SessionList } from '@/components/sidebar/SessionList';
import { Plus, SidebarSimple, GearSix } from '@phosphor-icons/react';
import { useSessionStore } from '@/stores/useSessionStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { generateId } from '@/lib/utils';

export const LeftSidebar: React.FC = () => {
  const addSession = useSessionStore((state) => state.addSession);
  const setActiveSessionId = useSessionStore((state) => state.setActiveSessionId);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);

  const handleNewSession = () => {
    const newSession = {
      id: generateId(),
      projectId: activeProjectId || 'default',
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSession(newSession);
    setActiveSessionId(newSession.id);
  };

  return (
    <aside className="h-full bg-[var(--surface)] border-r border-[var(--border)] flex flex-col w-[var(--sidebar-width-left)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center">
            <SidebarSimple size={18} weight="fill" className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">enowX</span>
        </div>
      </div>

      <div className="p-3">
        <ProjectSwitcher />
      </div>

      <div className="px-3 pb-2">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white hover:bg-[#e5e5e5] transition-all text-black text-sm font-semibold active:scale-[0.98]"
        >
          <Plus size={16} weight="bold" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] opacity-50 select-none">
        History
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <SessionList />
      </div>

      <div className="p-3 border-t border-[var(--border)]">
        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors text-sm"
        >
          <GearSix size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
