'use client';
import { Delete, CornerDownLeft } from 'lucide-react';

export default function VirtualKeyboard({
  activePressedKey,
  onDotPress,
  onDashPress,
  onNextLetter,
  onBackspace,
  settings
}) {
  const dotKeys = (settings?.dotKeys || ['d', 'f']).map(k => k.toUpperCase());
  const dashKeys = (settings?.dashKeys || ['j', 'k']).map(k => k.toUpperCase());

  const isDotActive = (key) => activePressedKey && activePressedKey.toUpperCase() === key;
  const isDashActive = (key) => activePressedKey && activePressedKey.toUpperCase() === key;
  const isSpaceActive = activePressedKey === ' ' || activePressedKey === 'Space';
  const isBackspaceActive = activePressedKey === 'Backspace';

  return (
    <div className="virtual-keyboard-section" aria-label="Morse Virtual Keyboard">
      <div className="keyboard-split-zones">
        {/* Left Zone: Dots (.) */}
        <div className="key-cluster dot-zone">
          <span className="zone-label dot">Left Hand: Dot (.)</span>
          <button
            type="button"
            className={`virtual-key dot ${isDotActive('D') ? 'pressed' : ''}`}
            onClick={onDotPress}
            title="Press D for Dot"
          >
            <span className="key-char">D</span>
            <span className="key-symbol dot">•</span>
          </button>

          <button
            type="button"
            className={`virtual-key dot ${isDotActive('F') ? 'pressed' : ''}`}
            onClick={onDotPress}
            title="Press F for Dot"
          >
            <span className="key-char">F</span>
            <span className="key-symbol dot">•</span>
          </button>
        </div>

        {/* Right Zone: Dashes (-) */}
        <div className="key-cluster dash-zone">
          <span className="zone-label dash">Right Hand: Dash (-)</span>
          <button
            type="button"
            className={`virtual-key dash ${isDashActive('J') ? 'pressed' : ''}`}
            onClick={onDashPress}
            title="Press J for Dash"
          >
            <span className="key-char">J</span>
            <span className="key-symbol dash">—</span>
          </button>

          <button
            type="button"
            className={`virtual-key dash ${isDashActive('K') ? 'pressed' : ''}`}
            onClick={onDashPress}
            title="Press K for Dash"
          >
            <span className="key-char">K</span>
            <span className="key-symbol dash">—</span>
          </button>
        </div>
      </div>

      {/* Action Keys */}
      <div className="bottom-action-keys">
        <button
          type="button"
          className={`virtual-key-action ${isBackspaceActive ? 'pressed' : ''}`}
          onClick={onBackspace}
          title="Backspace: Erase last dot or dash"
        >
          <Delete size={14} />
          <span>Backspace (Delete)</span>
        </button>

        <button
          type="button"
          className={`virtual-key-action ${isSpaceActive ? 'pressed' : ''}`}
          onClick={onNextLetter}
          title="Spacebar: Finish letter & move next"
        >
          <CornerDownLeft size={14} />
          <span>Space (Next Letter)</span>
        </button>
      </div>
    </div>
  );
}
