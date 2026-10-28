# MorseType — Learn Morse Code Through Keyboard Practice

A minimal, modern, beginner-friendly Morse code typing practice web application inspired by Monkeytype. Built with Next.js, Web Audio API, and Speech Synthesis. Ready for instant deployment on Vercel.

---

## ⚡ Features

1. **Monkeytype-Inspired Typing Practice**:
   - **Left Hand**: `F` or `D` = Dot (`.`)
   - **Right Hand**: `J` or `K` = Dash (`-`)
   - **Spacebar**: Confirm current letter & advance
   - **Backspace**: Delete last dot/dash
   - **Enter**: Submit answer or restart session
   - **Esc**: Reset practice session
   - Live WPM, accuracy, mistake tracking, and visual Morse capsules (blue dots, amber dashes).

2. **Practice Modes**:
   - **Learn Mode**: Displays the target letter and its Morse code pattern together.
   - **Practice Mode**: Target letter shown; enter Morse code from memory (hints available).
   - **Test Mode**: Morse code pattern given; decode the letter without hints.

3. **Beginner Progressive Curriculum (7 Levels)**:
   - **Level 1**: The Basics (single dots and dashes)
   - **Level 2**: Easy Letters (`E`, `T`, `I`, `M`, `A`, `N`)
   - **Level 3**: Letter Recognition (pattern decoding)
   - **Level 4**: Word Practice (`CAT`, `DOG`, `SUN`, `HI`, etc.)
   - **Level 5**: Timed Sprint (30-second challenge with live WPM)
   - **Level 6**: 3-Element Mastery (`S`, `O`, `U`, `D`, `R`, `K`, `W`, `G`)
   - **Level 7**: Numbers & Radio Prosigns (`0–9`, `SOS`, `CQ`)
   - Dynamic level unlocking based on configurable passing accuracy (default 80%).

4. **Word Document (DOCX) Writer & Exporter**:
   - Word processor interface with realistic white A4/Letter paper canvas.
   - Type in Morse code via keyboard (`D`/`F`, `J`/`K`, `Space`) with real-time decoding into text.
   - Full formatting ribbon: Font Family (Times New Roman, Georgia, Arial, etc.), Font Size, Bold, Italic, Underline, and Text Alignments.
   - **Export DOCX**: Generates real Microsoft Word `.docx` documents.
   - **Print**: Print-formatted layout (`@media print`) for clean paper printing and "Save as PDF".

5. **Morse Code to Text Translator & Voice Reader**:
   - Bi-directional instant conversion between Morse Code and Simple Text.
   - **Telegraph Sidetone Audio**: Synthesizes authentic Morse sound beeps.
   - **Voice Reader (Read Aloud)** using Web Speech API:
     - Play / Read Aloud
     - Pause & Resume
     - Stop
     - **Volume Control Slider** (0% to 100%)
     - **Reading Speed / Rate Slider** (0.5x to 1.75x)
     - **Pitch Control Slider**
     - Voice selector (supports natural system and browser voices).
   - One-click presets: SOS, "What hath God wrought", Ham radio CQ, Beethoven 5th.

6. **Interactive Morse Reference**:
   - Complete directory of all 26 letters (A–Z), digits (0–9), and radio prosigns.
   - Audio preview button for every character.
   - "Drill" button to immediately practice any character.

7. **Statistics & Alphabet Mastery Heatmap**:
   - Lifetime stats: total sessions, total letters typed, overall accuracy, high score WPM.
   - Per-letter mastery heatmap (A–Z) with color-coded accuracy.
   - Session history log table.
   - JSON export and import for data backups.

8. **Admin / Teacher Portal**:
   - **Username**: `admin`
   - **Password**: `Password@123`
   - Add, publish, and delete custom classroom lessons.
   - Unlock all levels for teaching demonstrations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- npm

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd MorseCode

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel

This project is built with Next.js App Router and requires zero configuration to deploy to Vercel:

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial MorseType release"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework preset will automatically detect **Next.js**.
5. Click **Deploy**. Your site will be live in seconds!
