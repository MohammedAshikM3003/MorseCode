'use client';

export default function MorseInput({ inputSequence, expectedSequence, showExpectedHint }) {
  const tokens = inputSequence.split('').filter(s => s === '.' || s === '-');

  return (
    <div className="input-stage">
      <div className="morse-tokens-container" aria-label={`Current Morse input: ${inputSequence || 'empty'}`}>
        {tokens.length === 0 ? (
          <span className="empty-morse-hint">
            {showExpectedHint && expectedSequence
              ? `Expected: ${expectedSequence}`
              : 'Press D/F for (•) or J/K for (—)'}
          </span>
        ) : (
          tokens.map((symbol, idx) => (
            <div
              key={`${idx}-${symbol}`}
              className={symbol === '.' ? 'morse-dot-pill' : 'morse-dash-pill'}
              title={symbol === '.' ? 'Dot (dit)' : 'Dash (dah)'}
            />
          ))
        )}
      </div>
    </div>
  );
}
