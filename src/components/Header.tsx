import React from 'react';

export type NavTab = 'today' | 'journal' | 'routines' | 'views' | 'insights';

interface HeaderProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onStartRoutine: () => void;
  isImmersive: boolean;
  onToggleImmersive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onStartRoutine,
  isImmersive,
  onToggleImmersive,
}) => {
  if (isImmersive) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={onToggleImmersive}
          className="px-4 py-2 text-xs font-medium text-white/90 bg-stone-900/70 hover:bg-stone-900/90 backdrop-blur-md rounded-lg transition-colors whitespace-nowrap shrink-0 border border-white/10"
        >
          Exit Immersive View
        </button>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-stone-950/65 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onNavigate('today')}
          className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 text-left cursor-pointer hover:text-amber-200 transition-colors"
        >
          AuraView
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigate('today')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'today'
                ? 'text-white border-b-2 border-amber-300 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Today's Sanctuary
          </button>
          <button
            onClick={() => onNavigate('journal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'journal'
                ? 'text-white border-b-2 border-amber-300 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Journal Studio
          </button>
          <button
            onClick={() => onNavigate('routines')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'routines'
                ? 'text-white border-b-2 border-amber-300 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Routine Saver
          </button>
          <button
            onClick={() => onNavigate('views')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'views'
                ? 'text-white border-b-2 border-amber-300 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Scenic Views
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              activeTab === 'insights'
                ? 'text-white border-b-2 border-amber-300 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Habit Continuity
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartRoutine}
            className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Routine Flow
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 gap-4 border-t border-white/5 text-xs text-stone-300 no-scrollbar">
        <button
          onClick={() => onNavigate('today')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'today' ? 'text-amber-300 font-medium' : ''}`}
        >
          Today
        </button>
        <button
          onClick={() => onNavigate('journal')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'journal' ? 'text-amber-300 font-medium' : ''}`}
        >
          Journal
        </button>
        <button
          onClick={() => onNavigate('routines')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'routines' ? 'text-amber-300 font-medium' : ''}`}
        >
          Routines
        </button>
        <button
          onClick={() => onNavigate('views')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'views' ? 'text-amber-300 font-medium' : ''}`}
        >
          Views
        </button>
        <button
          onClick={() => onNavigate('insights')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'insights' ? 'text-amber-300 font-medium' : ''}`}
        >
          Insights
        </button>
      </div>
    </header>
  );
};
