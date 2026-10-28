// Monkeytype-Style Reusable Word Generator for MorseType

export const BEGINNER_VOCABULARY = [
  // Foundational 2 to 4 letter words (E, T, I, M, A, N)
  'TEA', 'EAT', 'ATE', 'TEN', 'NET', 'MAN', 'MEN', 'TIE', 'ME', 'AM',
  'AT', 'IT', 'IN', 'AN', 'NAME', 'TIME', 'TEAM', 'MEET', 'MINE', 'MINT',
  'MAIN', 'NEAT', 'TENT', 'TAME', 'MATE', 'EMIT', 'ITEM',
  // S, O words
  'SEA', 'SET', 'SEE', 'NOT', 'NO', 'ON', 'SO', 'TO', 'ONE', 'NOTE',
  'SEAT', 'SITE', 'SAME', 'SOME', 'MOON', 'NOON', 'EAST', 'NEST', 'MOST',
  'TEST', 'STEM', 'SENT', 'MASS', 'MISS', 'MAST', 'TOSS', 'SOON', 'NOSE',
  'TOES', 'SON', 'SUN', 'STAR',
  // C, D, G, U, H additions
  'CAT', 'DOG', 'HI', 'HOT', 'HUT', 'HAD', 'HIT', 'HAT', 'HUG', 'GET',
  'GOT', 'GUN', 'GAS', 'DIG', 'DOT', 'DUE', 'MUD', 'CUP', 'CUT', 'CAN',
  'ACT', 'END', 'AND', 'AGE', 'CAME', 'DATE', 'DUST', 'SHUT', 'HEAD', 'HOME'
];

export const INTERMEDIATE_VOCABULARY = [
  'CAT', 'DOG', 'SUN', 'HI', 'TEA', 'SEA', 'RED', 'BLUE', 'SKY', 'WAVE',
  'FAST', 'CODE', 'RADIO', 'KEY', 'BEAT', 'PARIS', 'FLOW', 'LINE', 'SEND',
  'HELP', 'STOP', 'CALL', 'HERO', 'JUMP', 'LUCK', 'GOLD', 'WIND', 'FIRE',
  'DARK', 'ROAD', 'STAR', 'MOON', 'SHIP', 'DECK', 'PORT', 'ECHO', 'ZERO',
  'PARK', 'ZONE', 'QUIET', 'FLASH', 'STORM', 'TRAIN', 'SPACE', 'CLOUD',
  'LIGHT', 'VOICE', 'POINT', 'TRACK', 'NORTH', 'SOUTH', 'SPEED', 'SOUND',
  'WORLD', 'CLEAR', 'SIGNAL', 'NIGHT', 'WATER', 'EARTH', 'TIMER', 'FOCUS',
  'BRAVO', 'TANGO', 'DELTA', 'HOTEL', 'INDIA', 'KILO', 'LIMA', 'OSCAR'
];

export const ADVANCED_VOCABULARY = [
  'MORSE', 'SIGNAL', 'KEYBOARD', 'WIRELESS', 'STATION', 'ANTENNA', 'MESSAGE',
  'TRANSMIT', 'RECEIVE', 'CIRCUIT', 'TELEGRAPH', 'OPERATOR', 'FREQUENCY',
  'PHONETIC', 'BATTERY', 'NETWORK', 'COMMUNICATION', 'ALPHABET', 'TRANSMISSION',
  'EMERGENCY', 'VIBRATION', 'ELECTRIC', 'AUTOMATIC', 'DETECTOR', 'EQUIPMENT',
  'HEADPHONE', 'BROADCAST', 'BEACON', 'SATELLITE', 'DISPATCH', 'WAVELENGTH',
  'AMPLIFIER', 'RESONANCE', 'TELETYPE', 'IMPULSE', 'SYLLABLE', 'ACCURACY',
  'CHALLENGE', 'PRACTICE', 'PROJECT', 'DYNAMIC', 'COMPUTER', 'DISPLAY',
  'SYSTEM', 'INTERVAL', 'SEQUENCE', 'TERMINAL', 'SYMMETRY', 'FEEDBACK',
  'STANDARD', 'MODULATION', 'SPECTRUM', 'NAVIGATION', 'TELECOM'
];

// Mapping of curriculum level IDs to letters introduced
export const LEVEL_LETTERS_MAP = {
  'level-1': ['E', 'T'],
  'level-2': ['E', 'T', 'I', 'M', 'A', 'N'],
  'level-3': ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O'],
  'level-4': ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O', 'C', 'D', 'G', 'U', 'H'],
  'level-5': ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O', 'C', 'D', 'G', 'U', 'H', 'R', 'P', 'F', 'Y'],
  'level-6': ['E', 'T', 'I', 'M', 'A', 'N', 'S', 'O', 'C', 'D', 'G', 'U', 'H', 'R', 'P', 'F', 'Y', 'K', 'W', 'B', 'V', 'L'],
  'level-7': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
};

/**
 * Extract all unlocked letters based on user's unlocked levels and any custom lessons
 */
export function getUnlockedLetters(unlockedLevels = ['level-1'], customLessons = []) {
  const lettersSet = new Set(['E', 'T', 'I', 'M', 'A', 'N']); // Core starter letters

  if (Array.isArray(unlockedLevels)) {
    unlockedLevels.forEach(lvlId => {
      const letters = LEVEL_LETTERS_MAP[lvlId];
      if (letters) {
        letters.forEach(ch => lettersSet.add(ch));
      }
    });

    // If level-7 is unlocked, unlock all alphabet letters
    if (unlockedLevels.includes('level-7')) {
      for (let i = 65; i <= 90; i++) {
        lettersSet.add(String.fromCharCode(i));
      }
    }
  }

  // Also include letters from any custom teacher lessons
  if (Array.isArray(customLessons)) {
    customLessons.forEach(lesson => {
      if (Array.isArray(lesson.targets)) {
        lesson.targets.forEach(target => {
          target.toUpperCase().split('').forEach(ch => {
            if (/[A-Z]/.test(ch)) lettersSet.add(ch);
          });
        });
      }
    });
  }

  return lettersSet;
}

/**
 * Fisher-Yates array shuffle
 */
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get the candidate vocabulary bank according to difficulty and unlocked letters
 */
export function getVocabularyPool(difficulty = 'beginner', unlockedLevels = ['level-1'], customLessons = []) {
  const unlockedLetters = getUnlockedLetters(unlockedLevels, customLessons);

  let rawList = BEGINNER_VOCABULARY;
  if (difficulty === 'intermediate') {
    rawList = INTERMEDIATE_VOCABULARY;
  } else if (difficulty === 'advanced') {
    rawList = ADVANCED_VOCABULARY;
  }

  // Filter words strictly to only unlocked letters
  const filtered = rawList.filter(word => {
    return word.split('').every(ch => unlockedLetters.has(ch));
  });

  // If filtered word pool is small (e.g. at very early levels), fallback to safe starter words
  if (filtered.length < 10) {
    if (difficulty === 'advanced') return [...ADVANCED_VOCABULARY];
    if (difficulty === 'intermediate') return [...INTERMEDIATE_VOCABULARY];
    return [...BEGINNER_VOCABULARY];
  }

  return filtered;
}

/**
 * Generate exactly `count` words (default 20), avoiding repeats until the bank is exhausted,
 * and avoiding starting a new batch with the previous batch's last word.
 */
export function generateWordBatch({
  count = 20,
  difficulty = 'beginner',
  unlockedLevels = ['level-1'],
  customLessons = [],
  previousLastWord = null,
  usedWordsSet = new Set()
} = {}) {
  const candidatePool = getVocabularyPool(difficulty, unlockedLevels, customLessons);

  // Available words not yet used
  let available = candidatePool.filter(w => !usedWordsSet.has(w));

  // If available words are fewer than needed, reset usedWordsSet (bank exhausted)
  if (available.length < count) {
    usedWordsSet.clear();
    available = [...candidatePool];
  }

  // Shuffle the pool
  let shuffled = shuffleArray(available);

  // If pool has fewer than count words (rare edge case), cycle through until count is satisfied
  const batch = [];
  let poolIndex = 0;
  while (batch.length < count) {
    const candidate = shuffled[poolIndex % shuffled.length];
    // Avoid immediate duplicate adjacent word
    if (batch.length === 0 || batch[batch.length - 1] !== candidate) {
      batch.push(candidate);
    } else {
      // Pick next available
      const alt = shuffled[(poolIndex + 1) % shuffled.length];
      batch.push(alt);
    }
    poolIndex++;
  }

  // Requirement: Avoid starting the new batch with the previous batch's last word whenever possible
  if (previousLastWord && batch.length > 1 && batch[0] === previousLastWord) {
    // Find first word in batch that is different from previousLastWord and swap
    const swapIdx = batch.findIndex((w, idx) => idx > 0 && w !== previousLastWord);
    if (swapIdx > 0) {
      const temp = batch[0];
      batch[0] = batch[swapIdx];
      batch[swapIdx] = temp;
    }
  }

  // Record used words
  batch.forEach(w => usedWordsSet.add(w));

  const lastWord = batch[batch.length - 1];

  return {
    words: batch,
    lastWord: lastWord,
    usedWordsSet: usedWordsSet
  };
}

/**
 * Stateful generator class for persistent practice session streaming
 */
export class MorseWordGenerator {
  constructor({ difficulty = 'beginner', unlockedLevels = ['level-1'], customLessons = [] } = {}) {
    this.difficulty = difficulty;
    this.unlockedLevels = unlockedLevels;
    this.customLessons = customLessons;
    this.usedWordsSet = new Set();
    this.previousLastWord = null;
  }

  setDifficulty(difficulty) {
    if (this.difficulty !== difficulty) {
      this.difficulty = difficulty;
      this.usedWordsSet.clear();
      this.previousLastWord = null;
    }
  }

  setUnlockedLevels(levels) {
    this.unlockedLevels = levels;
  }

  setCustomLessons(lessons) {
    this.customLessons = lessons;
  }

  nextBatch(count = 20) {
    const result = generateWordBatch({
      count,
      difficulty: this.difficulty,
      unlockedLevels: this.unlockedLevels,
      customLessons: this.customLessons,
      previousLastWord: this.previousLastWord,
      usedWordsSet: this.usedWordsSet
    });

    this.previousLastWord = result.lastWord;
    this.usedWordsSet = result.usedWordsSet;
    return result.words;
  }

  reset() {
    this.usedWordsSet.clear();
    this.previousLastWord = null;
  }
}
