import React, { useState, useEffect } from 'react';
import { NotionPage, DatabaseViewType, TemplateDefinition } from './types/notion';
import { notionStorage } from './utils/notionStorage';
import { NotionSidebar } from './components/notion/NotionSidebar';
import { NotionTopBar } from './components/notion/NotionTopBar';
import { NotionPageEditor } from './components/notion/NotionPageEditor';
import { NotionDatabaseView } from './components/notion/NotionDatabaseView';
import { TemplateGalleryModal } from './components/notion/TemplateGalleryModal';
import { NOTION_TEMPLATES, SCENIC_COVERS } from './utils/notionTemplates';

export default function App() {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [databaseView, setDatabaseView] = useState<DatabaseViewType>('gallery');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const loadedPages = notionStorage.getPages();
    setPages(loadedPages);

    const savedActiveId = notionStorage.getActivePageId();
    setActivePageId(savedActiveId);

    const savedView = notionStorage.getActiveView();
    setDatabaseView(savedView);

    const savedTheme = notionStorage.getTheme();
    setIsDark(savedTheme === 'dark');

    const savedFullWidth = notionStorage.getFullWidth();
    setIsFullWidth(savedFullWidth);
  }, []);

  // Update Page handler
  const handleUpdatePage = (updated: NotionPage) => {
    const updatedList = notionStorage.savePage(updated);
    setPages(updatedList);
  };

  // Select Page handler
  const handleSelectPage = (id: string) => {
    setActivePageId(id);
    notionStorage.setActivePageId(id);
  };

  // Open Database View
  const handleOpenDatabaseView = () => {
    setActivePageId(null);
  };

  // Create new blank page
  const handleNewPage = () => {
    const newPage: NotionPage = {
      id: `page-${Date.now()}`,
      title: 'Untitled',
      icon: '📄',
      coverUrl: SCENIC_COVERS.alpine,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      templateType: 'blank',
      properties: {
        date: new Date().toISOString().split('T')[0],
        status: 'In Progress',
        tags: ['New Entry'],
        category: 'Journal',
      },
      blocks: [
        {
          id: `blk-${Date.now()}-1`,
          type: 'paragraph',
          content: '',
        },
      ],
    };

    const updatedList = [newPage, ...pages];
    setPages(updatedList);
    notionStorage.savePages(updatedList);
    setActivePageId(newPage.id);
  };

  // Apply template to create a new page
  const handleApplyTemplate = (template: TemplateDefinition) => {
    const newPage: NotionPage = {
      id: `page-${Date.now()}`,
      title: template.title,
      icon: template.icon,
      coverUrl: template.coverUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      templateType: template.id,
      properties: {
        date: new Date().toISOString().split('T')[0],
        status: template.defaultProperties.status || 'In Progress',
        mood: template.defaultProperties.mood,
        weather: template.defaultProperties.weather,
        totalSpent: template.defaultProperties.totalSpent,
        routineRate: template.defaultProperties.routineRate,
        tags: template.defaultProperties.tags || template.tags,
        category: template.defaultProperties.category || (template.category === 'Money & Wealth' ? 'Finance' : 'Journal'),
      },
      blocks: template.createBlocks(),
    };

    const updatedList = [newPage, ...pages];
    setPages(updatedList);
    notionStorage.savePages(updatedList);
    setActivePageId(newPage.id);
    setShowTemplateModal(false);
  };

  // Delete page
  const handleDeletePage = (id: string) => {
    const updatedList = notionStorage.deletePage(id);
    setPages(updatedList);
    if (activePageId === id) {
      setActivePageId(updatedList[0]?.id || null);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const target = pages.find(p => p.id === id);
    if (target) {
      handleUpdatePage({ ...target, isFavorite: !target.isFavorite });
    }
  };

  // Toggle theme
  const handleToggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    notionStorage.setTheme(next ? 'dark' : 'light');
  };

  // Toggle full width
  const handleToggleFullWidth = () => {
    const next = !isFullWidth;
    setIsFullWidth(next);
    notionStorage.setFullWidth(next);
  };

  // Change view
  const handleChangeView = (view: DatabaseViewType) => {
    setDatabaseView(view);
    notionStorage.setActiveView(view);
  };

  const currentPage = pages.find(p => p.id === activePageId) || null;

  return (
    <div className={`w-full min-h-screen flex ${isDark ? 'bg-[#121212] text-stone-100' : 'bg-white text-stone-800'}`}>
      {/* Notion Collapsible Sidebar */}
      <NotionSidebar
        pages={pages}
        activePageId={activePageId}
        onSelectPage={handleSelectPage}
        onOpenDatabaseView={handleOpenDatabaseView}
        onOpenTemplates={() => setShowTemplateModal(true)}
        onNewPage={handleNewPage}
        onDeletePage={handleDeletePage}
        onToggleFavorite={handleToggleFavorite}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Notion Top Bar */}
        <NotionTopBar
          currentPage={currentPage}
          onToggleFavorite={handleToggleFavorite}
          isFullWidth={isFullWidth}
          onToggleFullWidth={handleToggleFullWidth}
          onOpenTemplates={() => setShowTemplateModal(true)}
          onNewPage={handleNewPage}
          isDark={isDark}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {currentPage ? (
            <NotionPageEditor
              key={currentPage.id}
              page={currentPage}
              onUpdatePage={handleUpdatePage}
              isDark={isDark}
              isFullWidth={isFullWidth}
            />
          ) : (
            <NotionDatabaseView
              pages={pages}
              activeView={databaseView}
              onChangeView={handleChangeView}
              onSelectPage={handleSelectPage}
              onOpenTemplates={() => setShowTemplateModal(true)}
              isDark={isDark}
            />
          )}
        </main>
      </div>

      {/* Template Gallery Modal */}
      {showTemplateModal && (
        <TemplateGalleryModal
          onClose={() => setShowTemplateModal(false)}
          onApplyTemplate={handleApplyTemplate}
        />
      )}
    </div>
  );
}
