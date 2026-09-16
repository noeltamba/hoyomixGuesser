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

  return (
    <div className="subarea-grid">
      {subAreas.map((sub) => {
        const isSelected = selectedChoice === sub.id;
        let choiceClass = '';
        if (isSelected) {
          if (choiceStatus === 'correct') choiceClass = 'choice-correct';
          if (choiceStatus === 'wrong') choiceClass = 'choice-wrong-shake';
        }

        return (
          <button
            key={sub.id}
            className={`subarea-btn ${choiceClass}`}
            onClick={() => onSelectSubArea(sub.id)}
            disabled={choiceStatus !== 'idle'}
          >
            {sub.name}
          </button>
        );
      })}
    </div>
  );
};
