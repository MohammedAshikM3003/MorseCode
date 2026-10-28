'use client';
import { useState } from 'react';
import { BarChart3, TrendingUp, Award, Clock, Download, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import { LETTERS_LIST, charToMorse } from '../lib/morseData';
import { exportAllData, importAllData, clearAllData } from '../lib/storage';

export default function StatisticsView({ stats, history, onRefreshData }) {
  const [importStatus, setImportStatus] = useState(null);

  const totalAttempted = stats?.totalLettersAttempted || 0;
  const totalCorrect = stats?.totalLettersCorrect || 0;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Handle Export
  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morsetype-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importAllData(content);
        if (success) {
          setImportStatus('Data imported successfully!');
          onRefreshData();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Failed to import data: invalid JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle Clear
  const handleClear = () => {
    if (confirm('Are you sure you want to reset all your stats and progress? This cannot be undone.')) {
      clearAllData();
      onRefreshData();
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          Practice Statistics & Mastery
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Track your progress, historical typing sessions, and character-by-character accuracy.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <Award size={16} color="var(--accent-dot)" />
            <span>Total Sessions</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '0.4rem' }}>
            {stats?.totalSessions || 0}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <TrendingUp size={16} color="var(--accent-success)" />
            <span>Overall Accuracy</span>
          </div>
          <div style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            marginTop: '0.4rem',
            color: overallAccuracy >= 80 ? 'var(--accent-success)' : 'var(--accent-dash)'
          }}>
            {overallAccuracy}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {totalCorrect} / {totalAttempted} characters
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <Clock size={16} color="var(--accent-dash)" />
            <span>Peak Speed</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '0.4rem', color: 'var(--accent-dash)' }}>
            {stats?.bestWpm || 0} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>WPM</span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
            <BarChart3 size={16} color="var(--accent-dot)" />
            <span>Best Session</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '0.4rem' }}>
            {stats?.bestAccuracy || 0}%
          </div>
        </div>
      </div>

      {/* Alphabet Mastery Heatmap Grid */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.8rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          Alphabet Mastery Heatmap (A–Z)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
          Green indicates high accuracy (&gt;80%), Amber shows learning in progress, and gray is unattempted.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
          gap: '0.6rem'
        }}>
          {LETTERS_LIST.map((char) => {
            const charData = stats?.letterMastery?.[char];
            const charTotal = charData?.total || 0;
            const charCorrect = charData?.correct || 0;
            const accuracy = charTotal > 0 ? Math.round((charCorrect / charTotal) * 100) : null;

            let bgColor = 'rgba(255, 255, 255, 0.02)';
            let borderColor = 'var(--border-subtle)';
            let textColor = 'var(--text-dim)';

            if (accuracy !== null) {
              if (accuracy >= 80) {
                bgColor = 'rgba(34, 197, 94, 0.12)';
                borderColor = 'var(--accent-success)';
                textColor = 'var(--accent-success)';
              } else if (accuracy >= 50) {
                bgColor = 'rgba(245, 158, 11, 0.12)';
                borderColor = 'var(--accent-dash)';
                textColor = 'var(--accent-dash)';
              } else {
                bgColor = 'rgba(239, 68, 68, 0.12)';
                borderColor = 'var(--accent-error)';
                textColor = 'var(--accent-error)';
              }
            }

            return (
              <div
                key={char}
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.4rem',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{char}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {charToMorse(char)}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: textColor, marginTop: '2px' }}>
                  {accuracy !== null ? `${accuracy}%` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Session History */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.8rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem' }}>
          Recent Practice Sessions
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
          Log of your last 10 completed sessions.
        </p>

        {(!history || history.length === 0) ? (
          <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            No sessions recorded yet. Start practicing to see your session history here!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.6rem' }}>Date & Time</th>
                  <th style={{ padding: '0.6rem' }}>Mode</th>
                  <th style={{ padding: '0.6rem' }}>Accuracy</th>
                  <th style={{ padding: '0.6rem' }}>Speed</th>
                  <th style={{ padding: '0.6rem' }}>Time</th>
                  <th style={{ padding: '0.6rem' }}>Correct/Total</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                    <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>
                      {new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.65rem', textTransform: 'capitalize' }}>
                      {h.mode || 'Practice'}
                    </td>
                    <td style={{
                      padding: '0.65rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: h.accuracy >= 80 ? 'var(--accent-success)' : 'var(--accent-dash)'
                    }}>
                      {h.accuracy}%
                    </td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                      {h.wpm || 0} WPM
                    </td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                      {h.timeTaken}s
                    </td>
                    <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                      {h.correct}/{h.totalAttempted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Backup & Management Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1.2rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleExport}
            title="Download full progress backup as JSON"
          >
            <Download size={14} />
            <span>Export Data</span>
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={14} />
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImportFile}
            />
          </label>
        </div>

        {importStatus && (
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> {importStatus}
          </span>
        )}

        <button
          type="button"
          onClick={handleClear}
          style={{ color: 'var(--accent-error)', fontSize: '0.82rem', padding: '0.5rem 0.8rem' }}
        >
          <Trash2 size={14} />
          <span>Reset All Progress</span>
        </button>
      </div>
    </div>
  );
}
