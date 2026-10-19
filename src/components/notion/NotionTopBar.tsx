import React from 'react';
import { NotionPage } from '../../types/notion';
import {
  Star,
  Maximize2,
  Minimize2,
  Share2,
  Download,
  Plus,
  Sparkles,
} from 'lucide-react';

interface NotionTopBarProps {
  currentPage: NotionPage | null;
  onToggleFavorite: (id: string) => void;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
  onOpenTemplates: () => void;
  onNewPage: () => void;
  isDark: boolean;
}

export const NotionTopBar: React.FC<NotionTopBarProps> = ({
  currentPage,
  onToggleFavorite,
  isFullWidth,
  onToggleFullWidth,
  onOpenTemplates,
  onNewPage,
  isDark,
}) => {
  const handleExportPage = () => {
    if (!currentPage) return;
    const jsonStr = JSON.stringify(currentPage, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.title.toLowerCase().replace(/\s+/g, '_')}_notion.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className={`h-11 px-4 border-b flex items-center justify-between text-xs select-none sticky top-0 z-30 transition-colors backdrop-blur-md ${
      isDark ? 'bg-stone-950/80 border-stone-800 text-stone-300' : 'bg-white/80 border-stone-200 text-stone-700'
    }`}>
      {/* Left: Notion Breadcrumbs */}
      <div className="flex items-center gap-1.5 truncate">
        <span className="text-stone-400 hover:text-white cursor-pointer transition-colors">
          Workspace
        </span>
        <span className="text-stone-600">/</span>
        {currentPage ? (
          <div className="flex items-center gap-1.5 truncate font-medium text-white">
            <span>{currentPage.icon || '📄'}</span>
            <span className="truncate">{currentPage.title || 'Untitled'}</span>
          </div>
        ) : (
          <span className="font-medium text-white">All Databases & Views</span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {currentPage && (
          <button
            onClick={() => onToggleFavorite(currentPage.id)}
            className={`p-1.5 rounded hover:bg-stone-800 transition-colors cursor-pointer ${
              currentPage.isFavorite ? 'text-amber-300' : 'text-stone-400 hover:text-white'
            }`}
            title={currentPage.isFavorite ? 'Favorited' : 'Add to Favorites'}
          >
            <Star className={`w-3.5 h-3.5 ${currentPage.isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        <button
          onClick={onToggleFullWidth}
          className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          title={isFullWidth ? 'Standard Width' : 'Full Width'}
        >
          {isFullWidth ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {currentPage && (
          <button
            onClick={handleExportPage}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Export Page JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="h-4 w-px bg-stone-800 mx-1" />

        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Templates</span>
        </button>

        <button
          onClick={onNewPage}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-300 hover:bg-amber-200 text-stone-950 font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </button>
      </div>
    </header>
  );
};
