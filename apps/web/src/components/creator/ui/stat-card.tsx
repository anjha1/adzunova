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
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl desk:text-3xl font-black text-slate-900 dark:text-white mt-3">
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
          <span className="text-slate-500 dark:text-slate-400">{subValue}</span>
        )}
      </div>
    </div>
  );
}
