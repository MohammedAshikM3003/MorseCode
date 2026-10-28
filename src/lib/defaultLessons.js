// Structured Beginner Curriculum & Lessons

export const DEFAULT_LESSONS = [
  {
    id: 'level-1',
    level: 1,
    title: 'Level 1: The Basics',
    subtitle: 'Learn Dots (.) and Dashes (-)',
    description: 'Morse code is built of two simple elements: a short Dot (dit) and a long Dash (dah). Dah is 3x longer than dit.',
    instruction: 'Use your left hand (F or D) for Dots, and right hand (J or K) for Dashes. Press Space when ready.',
    category: 'beginner',
    targets: ['.', '-', '.', '.', '-', '-', '.', '-'],
    type: 'elements', // single dot or dash practice
    minAccuracy: 75,
    tips: [
      'Left fingers on D/F = Dot (.)',
      'Right fingers on J/K = Dash (-)',
      'Press Space after each element or word'
    ]
  },
  {
    id: 'level-2',
    level: 2,
    title: 'Level 2: Easy Letters',
    subtitle: 'Master E, T, I, M, A, and N',
    description: 'Start with the most common letters in English: E (.) and T (-), followed by their two-element combinations.',
    instruction: 'Type each letter in Morse code, then press Space to confirm.',
    category: 'letters',
    targets: ['E', 'T', 'I', 'M', 'A', 'N', 'E', 'A', 'T', 'I', 'N', 'M'],
    type: 'letters',
    minAccuracy: 80,
    tips: [
      'E is just one dot: .',
      'T is one single dash: -',
      'I is two dots: ..',
      'M is two dashes: --',
      'A is dot-dash: .-',
      'N is dash-dot: -.'
    ]
  },
  {
    id: 'level-3',
    level: 3,
    title: 'Level 3: Letter Recognition',
    subtitle: 'Decipher Morse Patterns',
    description: 'Train your brain to recognize patterns instantly. Look at the Morse code shown and identify the letter.',
    instruction: 'Identify the letter from the Morse code and encode it correctly.',
    category: 'recognition',
    targets: ['E', 'T', 'A', 'N', 'I', 'M', 'S', 'O'],
    type: 'test',
    minAccuracy: 80,
    tips: [
      'Think of sounds: dit-dah is A',
      'dah-dit is N',
      'dit-dit-dit is S (... in SOS)'
    ]
  },
  {
    id: 'level-4',
    level: 4,
    title: 'Level 4: Word Practice',
    subtitle: 'Form Simple English Words',
    description: 'Encode words letter by letter. Type each letter in Morse and press Space to move to the next letter.',
    instruction: 'Type the Morse sequence for each highlighted letter in the word.',
    category: 'words',
    targets: ['CAT', 'DOG', 'SUN', 'HI', 'TEA', 'MAN', 'NET'],
    type: 'words',
    minAccuracy: 80,
    tips: [
      'Take it one letter at a time.',
      'Notice how words flow with natural rhythm.',
      'Space confirms the current letter.'
    ]
  },
  {
    id: 'level-5',
    level: 5,
    title: 'Level 5: Timed Sprint',
    subtitle: 'Speed & Accuracy Under Time',
    description: 'Put your skills to the test with a 30-second timed challenge. Aim for 80%+ accuracy and high WPM.',
    instruction: 'Type as many letters or words as you can before the timer runs out!',
    category: 'timed',
    timeLimitSeconds: 30,
    targets: ['MORSE', 'CODE', 'RADIO', 'SIGNAL', 'PARIS', 'FAST', 'KEY'],
    type: 'words',
    minAccuracy: 75,
    tips: [
      'Smooth rhythm is faster than rushing.',
      'Accuracy builds natural speed.'
    ]
  },
  {
    id: 'level-6',
    level: 6,
    title: 'Level 6: 3-Element Mastery',
    subtitle: 'S, O, U, D, R, K, W, G',
    description: 'Expand your vocabulary with all eight 3-element letters. These complete the core of International Morse.',
    instruction: 'Practise each 3-element letter with precision.',
    category: 'advanced_letters',
    targets: ['S', 'O', 'U', 'D', 'R', 'K', 'W', 'G'],
    type: 'letters',
    minAccuracy: 80,
    tips: [
      'S is ... (three dots)',
      'O is --- (three dashes)',
      'R is .-. (rotation)',
      'K is -.- (kangaroo)'
    ]
  },
  {
    id: 'level-7',
    level: 7,
    title: 'Level 7: Numbers & Ham Prosigns',
    subtitle: 'Digits 0-9 and Distress SOS',
    description: 'Digits in Morse code follow a beautiful symmetric 5-element pattern. Plus learn historical radio signals.',
    instruction: 'Encode digits and radio prosigns accurately.',
    category: 'prosigns',
    targets: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'SOS'],
    type: 'letters',
    minAccuracy: 80,
    tips: [
      '1 to 5 build up dots (.---- to .....)',
      '6 to 0 build up dashes (-.... to -----)',
      'SOS is ...---...'
    ]
  }
];

export const PRACTICE_WORDS_BANK = [
  'CAT', 'DOG', 'SUN', 'HI', 'TEA', 'SEA', 'RED', 'BLUE', 'SKY',
  'RADIO', 'MORSE', 'SOUND', 'CODE', 'WAVE', 'KEY', 'PARIS', 'BEAT',
  'SIGNAL', 'HAM', 'FOX', 'ECHO', 'TANGO', 'BRAVO', 'ALPHA'
];
