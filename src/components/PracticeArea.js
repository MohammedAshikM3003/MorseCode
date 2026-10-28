'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Volume2, HelpCircle } from 'lucide-react';
import { charToMorse, morseToChar, CHAR_INFO } from '../lib/morseData';
import soundEngine from '../lib/soundEngine';
import MorseInput from './MorseInput';
import VirtualKeyboard from './VirtualKeyboard';

export default function PracticeArea({
  mode,
  targetItems, // array of strings (words like 'CAT', or letters ['E', 'T'])
  activeLesson,
  settings,
  soundMuted,
  onSessionComplete,
  onRestart,
  onRequestMoreWords,
  isTimedSession = false,
  timedSeconds = 30
}) {
  // Session State
  const [itemIndex, setItemIndex] = useState(0); // index in targetItems
  const [charIndex, setCharIndex] = useState(0); // index inside current word
  const [currentInput, setCurrentInput] = useState(''); // dots & dashes for current letter
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | null, message: '' }
  const [activePressedKey, setActivePressedKey] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Statistics State
  const [stats, setStats] = useState({
    attempted: 0,
    correct: 0,
    incorrect: 0,
    startTime: null,
    charBreakdown: {}
  });

  // Timed session state
  const [timeLeft, setTimeLeft] = useState(
    activeLesson?.timeLimitSeconds || (isTimedSession ? (timedSeconds || 30) : null)
  );

  // Key tracking to prevent duplicate repeats
  const pressedKeysRef = useRef(new Set());
  const timerRef = useRef(null);

  const currentWord = targetItems[itemIndex] || '';
  const isSingleElementMode = activeLesson?.type === 'elements';
  const isWordMode = currentWord.length > 1;
  const currentChar = isWordMode ? currentWord[charIndex] : currentWord;
  const expectedMorse = isSingleElementMode ? currentChar : charToMorse(currentChar);

  // Initialize start time on first interaction
  const ensureStarted = () => {
    if (!stats.startTime) {
      setStats(prev => ({ ...prev, startTime: Date.now() }));
    }
  };

  // Sound Engine sync with settings
  useEffect(() => {
    if (soundEngine) {
      soundEngine.setMuted(soundMuted);
      if (settings?.frequency) soundEngine.setFrequency(settings.frequency);
      if (settings?.wpm) soundEngine.setWpm(settings.wpm);
      if (settings?.volume !== undefined) soundEngine.setVolume(settings.volume);
    }
  }, [soundMuted, settings]);

  // Finish whole session
  const finishSession = useCallback(() => {
    const elapsedSeconds = stats.startTime ? Math.max(1, Math.round((Date.now() - stats.startTime) / 1000)) : 1;
    const totalAttempted = stats.attempted;
    const correct = stats.correct;
    const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
    // Standard WPM: (characters / 5) / (minutes)
    const minutes = elapsedSeconds / 60;
    const wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;

    onSessionComplete({
      totalAttempted,
      correct,
      incorrect: stats.incorrect,
      accuracy,
      timeTaken: elapsedSeconds,
      avgTimePerLetter: correct > 0 ? (elapsedSeconds / correct).toFixed(2) : 0,
      wpm,
      charBreakdown: stats.charBreakdown,
      mode,
      lessonId: activeLesson?.id || null,
      passed: accuracy >= (settings?.minPassAccuracy || 80)
    });
  }, [stats, onSessionComplete, mode, activeLesson, settings]);

  // Timed mode countdown
  useEffect(() => {
    const effectiveLimit = activeLesson?.timeLimitSeconds || (isTimedSession ? (timedSeconds || 30) : null);
    if (effectiveLimit && stats.startTime) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeLesson, isTimedSession, timedSeconds, stats.startTime, finishSession]);

  // Play audio preview of expected morse in Learn mode
  const playCurrentAudio = useCallback(() => {
    if (soundEngine && expectedMorse) {
      soundEngine.playSequence(expectedMorse);
    }
  }, [expectedMorse]);

  // Handle dot press
  const handleDot = useCallback(() => {
    ensureStarted();
    if (soundEngine) soundEngine.playDot();
    setCurrentInput(prev => prev + '.');
  }, [stats.startTime]);

  // Handle dash press
  const handleDash = useCallback(() => {
    ensureStarted();
    if (soundEngine) soundEngine.playDash();
    setCurrentInput(prev => prev + '-');
  }, [stats.startTime]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    setCurrentInput(prev => prev.slice(0, -1));
  }, []);

  // Submit current letter
  const handleSubmitLetter = useCallback(() => {
    if (!currentInput && !isSingleElementMode) return;
    ensureStarted();

    const isMatch = currentInput.trim() === expectedMorse.trim();

    // Update stats
    setStats(prev => {
      const breakdown = { ...prev.charBreakdown };
      if (!breakdown[currentChar]) breakdown[currentChar] = { correct: 0, total: 0 };
      breakdown[currentChar].total += 1;
      if (isMatch) breakdown[currentChar].correct += 1;

      return {
        ...prev,
        attempted: prev.attempted + 1,
        correct: prev.correct + (isMatch ? 1 : 0),
        incorrect: prev.incorrect + (isMatch ? 0 : 1),
        charBreakdown: breakdown
      };
    });

    if (isMatch) {
      if (soundEngine) soundEngine.playSuccess();
      setFeedback({ type: 'success', message: 'Correct!' });

      setTimeout(() => {
        setFeedback(null);
        setCurrentInput('');
        setShowHint(false);

        // Advance to next letter in current word, or next word
        if (isWordMode && charIndex < currentWord.length - 1) {
          setCharIndex(prev => prev + 1);
        } else if (itemIndex < targetItems.length - 1) {
          const nextIdx = itemIndex + 1;
          setItemIndex(nextIdx);
          setCharIndex(0);

          // Append new shuffled batches when user approaches end during timed practice
          if (timeLeft !== null && nextIdx >= targetItems.length - 4) {
            onRequestMoreWords?.();
          }
        } else {
          // Completed all target items
          if (timeLeft !== null) {
            onRequestMoreWords?.();
            setItemIndex(prev => prev + 1);
            setCharIndex(0);
          } else {
            finishSession();
          }
        }
      }, 200);
    } else {
      if (soundEngine) soundEngine.playError();
      setFeedback({
        type: 'error',
        message: `Incorrect! Expected: ${expectedMorse}`
      });

      // Clear after short duration so user can retry
      setTimeout(() => {
        setCurrentInput('');
      }, 400);
    }
  }, [currentInput, expectedMorse, isSingleElementMode, currentChar, isWordMode, charIndex, currentWord, itemIndex, targetItems, finishSession, timeLeft, onRequestMoreWords]);

  // Auto-advance if enabled and matches
  useEffect(() => {
    if (settings?.autoAdvanceOnValid && currentInput === expectedMorse) {
      handleSubmitLetter();
    }
  }, [currentInput, expectedMorse, settings?.autoAdvanceOnValid, handleSubmitLetter]);

  // Global Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside a form input, textarea, or contentEditable
      const targetTag = e.target.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      const key = e.key;

      // Prevent default scrolling for Spacebar when typing
      if (key === ' ' && e.target === document.body) {
        e.preventDefault();
      }

      // Check if already held down to prevent duplicate repeat fires
      if (pressedKeysRef.current.has(key.toLowerCase())) {
        return;
      }
      pressedKeysRef.current.add(key.toLowerCase());
      setActivePressedKey(key);

      const dotKeys = settings?.dotKeys || ['f', 'd', 'F', 'D'];
      const dashKeys = settings?.dashKeys || ['j', 'k', 'J', 'K'];

      if (dotKeys.includes(key)) {
        handleDot();
      } else if (dashKeys.includes(key)) {
        handleDash();
      } else if (key === ' ' || key === settings?.nextKey) {
        handleSubmitLetter();
      } else if (key === 'Backspace' || key === settings?.backspaceKey) {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Enter') {
        handleSubmitLetter();
      } else if (key === 'Escape') {
        onRestart();
      }
    };

    const handleKeyUp = (e) => {
      pressedKeysRef.current.delete(e.key.toLowerCase());
      setActivePressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [settings, handleDot, handleDash, handleSubmitLetter, handleBackspace, onRestart]);

  // Calculations for display
  const currentAccuracy = stats.attempted > 0
    ? Math.round((stats.correct / stats.attempted) * 100)
    : 100;

  const mnemonicInfo = CHAR_INFO[currentChar];

  return (
    <div className="practice-container">
      {/* Practice Stage Card */}
      <div className="practice-main-card">
        {/* Lesson Header if inside a lesson */}
        {activeLesson && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--accent-dot)',
              fontWeight: 700
            }}>
              {activeLesson.title}
            </span>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {activeLesson.instruction}
            </p>
          </div>
        )}

        {/* Monkeytype Upcoming Words Stream Preview */}
        {isWordMode && targetItems.length > 1 && (
          <div className="words-stream-preview" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.85rem',
            marginBottom: '1.25rem',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-mono)',
            overflow: 'hidden',
            maxWidth: '100%',
            userSelect: 'none'
          }}>
            {targetItems.slice(Math.max(0, itemIndex - 1), itemIndex + 6).map((word, wIdx) => {
              const actualIndex = Math.max(0, itemIndex - 1) + wIdx;
              const isCurrent = actualIndex === itemIndex;
              const isPast = actualIndex < itemIndex;
              return (
                <span
                  key={`${actualIndex}-${word}`}
                  style={{
                    color: isCurrent ? 'var(--accent-dot)' : isPast ? 'var(--text-dim)' : 'var(--text-muted)',
                    fontWeight: isCurrent ? 800 : 500,
                    borderBottom: isCurrent ? '2px solid var(--accent-dot)' : '2px solid transparent',
                    paddingBottom: '2px',
                    opacity: isPast ? 0.35 : isCurrent ? 1 : 0.65,
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        )}

        {/* Target Word / Letter Display */}
        <div className="target-word-display" aria-live="polite">
          {isWordMode ? (
            currentWord.split('').map((char, idx) => {
              let status = 'pending';
              if (idx < charIndex) status = 'correct';
              else if (idx === charIndex) status = 'current';

              return (
                <div key={idx} className={`char-box ${status}`}>
                  <span className="char-letter">{char}</span>
                  <span className="char-morse-hint">
                    {mode === 'learn' || showHint ? charToMorse(char) : '•••'}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="char-box current" style={{ minWidth: '90px', padding: '1rem 1.5rem' }}>
              <span className="char-letter" style={{ fontSize: '3.5rem' }}>
                {mode === 'test' && !showHint ? '?' : currentChar}
              </span>
              <span className="char-morse-hint" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                {mode === 'learn' || showHint ? expectedMorse : (mode === 'test' ? expectedMorse : '•••')}
              </span>
            </div>
          )}
        </div>

        {/* Audio Clue / Play button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
          <button
            type="button"
            className="icon-btn"
            onClick={playCurrentAudio}
            title="Hear Morse code sound"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            <Volume2 size={15} />
            <span>Hear Pattern</span>
          </button>

          {mode !== 'learn' && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowHint(prev => !prev)}
              title="Show/Hide Morse code hint"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              <HelpCircle size={15} />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          )}
        </div>

        {/* Mnemonic / Beginner helper note */}
        {settings?.showMnemonicHint && mnemonicInfo && (mode === 'learn' || showHint) && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.4rem', fontStyle: 'italic' }}>
            {mnemonicInfo.mnemonic}
          </p>
        )}

        {/* Visual Dots & Dashes Current Input */}
        <MorseInput
          inputSequence={currentInput}
          expectedSequence={expectedMorse}
          showExpectedHint={mode === 'learn'}
        />

        {/* Live Feedback Badge */}
        {feedback && (
          <div className={`feedback-badge ${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        activePressedKey={activePressedKey}
        onDotPress={handleDot}
        onDashPress={handleDash}
        onNextLetter={handleSubmitLetter}
        onBackspace={handleBackspace}
        settings={settings}
      />

      {/* Live Stats Bar */}
      <div className="practice-stats-bar">
        <div className="stat-item">
          <span>{isWordMode ? 'Word:' : 'Target:'}</span>
          <strong>{itemIndex + 1}/{targetItems.length}</strong>
        </div>

        <div className="stat-item">
          <span>Accuracy:</span>
          <strong style={{ color: currentAccuracy >= 80 ? 'var(--accent-success)' : 'var(--accent-dash)' }}>
            {currentAccuracy}%
          </strong>
        </div>

        <div className="stat-item">
          <span>Correct:</span>
          <strong>{stats.correct}</strong>
        </div>

        {timeLeft !== null && (
          <div className="stat-item">
            <span>Time Left:</span>
            <strong style={{ color: timeLeft <= 5 ? 'var(--accent-error)' : 'var(--text-main)' }}>
              {timeLeft}s
            </strong>
          </div>
        )}

        <button
          type="button"
          className="btn-secondary"
          onClick={onRestart}
          title="Restart Session (Esc)"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
        >
          <RotateCcw size={13} />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
}
