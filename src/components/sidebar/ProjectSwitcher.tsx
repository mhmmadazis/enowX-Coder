import React from 'react';
import { useProjectStore } from '@/stores/useProjectStore';
import { CaretUpDown, FolderSimple } from '@phosphor-icons/react';

export const ProjectSwitcher: React.FC = () => {
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="px-1 py-1">
      <button 
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)] transition-all border border-[var(--border)] group"
        onClick={() => {
          // Logic for project selection modal/dropdown
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-[var(--surface-3)] flex items-center justify-center border border-[var(--border)]">
            <FolderSimple size={14} weight="fill" className="text-[var(--text-muted)]" />
          </div>
          <span className="text-xs font-bold truncate tracking-tight text-[var(--text)]">
            {activeProject ? activeProject.name : 'Select Project'}
          </span>
        </div>
        <CaretUpDown size={12} weight="bold" className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors" />
      </button>
    </div>
  );
};
