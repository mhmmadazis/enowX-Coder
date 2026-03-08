import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { AgentRunWithTools, ToolCall } from '@/types';
import { TimelineEvent } from './TimelineEvent';
import { ToolExecutionBlock } from './ToolExecutionBlock';
import { ThinkingBlock } from './ThinkingBlock';
import {
  Circle,
  Dot,
  Terminal,
  WarningCircle,
  ChatCircleText,
} from '@phosphor-icons/react';

interface AgentRunCardProps {
  run: AgentRunWithTools;
}

type TimelineEventItem =
  | { kind: 'assistant_message'; key: string; content: string }
  | { kind: 'thinking'; key: string; content: string }
  | { kind: 'tool_execution'; key: string; tool: ToolCall }
  | { kind: 'tool_failed'; key: string; tool: ToolCall }
  | { kind: 'result'; key: string; content: string };

export function AgentRunCard({ run }: AgentRunCardProps) {
  const normalizedBlocks = run.thinkingBlocks
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
  const liveStream = run.streamingText.trim();

  const events = useMemo<TimelineEventItem[]>(() => {
    const list: TimelineEventItem[] = [];

    const intro = `Agent: ${run.agentType} (${run.status})`;
    list.push({ kind: 'assistant_message', key: `${run.id}-intro`, content: intro });

    normalizedBlocks.forEach((block, i) => {
      list.push({ kind: 'thinking', key: `${run.id}-thinking-${i}`, content: block });
    });

    if (run.status === 'running' && liveStream.length > 0) {
      list.push({
        kind: 'thinking',
        key: `${run.id}-thinking-live`,
        content: liveStream,
      });
    }

    run.toolCalls.forEach((tool) => {
      if (tool.status === 'failed') {
        list.push({ kind: 'tool_failed', key: `${run.id}-${tool.id}-failed`, tool });
      } else {
        list.push({ kind: 'tool_execution', key: `${run.id}-${tool.id}-exec`, tool });
      }
    });

    if (run.status === 'completed' && run.output) {
      list.push({ kind: 'result', key: `${run.id}-result`, content: run.output });
    }

    if (run.status === 'failed' && run.error) {
      list.push({ kind: 'result', key: `${run.id}-result-failed`, content: run.error });
    }

    return list;
  }, [
    run.agentType,
    run.id,
    run.output,
    run.error,
    run.status,
    run.toolCalls,
    normalizedBlocks,
    liveStream,
  ]);

  return (
    <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-3">
      <div className="space-y-3">
        {events.map((event, index) => {
          const showConnector = index < events.length - 1;

          if (event.kind === 'assistant_message') {
            return (
              <TimelineEvent
                key={event.key}
                showConnector={showConnector}
                icon={<Dot size={14} weight="fill" className="text-white" />}
              >
                <div className="text-[13px] leading-relaxed text-[var(--text)]">
                  {event.content}
                </div>
              </TimelineEvent>
            );
          }

          if (event.kind === 'thinking') {
            return (
              <TimelineEvent
                key={event.key}
                showConnector={showConnector}
                icon={<Circle size={10} weight="fill" className="text-[var(--text-muted)]" />}
              >
                <ThinkingBlock content={event.content} defaultCollapsed={true} />
              </TimelineEvent>
            );
          }

          if (event.kind === 'tool_execution') {
            return (
              <TimelineEvent
                key={event.key}
                showConnector={showConnector}
                icon={<Terminal size={13} weight="duotone" className="text-[var(--text-muted)]" />}
              >
                <ToolExecutionBlock tool={event.tool} defaultExpanded={false} />
              </TimelineEvent>
            );
          }

          if (event.kind === 'tool_failed') {
            return (
              <TimelineEvent
                key={event.key}
                showConnector={showConnector}
                icon={<WarningCircle size={13} weight="duotone" className="text-white" />}
              >
                <ToolExecutionBlock tool={event.tool} defaultExpanded={true} />
              </TimelineEvent>
            );
          }

          return (
            <TimelineEvent
              key={event.key}
              showConnector={showConnector}
              icon={<ChatCircleText size={13} weight="duotone" className="text-white" />}
            >
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/60 px-3 py-3 ai-prose ai-prose-readable text-[var(--text)]">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {event.content}
                </ReactMarkdown>
              </div>
            </TimelineEvent>
          );
        })}
      </div>
    </div>
  );
}
