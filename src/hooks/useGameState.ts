import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameId, StageId, Track, FeedbackState } from '../data/types';
import { TRACKS } from '../data/tracks';
import { playSoundEffect } from '../utils/soundEffects';

export const SEGMENTS = [3, 6, 10, 15, 30] as const;

export type EndStatus = 'guessed' | 'give_up' | 'didnt_guessed';

export function useGameState() {
  const [selectedGame, setSelectedGame] = useState<GameId>('genshin');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [stage, setStage] = useState<StageId>(1);
  const [solvedStages, setSolvedStages] = useState<number>(0);
  const [guessedSec, setGuessedSec] = useState<number>(3);

  // Segment index: 0 -> 3s, 1 -> 6s, 2 -> 10s, 3 -> 15s, 4 -> 30s
  const [segmentIndex, setSegmentIndex] = useState<number>(0);
  const [playedTrackIds, setPlayedTrackIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [endStatus, setEndStatus] = useState<EndStatus | null>(null);

  // Animation transition state
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [choiceStatus, setChoiceStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Playback start mode: 'beginning' (0:00) or 'middle' (halfway through track)
  const [playMode, setPlayModeState] = useState<'beginning' | 'middle'>('beginning');

  const setPlayMode = useCallback((mode: 'beginning' | 'middle') => {
    setPlayModeState(mode);
    setSegmentIndex(0); // Reset segment back to start on switch
  }, []);

  const currentSegmentLimit = SEGMENTS[segmentIndex];
  const isMaxSegment = segmentIndex === SEGMENTS.length - 1;

  // Pick random track
  const pickNewTrack = useCallback((gameId: GameId = selectedGame) => {
    const gameTracks = TRACKS.filter((t) => t.gameId === gameId);
    if (gameTracks.length === 0) {
      setCurrentTrack(null);
      return;
    }

    let unplayed = gameTracks.filter((t) => !playedTrackIds.includes(t.id));
    if (unplayed.length === 0) {
      setPlayedTrackIds([]);
      unplayed = gameTracks;
    }

    const randomIndex = Math.floor(Math.random() * unplayed.length);
    const chosen = unplayed[randomIndex];
    setCurrentTrack(chosen);
    setPlayedTrackIds((prev) => [...prev, chosen.id]);
    setStage(1);
    setSolvedStages(0);
    setGuessedSec(3);
    setSegmentIndex(0);
    setFeedback(null);
    setSelectedChoice(null);
    setChoiceStatus('idle');
    setIsTransitioning(false);
    setIsGameOver(false);
    setIsVictory(false);
    setEndStatus(null);
  }, [selectedGame, playedTrackIds]);

  // Initial load
  useEffect(() => {
    pickNewTrack(selectedGame);
  }, [selectedGame]);

  const showFeedback = (type: 'correct' | 'wrong' | 'info', message: string, subMessage?: string) => {
    setFeedback({ type, message, subMessage });
  };

  // Next segment / Skip segment action
  const skipOrAdvanceSegment = useCallback(() => {
    if (segmentIndex < SEGMENTS.length - 1) {
      setSegmentIndex((prev) => prev + 1);
      return true;
    }
    return false;
  }, [segmentIndex]);

  const handleWrongChoice = (choiceId: string, expectedHint: string) => {
    setSelectedChoice(choiceId);
    setChoiceStatus('wrong');
    playSoundEffect('wrong');

    // If already at 30s (last segment) and still wrong -> Auto Game Over "Didn't Guessed"
    if (segmentIndex >= SEGMENTS.length - 1) {
      setGuessedSec(SEGMENTS[segmentIndex]);
      showFeedback('wrong', "Didn't Guessed", `The track was "${currentTrack?.title}".`);
      setTimeout(() => {
        setEndStatus('didnt_guessed');
        setIsGameOver(true);
        setStage(5);
        setChoiceStatus('idle');
        setSelectedChoice(null);
      }, 800);
      return;
    }

    // Auto-advance segment if available
    setSegmentIndex((prev) => prev + 1);

    showFeedback('wrong', 'Incorrect', `Hint: ${expectedHint}`);

    // Reset shake state after animation ends
    setTimeout(() => {
      setChoiceStatus('idle');
      setSelectedChoice(null);
    }, 800);
  };

  const handleCorrectChoice = (choiceId: string, nextStage: StageId) => {
    setSelectedChoice(choiceId);
    setChoiceStatus('correct');
    playSoundEffect('correct');
    setFeedback(null);

    // Update how many stages have been correctly solved
    const newSolved = (nextStage - 1);
    setSolvedStages(newSolved);

    // Hold green for 1.0s (1 detik), then trigger slide out animation
    setTimeout(() => {
      setIsTransitioning(true);

      // Slide to next stage after slide out
      setTimeout(() => {
        setStage(nextStage);
        setSelectedChoice(null);
        setChoiceStatus('idle');
        setIsTransitioning(false);

        if (nextStage === 5) {
          setIsVictory(true);
          setEndStatus('guessed');
          setGuessedSec(SEGMENTS[segmentIndex]);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }, 300);
    }, 1000);
  };

  // Stage 1: Region Guess
  const guessRegion = (regionId: string) => {
    if (!currentTrack || choiceStatus !== 'idle') return;
    if (regionId === currentTrack.regionId) {
      handleCorrectChoice(regionId, 2);
    } else {
      handleWrongChoice(regionId, 'Check regional instruments.');
    }
  };

  // Stage 2: SubArea Guess
  const guessSubArea = (subAreaId: string) => {
    if (!currentTrack || choiceStatus !== 'idle') return;
    if (subAreaId === currentTrack.subAreaId) {
      handleCorrectChoice(subAreaId, 3);
    } else {
      handleWrongChoice(subAreaId, 'Check area theme.');
    }
  };

  // Stage 3: Context Guess
  const guessContext = (contextId: string) => {
    if (!currentTrack || choiceStatus !== 'idle') return;
    if (contextId === currentTrack.timeContext) {
      handleCorrectChoice(contextId, 4);
    } else {
      handleWrongChoice(contextId, 'Check tempo and mood.');
    }
  };

  // Stage 4: Title Guess
  const guessTitle = (titleInput: string) => {
    if (!currentTrack || choiceStatus !== 'idle') return;
    let cleanInput = titleInput.trim();
    if (cleanInput.includes(' - ')) {
      cleanInput = cleanInput.split(' - ')[0].trim();
    }
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanActual = currentTrack.title;

    if (normalize(cleanInput) === normalize(cleanActual)) {
      handleCorrectChoice('title_input', 5);
    } else {
      handleWrongChoice('title_input', `"${titleInput}" is not the correct title! Check the hints.`);
    }
  };

  // Give up action
  const giveUp = () => {
    setGuessedSec(SEGMENTS[segmentIndex]);
    setEndStatus('give_up');
    setIsGameOver(true);
    setStage(5);
    showFeedback('wrong', 'Given Up', `The track was "${currentTrack?.title}".`);
  };

  const restartGame = () => {
    pickNewTrack(selectedGame);
  };

  return {
    selectedGame,
    setSelectedGame,
    currentTrack,
    stage,
    segmentIndex,
    currentSegmentLimit,
    isMaxSegment,
    feedback,
    isGameOver,
    isVictory,
    endStatus,
    correctCount: solvedStages,
    guessedSec,
    selectedChoice,
    choiceStatus,
    isTransitioning,
    playMode,
    setPlayMode,
    guessRegion,
    guessSubArea,
    guessContext,
    guessTitle,
    skipOrAdvanceSegment,
    giveUp,
    pickNewTrack,
    restartGame
  };
}
