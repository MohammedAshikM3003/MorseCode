'use client';
import { Sparkles, Target, Zap } from 'lucide-react';

export default function ModeSelector({ currentMode, onSelectMode }) {
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

  return (
    <div className="mode-selector-wrapper">
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
    </div>
  );
}
