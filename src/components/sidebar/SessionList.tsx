import React from 'react';
import { useSessionStore } from '@/stores/useSessionStore';
import { ChatCircleText, Trash } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export const SessionList: React.FC = () => {
  const { sessions, activeSessionId, setActiveSessionId, removeSession } = useSessionStore();

  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <ChatCircleText size={32} weight="duotone" className="text-[var(--border)] mb-2" />
        <p className="text-xs text-[var(--text-muted)]">No sessions yet. Start a new chat!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
      {sessions.map((session) => (
        <div
          key={session.id}
          className={cn(
            "group flex items-center gap-2 px-3 py-2 rounded-md transition-colors cursor-pointer text-sm",
            activeSessionId === session.id 
              ? "bg-white/10 text-white border-l-2 border-white" 
              : "hover:bg-white/5 text-[var(--text-muted)] hover:text-white"
          )}
          onClick={() => setActiveSessionId(session.id)}
        >
          <ChatCircleText size={18} weight={activeSessionId === session.id ? "fill" : "regular"} className="shrink-0" />
          <span className="truncate flex-1 font-medium">{session.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeSession(session.id);
            }}
            className={cn(
              "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/20 transition-all",
              activeSessionId === session.id ? "hover:bg-white/20" : ""
            )}
          >
            <Trash size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
