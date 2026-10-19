import { JournalEntry, RoutinePreset, ScenicView, DailyRecord } from '../types';

export const SCENIC_VIEWS: ScenicView[] = [
  {
    id: 'alpine-dawn',
    name: 'Alpine Dawn',
    subtitle: 'Golden sunrise over mist-shrouded peaks & pristine lake',
    locationLabel: 'Bernese Highlands',
    imageSrc: '/src/assets/images/view_alpine_dawn_1792399038626.jpg',
    audioPreset: 'forest_wind',
    particleType: 'motes',
  },
  {
    id: 'coastal-twilight',
    name: 'Coastal Twilight',
    subtitle: 'Soft lavender dusk across still Scandinavian waters',
    locationLabel: 'Lofoten Archipelago',
    imageSrc: '/src/assets/images/view_coastal_twilight_1792399056464.jpg',
    audioPreset: 'rain',
    particleType: 'rain',
  },
  {
    id: 'zen-sanctuary',
    name: 'Kyoto Zen Pavilion',
    subtitle: 'Emerald moss garden and quiet bamboo sanctuary',
    locationLabel: 'Kyoto Arashiyama',
    imageSrc: '/src/assets/images/view_zen_sanctuary_1792399056308.jpg',
    audioPreset: 'singing_bowl',
    particleType: 'leaves',
  },
  {
    id: 'midnight-starlight',
    name: 'Midnight Constellations',
    subtitle: 'Tranquil glass balcony looking into the infinite cosmos',
    locationLabel: 'High Mountain Observatory',
    imageSrc: '/src/assets/images/view_night_starlight_1792399072203.jpg',
    audioPreset: 'binaural',
    particleType: 'stars',
  },
];

export const INITIAL_ROUTINE_PRESETS: RoutinePreset[] = [
  {
    id: 'preset-morning-awakening',
    name: 'Mindful Morning Awakening',
    description: 'A grounded morning sequence to foster clarity, hydration, and mindful intention before the world wakes.',
    timeOfDay: 'morning',
    estimatedMinutes: 45,
    isCustom: false,
    steps: [
      {
        id: 'step-m1',
        title: 'Hydration & Natural Light',
        description: 'Drink 500ml fresh room-temperature water with a squeeze of lemon and step onto the balcony or window for natural sunlight.',
        durationMinutes: 5,
        category: 'nourish',
        timeOfDay: 'morning',
        completed: false,
      },
      {
        id: 'step-m2',
        title: '10-Minute Box Breathing',
        description: 'Inhale 4s, hold 4s, exhale 4s, pause 4s. Soften facial tension and ground awareness into the physical body.',
        durationMinutes: 10,
        category: 'mind',
        timeOfDay: 'morning',
        completed: false,
      },
      {
        id: 'step-m3',
        title: 'Morning Stream Journaling',
        description: 'Write uncensored thoughts in the Journal Studio. Note 3 small things you appreciate and single intention for today.',
        durationMinutes: 15,
        category: 'mind',
        timeOfDay: 'morning',
        completed: false,
      },
      {
        id: 'step-m4',
        title: 'Gentle Spinal Mobility & Stretch',
        description: 'Cat-cow poses, low lunge hip openers, and deep shoulder rolls to release nocturnal stiffness.',
        durationMinutes: 10,
        category: 'body',
        timeOfDay: 'morning',
        completed: false,
      },
      {
        id: 'step-m5',
        title: 'Define Top 2 Deep Work Outcomes',
        description: 'Identify the two essential tasks that will make today meaningfully successful. Protect calendar time for them.',
        durationMinutes: 5,
        category: 'focus',
        timeOfDay: 'morning',
        completed: false,
      },
    ],
  },
  {
    id: 'preset-deep-focus',
    name: 'Deep Focus & Flow Ritual',
    description: 'Designed for uninterrupted creative synthesis and cognitively demanding problem solving.',
    timeOfDay: 'afternoon',
    estimatedMinutes: 65,
    isCustom: false,
    steps: [
      {
        id: 'step-f1',
        title: 'Digital Horizon Sanctuary',
        description: 'Close extraneous browser tabs, turn phone to Do Not Disturb, and set scenic view with rain or binaural tones.',
        durationMinutes: 5,
        category: 'focus',
        timeOfDay: 'afternoon',
        completed: false,
      },
      {
        id: 'step-f2',
        title: '45-Minute Unbroken Sprint',
        description: 'Single-task focused flow. No checking email or messaging until the session finishes.',
        durationMinutes: 45,
        category: 'focus',
        timeOfDay: 'afternoon',
        completed: false,
      },
      {
        id: 'step-f3',
        title: '10-Minute Eye Rest & Nature Pacing',
        description: 'Gaze into distant horizon (20-20-20 rule), walk around, stretch wrists and forearms.',
        durationMinutes: 10,
        category: 'body',
        timeOfDay: 'afternoon',
        completed: false,
      },
      {
        id: 'step-f4',
        title: 'Session Debrief & Next Step Anchor',
        description: 'Record progress note so returning to the problem later requires zero mental friction.',
        durationMinutes: 5,
        category: 'mind',
        timeOfDay: 'afternoon',
        completed: false,
      },
    ],
  },
  {
    id: 'preset-evening-sanctuary',
    name: 'Evening Wind-Down & Sleep Sanctuary',
    description: 'Gently release the cognitive momentum of the day and prepare nervous system for restorative sleep.',
    timeOfDay: 'evening',
    estimatedMinutes: 40,
    isCustom: false,
    steps: [
      {
        id: 'step-e1',
        title: 'Digital Sunset & Work Shutdown',
        description: 'Close work software. Put devices on bedroom chargers. Signal to your brain that the workday is officially over.',
        durationMinutes: 5,
        category: 'rest',
        timeOfDay: 'evening',
        completed: false,
      },
      {
        id: 'step-e2',
        title: 'Evening Gratitude & Reflection Journal',
        description: 'Capture what brought you unexpected joy today, what challenge you handled with grace, and let go of what you cannot change.',
        durationMinutes: 15,
        category: 'mind',
        timeOfDay: 'evening',
        completed: false,
      },
      {
        id: 'step-e3',
        title: 'Herbal Tea & Bedroom Temp Check',
        description: 'Sip warm chamomile or peppermint infusion. Set room temperature to cool 18-19°C (65-68°F).',
        durationMinutes: 5,
        category: 'nourish',
        timeOfDay: 'evening',
        completed: false,
      },
      {
        id: 'step-e4',
        title: '15-Minute Analog Reading',
        description: 'Read physical prose or literature. No backlit displays or provocative news.',
        durationMinutes: 15,
        category: 'rest',
        timeOfDay: 'evening',
        completed: false,
      },
    ],
  },
  {
    id: 'preset-weekend-reset',
    name: 'Weekend Reset & Space Renewal',
    description: 'Slow down, re-center priorities, and reset personal sanctuary for a calm week ahead.',
    timeOfDay: 'anytime',
    estimatedMinutes: 60,
    isCustom: false,
    steps: [
      {
        id: 'step-w1',
        title: 'Slow Morning Tea Without Clocks',
        description: 'Savor a warm beverage in stillness. Enjoy the scenic landscape without checking alerts.',
        durationMinutes: 15,
        category: 'nourish',
        timeOfDay: 'anytime',
        completed: false,
      },
      {
        id: 'step-w2',
        title: 'Physical Sanctuary Declutter',
        description: 'Clear desk surface, organize bedside table, and open windows to air out living spaces.',
        durationMinutes: 20,
        category: 'rest',
        timeOfDay: 'anytime',
        completed: false,
      },
      {
        id: 'step-w3',
        title: 'Weekly Wins & Learnings Journal',
        description: 'Celebrate 3 meaningful breakthroughs from this past week and write one sentence of encouragement for the week ahead.',
        durationMinutes: 15,
        category: 'mind',
        timeOfDay: 'anytime',
        completed: false,
      },
      {
        id: 'step-w4',
        title: 'Intentional Calendar Crafting',
        description: 'Block out self-care, movement, and family spaces before filling with commitments.',
        durationMinutes: 10,
        category: 'focus',
        timeOfDay: 'anytime',
        completed: false,
      },
    ],
  },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-seed-today',
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    title: 'The Calm Before the World Awakes',
    content: `Sitting by the window as the first pale amber glow filters over the lake. There is a sacred clarity to early mornings when the notifications haven't yet interrupted the rhythm of thought.\n\nI reflected today on how easy it is to equate frantic busyness with purposeful living. Today, my commitment is different: I want to move with deliberate elegance through each task. When working, I will sink completely into the focus. When resting, I will permit myself absolute ease without guilt.`,
    mood: 'Serene',
    weather: 'Sunny',
    gratitudeItems: [
      'The quiet scent of freshly steeped cedar and mint tea',
      'Having space in the morning to breathe without rush',
      'The calm water reflecting the golden morning ridges',
    ],
    highlightOfDay: 'Taking 20 uninterrupted minutes to sit in mindful stillness before opening emails.',
    tags: ['Mindfulness', 'Clarity', 'Morning Ritual'],
    wordCount: 104,
    isFavorite: true,
  },
  {
    id: 'entry-seed-yesterday',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timestamp: Date.now() - 86400000,
    title: 'Flow States and Letting Go of Perfection',
    content: `Spent three focused hours working on creative architecture today. I noticed how my attention naturally drifted toward self-criticism around the middle hour. Instead of abandoning the sprint, I paused, drank cold water, listened to the gentle rain soundscape, and reminded myself that the first draft exists only to give shape to thought.\n\nAfter finishing, the feeling of completion was deeply nourishing. Evening walk under crisp air made the day feel whole.`,
    mood: 'Focused',
    weather: 'Rain',
    gratitudeItems: [
      'Overcoming the dip of creative resistance',
      'The crisp smell of autumn rain on moss',
      'A warm home to retreat to after a damp walk',
    ],
    highlightOfDay: 'Wrapping up the primary milestone 30 minutes earlier than expected.',
    tags: ['Focus', 'Creativity', 'Patience'],
    wordCount: 96,
    isFavorite: false,
  },
  {
    id: 'entry-seed-prev2',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    timestamp: Date.now() - 172800000,
    title: 'Sanctuary of the Evening Hour',
    content: `Evening is such a gentle mirror. As the sun melted into lavender and dusky rose over the water, I closed all screens and lit a small beeswax candle.\n\nWhat worked well today was honoring my physical boundaries: I took three deliberate movement breaks, stretched my spine, and didn't allow urgency to masquerade as importance. Tomorrow I will bring this same centered balance to our team reviews.`,
    mood: 'Grateful',
    weather: 'Clear Sky',
    gratitudeItems: [
      'A phone call with an old friend that brought hearty laughter',
      'Nutritious home-cooked meal shared in calm silence',
      'The deep restorative breath after a busy week',
    ],
    highlightOfDay: 'A quiet conversation that reminded me how much progress we have made.',
    tags: ['Evening Debrief', 'Gratitude', 'Health'],
    wordCount: 88,
    isFavorite: true,
  },
];

const STORAGE_KEYS = {
  ENTRIES: 'auraview_journal_entries',
  ROUTINES: 'auraview_routine_presets',
  ACTIVE_ROUTINE_ID: 'auraview_active_routine_id',
  ACTIVE_VIEW_ID: 'auraview_active_view_id',
  DAILY_RECORDS: 'auraview_daily_records',
  VIEW_PREFERENCES: 'auraview_view_prefs',
  SOUND_VOLUME: 'auraview_sound_volume',
};

export const storage = {
  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(INITIAL_JOURNAL_ENTRIES));
        return INITIAL_JOURNAL_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_JOURNAL_ENTRIES;
    }
  },

  saveJournalEntries(entries: JournalEntry[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch {
      // ignore
    }
  },

  saveSingleEntry(entry: JournalEntry): JournalEntry[] {
    const list = this.getJournalEntries();
    const existingIdx = list.findIndex(e => e.id === entry.id || e.date === entry.date);
    let updated: JournalEntry[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = entry;
    } else {
      updated = [entry, ...list];
    }
    this.saveJournalEntries(updated);
    return updated;
  },

  deleteEntry(id: string): JournalEntry[] {
    const list = this.getJournalEntries().filter(e => e.id !== id);
    this.saveJournalEntries(list);
    return list;
  },

  getRoutinePresets(): RoutinePreset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(INITIAL_ROUTINE_PRESETS));
        return INITIAL_ROUTINE_PRESETS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ROUTINE_PRESETS;
    }
  },

  saveRoutinePresets(presets: RoutinePreset[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(presets));
    } catch {
      // ignore
    }
  },

  getActiveRoutineId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ROUTINE_ID) || INITIAL_ROUTINE_PRESETS[0].id;
  },

  setActiveRoutineId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROUTINE_ID, id);
  },

  getActiveViewId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VIEW_ID) || SCENIC_VIEWS[0].id;
  },

  setActiveViewId(id: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW_ID, id);
  },

  getDailyRecords(): Record<string, DailyRecord> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      if (!data) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const defaultRecords: Record<string, DailyRecord> = {
          [today]: {
            date: today,
            routineId: 'preset-morning-awakening',
            completedStepIds: ['step-m1', 'step-m2'],
            completionRate: 0.4,
          },
          [yesterday]: {
            date: yesterday,
            routineId: 'preset-morning-awakening',
            completedStepIds: ['step-m1', 'step-m2', 'step-m3', 'step-m4', 'step-m5'],
            completionRate: 1.0,
          },
        };
        localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(defaultRecords));
        return defaultRecords;
      }
      return JSON.parse(data);
    } catch {
      return {};
    }
  },

  saveDailyRecord(record: DailyRecord) {
    try {
      const current = this.getDailyRecords();
      current[record.date] = record;
      localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(current));
    } catch {
      // ignore
    }
  },

  getViewPreferences(): { blur: number; dim: number; showParticles: boolean } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIEW_PREFERENCES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return { blur: 2, dim: 45, showParticles: true };
  },

  saveViewPreferences(prefs: { blur: number; dim: number; showParticles: boolean }) {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  },
};
