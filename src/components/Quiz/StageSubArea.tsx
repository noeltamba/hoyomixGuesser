import React from 'react';
import { GameId } from '../../data/types';
import { GAMES_DATA } from '../../data/gamesData';

interface StageSubAreaProps {
  gameId: GameId;
  regionId: string;
  selectedChoice: string | null;
  choiceStatus: 'idle' | 'correct' | 'wrong';
  onSelectSubArea: (subAreaId: string) => void;
}

export const StageSubArea: React.FC<StageSubAreaProps> = ({
  gameId,
  regionId,
  selectedChoice,
  choiceStatus,
  onSelectSubArea
}) => {
  const game = GAMES_DATA[gameId];
  const region = game.regions.find((r) => r.id === regionId);
  const subAreas = region ? region.subAreas : [];

  const defaultR2 = 'https://pub-03c826d15ae3488fbeb22b9ff3af9800.r2.dev';
  const cdnBase = (import.meta.env.VITE_AUDIO_CDN_URL || defaultR2).replace(/\/+$/, '');

  return (
    <div className="subarea-grid">
      {subAreas.map((sub) => {
        const isSelected = selectedChoice === sub.id;
        let choiceClass = '';
        if (isSelected) {
          if (choiceStatus === 'correct') choiceClass = 'choice-correct';
          if (choiceStatus === 'wrong') choiceClass = 'choice-wrong-shake';
        }

        const imageUrl = sub.image
          ? (sub.image.startsWith('http') ? sub.image : `${cdnBase}${sub.image}`)
          : undefined;

        return (
          <button
            key={sub.id}
            className={`subarea-btn ${imageUrl ? 'has-thumbnail' : ''} ${choiceClass}`}
            onClick={() => onSelectSubArea(sub.id)}
            disabled={choiceStatus !== 'idle'}
          >
            {imageUrl && (
              <div className="subarea-thumbnail-wrap">
                <img
                  src={imageUrl}
                  alt={sub.name}
                  className="subarea-thumbnail-img"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to local /area/... if remote CDN fails
                    if (sub.image && !e.currentTarget.src.endsWith(sub.image)) {
                      e.currentTarget.src = sub.image;
                    }
                  }}
                />
              </div>
            )}
            <span className="subarea-name">{sub.name}</span>
          </button>
        );
      })}
    </div>
  );
};
