'use client';
import { useState } from 'react';
import { X, Volume2, Keyboard, Sliders, RotateCcw, Check } from 'lucide-react';
import soundEngine from '../lib/soundEngine';
import { DEFAULT_SETTINGS } from '../lib/storage';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) {
  const [form, setForm] = useState({ ...settings });
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleTestTone = () => {
    if (soundEngine) {
      soundEngine.setFrequency(form.frequency);
      soundEngine.setVolume(form.volume);
      soundEngine.playSequence('... --- ...');
    }
  };

  const handleResetDefaults = () => {
    setForm({ ...DEFAULT_SETTINGS });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(form);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Sliders size={20} color="var(--accent-dot)" />
            <span>Preferences & Controls</span>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Keybindings Section */}
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Keyboard size={15} color="var(--accent-dot)" />
              <span>Keyboard Bindings</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Dot (.) Keys</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.dotKeys.join(', ')}
                  onChange={(e) => {
                    const keys = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    handleChange('dotKeys', keys);
                  }}
                  placeholder="e.g. f, d"
                />
                <span className="form-hint">Separate multiple keys with commas</span>
              </div>

              <div className="form-group">
                <label className="form-label">Dash (—) Keys</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.dashKeys.join(', ')}
                  onChange={(e) => {
                    const keys = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    handleChange('dashKeys', keys);
                  }}
                  placeholder="e.g. j, k"
                />
                <span className="form-hint">Separate multiple keys with commas</span>
              </div>
            </div>
          </div>

          {/* Audio Synthesizer Section */}
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Volume2 size={15} color="var(--accent-dash)" />
                <span>Audio Tone (Sidetone)</span>
              </h4>

              <button
                type="button"
                className="icon-btn"
                onClick={handleTestTone}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                <span>Test Tone (SOS)</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">
                Tone Pitch: {form.frequency} Hz
              </label>
              <input
                type="range"
                min="400"
                max="900"
                step="25"
                style={{ width: '100%', accentColor: 'var(--accent-dot)' }}
                value={form.frequency}
                onChange={(e) => handleChange('frequency', Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Morse Speed: {form.wpm} WPM
              </label>
              <input
                type="range"
                min="10"
                max="30"
                step="1"
                style={{ width: '100%', accentColor: 'var(--accent-dash)' }}
                value={form.wpm}
                onChange={(e) => handleChange('wpm', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Practice & Curriculum Options */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.8rem' }}>
              Learning & Thresholds
            </h4>

            <div className="form-group">
              <label className="form-label">
                Level Passing Accuracy: {form.minPassAccuracy}%
              </label>
              <input
                type="range"
                min="60"
                max="95"
                step="5"
                style={{ width: '100%', accentColor: 'var(--accent-success)' }}
                value={form.minPassAccuracy}
                onChange={(e) => handleChange('minPassAccuracy', Number(e.target.value))}
              />
              <span className="form-hint">Score needed to unlock subsequent levels</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={form.autoAdvanceOnValid}
                  onChange={(e) => handleChange('autoAdvanceOnValid', e.target.checked)}
                  style={{ accentColor: 'var(--accent-dot)' }}
                />
                <span>Auto-advance immediately when valid Morse code matches</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={form.showMnemonicHint}
                  onChange={(e) => handleChange('showMnemonicHint', e.target.checked)}
                  style={{ accentColor: 'var(--accent-dot)' }}
                />
                <span>Display letter mnemonics and memory tips</span>
              </label>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleResetDefaults}
              style={{ fontSize: '0.82rem' }}
            >
              <RotateCcw size={13} />
              <span>Defaults</span>
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {savedNotification ? <Check size={14} /> : null}
                <span>{savedNotification ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
