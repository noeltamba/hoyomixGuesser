# 🎵 HoyoMix Guesser

An interactive, multi-stage music guessing web game tailored for HoYoverse soundtracks (HOYO-MiX), featuring **Genshin Impact**, **Honkai: Star Rail**, and **Zenless Zone Zero**.

![HoyoMix Guesser Preview](public/hero_bg.png)

---

## ✨ Features

- **🎮 3 Games Supported**:
  - **Genshin Impact** (Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Kha)
  - **Honkai: Star Rail** (Herta Space Station, Jarilo-VI, Xianzhou Luofu, Penacony, Amphoreus)
  - **Zenless Zone Zero** (Sixth Street, Lumina Square, Ballet Twins Road, Brant Street, Outer Ring)
- **🪜 4-Stage Progressive Guessing Flow**:
  1. **Stage 1 (Region / Planet / District)**: Identify the main nation or area.
  2. **Stage 2 (Sub-Area / Location)**: Pinpoint the exact landmark or sub-zone.
  3. **Stage 3 (Mood & Context)**: Determine day/night vibe, battle intensity, or indoor environment.
  4. **Stage 4 (Track Title)**: Multiple choice options or direct search to name the OST!
- **🎧 Interactive Vinyl Player & Audio Engine**:
  - Audio snippet unlocked incrementally (1.5s ➔ 3s ➔ 6s ➔ 12s ➔ 20s ➔ full).
  - Real-time Web Audio API frequency visualizer.
  - Skip snippet, replay snippet, and give up options.
  - Flexible play modes (Snippet limit vs. Free full play).
- **🎨 Rich Aesthetic & Responsive UI**:
  - Glassmorphic dark cyberpunk / celestial visual style with smooth animations powered by **Framer Motion**.
  - Confetti celebrations upon victory via **canvas-confetti**.
  - Dynamic game theme color accents.
  - Life tracker (3 Hearts) and streak counter.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vitejs.dev/)
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Styling**: Vanilla CSS with modern Glassmorphism and CSS Variables
- **Audio Processing**: HTML5 Audio & Web Audio API (Analysers, Frequency Data)

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

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
hoyomixGuesser/
├── public/                 # Static assets (images, audios, covers)
├── songs/                  # Audio tracks organized by game
├── src/
│   ├── components/
│   │   ├── AudioPlayer/    # Vinyl player, needle, waveform visualizer
│   │   ├── Quiz/           # Stage components (Region, SubArea, Context, Title, ResultModal)
│   │   └── Header.tsx      # Navigation & Game switcher
│   ├── data/
│   │   ├── gamesData.ts    # Regions, sub-areas, and game info
│   │   ├── tracks.ts       # Track metadata, audio sources, and hints
│   │   └── types.ts        # TypeScript interfaces
│   ├── hooks/
│   │   ├── useAudioEngine.ts # Web Audio API & playback controls
│   │   └── useGameState.ts   # Hearts, streak, stage progression logic
│   ├── App.tsx             # Main application orchestrator
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global design tokens and styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

*Disclaimer: HOYO-MiX, Genshin Impact, Honkai: Star Rail, and Zenless Zone Zero and their respective audio tracks and assets are trademarks and copyright of miHoYo / COGNOSPHERE.*
