'use client';

import React, { useState } from 'react';
import { PageHeader, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

type DayStatus = 'available' | 'limited' | 'busy' | 'shoot' | 'blackout';

interface CalendarDay {
  date: number;
  month: string;
  year: number;
  status: DayStatus;
  note?: string;
}

export default function AvailabilityPage() {
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();

  // Generate real calendar days for the current month
  const initialDays: CalendarDay[] = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
    month: currentMonthName,
    year: currentYear,
    status: 'available',
  }));

  const [days, setDays] = useState<CalendarDay[]>(initialDays);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(days[0] || null);
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
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'limited':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'busy':
        return 'bg-muted text-muted-foreground border-border';
      case 'shoot':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'blackout':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Availability & Calendar"
        description="Manage your shoot dates, production capacity, and blackout windows so brands book realistic timelines."
        action={
          <button
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 2500);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <ShellIcon name="Save" size={14} />
            {isSaved ? 'Schedule Saved!' : 'Save Schedule'}
          </button>
        }
      />

      <div className="grid grid-cols-1 desk:grid-cols-4 gap-4">
        <StatCard
          label="Booked Dates"
          value={bookedCount}
          subValue="Active campaign dates"
          icon={<ShellIcon name="Briefcase" size={16} />}
        />
        <StatCard
          label="Shoot Days"
          value={days.filter((d) => d.status === 'shoot').length}
          subValue="Confirmed shoots"
          icon={<ShellIcon name="Video" size={16} />}
        />
        <StatCard
          label="Blackout Days"
          value={blackoutCount}
          subValue="Travel / Personal Hold"
          icon={<ShellIcon name="Lock" size={16} />}
        />
        <StatCard
          label="Available Days"
          value={days.filter((d) => d.status === 'available').length}
          subValue="Open for booking"
          icon={<ShellIcon name="Calendar" size={16} />}
        />
      </div>

      <div className="grid grid-cols-1 desk:grid-cols-3 gap-6">
        {/* Main Calendar Grid */}
        <div className="desk:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">{currentMonthName} {currentYear} Schedule</h2>
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
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Date Configuration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedDay
                ? `Editing ${selectedDay.month} ${selectedDay.date}, ${selectedDay.year}`
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
                        ? 'border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
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
                        ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
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
                        ? 'border-border bg-muted text-foreground'
                        : 'border-border'
                    }`}
                  >
                    Busy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('blackout')}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      selectedDay.status === 'blackout'
                        ? 'border-rose-600 bg-rose-500/10 text-rose-600 dark:text-rose-400'
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
                  placeholder="e.g. Creator shoot travel"
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
        </div>
      </div>
    </div>
  );
}
