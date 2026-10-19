import React, { useState } from 'react';
import { NotionPage, DatabaseViewType } from '../../types/notion';
import {
  LayoutGrid,
  Table as TableIcon,
  Columns,
  Calendar as CalendarIcon,
  Plus,
  ArrowUpRight,
  DollarSign,
  CheckCircle,
  Tag,
  Search,
  Filter,
} from 'lucide-react';

interface NotionDatabaseViewProps {
  pages: NotionPage[];
  activeView: DatabaseViewType;
  onChangeView: (view: DatabaseViewType) => void;
  onSelectPage: (id: string) => void;
  onOpenTemplates: () => void;
  isDark: boolean;
}

export const NotionDatabaseView: React.FC<NotionDatabaseViewProps> = ({
  pages,
  activeView,
  onChangeView,
  onSelectPage,
  onOpenTemplates,
  isDark,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPages = pages.filter(p => {
    const matchesCat = filterCategory === 'all' || p.properties.category === filterCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.properties.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalSpentAcrossPages = filteredPages.reduce(
    (sum, p) => sum + (p.properties.totalSpent || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-6">
      {/* Database Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📔</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight font-display text-white">
              Life & Financial Routine OS
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Notion workspace database for daily reflection, routine adherence, and mindful money management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-300 text-stone-950 hover:bg-amber-200 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New with Template
          </button>
        </div>
      </div>

      {/* Notion Database Controls Bar: Views tabs, Search, Category filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* View Switcher Tabs (Gallery, Table, Board, Calendar) */}
        <div className="flex items-center gap-1 p-1 bg-stone-900/80 rounded-lg border border-stone-800">
          <button
            onClick={() => onChangeView('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeView === 'gallery'
                ? 'bg-stone-800 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Gallery</span>
          </button>

          <button
            onClick={() => onChangeView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeView === 'table'
                ? 'bg-stone-800 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>

          <button
            onClick={() => onChangeView('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeView === 'board'
                ? 'bg-stone-800 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Board</span>
          </button>

          <button
            onClick={() => onChangeView('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeView === 'calendar'
                ? 'bg-stone-800 text-white font-medium shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter pages..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-amber-300 w-44"
            />
          </div>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-stone-900 border border-stone-800 rounded-lg text-stone-300 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Finance">💰 Finance & Money</option>
            <option value="Journal">📔 Journals</option>
            <option value="Routine">🌅 Routines</option>
            <option value="Life OS">🧭 Life OS</option>
          </select>
        </div>
      </div>

      {/* 1. GALLERY VIEW */}
      {activeView === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPages.map(page => (
            <div
              key={page.id}
              onClick={() => onSelectPage(page.id)}
              className="group rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-300/60 bg-stone-900/60 transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-0.5"
            >
              {/* Card Cover Preview */}
              <div className="aspect-[16/9] overflow-hidden bg-stone-950 relative">
                {page.coverUrl ? (
                  <img
                    src={page.coverUrl}
                    alt={page.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-900 to-stone-950" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-2xl drop-shadow">
                  {page.icon || '📄'}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>{page.properties.date}</span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] bg-stone-800 text-stone-300">
                    {page.properties.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-200 transition-colors">
                  {page.title}
                </h3>

                {/* Money and Routine properties pill badges */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono tabular-nums border-t border-stone-800/60">
                  {page.properties.totalSpent !== undefined ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${page.properties.totalSpent.toFixed(2)} spent
                    </span>
                  ) : page.properties.routineRate !== undefined ? (
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {Math.round(page.properties.routineRate * 100)}% done
                    </span>
                  ) : (
                    <span className="text-stone-500">{page.properties.category || 'Page'}</span>
                  )}

                  <div className="flex items-center gap-1">
                    {page.properties.tags.slice(0, 1).map((t, idx) => (
                      <span key={idx} className="text-[10px] text-stone-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. TABLE VIEW */}
      {activeView === 'table' && (
        <div className="rounded-xl border border-stone-800 overflow-hidden bg-stone-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 bg-stone-900/80">
                  <th className="py-3 px-4 font-medium">Page Title</th>
                  <th className="py-3 px-4 font-medium w-28">Category</th>
                  <th className="py-3 px-4 font-medium w-28">Date</th>
                  <th className="py-3 px-4 font-medium w-28">Status</th>
                  <th className="py-3 px-4 font-medium w-32">Total Spent ($)</th>
                  <th className="py-3 px-4 font-medium w-28">Routine %</th>
                  <th className="py-3 px-4 font-medium">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredPages.map(page => (
                  <tr
                    key={page.id}
                    onClick={() => onSelectPage(page.id)}
                    className="hover:bg-stone-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-4 font-semibold text-white flex items-center gap-2">
                      <span>{page.icon || '📄'}</span>
                      <span className="group-hover:text-amber-200 transition-colors truncate">
                        {page.title}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-stone-400">{page.properties.category || 'Page'}</td>
                    <td className="py-2.5 px-4 font-mono text-stone-400">{page.properties.date}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-stone-800 text-stone-300">
                        {page.properties.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-emerald-400 font-medium">
                      {page.properties.totalSpent !== undefined
                        ? `$${page.properties.totalSpent.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums text-amber-300">
                      {page.properties.routineRate !== undefined
                        ? `${Math.round(page.properties.routineRate * 100)}%`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-stone-400">
                      <div className="flex items-center gap-1 flex-wrap">
                        {page.properties.tags.map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-stone-800/60 text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Total Summary Row */}
          <div className="px-4 py-3 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs font-mono tabular-nums text-stone-400">
            <span>{filteredPages.length} pages</span>
            <div className="flex items-center gap-6">
              <span className="text-emerald-400 font-bold">
                Total Tracked Spent: ${totalSpentAcrossPages.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. BOARD / KANBAN VIEW */}
      {activeView === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {(['Finance', 'Journal', 'Routine', 'Life OS'] as const).map(cat => {
            const pagesInCat = filteredPages.filter(p => p.properties.category === cat);
            return (
              <div key={cat} className="p-3 rounded-2xl bg-stone-900/50 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-semibold text-xs text-stone-300 flex items-center gap-1.5">
                    <span>{cat === 'Finance' ? '💰' : cat === 'Journal' ? '📔' : cat === 'Routine' ? '🌅' : '🧭'}</span>
                    <span>{cat}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                    {pagesInCat.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[220px]">
                  {pagesInCat.map(page => (
                    <div
                      key={page.id}
                      onClick={() => onSelectPage(page.id)}
                      className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-300/50 transition-all cursor-pointer shadow space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span>{page.icon || '📄'}</span>
                        <h4 className="text-xs font-semibold text-white truncate flex-1">
                          {page.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                        <span>{page.properties.date}</span>
                        {page.properties.totalSpent !== undefined && (
                          <span className="text-emerald-400 font-bold">
                            ${page.properties.totalSpent.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CALENDAR VIEW */}
      {activeView === 'calendar' && (
        <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/40 space-y-4">
          <div className="text-sm font-semibold text-white text-center pb-2 border-b border-stone-800">
            Active Workspace Calendar
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-stone-400 font-medium">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => {
              const dayNum = i + 1;
              const dateMatch = `2026-10-${String(dayNum).padStart(2, '0')}`;
              const pagesOnDay = pages.filter(p => p.properties.date === dateMatch);

              return (
                <div
                  key={i}
                  className="min-h-24 p-2 rounded-xl border border-stone-800/60 bg-stone-950/40 text-left flex flex-col justify-between"
                >
                  <span className="text-[11px] font-mono text-stone-500">{dayNum}</span>
                  <div className="space-y-1 my-1">
                    {pagesOnDay.map(p => (
                      <div
                        key={p.id}
                        onClick={() => onSelectPage(p.id)}
                        className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-amber-300 hover:text-stone-950 transition-colors text-[10px] truncate cursor-pointer font-medium"
                      >
                        {p.icon} {p.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
