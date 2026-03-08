import React from 'react';
import { cn } from '@/lib/utils';

interface TimelineEventProps {
  icon: React.ReactNode;
  showConnector: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  icon,
  showConnector,
  children,
  className,
  contentClassName,
}) => {
  return (
    <div className={cn('grid grid-cols-[20px_1fr] gap-3', className)}>
      <div className="relative flex justify-center">
        <div className="mt-1 z-10">{icon}</div>
        {showConnector && (
          <div className="absolute top-5 bottom-0 w-px bg-[var(--border)]/70" />
        )}
      </div>
      <div className={cn('min-w-0', contentClassName)}>{children}</div>
    </div>
  );
};
