// LocalStorage State Manager for MorseType

const STORAGE_KEYS = {
  SETTINGS: 'morsetype_settings',
  STATS: 'morsetype_stats',
  HISTORY: 'morsetype_history',
  UNLOCKED_LEVELS: 'morsetype_unlocked_levels',
  CUSTOM_LESSONS: 'morsetype_custom_lessons',
  ADMIN_AUTH: 'morsetype_admin_auth'
};

export const DEFAULT_SETTINGS = {
  dotKeys: ['f', 'd', 'F', 'D'],
  dashKeys: ['j', 'k', 'J', 'K'],
  nextKey: ' ',
  backspaceKey: 'Backspace',
  soundEnabled: true,
  frequency: 650,
  volume: 0.3,
  wpm: 18,
  minPassAccuracy: 80,
  highContrast: false,
  reducedMotion: false,
  autoAdvanceOnValid: false,
  showMnemonicHint: true,
};

export function getStoredSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function getUnlockedLevels() {
  if (typeof window === 'undefined') return ['level-1'];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS);
    if (!raw) return ['level-1'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ['level-1'];
  } catch {
    return ['level-1'];
  }
}

export function unlockLevel(levelId) {
  if (typeof window === 'undefined') return;
  try {
    const current = getUnlockedLevels();
    if (!current.includes(levelId)) {
      current.push(levelId);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to unlock level', e);
  }
}

export function getStoredStats() {
  const initialStats = {
    totalSessions: 0,
    totalLettersAttempted: 0,
    totalLettersCorrect: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    letterMastery: {}, // e.g. { 'A': { correct: 10, total: 12 } }
  };
  if (typeof window === 'undefined') return initialStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return initialStats;
    return { ...initialStats, ...JSON.parse(raw) };
  } catch {
    return initialStats;
  }
}

export function saveSessionStats(sessionResult) {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredStats();
    const updated = {
      totalSessions: current.totalSessions + 1,
      totalLettersAttempted: current.totalLettersAttempted + (sessionResult.totalAttempted || 0),
      totalLettersCorrect: current.totalLettersCorrect + (sessionResult.correct || 0),
      bestWpm: Math.max(current.bestWpm || 0, sessionResult.wpm || 0),
      bestAccuracy: Math.max(current.bestAccuracy || 0, sessionResult.accuracy || 0),
      letterMastery: { ...current.letterMastery },
    };

    // Update per-letter mastery
    if (sessionResult.charBreakdown) {
      Object.entries(sessionResult.charBreakdown).forEach(([char, data]) => {
        if (!updated.letterMastery[char]) {
          updated.letterMastery[char] = { correct: 0, total: 0 };
        }
        updated.letterMastery[char].correct += data.correct || 0;
        updated.letterMastery[char].total += data.total || 0;
      });
    }

    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updated));

    // Save history entry (last 50 sessions)
    const history = getSessionHistory();
    history.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      ...sessionResult
    });
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save session stats', e);
  }
}

export function getSessionHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getCustomLessons() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomLesson(lesson) {
  if (typeof window === 'undefined') return;
  try {
    const list = getCustomLessons();
    const existingIdx = list.findIndex(l => l.id === lesson.id);
    if (existingIdx >= 0) {
      list[existingIdx] = lesson;
    } else {
      list.push(lesson);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save custom lesson', e);
  }
}

export function deleteCustomLesson(lessonId) {
  if (typeof window === 'undefined') return;
  try {
    const list = getCustomLessons().filter(l => l.id !== lessonId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete custom lesson', e);
  }
}

export function exportAllData() {
  if (typeof window === 'undefined') return '{}';
  return JSON.stringify({
    settings: getStoredSettings(),
    stats: getStoredStats(),
    history: getSessionHistory(),
    unlockedLevels: getUnlockedLevels(),
    customLessons: getCustomLessons()
  }, null, 2);
}

export function importAllData(jsonString) {
  if (typeof window === 'undefined') return false;
  try {
    const data = JSON.parse(jsonString);
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    if (data.stats) localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
    if (data.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    if (data.unlockedLevels) localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(data.unlockedLevels));
    if (data.customLessons) localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(data.customLessons));
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
}

export function clearAllData() {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
