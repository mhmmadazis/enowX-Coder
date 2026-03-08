import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import 'highlight.js/styles/github-dark.css';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copied, setCopied] = React.useState(false);
  const code = String(children).replace(/\n$/, '');
  const lang = /language-(\w+)/.exec(className ?? '')?.[1] ?? '';

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded text-[0.85em] font-mono bg-[var(--surface-2)] text-[#e879f9]">
        {children}
      </code>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[var(--border)]">
        <span className="text-[11px] font-mono font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          {lang || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
        >
          {copied ? <Check size={12} weight="bold" className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto text-sm leading-relaxed bg-[#0d1117]">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = React.memo<ChatMessageProps>(({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 max-w-4xl mx-auto', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-lg shadow-purple-500/20 mt-1">
          AI
        </div>
      )}

      <div
        className={cn(
          'px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed',
          isUser
            ? 'bg-[var(--accent)] text-white rounded-tr-sm shadow-lg shadow-purple-500/10'
            : 'bg-[var(--surface-2)] text-[var(--text)] rounded-tl-sm border border-[var(--border)]'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: CodeBlock as React.ComponentType<React.HTMLAttributes<HTMLElement>>,
                pre: ({ children }) => <>{children}</>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 flex items-center justify-center text-[11px] font-bold text-white shadow-md mt-1">
          U
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';
