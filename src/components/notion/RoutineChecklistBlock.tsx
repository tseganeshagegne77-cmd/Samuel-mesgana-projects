import React, { useState } from 'react';
import { RoutineItem } from '../../types/notion';
import { audioEngine } from '../../utils/audioEngine';
import { Check, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';

interface RoutineChecklistBlockProps {
  routines: RoutineItem[];
  onChange: (updated: RoutineItem[]) => void;
  isDark: boolean;
}

export const RoutineChecklistBlock: React.FC<RoutineChecklistBlockProps> = ({
  routines = [],
  onChange,
  isDark,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newMinutes, setNewMinutes] = useState(10);
  const [newCategory, setNewCategory] = useState<RoutineItem['category']>('Mind');

  const total = routines.length;
  const completedCount = routines.filter(r => r.completed).length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const handleToggle = (id: string) => {
    const updated = routines.map(r => {
      if (r.id === id) {
        const nextState = !r.completed;
        if (nextState) {
          audioEngine.playChime(528);
        }
        return { ...r, completed: nextState };
      }
      return r;
    });
    onChange(updated);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const item: RoutineItem = {
      id: `rt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newTitle.trim(),
      timeMinutes: newMinutes,
      category: newCategory,
      completed: false,
    };
    onChange([...routines, item]);
    setNewTitle('');
    setNewMinutes(10);
  };

  const handleDelete = (id: string) => {
    onChange(routines.filter(r => r.id !== id));
  };

  return (
    <div className={`my-4 rounded-xl border overflow-hidden ${
      isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-stone-50/80 border-stone-200'
    }`}>
      {/* Header bar with progress meter */}
      <div className={`px-4 py-3 flex items-center justify-between border-b text-xs ${
        isDark ? 'border-stone-800 bg-stone-900/80' : 'border-stone-200 bg-stone-100/70'
      }`}>
        <div className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Habit Anchors & Routine Completion</span>
        </div>
        <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
          <span className="text-stone-400">{completedCount} of {total} fulfilled</span>
          <span className="font-bold text-amber-400">{percentage}%</span>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {routines.map(item => (
          <div
            key={item.id}
            className={`group p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
              item.completed
                ? isDark
                  ? 'bg-stone-950/20 border-stone-800/40 opacity-70'
                  : 'bg-white/40 border-stone-200/40 opacity-70'
                : isDark
                ? 'bg-stone-900/60 border-stone-800 hover:border-amber-300/40'
                : 'bg-white border-stone-200 hover:border-amber-400/60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => handleToggle(item.id)}
                className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer border ${
                  item.completed
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'border-stone-600 hover:border-amber-300 text-transparent'
                }`}
              >
                <Check className="w-3 h-3" />
              </button>

              <span
                className={`text-xs truncate ${
                  item.completed ? 'line-through text-stone-500' : isDark ? 'text-stone-200' : 'text-stone-800'
                }`}
              >
                {item.title}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs">
              <span className="text-[11px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-800/40">
                {item.category}
              </span>
              <span className="flex items-center gap-1 text-stone-400 font-mono tabular-nums text-[11px]">
                <Clock className="w-3 h-3 text-stone-500" />
                {item.timeMinutes}m
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-stone-500 hover:text-rose-400 transition-opacity cursor-pointer"
                title="Remove habit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Quick Add Form */}
        <div className={`p-2 rounded-lg border border-dashed flex items-center gap-2 ${
          isDark ? 'border-stone-800' : 'border-stone-300'
        }`}>
          <input
            type="text"
            placeholder="+ Add routine step..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-transparent focus:outline-none text-xs placeholder-stone-500 px-2"
          />
          <input
            type="number"
            min="1"
            max="120"
            value={newMinutes}
            onChange={e => setNewMinutes(parseInt(e.target.value) || 5)}
            className="w-14 bg-transparent border border-stone-700 rounded px-1.5 py-0.5 text-xs text-center font-mono"
            title="Minutes"
          />
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value as any)}
            className={`bg-transparent text-xs rounded border border-stone-700 py-0.5 px-1.5 cursor-pointer ${
              isDark ? 'text-stone-300' : 'text-stone-700'
            }`}
          >
            {(['Mind', 'Body', 'Focus', 'Nourish', 'Rest'] as const).map(cat => (
              <option key={cat} value={cat} className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim()}
            className="px-2.5 py-1 text-xs rounded bg-amber-300 text-stone-950 hover:bg-amber-200 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
