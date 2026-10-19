import React, { useState } from 'react';
import { NotionPage, NotionBlock, NotionBlockType } from '../../types/notion';
import { ExpenseTableBlock } from './ExpenseTableBlock';
import { RoutineChecklistBlock } from './RoutineChecklistBlock';
import { SCENIC_COVERS } from '../../utils/notionTemplates';
import {
  Smile,
  Image as ImageIcon,
  Calendar,
  Tag,
  DollarSign,
  Plus,
  Trash2,
  MoreVertical,
  CheckSquare,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  List,
  Quote,
  Minus,
  Sparkles,
  Info,
  Clock,
  ArrowUpDown,
} from 'lucide-react';

interface NotionPageEditorProps {
  page: NotionPage;
  onUpdatePage: (updated: NotionPage) => void;
  isDark: boolean;
  isFullWidth: boolean;
}

const COMMON_EMOJIS = ['💰', '📔', '🌅', '🌙', '📊', '🎯', '🛍️', '🧭', '✨', '🧠', '☕', '🌿', '💡', '🧘', '⚡'];

export const NotionPageEditor: React.FC<NotionPageEditorProps> = ({
  page,
  onUpdatePage,
  isDark,
  isFullWidth,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [activeSlashMenuIndex, setActiveSlashMenuIndex] = useState<number | null>(null);

  // Update Page Title
  const handleTitleChange = (newTitle: string) => {
    onUpdatePage({ ...page, title: newTitle });
  };

  // Update Icon
  const handleIconChange = (icon: string) => {
    onUpdatePage({ ...page, icon });
    setShowEmojiPicker(false);
  };

  // Update Cover
  const handleCoverChange = (coverUrl: string) => {
    onUpdatePage({ ...page, coverUrl });
    setShowCoverPicker(false);
  };

  // Update Property
  const handlePropertyChange = (field: string, value: any) => {
    onUpdatePage({
      ...page,
      properties: {
        ...page.properties,
        [field]: value,
      },
    });
  };

  // Blocks management
  const handleBlockChange = (blockId: string, updatedFields: Partial<NotionBlock>) => {
    const updatedBlocks = page.blocks.map(b => {
      if (b.id === blockId) {
        return { ...b, ...updatedFields };
      }
      return b;
    });

    // Auto calculate totalSpent from all expense tables if present
    let computedSpent = 0;
    let hasExpenses = false;
    updatedBlocks.forEach(b => {
      if (b.type === 'expense_table' && b.expenseData) {
        hasExpenses = true;
        computedSpent += b.expenseData.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      }
    });

    onUpdatePage({
      ...page,
      properties: {
        ...page.properties,
        ...(hasExpenses ? { totalSpent: computedSpent } : {}),
      },
      blocks: updatedBlocks,
    });
  };

  const handleAddBlock = (index: number, type: NotionBlockType) => {
    const newBlock: NotionBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      content: '',
      ...(type === 'callout' ? { calloutIcon: '💡', calloutColor: 'yellow', content: 'Callout note...' } : {}),
      ...(type === 'todo' ? { checked: false, content: 'To-do item' } : {}),
      ...(type === 'expense_table' ? { expenseData: [] } : {}),
      ...(type === 'routine_checklist' ? { routineData: [] } : {}),
    };

    const newBlocks = [...page.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onUpdatePage({ ...page, blocks: newBlocks });
    setActiveSlashMenuIndex(null);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (page.blocks.length <= 1) return;
    const newBlocks = page.blocks.filter(b => b.id !== blockId);
    onUpdatePage({ ...page, blocks: newBlocks });
  };

  return (
    <div className={`min-h-full pb-32 transition-colors ${
      isDark ? 'text-stone-100' : 'text-stone-800'
    }`}>
      {/* Notion Page Cover */}
      {page.coverUrl && (
        <div className="group relative w-full h-56 md:h-64 overflow-hidden bg-stone-900">
          <img
            src={page.coverUrl}
            alt="Page cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20" />

          {/* Hover Cover Controls */}
          <div className="absolute bottom-3 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
            <button
              onClick={() => setShowCoverPicker(!showCoverPicker)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-stone-900/80 hover:bg-stone-900 backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
            >
              Change Cover
            </button>
            <button
              onClick={() => onUpdatePage({ ...page, coverUrl: '' })}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-stone-900/80 hover:bg-stone-900 backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>

          {/* Cover Picker Modal */}
          {showCoverPicker && (
            <div className="absolute top-12 right-6 z-30 p-4 rounded-xl bg-stone-900/95 border border-stone-700 shadow-2xl space-y-3 backdrop-blur-md">
              <span className="text-xs font-semibold text-white block">Scenic Panorama Covers</span>
              <div className="grid grid-cols-2 gap-2 w-64">
                {Object.entries(SCENIC_COVERS).map(([key, url]) => (
                  <button
                    key={key}
                    onClick={() => handleCoverChange(url)}
                    className="aspect-video rounded-lg overflow-hidden border border-stone-700 hover:border-amber-300 transition-colors cursor-pointer"
                  >
                    <img src={url} alt={key} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Page Canvas Container */}
      <div className={`mx-auto px-6 md:px-12 transition-all duration-300 ${
        isFullWidth ? 'max-w-6xl' : 'max-w-3xl'
      }`}>
        {/* Page Icon & Quick Actions */}
        <div className={`relative ${page.coverUrl ? '-mt-10' : 'pt-8'} mb-4 flex items-end gap-3`}>
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-md cursor-pointer transition-transform hover:scale-105 border border-white/10 bg-stone-900"
              title="Click to change icon"
            >
              {page.icon || '📄'}
            </button>

            {/* Quick Emoji Picker Drawer */}
            {showEmojiPicker && (
              <div className="absolute top-18 left-0 z-40 p-3 rounded-2xl bg-stone-900 border border-stone-700 shadow-2xl grid grid-cols-5 gap-2 backdrop-blur-md w-56">
                {COMMON_EMOJIS.map(em => (
                  <button
                    key={em}
                    onClick={() => handleIconChange(em)}
                    className="p-2 text-2xl hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!page.coverUrl && (
            <button
              onClick={() => handleCoverChange(SCENIC_COVERS.alpine)}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 py-1 px-2 rounded hover:bg-stone-800/50 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Add Cover
            </button>
          )}
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <input
            type="text"
            value={page.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none focus:outline-none placeholder-stone-500 font-display"
          />
        </div>

        {/* Notion Properties Grid */}
        <div className={`py-3 px-4 mb-8 rounded-xl border text-xs space-y-2.5 ${
          isDark ? 'bg-stone-900/30 border-stone-800' : 'bg-stone-50 border-stone-200'
        }`}>
          {/* Date */}
          <div className="flex items-center gap-4">
            <div className="w-28 flex items-center gap-1.5 text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date</span>
            </div>
            <input
              type="date"
              value={page.properties.date}
              onChange={e => handlePropertyChange('date', e.target.value)}
              className="bg-transparent border border-stone-700/60 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-amber-300 font-mono"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <div className="w-28 flex items-center gap-1.5 text-stone-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Status</span>
            </div>
            <select
              value={page.properties.status}
              onChange={e => handlePropertyChange('status', e.target.value)}
              className="bg-transparent border border-stone-700/60 rounded px-2 py-0.5 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Planned" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Planned</option>
              <option value="In Progress" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>In Progress</option>
              <option value="Completed" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Completed</option>
              <option value="Archived" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Archived</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex items-center gap-4">
            <div className="w-28 flex items-center gap-1.5 text-stone-400">
              <Tag className="w-3.5 h-3.5" />
              <span>Category</span>
            </div>
            <select
              value={page.properties.category || 'Finance'}
              onChange={e => handlePropertyChange('category', e.target.value)}
              className="bg-transparent border border-stone-700/60 rounded px-2 py-0.5 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Finance" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Finance</option>
              <option value="Journal" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Journal</option>
              <option value="Routine" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Routine</option>
              <option value="Life OS" className={isDark ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'}>Life OS</option>
            </select>
          </div>

          {/* Total Spent (if finance page) */}
          {page.properties.totalSpent !== undefined && (
            <div className="flex items-center gap-4">
              <div className="w-28 flex items-center gap-1.5 text-stone-400">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Spent</span>
              </div>
              <span className="font-mono tabular-nums font-bold text-emerald-400">
                ${page.properties.totalSpent.toFixed(2)}
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-4">
            <div className="w-28 flex items-center gap-1.5 text-stone-400">
              <Tag className="w-3.5 h-3.5" />
              <span>Tags</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {page.properties.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 text-[11px] rounded bg-stone-800 text-stone-300 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Blocks Flow Area */}
        <div className="space-y-3">
          {page.blocks.map((block, idx) => (
            <div key={block.id} className="group relative flex items-start gap-2 -ml-7 pl-7">
              {/* Block Hover Drag/Add Handles */}
              <div className="absolute left-0 top-1.5 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 text-stone-500 transition-opacity">
                <button
                  onClick={() => setActiveSlashMenuIndex(activeSlashMenuIndex === idx ? null : idx)}
                  className="p-1 hover:text-white hover:bg-stone-800 rounded cursor-pointer"
                  title="Add block below"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBlock(block.id)}
                  className="p-1 hover:text-rose-400 hover:bg-stone-800 rounded cursor-pointer"
                  title="Delete block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Block Renderer */}
              <div className="flex-1 min-w-0">
                {block.type === 'paragraph' && (
                  <textarea
                    value={block.content}
                    onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Type '/' for commands or start writing..."
                    rows={Math.max(2, Math.ceil(block.content.length / 80))}
                    className="w-full bg-transparent focus:outline-none text-sm leading-relaxed resize-none font-sans"
                  />
                )}

                {block.type === 'heading1' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Heading 1"
                    className="w-full bg-transparent focus:outline-none text-2xl font-bold font-display mt-4 mb-2"
                  />
                )}

                {block.type === 'heading2' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Heading 2"
                    className="w-full bg-transparent focus:outline-none text-xl font-semibold font-display mt-3 mb-1"
                  />
                )}

                {block.type === 'heading3' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                    placeholder="Heading 3"
                    className="w-full bg-transparent focus:outline-none text-base font-medium mt-2"
                  />
                )}

                {block.type === 'todo' && (
                  <div className="flex items-start gap-2.5 py-1">
                    <input
                      type="checkbox"
                      checked={!!block.checked}
                      onChange={e => handleBlockChange(block.id, { checked: e.target.checked })}
                      className="mt-1 rounded accent-amber-400 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={block.content}
                      onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                      placeholder="To-do item..."
                      className={`w-full bg-transparent focus:outline-none text-sm ${
                        block.checked ? 'line-through text-stone-500' : ''
                      }`}
                    />
                  </div>
                )}

                {block.type === 'bullet' && (
                  <div className="flex items-start gap-2.5 py-1">
                    <span className="text-stone-400 mt-0.5">•</span>
                    <input
                      type="text"
                      value={block.content}
                      onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                      placeholder="List item..."
                      className="w-full bg-transparent focus:outline-none text-sm"
                    />
                  </div>
                )}

                {block.type === 'callout' && (
                  <div className={`p-4 rounded-xl border flex items-start gap-3 my-2 ${
                    isDark ? 'bg-amber-400/10 border-amber-400/25' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <span className="text-xl select-none">{block.calloutIcon || '💡'}</span>
                    <textarea
                      value={block.content}
                      onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                      rows={2}
                      placeholder="Callout thought or insight..."
                      className="w-full bg-transparent focus:outline-none text-xs leading-relaxed resize-none text-stone-200"
                    />
                  </div>
                )}

                {block.type === 'quote' && (
                  <div className="border-l-2 border-stone-500 pl-4 py-1.5 my-2 italic text-sm text-stone-300">
                    <input
                      type="text"
                      value={block.content}
                      onChange={e => handleBlockChange(block.id, { content: e.target.value })}
                      placeholder="Empty quote..."
                      className="w-full bg-transparent focus:outline-none italic"
                    />
                  </div>
                )}

                {block.type === 'divider' && (
                  <div className="py-3">
                    <hr className="border-stone-800" />
                  </div>
                )}

                {block.type === 'expense_table' && (
                  <ExpenseTableBlock
                    expenses={block.expenseData || []}
                    onChange={updated => handleBlockChange(block.id, { expenseData: updated })}
                    isDark={isDark}
                  />
                )}

                {block.type === 'routine_checklist' && (
                  <RoutineChecklistBlock
                    routines={block.routineData || []}
                    onChange={updated => handleBlockChange(block.id, { routineData: updated })}
                    isDark={isDark}
                  />
                )}
              </div>

              {/* Slash Command Block Adder Menu */}
              {activeSlashMenuIndex === idx && (
                <div className="absolute left-8 top-8 z-40 p-2 rounded-xl bg-stone-900 border border-stone-700 shadow-2xl space-y-1 w-64 backdrop-blur-xl">
                  <span className="text-[11px] font-semibold text-stone-400 px-2 py-1 block">Insert Notion Block</span>
                  <button
                    onClick={() => handleAddBlock(idx, 'paragraph')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-800 text-left text-white cursor-pointer"
                  >
                    <AlignLeft className="w-3.5 h-3.5 text-stone-400" />
                    <span>Text Paragraph</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'heading2')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-800 text-left text-white cursor-pointer"
                  >
                    <Heading2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Heading 2</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'todo')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-800 text-left text-white cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-stone-400" />
                    <span>To-do Checkbox</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'expense_table')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-emerald-950 text-left text-emerald-300 font-semibold cursor-pointer border border-emerald-500/30"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>💰 Money & Expense Table</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'routine_checklist')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-amber-950 text-left text-amber-300 font-semibold cursor-pointer border border-amber-500/30"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>🌅 Routine & Habit Tracker</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'callout')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-800 text-left text-white cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Callout Box</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'bullet')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-800 text-left text-white cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5 text-stone-400" />
                    <span>Bulleted List</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock(idx, 'divider')}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs hover:bg-stone-800 text-left text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5 text-stone-400" />
                    <span>Divider</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Quick Block Inserter Bar */}
        <div className="mt-12 pt-4 border-t border-stone-800 flex items-center gap-2 flex-wrap text-xs text-stone-400">
          <span className="text-stone-500 text-[11px]">Quick Add:</span>
          <button
            onClick={() => handleAddBlock(page.blocks.length - 1, 'paragraph')}
            className="px-2.5 py-1 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:text-white transition-colors cursor-pointer"
          >
            + Text
          </button>
          <button
            onClick={() => handleAddBlock(page.blocks.length - 1, 'heading2')}
            className="px-2.5 py-1 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:text-white transition-colors cursor-pointer"
          >
            + Heading
          </button>
          <button
            onClick={() => handleAddBlock(page.blocks.length - 1, 'todo')}
            className="px-2.5 py-1 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:text-white transition-colors cursor-pointer"
          >
            + To-do
          </button>
          <button
            onClick={() => handleAddBlock(page.blocks.length - 1, 'expense_table')}
            className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30 transition-colors cursor-pointer font-medium"
          >
            + 💰 Expense Table
          </button>
          <button
            onClick={() => handleAddBlock(page.blocks.length - 1, 'routine_checklist')}
            className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 hover:bg-amber-900 border border-amber-500/30 transition-colors cursor-pointer font-medium"
          >
            + 🌅 Routine Block
          </button>
          <button
            onClick={() => handleAddBlock(page.blocks.length - 1, 'callout')}
            className="px-2.5 py-1 rounded bg-stone-900/60 hover:bg-stone-800 border border-stone-800 hover:text-white transition-colors cursor-pointer"
          >
            + Callout
          </button>
        </div>
      </div>
    </div>
  );
};
