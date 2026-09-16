import React from 'react';
import { TIME_CONTEXTS } from '../../data/gamesData';

interface StageContextProps {
  selectedChoice: string | null;
  choiceStatus: 'idle' | 'correct' | 'wrong';
  onSelectContext: (contextId: 'day' | 'night' | 'battle' | 'indoor') => void;
}

export const StageContext: React.FC<StageContextProps> = ({
  selectedChoice,
  choiceStatus,
  onSelectContext
}) => {
  return (
    <div className="context-grid">
      {TIME_CONTEXTS.map((ctx) => {
        const isSelected = selectedChoice === ctx.id;
        let choiceClass = '';
        if (isSelected) {
          if (choiceStatus === 'correct') choiceClass = 'choice-correct';
          if (choiceStatus === 'wrong') choiceClass = 'choice-wrong-shake';
        }

        return (
          <button
            key={ctx.id}
            className={`context-card ${choiceClass}`}
            onClick={() => onSelectContext(ctx.id)}
            disabled={choiceStatus !== 'idle'}
          >
            <div className="context-header">
              <span>{ctx.name}</span>
            </div>
            <div className="context-desc">{ctx.desc}</div>
          </button>
        );
      })}
    </div>
  );
};
