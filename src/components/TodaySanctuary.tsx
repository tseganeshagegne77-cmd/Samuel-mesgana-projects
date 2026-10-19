import React, { useState } from 'react';
import { RoutinePreset, JournalEntry, ScenicView } from '../types';
import { audioEngine } from '../utils/audioEngine';
import {
  Play,
  Check,
  PenLine,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Sun,
  Moon,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface TodaySanctuaryProps {
  activeRoutine: RoutinePreset;
  completedStepIds: string[];
  onToggleStepComplete: (stepId: string) => void;
  todayJournalEntry: JournalEntry | undefined;
  onNavigateJournal: () => void;
  onNavigateRoutines: () => void;
  onNavigateViews: () => void;
  onStartGuidedFlow: () => void;
  activeView: ScenicView;
}

const WISDOM_QUOTES = [
  {
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    quote: "Smile, breathe, and go slowly. There is nowhere to arrive except the present moment.",
    author: "Thich Nhat Hanh",
  },
  {
    quote: "Tell me, what is it you plan to do with your one wild and precious life?",
    author: "Mary Oliver",
  },
  {
    quote: "Simplicity is the keynote of all true elegance.",
    author: "Coco Chanel",
  },
  {
    quote: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
  },
];

export const TodaySanctuary: React.FC<TodaySanctuaryProps> = ({
  activeRoutine,
  completedStepIds,
  onToggleStepComplete,
  todayJournalEntry,
  onNavigateJournal,
  onNavigateRoutines,
  onNavigateViews,
  onStartGuidedFlow,
  activeView,
}) => {
  const [quoteIdx] = useState<number>(() => Math.floor(Math.random() * WISDOM_QUOTES.length));
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(audioEngine.isPlaying());
  const quote = WISDOM_QUOTES[quoteIdx];

  const now = new Date();
  const hours = now.getHours();
  const greeting =
    hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const totalSteps = activeRoutine.steps.length;
  const completedCount = activeRoutine.steps.filter(s =>
    completedStepIds.includes(s.id)
  ).length;
  const routinePct = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const toggleSound = () => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      audioEngine.play(activeView.audioPreset);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Welcome & Quote Banner */}
      <div className="p-8 md:p-10 rounded-3xl bg-stone-900/60 backdrop-blur-md border border-white/10 relative overflow-hidden">
        {/* Ambient subtle light highlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium">
              {hours < 18 ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{dateFormatted}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{activeView.locationLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">
              {greeting}, Welcome to Sanctuary
            </h1>
            <p className="text-sm text-stone-300 max-w-xl italic font-serif-journal pt-1">
              "{quote.quote}" — <span className="not-italic text-stone-400 text-xs">{quote.author}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleSound}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-300/20 text-amber-200 border-amber-300/40 shadow-sm'
                  : 'bg-stone-950/50 text-stone-300 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {isPlayingAudio ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4" />}
              <span>{isPlayingAudio ? 'Ambient Sound Playing' : 'Start Soundscape'}</span>
            </button>

            <button
              onClick={onNavigateViews}
              className="p-2 text-stone-400 hover:text-white bg-stone-950/50 hover:bg-stone-800 border border-white/10 rounded-xl transition-colors cursor-pointer"
              title="Change Scenic View"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Cards: Daily Routine Checklist vs. Today's Journal Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Routine Saver Card */}
        <div className="p-6 md:p-7 rounded-3xl bg-stone-900/60 backdrop-blur-md border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Daily Routine Anchor</span>
                <h2 className="text-xl font-bold text-white font-display mt-0.5">{activeRoutine.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono tabular-nums text-amber-300 font-semibold block">
                  {routinePct}% Done
                </span>
                <span className="text-[11px] text-stone-400 font-mono tabular-nums">
                  {completedCount}/{totalSteps} steps
                </span>
              </div>
            </div>

            {/* Quick interactive steps */}
            <div className="space-y-2.5">
              {activeRoutine.steps.slice(0, 4).map((step, idx) => {
                const isCompleted = completedStepIds.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => onToggleStepComplete(step.id)}
                    className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-stone-950/30 border-white/5 opacity-70'
                        : 'bg-stone-950/60 border-white/10 hover:border-amber-300/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : 'border-white/20 group-hover:border-amber-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <span
                          className={`text-xs font-medium block truncate ${
                            isCompleted ? 'line-through text-stone-500' : 'text-stone-200'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[11px] text-stone-400 block truncate">
                          {step.description}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-stone-400 font-mono tabular-nums shrink-0">
                      {step.durationMinutes}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
            <button
              onClick={onNavigateRoutines}
              className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Manage & Customize Routines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onStartGuidedFlow}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Flow
            </button>
          </div>
        </div>

        {/* Right: Today's Journal & Reflection Hub */}
        <div className="p-6 md:p-7 rounded-3xl bg-stone-900/60 backdrop-blur-md border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Daily Reflection</span>
                <h2 className="text-xl font-bold text-white font-display mt-0.5">Today's Journal</h2>
              </div>
              <div>
                <span className="text-xs text-stone-400 font-mono tabular-nums">
                  {todayJournalEntry ? `${todayJournalEntry.wordCount} words written` : 'Unwritten'}
                </span>
              </div>
            </div>

            {todayJournalEntry ? (
              <div className="p-4 rounded-2xl bg-stone-950/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="text-amber-200 font-medium">{todayJournalEntry.mood} · {todayJournalEntry.weather}</span>
                  <span className="font-mono tabular-nums">{todayJournalEntry.date}</span>
                </div>
                <h3 className="text-sm font-semibold text-white">{todayJournalEntry.title}</h3>
                <p className="text-xs text-stone-300 font-serif-journal line-clamp-3 leading-relaxed">
                  {todayJournalEntry.content}
                </p>

                {todayJournalEntry.gratitudeItems?.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[11px] text-stone-400 font-medium block">Gratitude Note:</span>
                    <p className="text-xs text-stone-300 italic">
                      "{todayJournalEntry.gratitudeItems[0]}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-stone-950/40 border border-dashed border-white/10 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-300 flex items-center justify-center mx-auto">
                  <PenLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Your page awaits</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                    Record your morning intentions, mid-day milestones, or evening gratitude in peaceful stillness.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/10">
            <button
              onClick={onNavigateJournal}
              className="text-xs text-stone-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Browse Journal Archive</span>
              <BookOpen className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onNavigateJournal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <PenLine className="w-3.5 h-3.5" />
              {todayJournalEntry ? 'Open Editor' : 'Write Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
