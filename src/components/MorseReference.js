'use client';
import { useState } from 'react';
import { Volume2, Play, Search, Filter } from 'lucide-react';
import { MORSE_CODE_MAP, CHAR_INFO, LETTERS_LIST, DIGITS_LIST, PROSIGNS_LIST } from '../lib/morseData';
import soundEngine from '../lib/soundEngine';

export default function MorseReference({ onPracticeCharacter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'letters', 'digits', 'prosigns'
  const [activePlayingChar, setActivePlayingChar] = useState(null);

  // Play audio for character
  const playSound = (char, morse) => {
    if (!soundEngine) return;
    setActivePlayingChar(char);
    soundEngine.playSequence(morse, (step, symbol) => {
      if (step === -1) {
        setActivePlayingChar(null);
      }
    });
  };

  // Filter items
  const items = Object.entries(MORSE_CODE_MAP).filter(([char, morse]) => {
    if (filterCategory === 'letters' && !LETTERS_LIST.includes(char)) return false;
    if (filterCategory === 'digits' && !DIGITS_LIST.includes(char)) return false;
    if (filterCategory === 'prosigns' && !PROSIGNS_LIST.includes(char)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return char.toLowerCase().includes(q) || morse.includes(q);
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '960px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          International Morse Code Reference
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Explore the full chart of standard alphabet letters, digits, and radio prosigns. Click any card to hear its audio sound or launch a quick practice session.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search letter or pattern (e.g. A or .-)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'letters', label: 'Letters (A-Z)' },
            { id: 'digits', label: 'Digits (0-9)' },
            { id: 'prosigns', label: 'Prosigns & Symbols' }
          ].map(c => (
            <button
              key={c.id}
              type="button"
              className={`nav-btn ${filterCategory === c.id ? 'active' : ''}`}
              onClick={() => setFilterCategory(c.id)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Characters */}
      <div className="reference-grid">
        {items.map(([char, morse]) => {
          const info = CHAR_INFO[char];
          const isPlaying = activePlayingChar === char;

          return (
            <div
              key={char}
              className="reference-card"
              style={{
                borderColor: isPlaying ? 'var(--accent-dot)' : undefined,
                boxShadow: isPlaying ? '0 0 16px var(--accent-dot-glow)' : undefined
              }}
            >
              <div className="ref-char">{char}</div>
              <div className="ref-morse">{morse}</div>

              {info && (
                <div style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-dim)',
                  lineHeight: '1.2',
                  minHeight: '2.4em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {info.mnemonic}
                </div>
              )}

              <div style={{ display: 'flex', gap: '6px', marginTop: '0.5rem', width: '100%' }}>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ flex: 1, padding: '0.35rem 0', fontSize: '0.72rem' }}
                  onClick={() => playSound(char, morse)}
                  title={`Play audio for ${char}`}
                >
                  <Volume2 size={13} />
                  <span>Audio</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.35rem 0', fontSize: '0.72rem' }}
                  onClick={() => onPracticeCharacter(char)}
                  title={`Practice ${char} now`}
                >
                  <Play size={12} />
                  <span>Drill</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
