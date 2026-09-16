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

        return (
          <button
            key={sub.id}
            className={`subarea-card ${sub.image ? 'has-thumbnail' : ''} ${choiceClass}`}
            onClick={() => onSelectSubArea(sub.id)}
            disabled={choiceStatus !== 'idle'}
          >
            {sub.image && (
              <div className="subarea-thumbnail-box">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="subarea-thumbnail-img"
                  loading="lazy"
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
