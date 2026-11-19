import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, badge, action, actions }: PageHeaderProps) {
  const renderedActions = actions || action;
  return (
    <div className="flex flex-col desk:flex-row desk:items-center desk:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl desk:text-3xl font-black text-foreground tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {renderedActions && <div className="flex items-center gap-3">{renderedActions}</div>}
    </div>
  );
}
