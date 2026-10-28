'use client';
import { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Key, Unlock, LogOut, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { saveCustomLesson, deleteCustomLesson, unlockLevel } from '../lib/storage';
import { DEFAULT_LESSONS } from '../lib/defaultLessons';

export default function AdminPortal({
  isOpen,
  onClose,
  isLoggedIn,
  setIsLoggedIn,
  customLessons,
  onLessonsUpdated,
  onUnlockAll
}) {
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  // Lesson Creator Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetsInput, setTargetsInput] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [minAccuracy, setMinAccuracy] = useState(80);
  const [lessonSuccessMsg, setLessonSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'Password@123') {
      setIsLoggedIn(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid credentials. Hint: admin / Password@123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const handleCreateLesson = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetsInput.trim()) {
      return;
    }

    const targets = targetsInput
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(Boolean);

    const newLesson = {
      id: `custom-${Date.now()}`,
      level: 10 + (customLessons?.length || 0),
      title: title.trim(),
      subtitle: subtitle.trim() || 'Custom Lesson',
      description: description.trim() || 'Created by Administrator',
      instruction: 'Type each character or word in Morse code and press Space.',
      category: 'custom',
      targets: targets,
      type: targets.some(t => t.length > 1) ? 'words' : 'letters',
      minAccuracy: Number(minAccuracy) || 80,
      timeLimitSeconds: timeLimit ? Number(timeLimit) : null,
      isCustom: true,
      tips: ['Custom student lesson set. Take your time and focus on accuracy.']
    };

    saveCustomLesson(newLesson);
    unlockLevel(newLesson.id);
    onLessonsUpdated();

    // Reset form
    setTitle('');
    setSubtitle('');
    setDescription('');
    setTargetsInput('');
    setTimeLimit('');
    setLessonSuccessMsg('Custom lesson created and unlocked!');
    setTimeout(() => setLessonSuccessMsg(null), 3000);
  };

  const handleDeleteLesson = (id) => {
    deleteCustomLesson(id);
    onLessonsUpdated();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck size={20} color="var(--accent-dot)" />
            <span>Teacher & Admin Portal</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {!isLoggedIn ? (
          /* Login Form */
          <form onSubmit={handleLogin} style={{ padding: '1rem 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Sign in with administrative credentials to create custom lessons, curate curriculum wordlists, and manage classroom settings.
            </p>

            {authError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--accent-error)',
                color: 'var(--accent-error)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Username (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Password (Password@123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Key size={15} />
                <span>Log In</span>
              </button>
            </div>
          </form>
        ) : (
          /* Logged In Dashboard */
          <div>
            {/* Admin Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem 1rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-success)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Logged in as admin</span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onUnlockAll}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  title="Unlock all curriculum levels for demonstration"
                >
                  <Unlock size={13} />
                  <span>Unlock All Levels</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: 'var(--accent-error)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* Create Custom Lesson Form */}
            <div style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} color="var(--accent-dot)" />
                <span>Create New Custom Lesson</span>
              </h4>

              {lessonSuccessMsg && (
                <div style={{
                  color: 'var(--accent-success)',
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '0.5rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  marginBottom: '1rem'
                }}>
                  {lessonSuccessMsg}
                </div>
              )}

              <form onSubmit={handleCreateLesson}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Lesson Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Distress & Emergency Codes"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subtitle / Subheading</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Master SOS, MAYDAY, and CQ"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Words or Letters (Comma-Separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SOS, HELP, RADIO, WAVE"
                    value={targetsInput}
                    onChange={(e) => setTargetsInput(e.target.value)}
                    required
                  />
                  <span className="form-hint">Users will practice these target words sequentially.</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Time Limit (Seconds, Optional)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 45 (or leave empty for untimed)"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passing Accuracy Threshold (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="50"
                      max="100"
                      value={minAccuracy}
                      onChange={(e) => setMinAccuracy(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                  <Plus size={15} />
                  <span>Publish Lesson to Curriculum</span>
                </button>
              </form>
            </div>

            {/* List of Custom Lessons */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                Published Custom Lessons ({customLessons?.length || 0})
              </h4>

              {(!customLessons || customLessons.length === 0) ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                  No custom lessons created yet. Fill out the form above to deploy a new lesson for students.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {customLessons.map(lesson => (
                    <div
                      key={lesson.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-main)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lesson.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          Targets: {lesson.targets.join(', ')}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteLesson(lesson.id)}
                        style={{ color: 'var(--accent-error)', padding: '0.35rem' }}
                        title="Delete lesson"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
