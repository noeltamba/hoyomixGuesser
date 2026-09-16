import React from 'react';
import { Track } from '../../data/types';
import { PlayCircle, RotateCcw, Disc3, Music2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultModalProps {
  track: Track;
  isVictory: boolean;
  onNextTrack: () => void;
  onRestartGame: () => void;
  onClose?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  track,
  isVictory,
  onNextTrack,
  onRestartGame
}) => {
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
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className={`modal-status-pill ${isVictory ? 'victory' : 'defeat'}`}
          >
            {isVictory ? (
              <>
                <CheckCircle2 size={13} />
                <span>Solved</span>
              </>
            ) : (
              <>
                <XCircle size={13} />
                <span>Given Up</span>
              </>
            )}
          </motion.div>

          {/* Track Title */}
          <motion.h2
            className="modal-track-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            {track.title}
          </motion.h2>

          {/* Metadata Stack (Vertikal ke bawah, bukan 1 baris) */}
          <motion.div
            className="modal-meta-stack"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
          >
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
            {isVictory ? (
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
