'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Languages,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Volume1,
  RotateCcw,
  Copy,
  Check,
  ArrowRightLeft,
  Sparkles,
  Radio,
  Sliders,
  Mic
} from 'lucide-react';
import { morseToText, textToMorse } from '../lib/morseData';
import soundEngine from '../lib/soundEngine';

export default function MorseTranslatorVoice({ soundMuted }) {
  // Morse Code Input & Simple Text
  const [morseInput, setMorseInput] = useState('.... . .-.. .-.. --- / .-- --- .-. .-.. -.. / -.-. --.- / -.-. --.-');
  const [simpleTextInput, setSimpleTextInput] = useState('HELLO WORLD CQ CQ');

  // Active translation direction: 'morse-to-text' or 'text-to-morse'
  const [direction, setDirection] = useState('morse-to-text');

  // Speech Synthesis (Voice Reader) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0.85); // 0.0 to 1.0
  const [voiceRate, setVoiceRate] = useState(1.0); // 0.5 to 2.0
  const [voicePitch, setVoicePitch] = useState(1.0); // 0.5 to 1.5
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState('');
  const [activeWordSpoken, setActiveWordSpoken] = useState('');

  // Morse Audio (Beep) State
  const [isMorseBeeping, setIsMorseBeeping] = useState(false);
  const [morseWpm, setMorseWpm] = useState(18);

  // Notifications
  const [copiedMorse, setCopiedMorse] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const utteranceRef = useRef(null);

  // Load SpeechSynthesis Voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);
        // Default to first English voice or first available
        const defaultVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (defaultVoice) {
          setSelectedVoiceUri(defaultVoice.voiceURI);
        }
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync translation when morse changes
  const handleMorseChange = (newMorse) => {
    setMorseInput(newMorse);
    const decoded = morseToText(newMorse);
    setSimpleTextInput(decoded);
  };

  // Sync translation when simple text changes
  const handleTextChange = (newText) => {
    setSimpleTextInput(newText);
    const encoded = textToMorse(newText);
    setMorseInput(encoded);
  };

  // Swap translation direction
  const handleSwapDirection = () => {
    setDirection(prev => (prev === 'morse-to-text' ? 'text-to-morse' : 'morse-to-text'));
  };

  // Voice Reader Play / Speak
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech Synthesis is not supported in your browser.');
      return;
    }

    // If currently paused, resume
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const textToRead = simpleTextInput.trim();
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance;

    // Apply voice settings
    utterance.volume = voiceVolume;
    utterance.rate = voiceRate;
    utterance.pitch = voicePitch;

    if (selectedVoiceUri) {
      const matchedVoice = availableVoices.find(v => v.voiceURI === selectedVoiceUri);
      if (matchedVoice) utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const word = textToRead.substring(e.charIndex, e.charIndex + e.charLength);
        setActiveWordSpoken(word);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveWordSpoken('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveWordSpoken('');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Voice Reader Pause
  const handlePause = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Voice Reader Resume
  const handleResume = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Voice Reader Stop
  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveWordSpoken('');
    }
  };

  // Morse Tone Player Play
  const handlePlayMorseAudio = () => {
    if (!soundEngine || isMorseBeeping) return;
    setIsMorseBeeping(true);
    soundEngine.setWpm(morseWpm);
    soundEngine.playSequence(morseInput, (step, symbol) => {
      if (step === -1) {
        setIsMorseBeeping(false);
      }
    });
  };

  const handleStopMorseAudio = () => {
    if (soundEngine) {
      soundEngine.stopContinuousTone();
      setIsMorseBeeping(false);
    }
  };

  // Copy helper
  const handleCopyMorse = () => {
    navigator.clipboard.writeText(morseInput);
    setCopiedMorse(true);
    setTimeout(() => setCopiedMorse(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(simpleTextInput);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Sample Presets
  const presets = [
    { label: 'SOS Distress Signal', morse: '... --- ...' },
    { label: 'What Hath God Wrought', morse: '.-- .... .- - / .... .- - .... / --. --- -.. / .-- .-. --- ..- --. .... -' },
    { label: 'Ham Radio Call: CQ CQ', morse: '-.-. --.- / -.-. --.- / -.-. --.- / -.. . / -- --- .-. ... . / --.- ... .-..' },
    { label: 'Beethoven 5th (V for Victory)', morse: '...- / ...- / ...-' },
    { label: 'May The Force Be With You', morse: '-- .- -.-- / - .... . / ..-. --- .-. -.-. . / -... . / .-- .. - .... / -.-- --- ..-' }
  ];

  return (
    <div style={{ maxWidth: '980px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
          Morse Code to Simple Text & Voice Reader
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
          Real-time bi-directional Morse translator. Listen to natural speech reading with play, pause, and volume controls, or synthesize authentic radio telegraph beeps.
        </p>
      </div>

      {/* Preset Quick Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Quick Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            className="btn-secondary"
            onClick={() => handleMorseChange(p.morse)}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <Sparkles size={12} color="var(--accent-dot)" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Two-Column Translation Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Box 1: Morse Code Input */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="var(--accent-dot)" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Morse Code Input</span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="icon-btn"
                onClick={handleCopyMorse}
                title="Copy Morse code"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                {copiedMorse ? <Check size={13} color="var(--accent-success)" /> : <Copy size={13} />}
                <span>{copiedMorse ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                className="icon-btn"
                onClick={() => handleMorseChange('')}
                title="Clear Morse code"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className="form-input"
            value={morseInput}
            onChange={(e) => handleMorseChange(e.target.value)}
            placeholder="Enter Morse code (e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..)..."
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              letterSpacing: '0.08em',
              lineHeight: '1.6',
              minHeight: '160px',
              resize: 'vertical',
              background: 'rgba(0, 0, 0, 0.25)',
              color: 'var(--accent-dash)'
            }}
          />

          {/* Morse Helper Buttons */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleMorseChange(morseInput + '.')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
            >
              Dot (•)
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleMorseChange(morseInput + '-')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
            >
              Dash (—)
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleMorseChange(morseInput + ' ')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            >
              Letter Gap [Space]
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleMorseChange(morseInput + ' / ')}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            >
              Word Gap [ / ]
            </button>
          </div>

          {/* Morse Beep Audio Player */}
          <div style={{
            marginTop: '1.2rem',
            paddingTop: '0.8rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} color="var(--accent-dash)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Telegraph Sidetone</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {!isMorseBeeping ? (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePlayMorseAudio}
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                >
                  <Play size={13} />
                  <span>Play Beeps</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleStopMorseAudio}
                  style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', color: 'var(--accent-error)' }}
                >
                  <Square size={13} />
                  <span>Stop Beeps</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Box 2: Simple Text Output & Voice Reader */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Languages size={16} color="var(--accent-success)" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Decoded Simple Text</span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="icon-btn"
                onClick={handleCopyText}
                title="Copy translated text"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                {copiedText ? <Check size={13} color="var(--accent-success)" /> : <Copy size={13} />}
                <span>{copiedText ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                className="icon-btn"
                onClick={() => handleTextChange('')}
                title="Clear text"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            className="form-input"
            value={simpleTextInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Decoded English plain text will appear here automatically..."
            style={{
              fontSize: '1.15rem',
              lineHeight: '1.6',
              minHeight: '160px',
              resize: 'vertical',
              background: 'rgba(0, 0, 0, 0.25)',
              fontWeight: 500,
              color: 'var(--text-main)'
            }}
          />

          {/* Spoken Word Tracker */}
          {activeWordSpoken && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--accent-dot)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Speaking:</span>
              <strong style={{ background: 'var(--bg-surface-elevated)', padding: '2px 8px', borderRadius: '4px' }}>
                {activeWordSpoken}
              </strong>
            </div>
          )}

          {/* Voice Reader Controls Card */}
          <div style={{
            marginTop: '1.2rem',
            paddingTop: '0.8rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            {/* Play, Pause, Resume, Stop Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={16} color="var(--accent-dot)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Voice Reader (Read Aloud)</span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {!isSpeaking ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleSpeak}
                    style={{ padding: '0.4rem 0.95rem', fontSize: '0.82rem' }}
                    title="Read text aloud"
                  >
                    <Play size={14} />
                    <span>Read Aloud</span>
                  </button>
                ) : (
                  <>
                    {!isPaused ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={handlePause}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                        title="Pause speech"
                      >
                        <Pause size={14} />
                        <span>Pause</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={handleResume}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                        title="Resume speech"
                      >
                        <Play size={14} />
                        <span>Resume</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleStop}
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', color: 'var(--accent-error)' }}
                      title="Stop speech"
                    >
                      <Square size={14} />
                      <span>Stop</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Volume Control Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.2rem' }}>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setVoiceVolume(prev => (prev > 0 ? 0 : 0.85))}
                style={{ padding: '0.35rem' }}
                title={voiceVolume === 0 ? 'Unmute' : 'Mute'}
              >
                {voiceVolume === 0 ? (
                  <VolumeX size={15} color="var(--accent-error)" />
                ) : voiceVolume < 0.5 ? (
                  <Volume1 size={15} />
                ) : (
                  <Volume2 size={15} color="var(--accent-dot)" />
                )}
              </button>

              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '85px' }}>
                Volume: {Math.round(voiceVolume * 100)}%
              </span>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-dot)' }}
                title="Voice Volume Control"
              />
            </div>

            {/* Voice Speed & Pitch Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.2rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>Reading Speed</span>
                  <span>{voiceRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.75"
                  step="0.1"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-dash)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                  <span>Pitch</span>
                  <span>{voicePitch}</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.1"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-success)' }}
                />
              </div>
            </div>

            {/* Voice Selector Dropdown (if multiple voices available) */}
            {availableVoices.length > 0 && (
              <div style={{ marginTop: '0.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '3px' }}>
                  Synthesizer Voice:
                </label>
                <select
                  className="form-input"
                  value={selectedVoiceUri}
                  onChange={(e) => setSelectedVoiceUri(e.target.value)}
                  style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                >
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
