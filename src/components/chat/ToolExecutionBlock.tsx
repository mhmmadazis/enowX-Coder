import React, { useState } from 'react';
import { CaretDown, CaretRight, Terminal, WarningCircle } from '@phosphor-icons/react';
import { ToolCall } from '@/types';
import { cn } from '@/lib/utils';

interface ToolExecutionBlockProps {
  tool: ToolCall;
  defaultExpanded?: boolean;
}

const statusLabel = (status: ToolCall['status']) => {
  if (status === 'failed') return 'Execute Failed';
  if (status === 'completed') return 'Result';
  if (status === 'running') return 'Running';
  return 'Queued';
};

export const ToolExecutionBlock: React.FC<ToolExecutionBlockProps> = ({
  tool,
  defaultExpanded = false,
}) => {
  const [open, setOpen] = useState(defaultExpanded);
  const isFailed = tool.status === 'failed';

  return (
    <div
      className={cn(
        'rounded-lg border bg-[var(--surface-2)]/60 overflow-hidden',
        isFailed ? 'border-white/35' : 'border-[var(--border)]'
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <Terminal size={13} weight="duotone" className="text-[var(--text-muted)]" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--text-muted)]">
            Executed
          </span>
          <span
            className={cn(
              'text-[10px] px-1.5 py-0.5 rounded border',
              isFailed
                ? 'text-white border-white/40 bg-white/5'
                : 'text-[var(--text-subtle)] border-[var(--border)] bg-[var(--surface-3)]'
            )}
          >
            {statusLabel(tool.status)}
          </span>
        </div>
        {open ? <CaretDown size={12} /> : <CaretRight size={12} />}
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          <div className="rounded border border-[var(--border)] bg-[var(--surface-3)] p-2 font-mono text-[11px] text-[var(--text)] whitespace-pre-wrap break-all">
            {`> ${tool.toolName} ${tool.input}`}
          </div>

          {tool.output && (
            <div className="rounded border border-[var(--border)] bg-[var(--surface-3)]/70 p-2 font-mono text-[11px] text-[var(--text-muted)] whitespace-pre-wrap break-all">
              {tool.output}
            </div>
          )}

          {isFailed && (
            <div className="flex items-start gap-1.5 text-[11px] text-white border border-white/35 bg-white/5 rounded p-2">
              <WarningCircle size={13} className="mt-0.5 shrink-0" />
              <span>{tool.error ?? 'Tool execution failed.'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
