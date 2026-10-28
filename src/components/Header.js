'use client';
import { Volume2, VolumeX, Settings, ShieldCheck, BookOpen, BarChart3, Keyboard, Layers, FileText, Languages } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  soundMuted,
  setSoundMuted,
  openSettings,
  openAdmin,
  isAdminLoggedIn
}) {
  return (
    <header className="header-wrapper">
      <div className="header-content">
        {/* Logo */}
        <div
          className="logo-area"
          onClick={() => setActiveTab('practice')}
          role="button"
          tabIndex={0}
          title="MorseType Home"
        >
          <div className="logo-icon-pulse" aria-hidden="true">
            <span className="logo-dot" />
            <span className="logo-dash" />
            <span className="logo-dot" />
          </div>
          <span>MorseType</span>
        </div>

        {/* Navigation */}
        <nav className="nav-links" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-btn ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            <Keyboard size={15} />
            <span>Practice</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'doc-writer' ? 'active' : ''}`}
            onClick={() => setActiveTab('doc-writer')}
            title="Word DOCX Morse Document Writer"
          >
            <FileText size={15} />
            <span>Word Doc</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'translator' ? 'active' : ''}`}
            onClick={() => setActiveTab('translator')}
            title="Morse to Text Voice Reader & Audio"
          >
            <Languages size={15} />
            <span>Voice Translator</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            <Layers size={15} />
            <span>Lessons</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
          >
            <BookOpen size={15} />
            <span>Reference</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <BarChart3 size={15} />
            <span>Statistics</span>
          </button>
        </nav>

        {/* Header Right Controls */}
        <div className="header-right">
          {/* Quick Shortcut Pill */}
          <div className="shortcut-pill" title="Default Controls">
            <span className="key-badge">D/F</span>
            <span>.</span>
            <span className="key-badge">J/K</span>
            <span>-</span>
            <span className="key-badge">Space</span>
            <span>↵</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            className={`icon-btn ${!soundMuted ? 'active-glow' : ''}`}
            onClick={() => setSoundMuted(!soundMuted)}
            title={soundMuted ? 'Unmute Morse sound' : 'Mute Morse sound'}
            aria-label={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Settings Modal Toggle */}
          <button
            type="button"
            className="icon-btn"
            onClick={openSettings}
            title="Settings & Keybindings"
            aria-label="Settings"
          >
            <Settings size={17} />
          </button>

          {/* Admin / Teacher Portal */}
          <button
            type="button"
            className={`icon-btn ${isAdminLoggedIn ? 'active-glow' : ''}`}
            onClick={openAdmin}
            title={isAdminLoggedIn ? 'Admin Portal (Logged In)' : 'Admin / Teacher Portal'}
            aria-label="Admin Portal"
          >
            <ShieldCheck size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
