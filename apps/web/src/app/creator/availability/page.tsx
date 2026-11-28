'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PageHeader, StatCard } from '@/components/creator/ui';
import { ShellIcon } from '@/components/creator/shell/shell-icons';

type DayStatus = 'available' | 'limited' | 'busy' | 'shoot' | 'blackout';

interface CalendarDay {
  date: number;
  status: DayStatus;
  note?: string;
}

const TIMEZONE_OPTIONS = [
  'Asia/Kolkata',
  'UTC',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'America/New_York',
];

export default function AvailabilityPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1..12
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const monthLabel = new Date(year, month - 1, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const loadAvailability = useCallback(async (y: number, m: number) => {
    setLoading(true);
    setErrorMsg(null);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/creator/availability?year=${y}&month=${m}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to load availability');
        return;
      }
      const avail = data.availability;
      const loadedDays: CalendarDay[] = Array.isArray(avail?.days) ? avail.days : [];
      setDays(loadedDays);
      setTimezone(avail?.timezone || 'Asia/Kolkata');
      setVersion(Number(avail?.version ?? 0));
      setSelectedDay(loadedDays[0] ?? null);
    } catch {
      setErrorMsg('Network error loading availability');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAvailability(year, month);
  }, [year, month, loadAvailability]);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/creator/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          month,
          timezone,
          days,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || 'Failed to save schedule');
        return;
      }
      setVersion(Number(data.availability?.version ?? version + 1));
      setSaveMessage(`Saved v${data.availability?.version ?? version + 1}`);
    } catch {
      setErrorMsg('Network error saving schedule');
    } finally {
      setSaving(false);
    }
  };

  const shiftMonth = (delta: number) => {
    let nextM = month + delta;
    let nextY = year;
    if (nextM < 1) {
      nextM = 12;
      nextY -= 1;
    } else if (nextM > 12) {
      nextM = 1;
      nextY += 1;
    }
    setYear(nextY);
    setMonth(nextM);
  };

  const bookedCount = days.filter((d) => d.status === 'shoot' || d.status === 'busy').length;
  const blackoutCount = days.filter((d) => d.status === 'blackout').length;

  const handleUpdateStatus = (status: DayStatus) => {
    if (!selectedDay) return;
    setSaveMessage(null);
    setDays((prev) => prev.map((d) => (d.date === selectedDay.date ? { ...d, status } : d)));
    setSelectedDay({ ...selectedDay, status });
  };

  const getStatusColor = (status: DayStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'limited':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'busy':
        return 'bg-muted text-muted-foreground border-border';
      case 'shoot':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
      case 'blackout':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Creator Availability & Calendar"
        description="Manage your shoot dates, production capacity, timezone, and blackout windows so brands book realistic timelines."
        action={
          <div className="flex items-center gap-2">
            {saveMessage && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {saveMessage}
              </span>
            )}
            <button
              type="button"
              disabled={saving || loading}
              onClick={() => void handleSave()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-primary-foreground font-medium text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <ShellIcon name="Save" size={14} />
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        }
      />

      {errorMsg && (
        <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

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
        <div className="desk:col-span-2 p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="px-2 py-1 rounded-lg border border-border text-xs hover:bg-muted"
              >
                Prev
              </button>
              <h2 className="text-sm font-bold text-foreground">{`${monthLabel} Schedule`}</h2>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="px-2 py-1 rounded-lg border border-border text-xs hover:bg-muted"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value);
                  setSaveMessage(null);
                }}
                aria-label="Creator Timezone"
                className="text-xs rounded-lg border border-border bg-background px-2.5 py-1 text-foreground"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
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
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Loading calendar...
            </div>
          ) : (
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
                    <span className="text-xs font-bold text-foreground">{item.date}</span>
                    {item.note && (
                      <span className="text-[10px] leading-tight line-clamp-2 opacity-80 text-foreground">
                        {item.note}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-foreground">Date Configuration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedDay
                ? `Editing ${monthLabel}, Day ${selectedDay.date}`
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
                    className={`p-2 rounded-lg border text-center font-medium transition cursor-pointer ${
                      selectedDay.status === 'available'
                        ? 'border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('shoot')}
                    className={`p-2 rounded-lg border text-center font-medium transition cursor-pointer ${
                      selectedDay.status === 'shoot'
                        ? 'border-indigo-600 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-semibold ring-1 ring-indigo-500/30'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Shoot Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('busy')}
                    className={`p-2 rounded-lg border text-center font-medium transition cursor-pointer ${
                      selectedDay.status === 'busy'
                        ? 'border-border bg-muted text-foreground font-semibold ring-1 ring-border'
                        : 'border-border bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    Busy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('blackout')}
                    className={`p-2 rounded-lg border text-center font-medium transition cursor-pointer ${
                      selectedDay.status === 'blackout'
                        ? 'border-rose-600 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold ring-1 ring-rose-500/30'
                        : 'border-border bg-card text-foreground hover:bg-muted'
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
                    setSaveMessage(null);
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
