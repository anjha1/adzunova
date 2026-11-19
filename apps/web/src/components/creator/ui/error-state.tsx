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
    <div className="p-8 text-center rounded-3xl border border-destructive/30 bg-destructive/10">
      <div className="w-12 h-12 rounded-2xl bg-destructive/20 text-destructive flex items-center justify-center mx-auto mb-3 font-bold text-xl">
        !
      </div>
      <h3 className="text-base font-bold text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs desk:text-sm text-destructive max-w-md mx-auto">
        {message}
      </p>
      {requestId && (
        <p className="mt-2 text-[10px] font-mono text-muted-foreground">
          Request ID: {requestId}
        </p>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
