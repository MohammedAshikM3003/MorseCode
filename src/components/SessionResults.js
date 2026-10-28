'use client';
import { useEffect } from 'react';
import { RotateCcw, ArrowRight, Award, Zap, Clock, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SessionResults({
  results,
  bestAccuracy,
  onTryAgain,
  onContinueLearning,
  hasNextLesson
}) {
  useEffect(() => {
    // If passed with good accuracy, fire celebratory confetti
    if (results.accuracy >= 75) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4F9CF9', '#F59E0B', '#22C55E']
        });
      } catch {}
    }
  }, [results.accuracy]);

  return (
    <div className="practice-container" style={{ maxWidth: '640px', margin: '2rem auto' }}>
      <div className="practice-main-card" style={{ padding: '2.5rem' }}>
        {/* Header Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: results.accuracy >= 80 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: results.accuracy >= 80 ? 'var(--accent-success)' : 'var(--accent-dash)'
          }}>
            <Award size={24} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          {results.accuracy >= 80 ? 'Outstanding Precision!' : 'Session Complete!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {results.passed
            ? 'You met the accuracy threshold and unlocked the next challenge!'
            : 'Review your results below and practice again to build muscle memory.'}
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Accuracy */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Accuracy
            </span>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: results.accuracy >= 80 ? 'var(--accent-success)' : 'var(--accent-dash)',
              marginTop: '0.2rem'
            }}>
              {results.accuracy}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Best: {bestAccuracy}%
            </div>
          </div>

          {/* WPM */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Speed (WPM)
            </span>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-dot)',
              marginTop: '0.2rem'
            }}>
              {results.wpm}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Words/Min
            </div>
          </div>

          {/* Time Taken */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Time Taken
            </span>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              marginTop: '0.2rem'
            }}>
              {results.timeTaken}s
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              ~{results.avgTimePerLetter}s / char
            </div>
          </div>

          {/* Correct / Incorrect */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            padding: '1.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
              Correct / Total
            </span>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              marginTop: '0.2rem'
            }}>
              {results.correct}/{results.totalAttempted}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-error)', marginTop: '0.2rem' }}>
              {results.incorrect} mistakes
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onTryAgain}
            title="Repeat this session (Enter)"
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>

          {hasNextLesson ? (
            <button
              type="button"
              className="btn-primary"
              onClick={onContinueLearning}
              title="Proceed to next lesson"
              style={{ padding: '0.75rem 1.6rem' }}
            >
              <span>Continue Learning</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={onContinueLearning}
              style={{ padding: '0.75rem 1.6rem' }}
            >
              <span>Next Practice Set</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
