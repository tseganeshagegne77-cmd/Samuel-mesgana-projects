export type NotionBlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'todo'
  | 'bullet'
  | 'callout'
  | 'quote'
  | 'divider'
  | 'expense_table'
  | 'routine_checklist';

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: 'Housing' | 'Food & Groceries' | 'Transportation' | 'Health & Fitness' | 'Entertainment' | 'Shopping' | 'Savings/Invest' | 'Other';
  paymentMethod: 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer';
  isEssential: boolean;
  notes?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  timeMinutes: number;
  category: 'Mind' | 'Body' | 'Focus' | 'Nourish' | 'Rest';
  completed: boolean;
}

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  content: string;
  checked?: boolean;
  calloutIcon?: string;
  calloutColor?: string; // 'neutral' | 'blue' | 'yellow' | 'green' | 'red' | 'purple'
  expenseData?: ExpenseItem[];
  routineData?: RoutineItem[];
}

export type TemplateId =
  | 'daily_journal'
  | 'morning_routine'
  | 'evening_routine'
  | 'money_daily_expenses'
  | 'money_monthly_budget'
  | 'money_savings_milestones'
  | 'money_impulse_cooling_off'
  | 'weekly_review'
  | 'blank';

export interface NotionPageProperties {
  date: string; // YYYY-MM-DD
  status: 'In Progress' | 'Completed' | 'Archived' | 'Planned';
  mood?: 'Serene' | 'Inspired' | 'Grateful' | 'Focused' | 'Contemplative' | 'Tired';
  weather?: 'Sunny' | 'Misty' | 'Rain' | 'Clear Sky' | 'Gentle Breeze';
  tags: string[];
  totalSpent?: number;
  routineRate?: number; // 0 to 1
  category?: 'Journal' | 'Routine' | 'Finance' | 'Life OS';
}

export interface NotionPage {
  id: string;
  title: string;
  icon: string; // emoji e.g. "📔", "💰", "🌅"
  coverUrl: string; // scenic image url or color
  coverPosition?: number; // 0 to 100%
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  templateType: TemplateId;
  properties: NotionPageProperties;
  blocks: NotionBlock[];
}

export type DatabaseViewType = 'gallery' | 'table' | 'board' | 'calendar' | 'list';

export interface TemplateDefinition {
  id: TemplateId;
  title: string;
  icon: string;
  category: 'Money & Wealth' | 'Journal & Mindfulness' | 'Routines & Habits' | 'Life OS';
  description: string;
  tags: string[];
  coverUrl: string;
  defaultProperties: Partial<NotionPageProperties>;
  createBlocks: () => NotionBlock[];
}
