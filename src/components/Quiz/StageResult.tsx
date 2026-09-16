import React from 'react';
import { Track } from '../../data/types';
import { PlayCircle, RotateCcw } from 'lucide-react';

interface StageResultProps {
  track: Track;
  isVictory: boolean;
  onNextTrack: () => void;
  onRestartGame: () => void;
}

export const StageResult: React.FC<StageResultProps> = ({
  track,
  isVictory,
  onNextTrack,
  onRestartGame
}) => {
  return (
    <div className="result-box">
      <h2 className="result-track-title">{track.title}</h2>

      <div className="result-meta">
        <div><strong>Album:</strong> {track.album}</div>
        <div><strong>Composer:</strong> {track.composer}</div>
      </div>

      <p className="result-desc">{track.description}</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {isVictory ? (
          <button className="btn-primary" onClick={onNextTrack}>
            <PlayCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
            Next Track
          </button>
        ) : (
          <button className="btn-primary" onClick={onRestartGame}>
            <RotateCcw size={16} style={{ display: 'inline', marginRight: 6 }} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
