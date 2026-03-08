import React, { useEffect, useRef } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { useChatStore } from '@/stores/useChatStore';
import { ChatMessage } from './ChatMessage';
import { StreamingMessage } from './StreamingMessage';

export const ChatPanel: React.FC = () => {
  const { messages, isStreaming } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-4 flex items-center justify-center">
          <Sparkle size={28} weight="duotone" className="text-[var(--accent)]" />
        </div>
        <h2 className="text-lg font-bold mb-2">How can I help you today?</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-sm">
          Start a conversation. I can help you write code, debug issues, and build your project.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <StreamingMessage />
      <div ref={bottomRef} />
    </div>
  );
};
