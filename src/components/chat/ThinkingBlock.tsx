import React, { useState } from 'react';
import { Brain, CaretDown, CaretRight } from '@phosphor-icons/react';

interface ThinkingBlockProps {
  content: string;
  title?: string;
  defaultCollapsed?: boolean;
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({
  content,
  title = 'Thinking',
  defaultCollapsed = true,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/60 overflow-hidden">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <Brain size={13} weight="duotone" className="text-[var(--text-muted)]" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            {title}
          </span>
        </div>
        {collapsed ? <CaretRight size={12} /> : <CaretDown size={12} />}
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 text-[12px] leading-relaxed text-[var(--text)] whitespace-pre-wrap">
          {content}
        </div>
      )}
    </div>
  );
};
