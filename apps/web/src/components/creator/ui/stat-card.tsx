import React from 'react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subValue?: string;
  delta?: {
    percent: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function StatCard({ label, value, subValue, delta, icon }: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-muted text-foreground">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl desk:text-3xl font-black text-foreground mt-3">
        {value}
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        {delta && (
          <span
            className={`font-semibold ${
              delta.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {delta.isPositive ? '+' : '-'}{Math.abs(delta.percent)}%
          </span>
        )}
        {subValue && (
          <span className="text-muted-foreground">{subValue}</span>
        )}
      </div>
    </div>
  );
}
