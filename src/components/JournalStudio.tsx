import React, { useState, useEffect } from 'react';
import { JournalEntry, MoodType, WeatherType } from '../types';
import { storage } from '../utils/storage';
import {
  Save,
  Trash2,
  Search,
  Sparkles,
  Star,
  Download,
  Calendar,
  PenLine,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface JournalStudioProps {
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const INSPIRATIONAL_PROMPTS = [
  "What brought you unexpected peace or stillness today?",
  "What is one challenge you faced, and what did it reveal about your resilience?",
  "What boundary did you honor today to protect your mental energy?",
  "Describe one sensory detail from today that made you feel fully alive.",
  "What is something you are holding onto that you can gently release tonight?",
  "Who crossed your path today that you feel quietly grateful for?",
  "If today were a chapter title in your life's book, what would it be named?",
  "What did your physical body need today, and did you listen to it?",
  "What intention will you carry into tomorrow morning?",
];

const MOODS: MoodType[] = ['Serene', 'Inspired', 'Grateful', 'Focused', 'Contemplative', 'Tired'];
const WEATHERS: WeatherType[] = ['Sunny', 'Misty', 'Rain', 'Clear Sky', 'Gentle Breeze'];

export const JournalStudio: React.FC<JournalStudioProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
}) => {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moodFilter, setMoodFilter] = useState<string>('all');

  // Active Editor Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [mood, setMood] = useState<MoodType>('Serene');
  const [weather, setWeather] = useState<WeatherType>('Sunny');
  const [gratitude1, setGratitude1] = useState<string>('');
  const [gratitude2, setGratitude2] = useState<string>('');
  const [gratitude3, setGratitude3] = useState<string>('');
  const [highlight, setHighlight] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showPromptDrawer, setShowPromptDrawer] = useState<boolean>(false);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  // Load entry into editor when selected or initial load
  useEffect(() => {
    if (selectedEntryId) {
      const found = entries.find(e => e.id === selectedEntryId);
      if (found) {
        setDate(found.date);
        setTitle(found.title);
        setContent(found.content);
        setMood(found.mood);
        setWeather(found.weather);
        setGratitude1(found.gratitudeItems?.[0] || '');
        setGratitude2(found.gratitudeItems?.[1] || '');
        setGratitude3(found.gratitudeItems?.[2] || '');
        setHighlight(found.highlightOfDay || '');
        setTagsInput(found.tags?.join(', ') || '');
        setIsFavorite(!!found.isFavorite);
        return;
      }
    }

    // Default to today's entry if exists, or start fresh
    const todaysEntry = entries.find(e => e.date === todayStr);
    if (todaysEntry) {
      setSelectedEntryId(todaysEntry.id);
    } else {
      resetEditorToBlank();
    }
  }, [selectedEntryId, entries]);

  const resetEditorToBlank = () => {
    setSelectedEntryId(null);
    setDate(todayStr);
    setTitle('');
    setContent('');
    setMood('Serene');
    setWeather('Sunny');
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setHighlight('');
    setTagsInput('');
    setIsFavorite(false);
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntryId(entry.id);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = () => {
    const gratitudeItems = [gratitude1, gratitude2, gratitude3].filter(g => g.trim().length > 0);
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newEntry: JournalEntry = {
      id: selectedEntryId || `entry-${Date.now()}`,
      date,
      timestamp: Date.now(),
      title: title.trim() || `Reflection on ${date}`,
      content: content.trim(),
      mood,
      weather,
      gratitudeItems,
      highlightOfDay: highlight.trim(),
      tags: tags.length > 0 ? tags : ['Reflection'],
      wordCount,
      isFavorite,
    };

    onSaveEntry(newEntry);
    setSelectedEntryId(newEntry.id);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleDelete = (id: string) => {
    onDeleteEntry(id);
    if (selectedEntryId === id) {
      resetEditorToBlank();
    }
  };

  const handleExportMarkdown = () => {
    const mdContent = `# ${title || `Journal Entry - ${date}`}
Date: ${date}
Mood: ${mood} · Weather: ${weather}

## Gratitude
- ${gratitude1 || '—'}
- ${gratitude2 || '—'}
- ${gratitude3 || '—'}

## Highlight of the Day
${highlight || '—'}

## Reflection
${content}
`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal_${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertPrompt = (promptText: string) => {
    setContent(prev => (prev ? `${prev}\n\n*${promptText}*\n` : `*${promptText}*\n`));
    setShowPromptDrawer(false);
  };

  // Filtered entries list
  const filteredEntries = entries.filter(e => {
    const matchesQuery =
      searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = moodFilter === 'all' || e.mood === moodFilter;
    return matchesQuery && matchesMood;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Contemplative Space</span>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display mt-1">Journal Studio</h1>
          <p className="text-sm text-stone-300 mt-1 max-w-2xl">
            A quiet sanctuary to unburden thought, record gratitude, and witness your personal evolution in uninterrupted stillness.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={resetEditorToBlank}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-900 bg-amber-300 hover:bg-amber-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <PenLine className="w-3.5 h-3.5" />
            New Reflection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Archive Browser (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reflections, tags..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950/80 border border-white/10 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-300"
              />
            </div>

            {/* Mood Filter row */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs text-stone-400 no-scrollbar">
              <button
                onClick={() => setMoodFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  moodFilter === 'all' ? 'bg-stone-800 text-white font-medium' : 'hover:text-white'
                }`}
              >
                All Moods
              </button>
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMoodFilter(m)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    moodFilter === m ? 'bg-stone-800 text-white font-medium' : 'hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Entries Timeline List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 rounded-xl bg-stone-900/30 border border-white/5">
                No journal entries matching your criteria.
              </div>
            ) : (
              filteredEntries.map(entry => {
                const isSelected = selectedEntryId === entry.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => handleSelectEntry(entry)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-stone-900/90 border-amber-300/80 ring-1 ring-amber-300/30 shadow-md'
                        : 'bg-stone-950/40 hover:bg-stone-900/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{entry.date}</span>
                      <div className="flex items-center gap-2">
                        <span>{entry.mood}</span>
                        {entry.isFavorite && <Star className="w-3 h-3 text-amber-300 fill-amber-300" />}
                      </div>
                    </div>

                    <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">
                      {entry.title || 'Untitled Entry'}
                    </h4>

                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {entry.content || entry.highlightOfDay || 'No written reflection.'}
                    </p>

                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-500">
                      <span>{entry.wordCount} words · {Math.max(1, Math.ceil(entry.wordCount / 200))}m read</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Writing Studio (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-stone-900/70 backdrop-blur-md border border-white/10 space-y-6">
            {/* Top Editor Bar: Date, Mood, Weather, Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-stone-300">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="bg-stone-950/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-300 font-mono"
                  />
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isFavorite
                      ? 'bg-amber-300/15 border-amber-300/40 text-amber-300'
                      : 'border-white/10 text-stone-400 hover:text-white'
                  }`}
                  title={isFavorite ? 'Bookmarked' : 'Add to favorites'}
                >
                  <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPromptDrawer(!showPromptDrawer)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-300/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Reflection Prompts
                </button>

                <button
                  onClick={handleExportMarkdown}
                  className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  title="Export to Markdown"
                >
                  <Download className="w-4 h-4" />
                </button>

                {selectedEntryId && (
                  <button
                    onClick={() => handleDelete(selectedEntryId)}
                    className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savedNotification ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>

            {/* Prompt Drawer */}
            {showPromptDrawer && (
              <div className="p-4 rounded-2xl bg-stone-950/70 border border-amber-300/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Guiding Prompts for Today's Reflection
                  </span>
                  <button
                    onClick={() => setShowPromptDrawer(false)}
                    className="text-stone-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INSPIRATIONAL_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => insertPrompt(p)}
                      className="p-2.5 rounded-lg text-left text-xs text-stone-300 hover:text-white bg-stone-900/60 hover:bg-stone-800/80 border border-white/5 hover:border-amber-300/30 transition-all cursor-pointer"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mood & Weather selectors (Clean, unboxed metadata control) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs text-stone-400 font-medium">Primary Emotion / Energy</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        mood === m
                          ? 'bg-amber-300 text-stone-950 font-semibold'
                          : 'bg-stone-950/60 text-stone-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-stone-400 font-medium">Weather Atmosphere</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {WEATHERS.map(w => (
                    <button
                      key={w}
                      onClick={() => setWeather(w)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        weather === w
                          ? 'bg-amber-300 text-stone-950 font-semibold'
                          : 'bg-stone-950/60 text-stone-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gratitude & Win of the Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-950/40 border border-white/10 space-y-2.5">
                <span className="text-xs font-semibold text-amber-200">Three Appreciations Today</span>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={gratitude1}
                    onChange={e => setGratitude1(e.target.value)}
                    placeholder="1. Something small that brought warmth..."
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white placeholder-stone-600 focus:outline-none focus:border-amber-300"
                  />
                  <input
                    type="text"
                    value={gratitude2}
                    onChange={e => setGratitude2(e.target.value)}
                    placeholder="2. An act of kindness or supportive word..."
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white placeholder-stone-600 focus:outline-none focus:border-amber-300"
                  />
                  <input
                    type="text"
                    value={gratitude3}
                    onChange={e => setGratitude3(e.target.value)}
                    placeholder="3. A simple comfort in your surroundings..."
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white placeholder-stone-600 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/40 border border-white/10 space-y-2.5">
                <span className="text-xs font-semibold text-amber-200">Highlight / Anchor Moment</span>
                <textarea
                  value={highlight}
                  onChange={e => setHighlight(e.target.value)}
                  rows={4}
                  placeholder="The moment from today you want to carry forward in memory..."
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white placeholder-stone-600 focus:outline-none focus:border-amber-300 leading-relaxed"
                />
              </div>
            </div>

            {/* Entry Title & Long-Form Body */}
            <div className="space-y-3 pt-2">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title of Today's Chapter..."
                className="w-full px-0 py-2 text-2xl font-bold bg-transparent border-b border-white/10 text-white font-display focus:outline-none focus:border-amber-300 placeholder-stone-600"
              />

              <div className="relative">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={14}
                  placeholder="Pour your stream of consciousness freely here. What happened today? What did you notice? What are you ready to surrender?..."
                  className="w-full p-4 rounded-2xl bg-stone-950/40 border border-white/10 text-stone-100 font-serif-journal text-base leading-relaxed focus:outline-none focus:border-amber-300 placeholder-stone-600"
                />
              </div>

              {/* Tags & Word count footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400 pt-1">
                <div className="flex items-center gap-2 flex-1">
                  <span className="shrink-0 text-stone-500">Tags:</span>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="Mindfulness, Focus, Family (comma separated)"
                    className="w-full sm:w-72 px-2.5 py-1 bg-stone-950/40 border border-white/10 rounded-md text-xs text-stone-200 focus:outline-none focus:border-amber-300"
                  />
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
                  <span>{wordCount} words</span>
                  <span aria-hidden="true">·</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
