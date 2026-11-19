'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard, StatusBadge } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

type DayStatus = 'available' | 'limited' | 'busy' | 'shoot' | 'blackout';

interface CalendarDay {
  date: number;
  month: string;
  status: DayStatus;
  note?: string;
}

const INITIAL_DAYS: CalendarDay[] = [
  { date: 1, month: 'Nov', status: 'available' },
  { date: 2, month: 'Nov', status: 'available' },
  { date: 3, month: 'Nov', status: 'available' },
  { date: 4, month: 'Nov', status: 'shoot', note: 'Tech Brand Shoot' },
  { date: 5, month: 'Nov', status: 'busy', note: 'Editing Deliverable' },
  { date: 6, month: 'Nov', status: 'available' },
  { date: 7, month: 'Nov', status: 'available' },
  { date: 8, month: 'Nov', status: 'available' },
  { date: 9, month: 'Nov', status: 'available' },
  { date: 10, month: 'Nov', status: 'blackout', note: 'Creator Travel' },
  { date: 11, month: 'Nov', status: 'blackout', note: 'Creator Travel' },
  { date: 12, month: 'Nov', status: 'blackout', note: 'Creator Travel' },
  { date: 13, month: 'Nov', status: 'available' },
  { date: 14, month: 'Nov', status: 'available' },
  { date: 15, month: 'Nov', status: 'limited', note: '1 slot left' },
  { date: 16, month: 'Nov', status: 'available' },
  { date: 17, month: 'Nov', status: 'available' },
  { date: 18, month: 'Nov', status: 'available' },
  { date: 19, month: 'Nov', status: 'available' },
  { date: 20, month: 'Nov', status: 'available' },
  { date: 21, month: 'Nov', status: 'shoot', note: 'App Unboxing' },
  { date: 22, month: 'Nov', status: 'available' },
  { date: 23, month: 'Nov', status: 'available' },
  { date: 24, month: 'Nov', status: 'available' },
  { date: 25, month: 'Nov', status: 'available' },
  { date: 26, month: 'Nov', status: 'available' },
  { date: 27, month: 'Nov', status: 'available' },
  { date: 28, month: 'Nov', status: 'available' },
  { date: 29, month: 'Nov', status: 'available' },
  { date: 30, month: 'Nov', status: 'available' },
];

export default function AvailabilityPage() {
  const [days, setDays] = useState<CalendarDay[]>(INITIAL_DAYS);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(days[3]);
  const [acceptingRushOrders, setAcceptingRushOrders] = useState(true);
  const [maxMonthlyDeals, setMaxMonthlyDeals] = useState(4);
  const [isSaved, setIsSaved] = useState(false);

  const bookedCount = days.filter((d) => d.status === 'shoot' || d.status === 'busy').length;
  const blackoutCount = days.filter((d) => d.status === 'blackout').length;

  const handleUpdateStatus = (status: DayStatus) => {
    if (!selectedDay) return;
    setDays((prev) =>
      prev.map((d) => (d.date === selectedDay.date ? { ...d, status } : d))
    );
    setSelectedDay({ ...selectedDay, status });
  };

  const getStatusColor = (status: DayStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'limited':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'busy':
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20';
      case 'shoot':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
      case 'blackout':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Availability & Calendar"
        description="Manage your shoot dates, production pipeline capacity, and blackout windows so brands book realistic deliverable timelines."
        action={
          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 2500);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ShellIcon name="Save" size={14} />
            {isSaved ? 'Schedule Published!' : 'Save Schedule'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Production Capacity"
          value={`${bookedCount} / ${maxMonthlyDeals} Booked`}
          subValue="Monthly campaign limit"
          icon={<ShellIcon name="Briefcase" size={16} />}
        />
        <StatCard
          label="Shoot Days"
          value={days.filter((d) => d.status === 'shoot').length}
          subValue="Active on-camera dates"
          icon={<ShellIcon name="Video" size={16} />}
        />
        <StatCard
          label="Blackout Days"
          value={blackoutCount}
          subValue="Travel / Personal Hold"
          icon={<ShellIcon name="Lock" size={16} />}
        />
        <StatCard
          label="Rush Bookings (&lt;48h)"
          value={acceptingRushOrders ? 'Open (+25%)' : 'Closed'}
          subValue="Brand instant dispatch"
          icon={<ShellIcon name="Zap" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-6">
        {/* Main Calendar Grid */}
        <div className="desk:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">November 2026 Schedule</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Shoot Day
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Blackout
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center text-[11px] font-bold text-muted-foreground py-1">
                {day}
              </div>
            ))}

            {days.map((item) => {
              const isSelected = selectedDay?.date === item.date;
              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => setSelectedDay(item)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                    isSelected ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
                  } ${getStatusColor(item.status)}`}
                >
                  <span className="text-xs font-bold">{item.date}</span>
                  {item.note && (
                    <span className="text-[10px] leading-tight line-clamp-2 opacity-80">
                      {item.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details Drawer */}
        <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Date Configuration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedDay
                ? `Editing ${selectedDay.month} ${selectedDay.date}, 2026`
                : 'Select a day to update availability'}
            </p>
          </div>

          {selectedDay && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Availability Status</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('available')}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      selectedDay.status === 'available'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-border'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('shoot')}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      selectedDay.status === 'shoot'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-border'
                    }`}
                  >
                    Shoot Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('busy')}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      selectedDay.status === 'busy'
                        ? 'border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        : 'border-border'
                    }`}
                  >
                    Production / Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('blackout')}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      selectedDay.status === 'blackout'
                        ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                        : 'border-border'
                    }`}
                  >
                    Blackout / Hold
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Calendar Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. In Mumbai for Brand Event"
                  value={selectedDay.note || ''}
                  onChange={(e) => {
                    const note = e.target.value;
                    setDays((prev) =>
                      prev.map((d) => (d.date === selectedDay.date ? { ...d, note } : d))
                    );
                    setSelectedDay({ ...selectedDay, note });
                  }}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border space-y-3">
            <h4 className="text-xs font-bold text-foreground">Global Booking Controls</h4>

            <label className="flex items-center justify-between text-xs cursor-pointer select-none">
              <div>
                <span className="font-medium text-foreground block">Accept Rush Orders</span>
                <span className="text-[11px] text-muted-foreground">Allows brands to request &lt;48h delivery with 25% rush surge.</span>
              </div>
              <input
                type="checkbox"
                checked={acceptingRushOrders}
                onChange={(e) => setAcceptingRushOrders(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 ml-2"
              />
            </label>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Max Deals Per Month</label>
              <select
                value={maxMonthlyDeals}
                onChange={(e) => setMaxMonthlyDeals(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-border bg-background px-2.5 py-1.5 text-foreground"
              >
                <option value={2}>2 Campaigns (Exclusive focus)</option>
                <option value={4}>4 Campaigns (Standard workload)</option>
                <option value={8}>8 Campaigns (High volume)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
