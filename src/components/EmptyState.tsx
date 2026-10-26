import React from 'react';
import { LucideIcon, Play, FlaskConical, BarChart3, Database } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryText?: string;
  onSecondaryAction?: () => void;
  badge?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = BarChart3,
  title,
  description,
  actionText,
  onAction,
  secondaryText,
  onSecondaryAction,
  badge = 'No Data Recorded',
  compact = false,
}) => {
  return (
    <div 
      className={`card-primary flex flex-col items-center justify-center text-center ${
        compact ? 'p-6' : 'p-12'
      } border border-dashed border-[#29313F] rounded-xl bg-[#171C25]/60`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#1D2430] border border-[#29313F] flex items-center justify-center mb-4 text-[#8CB8FF] shadow-inner">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>

      {badge && (
        <span className="badge badge-neutral mb-3 text-[11px] font-mono tracking-wide uppercase">
          {badge}
        </span>
      )}

      <h3 className="heading-card text-lg text-[#F5F6FA] mb-2">{title}</h3>
      <p className="text-body max-w-md text-sm text-[#A7B0C0] mb-6 leading-relaxed">
        {description}
      </p>

      {(actionText || secondaryText) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="btn-accent inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{actionText}</span>
            </button>
          )}

          {secondaryText && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="btn-secondary"
            >
              <span>{secondaryText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
