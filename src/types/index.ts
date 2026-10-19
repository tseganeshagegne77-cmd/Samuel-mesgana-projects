export interface RoutineStep {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: 'mind' | 'body' | 'focus' | 'nourish' | 'rest';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  completed: boolean;
  notes?: string;
}

export interface RoutinePreset {
  id: string;
  name: string;
  description: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  isCustom?: boolean;
  estimatedMinutes: number;
  steps: RoutineStep[];
}

export type MoodType = 'Serene' | 'Inspired' | 'Grateful' | 'Focused' | 'Contemplative' | 'Tired';
export type WeatherType = 'Sunny' | 'Misty' | 'Rain' | 'Clear Sky' | 'Gentle Breeze';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  title: string;
  content: string;
  mood: MoodType;
  weather: WeatherType;
  gratitudeItems: string[];
  highlightOfDay: string;
  tags: string[];
  wordCount: number;
  isFavorite?: boolean;
}

export interface ScenicView {
  id: string;
  name: string;
  subtitle: string;
  locationLabel: string;
  imageSrc: string;
  audioPreset: 'rain' | 'forest_wind' | 'singing_bowl' | 'binaural' | 'none';
  particleType: 'rain' | 'motes' | 'leaves' | 'stars' | 'none';
}

export interface DailyRecord {
  date: string;
  completedStepIds: string[];
  routineId: string;
  journalEntryId?: string;
  completionRate: number;
}
