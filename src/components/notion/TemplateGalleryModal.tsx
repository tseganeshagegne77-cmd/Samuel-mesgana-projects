import React, { useState } from 'react';
import { NOTION_TEMPLATES } from '../../utils/notionTemplates';
import { TemplateDefinition, NotionPage } from '../../types/notion';
import { X, Check, Sparkles, DollarSign, Clock, BookOpen, Compass } from 'lucide-react';

interface TemplateGalleryModalProps {
  onClose: () => void;
  onApplyTemplate: (template: TemplateDefinition) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  onClose,
  onApplyTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition>(NOTION_TEMPLATES[0]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Money & Wealth', 'Routines & Habits', 'Journal & Mindfulness', 'Life OS'];

  const filteredTemplates = NOTION_TEMPLATES.filter(
    t => activeCategory === 'all' || t.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-stone-900 border border-stone-700 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <h2 className="text-base font-bold text-white font-display">Notion Template Gallery</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-2.5 bg-stone-950/40 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-amber-300 text-stone-950 font-semibold'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              {cat === 'all' ? 'All Templates' : cat}
            </button>
          ))}
        </div>

        {/* Split View: Left List vs Right Preview */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left List (5 cols) */}
          <div className="md:col-span-5 p-4 border-r border-stone-800 overflow-y-auto space-y-2">
            {filteredTemplates.map(template => {
              const isSelected = selectedTemplate.id === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-800 border-amber-300/80 ring-1 ring-amber-300/40'
                      : 'bg-stone-950/40 border-stone-800/80 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl shrink-0 mt-0.5">{template.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate">
                          {template.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {template.tags.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="text-[10px] text-stone-500 bg-stone-900 px-1.5 py-0.2 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Preview (7 cols) */}
          <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between space-y-6 bg-stone-950/20">
            <div className="space-y-4">
              <div className="aspect-[16/8] rounded-xl overflow-hidden border border-stone-800 relative bg-stone-900">
                <img
                  src={selectedTemplate.coverUrl}
                  alt={selectedTemplate.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-3xl">{selectedTemplate.icon}</span>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-medium">
                  {selectedTemplate.category}
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-0.5">
                  {selectedTemplate.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Template Blocks preview checklist */}
              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
                <span className="text-xs font-semibold text-white block">Template Included Blocks:</span>
                <div className="space-y-1.5 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dedicated Notion page properties & cover</span>
                  </div>
                  {selectedTemplate.category === 'Money & Wealth' && (
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Interactive Financial Expense Tracker Table</span>
                    </div>
                  )}
                  {selectedTemplate.category === 'Routines & Habits' && (
                    <div className="flex items-center gap-2 text-amber-300 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Interactive Daily Routine Habit Checklist with Chimes</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-300" />
                    <span>Reflective prompt callouts and to-dos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => onApplyTemplate(selectedTemplate)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-300 text-stone-950 hover:bg-amber-200 transition-colors shadow-md cursor-pointer"
              >
                <span>Use this template</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
