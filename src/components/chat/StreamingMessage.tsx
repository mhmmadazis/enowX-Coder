import React from 'react';
import { useChatStore } from '@/stores/useChatStore';

export const StreamingMessage: React.FC = () => {
  const { streamingText, isStreaming } = useChatStore();

  if (!isStreaming) return null;

  return (
    <div className="flex gap-3 max-w-4xl mx-auto justify-start">
      <div className="w-8 h-8 rounded-lg bg-[var(--accent)] shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-purple-500/20 mt-1">
        <span className="animate-pulse">AI</span>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm leading-relaxed bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)]">
        <span className="whitespace-pre-wrap">{streamingText}</span>
        <span className="inline-block w-0.5 h-4 bg-[var(--accent)] ml-0.5 animate-pulse align-middle" />
      </div>
    </div>
  );
};
