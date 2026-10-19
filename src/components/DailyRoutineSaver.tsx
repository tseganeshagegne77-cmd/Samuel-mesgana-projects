import React, { useState } from 'react';
import { RoutinePreset, RoutineStep } from '../types';
import { storage } from '../utils/storage';
import { audioEngine } from '../utils/audioEngine';
import {
  Plus,
  Play,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Clock,
  Sparkles,
  Edit2,
  X,
  Check,
} from 'lucide-react';

interface DailyRoutineSaverProps {
  routinePresets: RoutinePreset[];
  activeRoutineId: string;
  onSelectRoutine: (id: string) => void;
  onUpdatePresets: (presets: RoutinePreset[]) => void;
  completedStepIds: string[];
  onToggleStepComplete: (stepId: string) => void;
  onResetToday: () => void;
  onStartGuidedFlow: () => void;
}

export const DailyRoutineSaver: React.FC<DailyRoutineSaverProps> = ({
  routinePresets,
  activeRoutineId,
  onSelectRoutine,
  onUpdatePresets,
  completedStepIds,
  onToggleStepComplete,
  onResetToday,
  onStartGuidedFlow,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [isEditingRoutine, setIsEditingRoutine] = useState<boolean>(false);
  const [isCreatingRoutine, setIsCreatingRoutine] = useState<boolean>(false);

  // Form states for adding/editing a routine
  const [formName, setFormName] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formTimeOfDay, setFormTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');
  const [formSteps, setFormSteps] = useState<RoutineStep[]>([]);

  // Step adding form inside builder
  const [newStepTitle, setNewStepTitle] = useState<string>('');
  const [newStepDesc, setNewStepDesc] = useState<string>('');
  const [newStepDuration, setNewStepDuration] = useState<number>(10);
  const [newStepCategory, setNewStepCategory] = useState<'mind' | 'body' | 'focus' | 'nourish' | 'rest'>('mind');

  const currentRoutine =
    routinePresets.find(r => r.id === activeRoutineId) || routinePresets[0];

  const filteredSteps = currentRoutine
    ? currentRoutine.steps.filter(s => {
        if (filterPeriod === 'all') return true;
        return s.timeOfDay === filterPeriod || s.timeOfDay === 'anytime';
      })
    : [];

  const totalFiltered = filteredSteps.length;
  const completedFilteredCount = filteredSteps.filter(s => completedStepIds.includes(s.id)).length;
  const completionPercentage = totalFiltered > 0 ? Math.round((completedFilteredCount / totalFiltered) * 100) : 0;

  // Open Edit Mode
  const handleOpenEdit = () => {
    setFormName(currentRoutine.name);
    setFormDesc(currentRoutine.description);
    setFormTimeOfDay(currentRoutine.timeOfDay);
    setFormSteps([...currentRoutine.steps]);
    setIsEditingRoutine(true);
    setIsCreatingRoutine(false);
  };

  // Open Create Mode
  const handleOpenCreate = () => {
    setFormName('New Custom Routine');
    setFormDesc('Describe the purpose of this sequence...');
    setFormTimeOfDay('morning');
    setFormSteps([
      {
        id: `step-${Date.now()}-1`,
        title: 'Morning Stillness & Hydration',
        description: 'Drink water and breathe deeply for 5 minutes',
        durationMinutes: 5,
        category: 'nourish',
        timeOfDay: 'morning',
        completed: false,
      },
    ]);
    setIsCreatingRoutine(true);
    setIsEditingRoutine(true);
  };

  const handleAddStepToForm = () => {
    if (!newStepTitle.trim()) return;
    const newStep: RoutineStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: newStepTitle.trim(),
      description: newStepDesc.trim() || 'Focus on presence during this step.',
      durationMinutes: newStepDuration,
      category: newStepCategory,
      timeOfDay: formTimeOfDay,
      completed: false,
    };
    setFormSteps(prev => [...prev, newStep]);
    setNewStepTitle('');
    setNewStepDesc('');
    setNewStepDuration(10);
  };

  const handleRemoveStepFromForm = (stepId: string) => {
    setFormSteps(prev => prev.filter(s => s.id !== stepId));
  };

  const handleSaveRoutineForm = () => {
    if (!formName.trim() || formSteps.length === 0) return;

    const estimatedMins = formSteps.reduce((acc, s) => acc + s.durationMinutes, 0);

    if (isCreatingRoutine) {
      const newPreset: RoutinePreset = {
        id: `custom-routine-${Date.now()}`,
        name: formName.trim(),
        description: formDesc.trim(),
        timeOfDay: formTimeOfDay,
        isCustom: true,
        estimatedMinutes: estimatedMins,
        steps: formSteps,
      };
      const updated = [...routinePresets, newPreset];
      onUpdatePresets(updated);
      onSelectRoutine(newPreset.id);
    } else {
      const updated = routinePresets.map(p => {
        if (p.id === currentRoutine.id) {
          return {
            ...p,
            name: formName.trim(),
            description: formDesc.trim(),
            timeOfDay: formTimeOfDay,
            estimatedMinutes: estimatedMins,
            steps: formSteps,
          };
        }
        return p;
      });
      onUpdatePresets(updated);
    }
    setIsEditingRoutine(false);
    setIsCreatingRoutine(false);
  };

  const handleDeleteRoutine = (presetId: string) => {
    if (routinePresets.length <= 1) return;
    const updated = routinePresets.filter(p => p.id !== presetId);
    onUpdatePresets(updated);
    onSelectRoutine(updated[0].id);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentRoutine, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentRoutine.name.toLowerCase().replace(/\s+/g, '_')}_routine.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.name && Array.isArray(parsed.steps)) {
          const imported: RoutinePreset = {
            ...parsed,
            id: `imported-${Date.now()}`,
            isCustom: true,
          };
          const updated = [...routinePresets, imported];
          onUpdatePresets(updated);
          onSelectRoutine(imported.id);
        }
      } catch {
        // ignore invalid json
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Title & Routine Saver Engine Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300/80 font-medium">Daily Architecture</span>
          <h1 className="text-3xl font-bold tracking-tight text-white font-display mt-1">Routine Saver & Daily Tracker</h1>
          <p className="text-sm text-stone-300 mt-1 max-w-2xl">
            Design, save, and honor intentional daily routines. Execute step-by-step with guided focus or track your progress seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={onStartGuidedFlow}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Launch Guided Routine
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-stone-900/80 hover:bg-stone-800 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Routine
          </button>
        </div>
      </div>

      {/* Routine Preset Selector Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Saved Routine Presets</h2>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Export Routine as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <label className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Import
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {routinePresets.map(preset => {
            const isSelected = preset.id === activeRoutineId;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectRoutine(preset.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-stone-900/90 border-amber-300/80 ring-1 ring-amber-300/40 shadow-lg'
                    : 'bg-stone-950/40 hover:bg-stone-900/50 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="capitalize">{preset.timeOfDay}</span>
                  <span className="font-mono tabular-nums">{preset.estimatedMinutes} min</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1 line-clamp-1">{preset.name}</h3>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{preset.steps.length} steps</span>
                  {isSelected && <span className="text-amber-300 font-medium">Selected</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine Detail & Daily Checklist Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Routine Checklist */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span>{currentRoutine.timeOfDay.toUpperCase()} ROUTINE</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{currentRoutine.estimatedMinutes} min total</span>
                <span aria-hidden="true">·</span>
                <span>{currentRoutine.steps.length} steps</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display mt-0.5">{currentRoutine.name}</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-lg border border-white/10 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Customize Steps
              </button>
              <button
                onClick={onResetToday}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer"
                title="Reset completed checklist for today"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Filter Tabs for Time of Day */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-stone-950/60 rounded-lg border border-white/10">
              {(['all', 'morning', 'afternoon', 'evening'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterPeriod(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize cursor-pointer ${
                    filterPeriod === tab
                      ? 'bg-stone-800 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-400 font-mono tabular-nums">
              {completedFilteredCount} of {totalFiltered} completed ({completionPercentage}%)
            </span>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {filteredSteps.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No steps matching this time filter in this routine.
              </div>
            ) : (
              filteredSteps.map((step, idx) => {
                const isCompleted = completedStepIds.includes(step.id);
                return (
                  <div
                    key={step.id}
                    onClick={() => onToggleStepComplete(step.id)}
                    className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isCompleted
                        ? 'bg-stone-950/30 border-white/5 opacity-75'
                        : 'bg-stone-950/60 border-white/10 hover:border-amber-300/40'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                        isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                          : 'border-white/20 group-hover:border-amber-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-stone-500 tabular-nums">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <h4
                            className={`text-sm font-semibold transition-colors ${
                              isCompleted ? 'line-through text-stone-400' : 'text-white'
                            }`}
                          >
                            {step.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-stone-400 shrink-0 font-mono tabular-nums">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{step.durationMinutes} min</span>
                        </div>
                      </div>

                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isCompleted ? 'text-stone-500' : 'text-stone-300'
                        }`}
                      >
                        {step.description}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-stone-400">
                        <span className="capitalize">{step.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{step.timeOfDay}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Routine Statistics & Focus Trigger */}
        <div className="space-y-6">
          {/* Progress Card */}
          <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur-md border border-white/10 space-y-4">
            <h3 className="text-base font-semibold text-white">Daily Execution Status</h3>

            {/* Circular / Large percentage display */}
            <div className="p-6 rounded-xl bg-stone-950/50 border border-white/5 text-center">
              <div className="text-4xl font-extralight text-amber-300 font-mono tabular-nums">
                {completionPercentage}%
              </div>
              <span className="text-xs text-stone-400 mt-1 block">
                {completedFilteredCount} of {totalFiltered} habits completed
              </span>
              <div className="w-full bg-stone-800 h-2 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-amber-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-stone-300 space-y-2 pt-1">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-stone-400">Routine</span>
                <span className="font-medium text-white truncate max-w-[140px]">{currentRoutine.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-stone-400">Estimated Duration</span>
                <span className="font-mono tabular-nums text-white">{currentRoutine.estimatedMinutes} minutes</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-400">Routine State</span>
                <span className="text-emerald-400 font-medium">
                  {completionPercentage === 100 ? 'Fulfilled Today' : 'In Progress'}
                </span>
              </div>
            </div>

            <button
              onClick={onStartGuidedFlow}
              className="w-full py-3 px-4 rounded-xl bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Step Timer Runner
            </button>
          </div>

          {/* Routine Saver Customization Tips */}
          <div className="p-5 rounded-2xl bg-stone-900/40 border border-white/5 text-xs text-stone-300 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary Principle</span>
            </div>
            <p className="leading-relaxed text-stone-400">
              Keep routines under 5 essential anchors. When life gets chaotic, consistency on two small habits brings greater peace than an overwhelming checklist.
            </p>
          </div>
        </div>
      </div>

      {/* Routine Customization / Creation Modal */}
      {isEditingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 p-6 rounded-3xl bg-stone-900 border border-white/15 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white font-display">
                {isCreatingRoutine ? 'Create New Routine' : `Customize "${currentRoutine.name}"`}
              </h3>
              <button
                onClick={() => setIsEditingRoutine(false)}
                className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Routine Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-medium">Routine Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-300"
                  placeholder="e.g. Dawn Awakening Ritual"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-300 font-medium">Primary Time of Day</label>
                <select
                  value={formTimeOfDay}
                  onChange={e => setFormTimeOfDay(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-stone-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-300 cursor-pointer"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="anytime">Anytime / Weekend</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-stone-300 font-medium">Routine Description</label>
                <textarea
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-300"
                  placeholder="What is the mental intention of this sequence?"
                />
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              <label className="text-xs text-stone-300 font-semibold block">
                Routine Steps ({formSteps.length})
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {formSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-950/60 border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-mono text-stone-500 tabular-nums">{idx + 1}.</span>
                      <div className="truncate">
                        <span className="font-semibold text-white">{step.title}</span>
                        <span className="text-stone-400 ml-2">({step.durationMinutes}m · {step.category})</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStepFromForm(step.id)}
                      className="p-1.5 text-stone-500 hover:text-rose-400 transition-colors cursor-pointer ml-2"
                      title="Delete step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Step Subform */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-white/10 space-y-3">
                <span className="text-xs font-medium text-amber-300">Add New Step</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newStepTitle}
                    onChange={e => setNewStepTitle(e.target.value)}
                    placeholder="Step Title (e.g. 5m Meditation)"
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-300"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={newStepDuration}
                      onChange={e => setNewStepDuration(parseInt(e.target.value) || 5)}
                      className="w-20 px-2 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white font-mono"
                      title="Duration in minutes"
                    />
                    <select
                      value={newStepCategory}
                      onChange={e => setNewStepCategory(e.target.value as any)}
                      className="flex-1 px-2 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white"
                    >
                      <option value="mind">Mind</option>
                      <option value="body">Body</option>
                      <option value="focus">Focus</option>
                      <option value="nourish">Nourish</option>
                      <option value="rest">Rest</option>
                    </select>
                  </div>
                </div>

                <input
                  type="text"
                  value={newStepDesc}
                  onChange={e => setNewStepDesc(e.target.value)}
                  placeholder="Optional guidance notes..."
                  className="w-full px-3 py-1.5 text-xs bg-stone-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-300"
                />

                <button
                  type="button"
                  onClick={handleAddStepToForm}
                  className="px-3 py-1.5 text-xs font-medium text-stone-900 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
                >
                  Add Step to List
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {!isCreatingRoutine && routinePresets.length > 1 ? (
                <button
                  onClick={() => handleDeleteRoutine(currentRoutine.id)}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Routine
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditingRoutine(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRoutineForm}
                  className="px-5 py-2 text-xs font-semibold text-stone-950 bg-amber-300 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
                >
                  Save Routine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
