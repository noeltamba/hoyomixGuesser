import React from 'react';
import { GameId } from '../data/types';

interface HeaderProps {
  selectedGame: GameId;
  onSelectGame: (id: GameId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedGame,
  onSelectGame
}) => {
  const games: { id: GameId; label: string; disabled?: boolean }[] = [
    { id: 'genshin', label: 'Genshin Impact' },
    { id: 'hsr', label: 'Honkai: Star Rail (Soon)', disabled: true },
    { id: 'zzz', label: 'Zenless Zone Zero (Soon)', disabled: true }
  ];

  return (
    <header className="header-wrapper">
      <div>
        <h1 className="brand-title">HoYo-MiX Guesser</h1>
        <p className="brand-subtitle">OST Guessing Game</p>
      </div>

      <div className="top-bar">
        <div className="game-tabs">
          {games.map((g) => (
            <button
              key={g.id}
              className={`game-tab ${selectedGame === g.id ? 'active' : ''} ${g.disabled ? 'disabled-tab' : ''}`}
              onClick={() => !g.disabled && onSelectGame(g.id)}
              disabled={g.disabled}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
