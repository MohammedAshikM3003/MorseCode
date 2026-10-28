'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../components/Header';
import ScrollProgress from '../components/ScrollProgress';
import BackgroundGlow from '../components/BackgroundGlow';
import ModeSelector from '../components/ModeSelector';
import PracticeArea from '../components/PracticeArea';
import SessionResults from '../components/SessionResults';
import LessonsPanel from '../components/LessonsPanel';
import MorseReference from '../components/MorseReference';
import StatisticsView from '../components/StatisticsView';
import SettingsModal from '../components/SettingsModal';
import AdminPortal from '../components/AdminPortal';
import MorseDocumentWriter from '../components/MorseDocumentWriter';
import MorseTranslatorVoice from '../components/MorseTranslatorVoice';

import { DEFAULT_LESSONS, PRACTICE_WORDS_BANK } from '../lib/defaultLessons';
import {
  getStoredSettings,
  saveStoredSettings,
  getUnlockedLevels,
  unlockLevel,
  getStoredStats,
  saveSessionStats,
  getSessionHistory,
  getCustomLessons
} from '../lib/storage';

export default function Home() {
  // Navigation & View
  const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'lessons' | 'reference' | 'statistics'
  const [currentMode, setCurrentMode] = useState('learn'); // 'learn' | 'practice' | 'test'

  // Settings & Audio
  const [settings, setSettings] = useState(() => getStoredSettings());
  const [soundMuted, setSoundMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Admin Portal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Curriculum & Lessons State
  const [unlockedLevels, setUnlockedLevels] = useState(() => getUnlockedLevels());
  const [customLessons, setCustomLessons] = useState(() => getCustomLessons());
  const [activeLesson, setActiveLesson] = useState(null);

  // Practice Targets
  const [targetItems, setTargetItems] = useState(['CAT', 'DOG', 'SUN', 'HI']);
  const [sessionResults, setSessionResults] = useState(null);
  const [practiceKey, setPracticeKey] = useState(0); // increment to force remount session

  // Stats
  const [stats, setStats] = useState(() => getStoredStats());
  const [history, setHistory] = useState(() => getSessionHistory());

  // Merge default lessons with any custom teacher lessons
  const allLessons = useMemo(() => {
    return [...DEFAULT_LESSONS, ...(customLessons || [])];
  }, [customLessons]);

  // Sync settings & stats from localStorage on mount
  useEffect(() => {
    setSettings(getStoredSettings());
    setUnlockedLevels(getUnlockedLevels());
    setCustomLessons(getCustomLessons());
    setStats(getStoredStats());
    setHistory(getSessionHistory());
  }, []);

  // Update soundEngine muted state when settings or soundMuted changes
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleRefreshData = () => {
    setStats(getStoredStats());
    setHistory(getSessionHistory());
    setUnlockedLevels(getUnlockedLevels());
    setCustomLessons(getCustomLessons());
  };

  // Start a lesson
  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
    setTargetItems([...lesson.targets]);
    setSessionResults(null);
    setActiveTab('practice');
    setPracticeKey(prev => prev + 1);
  };

  // Switch mode
  const handleSelectMode = (newMode) => {
    setCurrentMode(newMode);
    setSessionResults(null);
    setPracticeKey(prev => prev + 1);
  };

  // Drill a single character from the Morse Reference
  const handleDrillCharacter = (char) => {
    setActiveLesson(null);
    // Drill pattern: repeat the character 4 times
    setTargetItems([char, char, char, char]);
    setCurrentMode('practice');
    setActiveTab('practice');
    setSessionResults(null);
    setPracticeKey(prev => prev + 1);
  };

  // Handle session completion
  const handleSessionComplete = useCallback((results) => {
    setSessionResults(results);

    // Save stats locally
    saveSessionStats(results);
    setStats(getStoredStats());
    setHistory(getSessionHistory());

    // If passed a curriculum lesson, unlock the next one
    if (results.lessonId && results.passed) {
      const currentIdx = allLessons.findIndex(l => l.id === results.lessonId);
      if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
        const nextLesson = allLessons[currentIdx + 1];
        unlockLevel(nextLesson.id);
        setUnlockedLevels(getUnlockedLevels());
      }
    }
  }, [allLessons]);

  // Try again
  const handleTryAgain = () => {
    setSessionResults(null);
    setPracticeKey(prev => prev + 1);
  };

  // Continue learning (advance to next lesson or next word pack)
  const handleContinueLearning = () => {
    if (activeLesson) {
      const currentIdx = allLessons.findIndex(l => l.id === activeLesson.id);
      if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
        const next = allLessons[currentIdx + 1];
        handleStartLesson(next);
        return;
      }
    }

    // Pick 4 random words from practice words bank
    const shuffled = [...PRACTICE_WORDS_BANK].sort(() => 0.5 - Math.random());
    setTargetItems(shuffled.slice(0, 4));
    setActiveLesson(null);
    setSessionResults(null);
    setPracticeKey(prev => prev + 1);
  };

  // Admin Unlock All Lessons helper
  const handleUnlockAll = () => {
    allLessons.forEach(l => unlockLevel(l.id));
    setUnlockedLevels(getUnlockedLevels());
  };

  const hasNextLesson = activeLesson
    ? allLessons.findIndex(l => l.id === activeLesson.id) < allLessons.length - 1
    : false;

  return (
    <div className="app-container">
      {/* Top thin scroll progress bar */}
      <ScrollProgress />

      {/* Subtle ambient lighting */}
      <BackgroundGlow />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        openSettings={() => setIsSettingsOpen(true)}
        openAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1rem 0 3rem' }}>
        {activeTab === 'practice' && (
          <div>
            {/* Mode Selector */}
            <ModeSelector
              currentMode={currentMode}
              onSelectMode={handleSelectMode}
            />

            {/* If session results exist, show results screen, else show practice stage */}
            {sessionResults ? (
              <SessionResults
                results={sessionResults}
                bestAccuracy={stats?.bestAccuracy || sessionResults.accuracy}
                onTryAgain={handleTryAgain}
                onContinueLearning={handleContinueLearning}
                hasNextLesson={hasNextLesson}
              />
            ) : (
              <PracticeArea
                key={practiceKey}
                mode={currentMode}
                targetItems={targetItems}
                activeLesson={activeLesson}
                settings={settings}
                soundMuted={soundMuted}
                onSessionComplete={handleSessionComplete}
                onRestart={handleTryAgain}
              />
            )}
          </div>
        )}

        {activeTab === 'doc-writer' && (
          <MorseDocumentWriter
            settings={settings}
            soundMuted={soundMuted}
          />
        )}

        {activeTab === 'translator' && (
          <MorseTranslatorVoice
            soundMuted={soundMuted}
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsPanel
            lessons={allLessons}
            unlockedLevelIds={unlockedLevels}
            onStartLesson={handleStartLesson}
            activeLessonId={activeLesson?.id}
          />
        )}

        {activeTab === 'reference' && (
          <MorseReference
            onPracticeCharacter={handleDrillCharacter}
          />
        )}

        {activeTab === 'statistics' && (
          <StatisticsView
            stats={stats}
            history={history}
            onRefreshData={handleRefreshData}
          />
        )}
      </main>

      {/* Preferences Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Admin / Teacher Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isLoggedIn={isAdminLoggedIn}
        setIsLoggedIn={setIsAdminLoggedIn}
        customLessons={customLessons}
        onLessonsUpdated={() => {
          setCustomLessons(getCustomLessons());
          setUnlockedLevels(getUnlockedLevels());
        }}
        onUnlockAll={handleUnlockAll}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>MorseType</strong> — Minimal Morse code typing tutor inspired by Monkeytype.
          </div>
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            <span>Left: [D] / [F] = Dot</span>
            <span>Right: [J] / [K] = Dash</span>
            <span>Space = Next Letter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
