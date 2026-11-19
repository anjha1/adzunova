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
    <div className="flex flex-col desk:flex-row desk:items-center desk:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl desk:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {renderedActions && <div className="flex items-center gap-3">{renderedActions}</div>}
    </div>
  );
}
