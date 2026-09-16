import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Flag, Disc, SlidersHorizontal } from 'lucide-react';
import { SEGMENTS } from '../../hooks/useGameState';

interface VinylPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  segmentIndex: number;
  playMode: 'beginning' | 'middle';
  onChangePlayMode: (mode: 'beginning' | 'middle') => void;
  onTogglePlay: () => void;
  onReplay: () => void;
  onSkipSegment: () => void;
  onGiveUp: () => void;
  getFrequencyData: () => Uint8Array;
}

export const VinylPlayer: React.FC<VinylPlayerProps> = ({
  isPlaying,
  currentTime,
  segmentIndex,
  playMode,
  onChangePlayMode,
  onTogglePlay,
  onReplay,
  onSkipSegment,
  onGiveUp,
  getFrequencyData
}) => {
  const [bars, setBars] = useState<number[]>(new Array(18).fill(4));
  const animFrameRef = useRef<number | null>(null);

  const maxTotalSec = 30;
  const currentLimit = SEGMENTS[segmentIndex];
  const isMaxSegment = segmentIndex === SEGMENTS.length - 1;

  useEffect(() => {
    const updateVisualizer = () => {
      if (isPlaying) {
        const freqData = getFrequencyData();
        const heights = Array.from({ length: 18 }, (_, i) => {
          const val = freqData[i % freqData.length] || 10;
          return Math.max(4, (val / 255) * 36);
        });
        setBars(heights);
      } else {
        setBars(new Array(18).fill(4));
      }
      animFrameRef.current = requestAnimationFrame(updateVisualizer);
    };

    animFrameRef.current = requestAnimationFrame(updateVisualizer);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, getFrequencyData]);

  const currentPercent = Math.min(100, (currentTime / maxTotalSec) * 100);
  const unlockedPercent = (currentLimit / maxTotalSec) * 100;

  return (
    <section className="glass-card player-container">
      {/* Top Row: Playback Position Mode Switcher on the Right */}
      <div className="player-top-row">
        <span className="player-section-label">Audio Player</span>
        <div className="player-mode-switch" role="group" aria-label="Audio start position">
          <button
            type="button"
            className={`mode-switch-btn ${playMode === 'beginning' ? 'active' : ''}`}
            onClick={() => onChangePlayMode('beginning')}
            title="Play from start (0:00)"
          >
            <Disc size={13} />
            <span>Start</span>
          </button>
          <button
            type="button"
            className={`mode-switch-btn ${playMode === 'middle' ? 'active' : ''}`}
            onClick={() => onChangePlayMode('middle')}
            title="Play from middle (50%)"
          >
            <SlidersHorizontal size={13} />
            <span>Middle</span>
          </button>
        </div>
      </div>

      {/* Vinyl Disc & Center Button */}
      <div className="vinyl-box">
        <div className={`vinyl-disc ${isPlaying ? 'playing' : ''}`}>
          <div className="vinyl-center" />
        </div>
        <button
          className="player-main-btn"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 3 }} />}
        </button>
      </div>

      {/* Realtime Audio Visualizer Bars */}
      <div className="visualizer-wrapper">
        {bars.map((h, idx) => (
          <div
            key={idx}
            className="v-bar"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Clean Single Bar with Center Timer */}
      <div className="progress-container">
        {/* Center Live Timer */}
        <div className="timer-center-display">
          <span>{currentTime.toFixed(1)}s</span>
          <span className="timer-sub"> / {currentLimit}s</span>
          <span className="timer-mode-tag">
            {playMode === 'middle' ? '(Middle)' : '(Start)'}
          </span>
        </div>

        {/* Unified Smooth Progress Bar with Segment Grid */}
        <div className="progress-track-clean">
          {/* Unlocked active zone */}
          <div
            className="unlocked-zone-clean"
            style={{ width: `${unlockedPercent}%` }}
          />
          {/* Realtime playback head */}
          <div
            className="progress-fill-clean"
            style={{ width: `${currentPercent}%` }}
          />
          {/* Segment Grid Dividers */}
          <div className="progress-grid-overlay">
            {SEGMENTS.map((seg, idx) => {
              if (idx === SEGMENTS.length - 1) return null;
              const posPercent = (seg / maxTotalSec) * 100;
              return (
                <div
                  key={seg}
                  className={`grid-divider-line ${seg <= currentLimit ? 'unlocked' : ''}`}
                  style={{ left: `${posPercent}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Segment Grid Timestamp Markers */}
        <div className="progress-ticks-row">
          <span className="tick-label tick-start">0s</span>
          {SEGMENTS.map((seg) => {
            const posPercent = (seg / maxTotalSec) * 100;
            const isUnlocked = seg <= currentLimit;
            return (
              <span
                key={seg}
                className={`tick-label ${isUnlocked ? 'unlocked' : ''}`}
                style={{ left: `${posPercent}%` }}
              >
                {seg}s
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="player-action-row">
        <button
          className="btn-secondary"
          onClick={onReplay}
          title={playMode === 'middle' ? 'Replay from middle' : 'Replay from start'}
        >
          <RotateCcw size={15} />
          <span>Replay</span>
        </button>

        {!isMaxSegment ? (
          <button
            className="btn-secondary btn-skip"
            onClick={onSkipSegment}
            title="Skip to next segment"
          >
            <FastForward size={15} />
            <span>Skip</span>
          </button>
        ) : (
          <button
            className="btn-secondary btn-giveup"
            onClick={onGiveUp}
            title="Give Up"
          >
            <Flag size={15} />
            <span>Give Up</span>
          </button>
        )}
      </div>
    </section>
  );
};
