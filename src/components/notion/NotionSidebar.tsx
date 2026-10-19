import React, { useState } from 'react';
import { NotionPage, DatabaseViewType } from '../../types/notion';
import { audioEngine } from '../../utils/audioEngine';
import {
  Search,
  Plus,
  Sparkles,
  LayoutGrid,
  DollarSign,
  Clock,
  BookOpen,
  Compass,
  Star,
  ChevronRight,
  ChevronDown,
  Trash2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeft,
  Settings,
} from 'lucide-react';

interface NotionSidebarProps {
  pages: NotionPage[];
  activePageId: string | null;
  onSelectPage: (id: string) => void;
  onOpenDatabaseView: () => void;
  onOpenTemplates: () => void;
  onNewPage: () => void;
  onDeletePage: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const NotionSidebar: React.FC<NotionSidebarProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onOpenDatabaseView,
  onOpenTemplates,
  onNewPage,
  onDeletePage,
  onToggleFavorite,
  isDark,
  onToggleTheme,
  isOpen,
  onToggleOpen,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(audioEngine.isPlaying());
  const [activeSoundType, setActiveSoundType] = useState(audioEngine.getCurrentType());
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sec: string) => {
    setCollapsedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleToggleSound = () => {
    if (isPlayingAudio) {
      audioEngine.stop();
      setIsPlayingAudio(false);
    } else {
      audioEngine.play(activeSoundType === 'none' ? 'forest_wind' : activeSoundType);
      setIsPlayingAudio(true);
      setActiveSoundType(activeSoundType === 'none' ? 'forest_wind' : activeSoundType);
    }
  };

  const favoritePages = pages.filter(p => p.isFavorite);
  const moneyPages = pages.filter(p => p.properties.category === 'Finance');
  const routinePages = pages.filter(p => p.properties.category === 'Routine');
  const journalPages = pages.filter(p => p.properties.category === 'Journal' || p.properties.category === 'Life OS');

  if (!isOpen) {
    return (
      <div className="fixed top-3 left-3 z-40">
        <button
          onClick={onToggleOpen}
          className="p-2 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 shadow-md transition-colors cursor-pointer"
          title="Open Notion Sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className={`w-64 h-screen shrink-0 border-r flex flex-col justify-between transition-colors z-40 select-none ${
      isDark ? 'bg-stone-950/95 border-stone-800 text-stone-300' : 'bg-stone-100/95 border-stone-300 text-stone-700'
    }`}>
      {/* Top Section: Workspace header */}
      <div className="p-3 border-b border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-stone-950 font-bold text-xs shrink-0">
            N
          </div>
          <span className="text-xs font-semibold text-white truncate">
            Tseganesh's Notion OS
          </span>
        </div>

        <button
          onClick={onToggleOpen}
          className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer"
          title="Close sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs">
        {/* Quick Database & Template triggers */}
        <div className="space-y-0.5">
          <button
            onClick={onOpenDatabaseView}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activePageId === null
                ? 'bg-stone-800/80 text-white font-medium'
                : 'hover:bg-stone-800/40 text-stone-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-amber-300" />
            <span>Database Views (Gallery & Table)</span>
          </button>

          <button
            onClick={onOpenTemplates}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-800/40 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Notion Templates Catalogue</span>
          </button>

          <button
            onClick={onNewPage}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-800/40 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Blank Page</span>
          </button>
        </div>

        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 px-2 block">
              Favorites
            </span>
            {favoritePages.map(page => (
              <div
                key={page.id}
                onClick={() => onSelectPage(page.id)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activePageId === page.id
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'hover:bg-stone-800/40 text-stone-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>{page.icon || '📄'}</span>
                  <span className="truncate">{page.title}</span>
                </div>
                <Star className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Money & Finance OS Section */}
        <div className="space-y-1">
          <div
            onClick={() => toggleSection('money')}
            className="flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
          >
            <span className="flex items-center gap-1.5 text-emerald-400">
              <DollarSign className="w-3 h-3" /> Money & Finance ({moneyPages.length})
            </span>
            {collapsedSections['money'] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>

          {!collapsedSections['money'] && (
            <div className="space-y-0.5 pl-1">
              {moneyPages.map(page => (
                <div
                  key={page.id}
                  onClick={() => onSelectPage(page.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePageId === page.id
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'hover:bg-stone-800/40 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{page.icon || '💰'}</span>
                    <span className="truncate">{page.title}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeletePage(page.id);
                      }}
                      className="p-1 text-stone-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Routines & Habits Section */}
        <div className="space-y-1">
          <div
            onClick={() => toggleSection('routines')}
            className="flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
          >
            <span className="flex items-center gap-1.5 text-amber-300">
              <Clock className="w-3 h-3" /> Routine Saver ({routinePages.length})
            </span>
            {collapsedSections['routines'] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>

          {!collapsedSections['routines'] && (
            <div className="space-y-0.5 pl-1">
              {routinePages.map(page => (
                <div
                  key={page.id}
                  onClick={() => onSelectPage(page.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePageId === page.id
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'hover:bg-stone-800/40 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{page.icon || '🌅'}</span>
                    <span className="truncate">{page.title}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeletePage(page.id);
                      }}
                      className="p-1 text-stone-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Journals & Life OS Section */}
        <div className="space-y-1">
          <div
            onClick={() => toggleSection('journals')}
            className="flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-500 cursor-pointer hover:text-stone-300"
          >
            <span className="flex items-center gap-1.5 text-stone-300">
              <BookOpen className="w-3 h-3" /> Journals & Reflections ({journalPages.length})
            </span>
            {collapsedSections['journals'] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>

          {!collapsedSections['journals'] && (
            <div className="space-y-0.5 pl-1">
              {journalPages.map(page => (
                <div
                  key={page.id}
                  onClick={() => onSelectPage(page.id)}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePageId === page.id
                      ? 'bg-stone-800 text-white font-semibold'
                      : 'hover:bg-stone-800/40 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{page.icon || '📔'}</span>
                    <span className="truncate">{page.title}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeletePage(page.id);
                      }}
                      className="p-1 text-stone-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls: Ambient Soundscape Mini-player & Theme Switch */}
      <div className="p-3 border-t border-stone-800/80 space-y-2 text-xs">
        {/* Ambient sound mini widget */}
        <div className="flex items-center justify-between px-1 text-stone-400">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[11px] text-stone-400">
              {isPlayingAudio ? 'Sound Playing' : 'Ambient Audio'}
            </span>
          </div>

          <button
            onClick={onToggleTheme}
            className="p-1 rounded text-stone-400 hover:text-white transition-colors cursor-pointer"
            title={isDark ? 'Switch to Notion Light' : 'Switch to Notion Dark'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
