# 🎵 HoyoMix Guesser

An interactive, multi-stage music guessing web game tailored for HoYoverse soundtracks (HOYO-MiX), focusing on **Genshin Impact** and ready for **Honkai: Star Rail** and **Zenless Zone Zero**.

![HoyoMix Guesser Preview](public/hero_bg.png)

---

## ✨ Features

- **🎮 Supported Games**:
  - **Genshin Impact**: Comprehensive regions including Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya, plus special event areas (Golden Apple Archipelago, Veluriyam Mirage, Simulanka, Enkanomiya).
  - **Honkai: Star Rail & Zenless Zone Zero**: Architecture ready for future expansion.
- **🪜 4-Stage Progressive Guessing Flow**:
  1. **Stage 1 (Region / Nation)**: Identify the main nation or area from an 8-region grid.
  2. **Stage 2 (Sub-Area / Location)**: Pinpoint the exact landmark or sub-zone with visual thumbnail choices.
  3. **Stage 3 (Mood & Context)**: Determine day/night vibe, battle intensity, or indoor environment.
  4. **Stage 4 (Track Title)**: Name the track using structured hints (initials, album, character, atmosphere).
- **🎧 Interactive Vinyl Player & Audio Engine**:
  - Incremental audio snippets: 1.5s ➔ 3s ➔ 6s ➔ 12s ➔ 20s ➔ Full.
  - Real-time Web Audio API frequency visualizer.
  - Skip snippet, replay snippet, and give up controls.
  - Flexible play modes (Snippet limit vs. Free full play).
- **☁️ Cloudflare R2 Audio Hosting**:
  - Audio tracks are streamed on-demand via Cloudflare R2 CDN (`VITE_AUDIO_CDN_URL`), keeping the git repository lightweight.
- **🎨 Rich Aesthetic & Responsive UI**:
  - Celestial glassmorphism with smooth animations powered by **Framer Motion**.
  - Confetti celebrations upon victory via **canvas-confetti**.
  - Fixed-dimension stage layouts to prevent screen jumping between questions.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Styling**: Vanilla CSS with modern Glassmorphism and CSS Variables
- **Audio & Storage**: HTML5 Audio & Web Audio API (Analysers, Frequency Data) + Cloudflare R2 CDN

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/noeltamba/hoyomixGuesser.git
   cd hoyomixGuesser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env` if you want to customize your Cloudflare R2 CDN URL:
   ```env
   VITE_STORAGE_PROVIDER=r2
   VITE_AUDIO_CDN_URL=https://pub-03c826d15ae3488fbeb22b9ff3af9800.r2.dev
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
hoyomixGuesser/
├── public/                 # Static public assets (logos, area thumbnails, emblems)
├── src/
│   ├── components/
│   │   ├── AudioPlayer/    # Vinyl player, needle, waveform visualizer
│   │   ├── Quiz/           # Stage components (StageRegion, StageSubArea, StageContext, StageTitleGuess, ResultModal)
│   │   └── Header.tsx      # Navigation & Game switcher
│   ├── data/
│   │   ├── gamesData.ts    # Regions, sub-areas, and game definitions
│   │   ├── tracks.ts       # Track parser, metadata loader, and audio URL resolvers
│   │   └── types.ts        # TypeScript interfaces
│   ├── hooks/
│   │   ├── useAudioEngine.ts # Web Audio API playback & segment limit controls
│   │   └── useGameState.ts   # Stage progression, score, and quiz logic
│   ├── songs/              # Track metadata definition files (data.txt per track)
│   ├── App.tsx             # Main application orchestrator
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global design tokens, layout stability, and animations
├── logs/                   # Track update logs and release notes
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

*Disclaimer: HOYO-MiX, Genshin Impact, Honkai: Star Rail, and Zenless Zone Zero and their respective audio tracks and assets are trademarks and copyright of miHoYo / COGNOSPHERE.*
