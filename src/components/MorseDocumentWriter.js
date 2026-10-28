'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Volume2,
  Keyboard,
  Sparkles,
  Check
} from 'lucide-react';
import { morseToChar, textToMorse, charToMorse, REVERSE_MORSE_MAP } from '../lib/morseData';
import soundEngine from '../lib/soundEngine';
import { exportToDocx } from '../lib/docxExporter';

export default function MorseDocumentWriter({ settings, soundMuted }) {
  // Document State
  const [docTitle, setDocTitle] = useState('Morse Code Transmission');
  const [documentContent, setDocumentContent] = useState(
    'WE RECEIVE YOUR SIGNAL LOUD AND CLEAR.\nTRANSMITTING TELEGRAPH LOG OVER HIGH FREQUENCY CHANNEL.\nEND OF MESSAGE.'
  );

  // Morse Typing Mode State
  const [morseModeActive, setMorseModeActive] = useState(true);
  const [currentMorseBuffer, setCurrentMorseBuffer] = useState('');
  const [includeTranscript, setIncludeTranscript] = useState(true);

  // Formatting State
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState('14pt');
  const [textAlign, setTextAlign] = useState('left');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // UI status
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [exporting, setExporting] = useState(false);

  const editorRef = useRef(null);
  const pressedKeysRef = useRef(new Set());

  // Current decoded letter preview from buffer
  const previewChar = currentMorseBuffer ? morseToChar(currentMorseBuffer) : '';

  // Append character to document
  const appendText = useCallback((textToAdd) => {
    setDocumentContent(prev => prev + textToAdd);
  }, []);

  // Handle Morse dot
  const handleDot = useCallback(() => {
    if (soundEngine && !soundMuted) soundEngine.playDot();
    setCurrentMorseBuffer(prev => prev + '.');
  }, [soundMuted]);

  // Handle Morse dash
  const handleDash = useCallback(() => {
    if (soundEngine && !soundMuted) soundEngine.playDash();
    setCurrentMorseBuffer(prev => prev + '-');
  }, [soundMuted]);

  // Handle submit letter from buffer or space
  const handleSpace = useCallback(() => {
    if (currentMorseBuffer) {
      const decoded = morseToChar(currentMorseBuffer);
      if (decoded && decoded !== '?') {
        appendText(decoded);
        if (soundEngine && !soundMuted) soundEngine.playSuccess();
      } else {
        // Unrecognized morse
        appendText(currentMorseBuffer);
      }
      setCurrentMorseBuffer('');
    } else {
      // Empty buffer space -> Word space
      appendText(' ');
    }
  }, [currentMorseBuffer, appendText, soundMuted]);

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    if (currentMorseBuffer) {
      setCurrentMorseBuffer(prev => prev.slice(0, -1));
    } else {
      setDocumentContent(prev => prev.slice(0, -1));
    }
  }, [currentMorseBuffer]);

  // Handle Enter (New paragraph)
  const handleEnter = useCallback(() => {
    if (currentMorseBuffer) {
      const decoded = morseToChar(currentMorseBuffer);
      if (decoded) appendText(decoded);
      setCurrentMorseBuffer('');
    }
    appendText('\n');
  }, [currentMorseBuffer, appendText]);

  // Keyboard capture when Morse mode is enabled
  useEffect(() => {
    if (!morseModeActive) return;

    const handleKeyDown = (e) => {
      // If typing in the document title input, let normal input happen
      if (e.target.id === 'doc-title-input') return;

      const key = e.key;
      const dotKeys = settings?.dotKeys || ['f', 'd', 'F', 'D'];
      const dashKeys = settings?.dashKeys || ['j', 'k', 'J', 'K'];

      if (key === ' ' && e.target === document.body) {
        e.preventDefault();
      }

      if (pressedKeysRef.current.has(key.toLowerCase())) return;
      pressedKeysRef.current.add(key.toLowerCase());

      if (dotKeys.includes(key)) {
        e.preventDefault();
        handleDot();
      } else if (dashKeys.includes(key)) {
        e.preventDefault();
        handleDash();
      } else if (key === ' ') {
        e.preventDefault();
        handleSpace();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Enter') {
        e.preventDefault();
        handleEnter();
      }
    };

    const handleKeyUp = (e) => {
      pressedKeysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [morseModeActive, settings, handleDot, handleDash, handleSpace, handleBackspace, handleEnter]);

  // Export to Microsoft Word DOCX
  const handleExportDocx = async () => {
    try {
      setExporting(true);
      const morseTranscript = textToMorse(documentContent);
      await exportToDocx({
        title: docTitle,
        content: documentContent,
        includeMorseTranscript: includeTranscript,
        morseTranscript: morseTranscript
      });
    } catch (err) {
      console.error('Failed to export DOCX', err);
      alert('Error generating Word document.');
    } finally {
      setExporting(false);
    }
  };

  // Print Document
  const handlePrint = () => {
    window.print();
  };

  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(documentContent);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Calculate statistics
  const wordCount = documentContent.trim() ? documentContent.trim().split(/\s+/).length : 0;
  const charCount = documentContent.length;
  const morseTranscript = textToMorse(documentContent);

  return (
    <div className="doc-writer-wrapper">
      {/* Printable Document Header (visible only on print) */}
      <div className="print-only-header">
        <h1>{docTitle}</h1>
      </div>

      {/* Screen Toolbar & Word Ribbon */}
      <div className="doc-toolbar-card no-print">
        {/* Top File Bar */}
        <div className="doc-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
            <FileText size={20} color="var(--accent-dot)" />
            <input
              id="doc-title-input"
              type="text"
              className="doc-title-input"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Document Title"
              title="Click to rename Word document"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              .docx
            </span>
          </div>

          {/* Export & Print Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleExportDocx}
              disabled={exporting}
              title="Download as Microsoft Word (.docx) file"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
            >
              <Download size={15} />
              <span>{exporting ? 'Generating...' : 'Export DOCX'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrint}
              title="Print document or save as PDF"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handleCopy}
              title="Copy text to clipboard"
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
            >
              {copiedNotification ? <Check size={15} color="var(--accent-success)" /> : <Copy size={15} />}
              <span>{copiedNotification ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (confirm('Clear entire document?')) {
                  setDocumentContent('');
                  setCurrentMorseBuffer('');
                }
              }}
              title="Clear document text"
              style={{ padding: '0.55rem 0.8rem', color: 'var(--accent-error)' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Formatting & Controls Ribbon */}
        <div className="doc-ribbon-row">
          {/* Font Family */}
          <select
            className="ribbon-select"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            title="Font Family"
          >
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
            <option value="Courier Prime">Courier Prime</option>
            <option value="Inter">Inter (Sans-Serif)</option>
          </select>

          {/* Font Size */}
          <select
            className="ribbon-select"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            title="Font Size"
          >
            <option value="11pt">11 pt</option>
            <option value="12pt">12 pt</option>
            <option value="14pt">14 pt</option>
            <option value="16pt">16 pt</option>
            <option value="18pt">18 pt</option>
            <option value="22pt">22 pt</option>
          </select>

          <div className="ribbon-separator" />

          {/* Style Toggles */}
          <button
            type="button"
            className={`ribbon-btn ${isBold ? 'active' : ''}`}
            onClick={() => setIsBold(!isBold)}
            title="Bold"
          >
            <Bold size={15} />
          </button>

          <button
            type="button"
            className={`ribbon-btn ${isItalic ? 'active' : ''}`}
            onClick={() => setIsItalic(!isItalic)}
            title="Italic"
          >
            <Italic size={15} />
          </button>

          <button
            type="button"
            className={`ribbon-btn ${isUnderline ? 'active' : ''}`}
            onClick={() => setIsUnderline(!isUnderline)}
            title="Underline"
          >
            <Underline size={15} />
          </button>

          <div className="ribbon-separator" />

          {/* Alignment */}
          <button
            type="button"
            className={`ribbon-btn ${textAlign === 'left' ? 'active' : ''}`}
            onClick={() => setTextAlign('left')}
            title="Align Left"
          >
            <AlignLeft size={15} />
          </button>

          <button
            type="button"
            className={`ribbon-btn ${textAlign === 'center' ? 'active' : ''}`}
            onClick={() => setTextAlign('center')}
            title="Align Center"
          >
            <AlignCenter size={15} />
          </button>

          <button
            type="button"
            className={`ribbon-btn ${textAlign === 'right' ? 'active' : ''}`}
            onClick={() => setTextAlign('right')}
            title="Align Right"
          >
            <AlignRight size={15} />
          </button>

          <button
            type="button"
            className={`ribbon-btn ${textAlign === 'justify' ? 'active' : ''}`}
            onClick={() => setTextAlign('justify')}
            title="Justify"
          >
            <AlignJustify size={15} />
          </button>

          <div className="ribbon-separator" />

          {/* Mode Switcher: Morse Typing vs Normal Editing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <button
              type="button"
              className={`mode-tab ${morseModeActive ? 'active learn' : ''}`}
              onClick={() => setMorseModeActive(true)}
              style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
              title="Type using Morse code keys: D/F for Dot, J/K for Dash, Space for Next"
            >
              <Sparkles size={13} />
              <span>Morse Keyboard Mode</span>
            </button>

            <button
              type="button"
              className={`mode-tab ${!morseModeActive ? 'active' : ''}`}
              onClick={() => setMorseModeActive(false)}
              style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
              title="Type normally using regular keyboard text input"
            >
              <Keyboard size={13} />
              <span>Normal Text Mode</span>
            </button>
          </div>
        </div>

        {/* Morse Live Input Buffer Banner (Shown when in Morse mode) */}
        {morseModeActive && (
          <div className="morse-doc-buffer-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Active Morse Buffer:
              </span>
              <div className="buffer-tokens-pill">
                {currentMorseBuffer ? (
                  currentMorseBuffer.split('').map((s, i) => (
                    <span
                      key={i}
                      className={s === '.' ? 'morse-dot-pill' : 'morse-dash-pill'}
                      style={{ display: 'inline-block' }}
                    />
                  ))
                ) : (
                  <span style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.82rem' }}>
                    Type D/F for (•) or J/K for (—)
                  </span>
                )}
              </div>

              {currentMorseBuffer && (
                <div style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--accent-dot)',
                  color: 'var(--accent-dot)',
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  = {previewChar}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDot}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <span>Dot [D/F]</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDash}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <span>Dash [J/K]</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSpace}
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
              >
                <span>Confirm Letter [Space]</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Realistic Word Document Canvas Paper */}
      <div className="word-paper-container">
        <div
          className="word-doc-paper"
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize,
            textAlign: textAlign,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none',
          }}
        >
          {/* Document Header Line inside paper */}
          <div className="doc-paper-header">
            <span>{docTitle}</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>

          {/* Interactive Document Body */}
          {morseModeActive ? (
            <div
              className="doc-paper-content"
              style={{ whiteSpace: 'pre-wrap', minHeight: '400px' }}
            >
              {documentContent}
              <span className="doc-cursor-blink" />
            </div>
          ) : (
            <textarea
              className="doc-paper-textarea"
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="Start typing your document..."
              style={{
                fontFamily: fontFamily,
                fontSize: fontSize,
                textAlign: textAlign,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderline ? 'underline' : 'none',
              }}
            />
          )}

          {/* Optional Morse Code Transcript Section */}
          {includeTranscript && (
            <div className="doc-paper-transcript-box">
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: '4px' }}>
                Telegraph Morse Code Stream:
              </div>
              <div style={{ fontFamily: 'Courier New, monospace', fontSize: '0.9rem', color: '#374151', wordBreak: 'break-all' }}>
                {morseTranscript || '...'}
              </div>
            </div>
          )}

          {/* Paper Footer */}
          <div className="doc-paper-footer">
            <span>Page 1 of 1</span>
            <span>MorseType Document System</span>
          </div>
        </div>
      </div>

      {/* Bottom Status & Options Bar */}
      <div className="doc-status-footer no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Characters: <strong>{charCount}</strong></span>
          <span>Mode: <strong>{morseModeActive ? 'Morse Keyboard' : 'Standard Text'}</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={includeTranscript}
              onChange={(e) => setIncludeTranscript(e.target.checked)}
              style={{ accentColor: 'var(--accent-dot)' }}
            />
            <span>Include Morse Transcript in Word & Print</span>
          </label>
        </div>
      </div>
    </div>
  );
}
