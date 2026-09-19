import React from 'react';
import { Track } from '../../data/types';
import { PlayCircle, RotateCcw } from 'lucide-react';
import { GAMES_DATA, TIME_CONTEXTS } from '../../data/gamesData';

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
  const gameInfo = GAMES_DATA[track.gameId];
  const regionObj = gameInfo?.regions?.find((r) => r.id === track.regionId);
  const regionName = regionObj?.name || track.regionId.replace(/_/g, ' ');

  const subAreaObj = regionObj?.subAreas?.find((s) => s.id === track.subAreaId);
  const subAreaName = subAreaObj?.name || (track.subAreaId ? track.subAreaId.replace(/_/g, ' ') : '-');

  const contextObj = TIME_CONTEXTS.find((c) => c.id === track.timeContext);
  const contextName = contextObj ? `${contextObj.name} (${contextObj.desc})` : track.timeContext;

  return (
    <div className="result-box">
      <h2 className="result-track-title">{track.title}</h2>

      <div className="result-meta">
        <div><strong>Region:</strong> {regionName}</div>
        <div><strong>Area:</strong> {subAreaName}</div>
        <div><strong>Context:</strong> {contextName}</div>
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
