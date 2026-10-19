import React from 'react';
import { JournalEntry, RoutinePreset, DailyRecord } from '../types';
import { Award, Flame, Calendar, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

interface HabitInsightsProps {
  entries: JournalEntry[];
  dailyRecords: Record<string, DailyRecord>;
  activeRoutine: RoutinePreset;
}

export const HabitInsights: React.FC<HabitInsightsProps> = ({
  entries,
  dailyRecords,
  activeRoutine,
}) => {
  // Compute total words written
  const totalWords = entries.reduce((acc, e) => acc + (e.wordCount || 0), 0);

  // Compute 7-day strip
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const currentDayIndex = (today.getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const record = dailyRecords[dateStr];
    const hasJournal = entries.some(e => e.date === dateStr);
    const dayLabel = daysOfWeek[(d.getDay() + 6) % 7];
    const isToday = i === 6;
    return {
      dateStr,
      dayLabel,
      isToday,
      hasJournal,
      routinePct: record ? Math.round(record.completionRate * 100) : 0,
      completedSteps: record ? record.completedStepIds.length : 0,
    };
  });

  // Calculate streak
  let currentStreak = 0;
  for (let i = past7Days.length - 1; i >= 0; i--) {
    if (past7Days[i].routinePct > 0 || past7Days[i].hasJournal) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Mood breakdown
  const moodCounts: Record<string, number> = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-white/10">
        <span className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Holistic Analytics</span>
        <h1 className="text-3xl font-bold tracking-tight text-white font-display mt-1">Habit Continuity & Insights</h1>
        <p className="text-sm text-stone-300 mt-1 max-w-2xl">
          Observe your personal patterns, journaling cadence, and daily rhythm without judgment or artificial pressure.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Mindful Streak</span>
            <Flame className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-3xl font-extralight text-white font-mono tabular-nums">
            {currentStreak} <span className="text-sm font-sans text-stone-400">days</span>
          </div>
          <p className="text-[11px] text-stone-400">Consecutive days honoring routines or reflection</p>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Written Reflections</span>
            <BookOpen className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-3xl font-extralight text-white font-mono tabular-nums">
            {entries.length} <span className="text-sm font-sans text-stone-400">entries</span>
          </div>
          <p className="text-[11px] text-stone-400 font-mono tabular-nums">{totalWords.toLocaleString()} cumulative words written</p>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Active Ritual</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-semibold text-white truncate">
            {activeRoutine.name}
          </div>
          <p className="text-[11px] text-stone-400 font-mono tabular-nums">{activeRoutine.steps.length} anchor habits configured</p>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>7-Day Consistency</span>
            <TrendingUp className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-3xl font-extralight text-amber-300 font-mono tabular-nums">
            {Math.round((past7Days.filter(d => d.routinePct > 50 || d.hasJournal).length / 7) * 100)}%
          </div>
          <p className="text-[11px] text-stone-400">Weekly ritual fulfillment frequency</p>
        </div>
      </div>

      {/* 7-Day Visual Rhythm Strip */}
      <div className="p-6 md:p-8 rounded-3xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="text-base font-semibold text-white">Weekly Sanctuary Matrix</h3>
            <p className="text-xs text-stone-400">Habit completion and journaling presence across the past 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-300 inline-block" /> Completed Routine
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-stone-700 inline-block" /> Rest Day
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 pt-2">
          {past7Days.map(day => (
            <div
              key={day.dateStr}
              className={`p-3 md:p-4 rounded-xl border text-center transition-all ${
                day.isToday
                  ? 'bg-amber-300/10 border-amber-300/40 ring-1 ring-amber-300/20'
                  : 'bg-stone-950/40 border-white/10'
              }`}
            >
              <span className="text-xs text-stone-400 font-medium block">{day.dayLabel}</span>
              <span className="text-[11px] font-mono tabular-nums text-stone-500 block mt-0.5">
                {day.dateStr.slice(5)}
              </span>

              {/* Completion Circle / Meter */}
              <div className="my-3 py-2 flex flex-col items-center justify-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono tabular-nums font-semibold border ${
                    day.routinePct >= 80
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : day.routinePct > 0
                      ? 'bg-amber-300/20 text-amber-300 border-amber-300/50'
                      : 'bg-stone-800/40 text-stone-500 border-white/5'
                  }`}
                >
                  {day.routinePct > 0 ? `${day.routinePct}%` : '—'}
                </div>
              </div>

              <div className="text-[11px] text-stone-400">
                {day.hasJournal ? (
                  <span className="text-amber-200">Journaled</span>
                ) : (
                  <span className="text-stone-600">No Entry</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Equilibrium & Journaling Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-4">
          <h3 className="text-base font-semibold text-white">Mood Equilibrium</h3>
          <p className="text-xs text-stone-400">Emotional states recorded during your reflections</p>

          <div className="space-y-3 pt-2">
            {Object.entries(moodCounts).length === 0 ? (
              <p className="text-xs text-stone-500">Record journal entries to visualize mood patterns.</p>
            ) : (
              Object.entries(moodCounts).map(([m, count]) => {
                const pct = Math.round((count / entries.length) * 100);
                return (
                  <div key={m} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-200">{m}</span>
                      <span className="text-stone-400 font-mono tabular-nums">{count} entries ({pct}%)</span>
                    </div>
                    <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-300 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-4">
          <h3 className="text-base font-semibold text-white">Mindful Practice Insights</h3>
          <p className="text-xs text-stone-400">Subtle principles for sustainable consistency</p>

          <div className="space-y-3 text-xs text-stone-300 pt-1 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-stone-950/40 border border-white/5 space-y-1">
              <span className="font-semibold text-amber-200 block">The Two-Minute Rule</span>
              <p className="text-stone-400">
                On high-stress days, complete just 1 single step in your routine. Maintaining the identity of someone who returns to sanctuary matters more than volume.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-950/40 border border-white/5 space-y-1">
              <span className="font-semibold text-amber-200 block">Evening Cognitive Offloading</span>
              <p className="text-stone-400">
                Writing down tomorrow's top 2 priorities before bed reduces pre-sleep cognitive arousal and improves deep sleep architecture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
