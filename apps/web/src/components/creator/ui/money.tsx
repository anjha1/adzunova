import React from 'react';

interface MoneyProps {
  minorUnits: number;
  currency?: string;
  locale?: string;
  className?: string;
}

export function Money({ minorUnits, currency = 'INR', locale = 'en-IN', className = '' }: MoneyProps) {
  const major = (minorUnits || 0) / 100;
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '';

  const formatted = major.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {symbol}{formatted}
      {!symbol && ` ${currency}`}
    </span>
  );
}
