import React from 'react';
import { GameId } from '../../data/types';
import { GAMES_DATA } from '../../data/gamesData';

interface StageSubAreaProps {
  gameId: GameId;
  regionId: string;
  targetSubAreaId?: string;
  selectedChoice: string | null;
  choiceStatus: 'idle' | 'correct' | 'wrong';
  onSelectSubArea: (subAreaId: string) => void;
}

const defaultR2 = 'https://pub-03c826d15ae3488fbeb22b9ff3af9800.r2.dev';
const cdnBase = (import.meta.env.VITE_AUDIO_CDN_URL || defaultR2).replace(/\/+$/, '');

function getImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/area/')) {
    return `${cdnBase}${imagePath}`;
  }
  return imagePath;
}

export const StageSubArea: React.FC<StageSubAreaProps> = ({
  gameId,
  regionId,
  targetSubAreaId,
  selectedChoice,
  choiceStatus,
  onSelectSubArea
}) => {
  const game = GAMES_DATA[gameId];
  const region = game.regions.find((r) => r.id === regionId);
  const subAreas = region ? region.subAreas : [];

  // Pick 4 options including the correct target subarea
  const displaySubAreas = React.useMemo(() => {
    if (subAreas.length <= 4) return subAreas;

    const correct = subAreas.find((s) => s.id === targetSubAreaId) || subAreas[0];
    const others = subAreas.filter((s) => s.id !== correct.id);

    // Shuffle others and pick 3
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    // Combine and shuffle the 4 choices
    return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
  }, [subAreas, targetSubAreaId]);

  return (
    <div className="subarea-cards-grid">
      {displaySubAreas.map((sub) => {
        const isSelected = selectedChoice === sub.id;
        let choiceClass = '';
        if (isSelected) {
          if (choiceStatus === 'correct') choiceClass = 'choice-correct';
          if (choiceStatus === 'wrong') choiceClass = 'choice-wrong-shake';
        }

        const resolvedSrc = getImageUrl(sub.image);

        return (
          <button
            key={sub.id}
            className={`subarea-card ${sub.image ? 'has-thumbnail' : ''} ${choiceClass}`}
            onClick={() => onSelectSubArea(sub.id)}
            disabled={choiceStatus !== 'idle'}
          >
            {resolvedSrc && (
              <div className="subarea-thumbnail-box">
                <img
                  src={resolvedSrc}
                  alt={sub.name}
                  className="subarea-thumbnail-img"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to local path if CDN fails or vice versa
                    if (sub.image && e.currentTarget.src !== sub.image) {
                      e.currentTarget.src = sub.image;
                    }
                  }}
                />
                <div className="subarea-thumbnail-overlay" />
              </div>
            )}
            <span className="subarea-card-name">{sub.name}</span>
          </button>
        );
      })}
    </div>
  );
};
