import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Track, TrackHint } from '../../data/types';
import { TRACKS } from '../../data/tracks';
import { GAMES_DATA } from '../../data/gamesData';
import { Send, Lightbulb, Sparkles, Music, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StageTitleGuessProps {
  track: Track;
  selectedChoice: string | null;
  choiceStatus: 'idle' | 'correct' | 'wrong';
  onGuessTitle: (input: string) => void;
}

export const StageTitleGuess: React.FC<StageTitleGuessProps> = ({
  track,
  choiceStatus,
  onGuessTitle
}) => {
  const [input, setInput] = useState('');
  const [unlockedHints, setUnlockedHints] = useState<TrackHint[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to get formatted region name
  const getRegionName = (trackItem: Track) => {
    const game = GAMES_DATA[trackItem.gameId];
    const region = game?.regions.find((r) => r.id === trackItem.regionId);
    return region?.name || trackItem.regionId;
  };

  // Pre-calculate all track suggestions for current game
  const allGameTracks = useMemo(() => {
    return TRACKS.filter((t) => t.gameId === track.gameId).map((t) => {
      const regionName = getRegionName(t);
      return {
        id: t.id,
        title: t.title,
        regionName,
        displayText: `${t.title} - ${regionName}`
      };
    });
  }, [track.gameId]);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    const query = input.trim().toLowerCase();
    if (!query) return [];
    return allGameTracks
      .filter((t) =>
        t.title.toLowerCase().includes(query) ||
        t.regionName.toLowerCase().includes(query) ||
        t.displayText.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [input, allGameTracks]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Default hints fallback if not explicitly configured
  const allPossibleHints: TrackHint[] =
    track.hints && track.hints.length > 0
      ? track.hints
      : [
          { label: 'Initials', value: track.title.split(' ').map((w) => w[0]).join('. ') },
          { label: 'Album', value: track.album },
          { label: 'Atmosphere', value: track.tags.join(', ') }
        ];

  const handleSelectSuggestion = (suggestion: typeof allGameTracks[0]) => {
    setInput(suggestion.displayText);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    if (choiceStatus === 'idle') {
      onGuessTitle(suggestion.displayText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
      handleSelectSuggestion(filteredSuggestions[selectedIndex]);
      return;
    }

    if (input.trim() && choiceStatus === 'idle') {
      onGuessTitle(input);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const handleRevealHint = () => {
    const remaining = allPossibleHints.filter(
      (h) => !unlockedHints.some((u) => u.label === h.label)
    );
    if (remaining.length > 0) {
      const randomHint = remaining[Math.floor(Math.random() * remaining.length)];
      setUnlockedHints((prev) => [...prev, randomHint]);
    }
  };

  const formClass =
    choiceStatus === 'correct'
      ? 'choice-correct'
      : choiceStatus === 'wrong'
      ? 'choice-wrong-shake'
      : '';

  const hasRemainingHints = unlockedHints.length < allPossibleHints.length;

  return (
    <div className="title-input-wrapper" ref={containerRef}>
      <form onSubmit={handleSubmit} className={`input-row ${formClass}`} style={{ position: 'relative' }}>
        <div className="input-search-container">
          <input
            ref={inputRef}
            type="text"
            className="title-input"
            placeholder="Type track title... (e.g. Her Wishes - Sumeru)"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsDropdownOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (input.trim().length > 0) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            disabled={choiceStatus !== 'idle'}
            autoFocus
          />

          {/* Autocomplete Suggestions Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && filteredSuggestions.length > 0 && (
              <motion.div
                className="suggestions-dropdown"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {filteredSuggestions.map((sug, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={sug.id}
                      type="button"
                      className={`suggestion-item ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectSuggestion(sug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="suggestion-left">
                        <Music size={14} className="sug-music-icon" />
                        <span className="sug-title">{sug.title}</span>
                      </div>
                      <div className="suggestion-right">
                        <span className="sug-region-badge">
                          <MapPin size={11} style={{ display: 'inline', marginRight: 2 }} />
                          {sug.regionName}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button type="submit" className="btn-primary guess-submit-btn" disabled={choiceStatus !== 'idle'}>
          <Send size={15} style={{ display: 'inline', marginRight: 6 }} />
          Guess
        </button>
      </form>

      {/* Interactive Hint Trigger Button */}
      <div className="hints-action-area">
        <button
          type="button"
          className="btn-hint-trigger"
          onClick={handleRevealHint}
          disabled={!hasRemainingHints || choiceStatus !== 'idle'}
        >
          <Lightbulb size={15} />
          <span>
            {unlockedHints.length === 0
              ? 'Get a Hint'
              : hasRemainingHints
              ? `Get Another Hint (${unlockedHints.length}/${allPossibleHints.length})`
              : 'All Hints Revealed'}
          </span>
        </button>

        {/* Display Revealed Hints as Rich Cards */}
        {unlockedHints.length > 0 && (
          <div className="unlocked-hints-list">
            {unlockedHints.map((hint, idx) => (
              <div key={idx} className="hint-card-revealed">
                <div className="hint-card-header">
                  <Sparkles size={13} className="hint-icon" />
                  <span className="hint-type">{hint.label}</span>
                </div>
                <div className="hint-value">{hint.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
