'use client';
import { Lock, CheckCircle2, Play, Sparkles, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function LessonsPanel({
  lessons,
  unlockedLevelIds,
  onStartLesson,
  activeLessonId
}) {
  return (
    <div style={{ maxWidth: '860px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          Beginner Morse Curriculum
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Step-by-step progressive lessons from individual dits & dahs to full speed words.
        </p>
      </div>

      {/* Lesson List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {lessons.map((lesson) => {
          const isUnlocked = unlockedLevelIds.includes(lesson.id);
          const isActive = activeLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              style={{
                background: isActive ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: `1px solid ${isActive ? 'var(--accent-dot)' : isUnlocked ? 'var(--border-subtle)' : 'rgba(255, 255, 255, 0.05)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                opacity: isUnlocked ? 1 : 0.6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap',
                boxShadow: isActive ? '0 0 16px var(--accent-dot-glow)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Left Details */}
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isUnlocked ? 'var(--accent-dot-bg)' : 'rgba(255, 255, 255, 0.05)',
                    color: isUnlocked ? 'var(--accent-dot)' : 'var(--text-dim)',
                    border: `1px solid ${isUnlocked ? 'var(--accent-dot)' : 'transparent'}`
                  }}>
                    Level {lesson.level}
                  </span>

                  {lesson.isCustom && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--accent-dash)',
                      border: '1px solid var(--accent-dash)'
                    }}>
                      Custom Teacher Lesson
                    </span>
                  )}

                  {lesson.timeLimitSeconds && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: 'var(--text-dim)'
                    }}>
                      <Clock size={12} />
                      {lesson.timeLimitSeconds}s Sprint
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {lesson.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {lesson.description}
                </p>

                {/* Target Characters Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '4px' }}>Targets:</span>
                  {lesson.targets.slice(0, 8).map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        color: 'var(--text-main)'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {lesson.targets.length > 8 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      +{lesson.targets.length - 8} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isUnlocked ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onStartLesson(lesson)}
                    style={{ padding: '0.7rem 1.4rem' }}
                  >
                    <Play size={15} />
                    <span>{isActive ? 'Continue' : 'Start Lesson'}</span>
                  </button>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-dim)',
                    fontSize: '0.82rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    padding: '0.6rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <Lock size={14} />
                    <span>Pass previous level ({lesson.minAccuracy || 80}%)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
