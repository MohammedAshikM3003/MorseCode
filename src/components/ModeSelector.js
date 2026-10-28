'use client';
import { Sparkles, Target, Zap } from 'lucide-react';

export default function ModeSelector({
  currentMode,
  onSelectMode,
  currentDifficulty = 'beginner',
  onSelectDifficulty,
  currentPracticeType = 'words',
  onSelectPracticeType
}) {
  const modes = [
    {
      id: 'learn',
      name: 'Learn',
      icon: Sparkles,
      desc: 'Letter & Morse pattern shown side-by-side'
    },
    {
      id: 'practice',
      name: 'Practice',
      icon: Target,
      desc: 'Encode the target letter from memory'
    },
    {
      id: 'test',
      name: 'Test',
      icon: Zap,
      desc: 'Decode Morse patterns without any hints'
    }
  ];

  const difficulties = [
    { id: 'beginner', name: 'Beginner', desc: 'Short words with unlocked letters (E, T, I, M, A, N, etc.)' },
    { id: 'intermediate', name: 'Intermediate', desc: '3 to 5 letter common words' },
    { id: 'advanced', name: 'Advanced', desc: 'Full vocabulary & technical telegraph terms' }
  ];

  return (
    <div className="mode-selector-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
      {/* Top Mode Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div className="mode-pills" role="tablist" aria-label="Practice Modes">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                className={`mode-tab ${isActive ? `active ${m.id}` : ''}`}
                onClick={() => onSelectMode(m.id)}
                title={m.desc}
              >
                <Icon size={14} />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Practice Type: 20 Words vs 30s Timed Sprint */}
        {onSelectPracticeType && (
          <div className="mode-pills" role="tablist" aria-label="Practice Type">
            <button
              type="button"
              className={`mode-tab ${currentPracticeType === 'words' ? 'active' : ''}`}
              onClick={() => onSelectPracticeType('words')}
              title="Practice exactly 20 words"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              <span>20 Words</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${currentPracticeType === 'timed' ? 'active' : ''}`}
              onClick={() => onSelectPracticeType('timed')}
              title="30-second timed sprint with stream generation"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              <span>30s Sprint</span>
            </button>
          </div>
        )}
      </div>

      {/* Difficulty Sub-Bar */}
      {onSelectDifficulty && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--text-dim)', fontWeight: 600, marginRight: '4px' }}>Difficulty:</span>
          {difficulties.map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDifficulty(d.id)}
              className={`nav-btn ${currentDifficulty === d.id ? 'active' : ''}`}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                color: currentDifficulty === d.id ? 'var(--accent-dot)' : undefined
              }}
              title={d.desc}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
