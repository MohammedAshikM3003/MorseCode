// International Morse Code Dictionary and Utilities

export const MORSE_CODE_MAP = {
  // Letters A-Z
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',

  // Digits 0-9
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',

  // Common Prosigns & Punctuation
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '/': '-..-.',
  '@': '.--.-.',
  '=': '-...-',
  'SOS': '...---...',
};

// Reverse map: Morse -> Character
export const REVERSE_MORSE_MAP = Object.entries(MORSE_CODE_MAP).reduce((acc, [char, morse]) => {
  acc[morse] = char;
  return acc;
}, {});

// Phonetic / Mnemonics for learning
export const CHAR_INFO = {
  'E': { mnemonic: 'Single short dot. Most common letter in English.', category: '1-element' },
  'T': { mnemonic: 'Single long dash. Second most common letter.', category: '1-element' },
  'I': { mnemonic: 'Two rapid dots (dit-dit).', category: '2-element' },
  'M': { mnemonic: 'Two heavy dashes (dah-dah).', category: '2-element' },
  'A': { mnemonic: 'Dot-Dash (dit-dah). Remember: "A-BOUT".', category: '2-element' },
  'N': { mnemonic: 'Dash-Dot (dah-dit). Reverse of A.', category: '2-element' },
  'S': { mnemonic: 'Three dots (dit-dit-dit). Famous in SOS.', category: '3-element' },
  'O': { mnemonic: 'Three dashes (dah-dah-dah). Long and deep.', category: '3-element' },
  'U': { mnemonic: 'Two dots, one dash (dit-dit-dah). "YOU-NI-CORN".', category: '3-element' },
  'D': { mnemonic: 'Dash, two dots (dah-dit-dit). "DANGEROUS".', category: '3-element' },
  'R': { mnemonic: 'Dot, dash, dot (dit-dah-dit). "RO-TATION".', category: '3-element' },
  'K': { mnemonic: 'Dash, dot, dash (dah-dit-dah). "KAN-GA-ROO".', category: '3-element' },
  'W': { mnemonic: 'Dot, two dashes (dit-dah-dah). "WITH-BEST-WISHES".', category: '3-element' },
  'G': { mnemonic: 'Two dashes, one dot (dah-dah-dit). "GOOD-GRA-VY".', category: '3-element' },
  'H': { mnemonic: 'Four rapid dots (dit-dit-dit-dit). "HIP-PI-TY-HOP".', category: '4-element' },
  'B': { mnemonic: 'Dash, three dots (dah-dit-dit-dit). "BEAT-IT-DOWN-NOW".', category: '4-element' },
  'L': { mnemonic: 'Dot, dash, two dots (dit-dah-dit-dit).', category: '4-element' },
  'P': { mnemonic: 'Dot, two dashes, dot (dit-dah-dah-dit).', category: '4-element' },
  'F': { mnemonic: 'Two dots, dash, dot (dit-dit-dah-dit).', category: '4-element' },
  'V': { mnemonic: 'Three dots, one dash (dit-dit-dit-dah). Beethoven 5th symphony motif!', category: '4-element' },
  'C': { mnemonic: 'Dash-dot-dash-dot (dah-dit-dah-dit). "CO-CA-CO-LA".', category: '4-element' },
  'X': { mnemonic: 'Dash-dot-dot-dash (dah-dit-dit-dah).', category: '4-element' },
  'Z': { mnemonic: 'Two dashes, two dots (dah-dah-dit-dit).', category: '4-element' },
  'Q': { mnemonic: 'Two dashes, dot, dash (dah-dah-dit-dah). "GOD-SAVE-THE-QUEEN".', category: '4-element' },
  'Y': { mnemonic: 'Dash, dot, two dashes (dah-dit-dah-dah).', category: '4-element' },
  'J': { mnemonic: 'Dot, three dashes (dit-dah-dah-dah).', category: '4-element' },
  '0': { mnemonic: 'Five long dashes. Full weight.', category: 'numbers' },
  '1': { mnemonic: 'One dot followed by four dashes.', category: 'numbers' },
  '2': { mnemonic: 'Two dots followed by three dashes.', category: 'numbers' },
  '3': { mnemonic: 'Three dots followed by two dashes.', category: 'numbers' },
  '4': { mnemonic: 'Four dots followed by one dash.', category: 'numbers' },
  '5': { mnemonic: 'Five quick dots.', category: 'numbers' },
  '6': { mnemonic: 'One dash followed by four dots.', category: 'numbers' },
  '7': { mnemonic: 'Two dashes followed by three dots.', category: 'numbers' },
  '8': { mnemonic: 'Three dashes followed by two dots.', category: 'numbers' },
  '9': { mnemonic: 'Four dashes followed by one dot.', category: 'numbers' },
  'SOS': { mnemonic: 'Universal distress signal: 3 dots, 3 dashes, 3 dots (...---...).', category: 'prosign' },
};

export function charToMorse(char) {
  if (!char) return '';
  const upper = char.toUpperCase();
  return MORSE_CODE_MAP[upper] || '';
}

export function morseToChar(morse) {
  if (!morse) return '';
  return REVERSE_MORSE_MAP[morse.trim()] || '?';
}

export function wordToMorseArray(word) {
  if (!word) return [];
  return word
    .toUpperCase()
    .split('')
    .filter(c => MORSE_CODE_MAP[c])
    .map(c => ({
      char: c,
      morse: MORSE_CODE_MAP[c]
    }));
}

export function isValidMorse(morse) {
  return /^[.\-]+$/.test(morse);
}

export const LETTERS_LIST = Object.keys(MORSE_CODE_MAP).filter(k => k.length === 1 && /[A-Z]/.test(k));
export const DIGITS_LIST = Object.keys(MORSE_CODE_MAP).filter(k => /[0-9]/.test(k));
export const PROSIGNS_LIST = ['SOS', '.', '?', '/', '@', '='];

// Convert regular sentences/paragraphs into standard Morse representation
export function textToMorse(text) {
  if (!text) return '';
  return text
    .trim()
    .split(/\s+/)
    .map(word => {
      return word
        .split('')
        .map(c => charToMorse(c))
        .filter(Boolean)
        .join(' ');
    })
    .filter(Boolean)
    .join(' / ');
}

// Convert Morse code strings (with spaces between letters and / between words) into readable English
export function morseToText(morse) {
  if (!morse) return '';
  // Split words by slash or triple space
  const words = morse.trim().split(/\s*\/\s*|\s{3,}/);
  return words
    .map(wordMorse => {
      // Split letters by single space
      const letters = wordMorse.trim().split(/\s+/);
      return letters
        .map(letterMorse => {
          if (!letterMorse) return '';
          return REVERSE_MORSE_MAP[letterMorse] || (letterMorse === '...---...' ? 'SOS' : '?');
        })
        .join('');
    })
    .join(' ');
}
