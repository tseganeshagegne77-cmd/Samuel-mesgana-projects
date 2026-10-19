import { NotionPage, DatabaseViewType } from '../types/notion';
import { NOTION_TEMPLATES, SCENIC_COVERS } from './notionTemplates';

const NOTION_STORAGE_KEYS = {
  PAGES: 'auraview_notion_pages_v2',
  ACTIVE_PAGE: 'auraview_notion_active_page_v2',
  ACTIVE_VIEW: 'auraview_notion_active_view_v2',
  THEME: 'auraview_notion_theme_v2',
  FULL_WIDTH: 'auraview_notion_full_width_v2',
};

const INITIAL_SEEDED_PAGES: NotionPage[] = [
  {
    id: 'page-daily-expense-today',
    title: 'Daily Expense & Mindful Spending Log',
    icon: '💰',
    coverUrl: SCENIC_COVERS.alpine,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
    isFavorite: true,
    templateType: 'money_daily_expenses',
    properties: {
      date: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      totalSpent: 42.50,
      tags: ['Daily Expense', 'Mindful Spending', 'Groceries'],
      category: 'Finance',
    },
    blocks: NOTION_TEMPLATES.find(t => t.id === 'money_daily_expenses')!.createBlocks(),
  },
  {
    id: 'page-morning-routine-today',
    title: 'Morning Awakening & Routine Saver',
    icon: '🌅',
    coverUrl: SCENIC_COVERS.alpine,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now(),
    isFavorite: true,
    templateType: 'morning_routine',
    properties: {
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      routineRate: 0.8,
      mood: 'Serene',
      tags: ['Morning Ritual', 'Clarity', 'Health'],
      category: 'Routine',
    },
    blocks: NOTION_TEMPLATES.find(t => t.id === 'morning_routine')!.createBlocks(),
  },
  {
    id: 'page-50-30-20-budget',
    title: '50/30/20 Wealth & Budget Allocator',
    icon: '📊',
    coverUrl: SCENIC_COVERS.coastal,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    isFavorite: true,
    templateType: 'money_monthly_budget',
    properties: {
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'In Progress',
      totalSpent: 3230.00,
      tags: ['Monthly Budget', '50/30/20', 'Savings'],
      category: 'Finance',
    },
    blocks: NOTION_TEMPLATES.find(t => t.id === 'money_monthly_budget')!.createBlocks(),
  },
  {
    id: 'page-daily-reflection',
    title: 'Sanctuary of the Morning Glow',
    icon: '📔',
    coverUrl: SCENIC_COVERS.zen,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    isFavorite: false,
    templateType: 'daily_journal',
    properties: {
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      status: 'Completed',
      mood: 'Grateful',
      weather: 'Sunny',
      tags: ['Daily Journal', 'Gratitude', 'Stillness'],
      category: 'Journal',
    },
    blocks: NOTION_TEMPLATES.find(t => t.id === 'daily_journal')!.createBlocks(),
  },
  {
    id: 'page-savings-milestones',
    title: 'Savings Milestones & Freedom Fund',
    icon: '🎯',
    coverUrl: SCENIC_COVERS.starlight,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    isFavorite: false,
    templateType: 'money_savings_milestones',
    properties: {
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
      status: 'In Progress',
      tags: ['Emergency Fund', 'Index Funds', 'Net Worth'],
      category: 'Finance',
    },
    blocks: NOTION_TEMPLATES.find(t => t.id === 'money_savings_milestones')!.createBlocks(),
  },
  {
    id: 'page-evening-sanctuary',
    title: 'Evening Sleep Sanctuary & Wind-Down',
    icon: '🌙',
    coverUrl: SCENIC_COVERS.starlight,
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now() - 345600000,
    isFavorite: false,
    templateType: 'evening_routine',
    properties: {
      date: new Date(Date.now() - 345600000).toISOString().split('T')[0],
      status: 'Planned',
      routineRate: 0.25,
      mood: 'Contemplative',
      tags: ['Evening Reset', 'Sleep', 'Rest'],
      category: 'Routine',
    },
    blocks: NOTION_TEMPLATES.find(t => t.id === 'evening_routine')!.createBlocks(),
  },
];

export const notionStorage = {
  getPages(): NotionPage[] {
    try {
      const data = localStorage.getItem(NOTION_STORAGE_KEYS.PAGES);
      if (!data) {
        localStorage.setItem(NOTION_STORAGE_KEYS.PAGES, JSON.stringify(INITIAL_SEEDED_PAGES));
        return INITIAL_SEEDED_PAGES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SEEDED_PAGES;
    }
  },

  savePages(pages: NotionPage[]) {
    try {
      localStorage.setItem(NOTION_STORAGE_KEYS.PAGES, JSON.stringify(pages));
    } catch {
      // ignore
    }
  },

  savePage(page: NotionPage): NotionPage[] {
    const list = this.getPages();
    const idx = list.findIndex(p => p.id === page.id);
    let updated: NotionPage[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = { ...page, updatedAt: Date.now() };
    } else {
      updated = [{ ...page, createdAt: Date.now(), updatedAt: Date.now() }, ...list];
    }
    this.savePages(updated);
    return updated;
  },

  deletePage(id: string): NotionPage[] {
    const list = this.getPages().filter(p => p.id !== id);
    this.savePages(list);
    return list;
  },

  getActivePageId(): string {
    return localStorage.getItem(NOTION_STORAGE_KEYS.ACTIVE_PAGE) || INITIAL_SEEDED_PAGES[0].id;
  },

  setActivePageId(id: string) {
    localStorage.setItem(NOTION_STORAGE_KEYS.ACTIVE_PAGE, id);
  },

  getActiveView(): DatabaseViewType {
    return (localStorage.getItem(NOTION_STORAGE_KEYS.ACTIVE_VIEW) as DatabaseViewType) || 'gallery';
  },

  setActiveView(view: DatabaseViewType) {
    localStorage.setItem(NOTION_STORAGE_KEYS.ACTIVE_VIEW, view);
  },

  getTheme(): 'dark' | 'light' {
    return (localStorage.getItem(NOTION_STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  },

  setTheme(theme: 'dark' | 'light') {
    localStorage.setItem(NOTION_STORAGE_KEYS.THEME, theme);
  },

  getFullWidth(): boolean {
    return localStorage.getItem(NOTION_STORAGE_KEYS.FULL_WIDTH) === 'true';
  },

  setFullWidth(full: boolean) {
    localStorage.setItem(NOTION_STORAGE_KEYS.FULL_WIDTH, full ? 'true' : 'false');
  },
};
