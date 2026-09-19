import React from 'react';
import { Track } from '../../data/types';
import { EndStatus } from '../../hooks/useGameState';
import { PlayCircle, RotateCcw, Disc3, Music2, CheckCircle2, XCircle, Award, AlertCircle, Compass, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES_DATA, TIME_CONTEXTS } from '../../data/gamesData';

interface ResultModalProps {
  track: Track;
  isVictory: boolean;
  endStatus?: EndStatus | null;
  correctCount?: number;
  guessedSec?: number;
  onNextTrack: () => void;
  onRestartGame: () => void;
  onClose?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  track,
  isVictory,
  endStatus = isVictory ? 'guessed' : 'give_up',
  correctCount = isVictory ? 4 : 0,
  guessedSec = 3,
  onNextTrack,
  onRestartGame
}) => {
  const isGuessed = endStatus === 'guessed' || isVictory;
  const isGiveUp = endStatus === 'give_up';
  const isDidntGuessed = endStatus === 'didnt_guessed';

  // Resolve user-friendly labels for Region, SubArea, and Context
  const gameInfo = GAMES_DATA[track.gameId];
  const regionObj = gameInfo?.regions?.find((r) => r.id === track.regionId);
  const regionName = regionObj?.name || track.regionId.replace(/_/g, ' ');

  const subAreaObj = regionObj?.subAreas?.find((s) => s.id === track.subAreaId);
  const subAreaName = subAreaObj?.name || (track.subAreaId ? track.subAreaId.replace(/_/g, ' ') : '-');

  const contextObj = TIME_CONTEXTS.find((c) => c.id === track.timeContext);
  const contextName = contextObj ? `${contextObj.name} (${contextObj.desc})` : track.timeContext;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="modal-card"
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{
            type: 'spring',
            damping: 24,
            stiffness: 300,
            mass: 0.8
          }}
        >
          {/* Header Row: Status Badge & Score .../4 & Time in seconds */}
          <div className="modal-header-badges">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className={`modal-status-pill ${isGuessed ? 'victory' : isDidntGuessed ? 'defeat' : 'give-up'}`}
            >
              {isGuessed && (
                <>
                  <CheckCircle2 size={13} />
                  <span>Guessed</span>
                </>
              )}
              {isGiveUp && (
                <>
                  <AlertCircle size={13} />
                  <span>Give Up</span>
                </>
              )}
              {isDidntGuessed && (
                <>
                  <XCircle size={13} />
                  <span>Didn't Guessed</span>
                </>
              )}
            </motion.div>

            {/* Time / Seconds Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              className="modal-time-pill"
            >
              <span>{isGuessed ? `Guessed at ${guessedSec}s` : `Ended at ${guessedSec}s`}</span>
            </motion.div>

            {/* Score .../4 Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.2 }}
              className={`modal-score-pill ${isGuessed ? 'score-full' : ''}`}
            >
              <Award size={13} />
              <span>{correctCount}/4 Correct</span>
            </motion.div>
          </div>

          {/* Album Cover Thumbnail above Title */}
          {track.coverImage && (
            <motion.div
              className="modal-cover-wrapper"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              <img
                src={track.coverImage}
                alt={track.album}
                className="modal-cover-img"
                loading="lazy"
                onError={(e) => {
                  // Hide container gracefully if cover image is not found on CDN
                  (e.currentTarget.parentElement as HTMLElement)?.style.setProperty('display', 'none');
                }}
              />
            </motion.div>
          )}

          {/* Track Title */}
          <motion.h2
            className="modal-track-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.25 }}
          >
            {track.title}
          </motion.h2>

          {/* Metadata Stack (Vertikal ke bawah) */}
          <motion.div
            className="modal-meta-stack"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
          >
            {/* Answers Breakdown: Region, SubArea, Context */}
            <div className="modal-answers-grid">
              <div className="modal-answer-card">
                <div className="meta-row-header">
                  <Compass size={13} className="meta-icon" />
                  <span className="meta-label">REGION</span>
                </div>
                <div className="meta-val-highlight">{regionName}</div>
              </div>

              <div className="modal-answer-card">
                <div className="meta-row-header">
                  <MapPin size={13} className="meta-icon" />
                  <span className="meta-label">AREA</span>
                </div>
                <div className="meta-val-highlight">{subAreaName}</div>
              </div>

              <div className="modal-answer-card modal-answer-full">
                <div className="meta-row-header">
                  <Clock size={13} className="meta-icon" />
                  <span className="meta-label">CONTEXT</span>
                </div>
                <div className="meta-val-highlight">{contextName}</div>
              </div>
            </div>

            <div className="modal-meta-row">
              <div className="meta-row-header">
                <Disc3 size={13} className="meta-icon" />
                <span className="meta-label">ALBUM</span>
              </div>
              <div className="meta-val-stacked">{track.album}</div>
            </div>

            <div className="modal-meta-row">
              <div className="meta-row-header">
                <Music2 size={13} className="meta-icon" />
                <span className="meta-label">COMPOSER</span>
              </div>
              <div className="meta-val-stacked">{track.composer}</div>
            </div>
          </motion.div>

          {/* Description */}
          {track.description && (
            <motion.p
              className="modal-desc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.25 }}
            >
              {track.description}
            </motion.p>
          )}

          {/* Action Button */}
          <motion.div
            className="modal-action-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
          >
            {isGuessed ? (
              <button className="btn-primary modal-btn" onClick={onNextTrack}>
                <PlayCircle size={16} />
                <span>Next Track</span>
              </button>
            ) : (
              <button className="btn-primary modal-btn" onClick={onRestartGame}>
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
