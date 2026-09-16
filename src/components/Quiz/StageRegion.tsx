import React from 'react';
import { GameId, StageId } from '../../data/types';
import { GAMES_DATA } from '../../data/gamesData';

interface StageProgressProps {
  currentStage: StageId;
}

export const StageProgress: React.FC<StageProgressProps> = ({ currentStage }) => {
  const steps = [
    { num: 1, label: 'Region' },
    { num: 2, label: 'Area' },
    { num: 3, label: 'Context' },
    { num: 4, label: 'Title' }
  ];

  return (
    <div className="stage-stepper">
      {steps.map((s) => {
        let statusClass = '';
        if (currentStage > s.num) statusClass = 'done';
        else if (currentStage === s.num) statusClass = 'active';

        return (
          <div key={s.num} className={`step-dot ${statusClass}`} title={s.label}>
            {s.num}
          </div>
        );
      })}
    </div>
  );
};

interface StageRegionProps {
  gameId: GameId;
  selectedChoice: string | null;
  choiceStatus: 'idle' | 'correct' | 'wrong';
  onSelectRegion: (regionId: string) => void;
}

export const StageRegion: React.FC<StageRegionProps> = ({
  gameId,
  selectedChoice,
  choiceStatus,
  onSelectRegion
}) => {
  const game = GAMES_DATA[gameId];

  return (
    <div className="cards-grid">
      {game.regions.map((region) => {
        const isSelected = selectedChoice === region.id;
        let choiceClass = '';
        if (isSelected) {
          if (choiceStatus === 'correct') choiceClass = 'choice-correct';
          if (choiceStatus === 'wrong') choiceClass = 'choice-wrong-shake';
        }

        return (
          <button
            key={region.id}
            className={`select-card ${choiceClass}`}
            onClick={() => onSelectRegion(region.id)}
            disabled={choiceStatus !== 'idle'}
          >
            <img
              src={region.logo}
              alt={region.name}
              className="region-logo-img"
              loading="lazy"
            />
            <span className="select-card-name">{region.name}</span>
            {region.subtitle && (
              <span className="select-card-subtitle">{region.subtitle}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
