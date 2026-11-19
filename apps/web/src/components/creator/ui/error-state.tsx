import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  requestId?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  requestId,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-8 text-center rounded-3xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
      <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
        !
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs desk:text-sm text-red-600 dark:text-red-400 max-w-md mx-auto">
        {message}
      </p>
      {requestId && (
        <p className="mt-2 text-[10px] font-mono text-slate-400">
          Request ID: {requestId}
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
