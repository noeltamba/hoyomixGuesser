import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { VinylPlayer } from './components/AudioPlayer/VinylPlayer';
import { StageProgress, StageRegion } from './components/Quiz/StageRegion';
import { StageSubArea } from './components/Quiz/StageSubArea';
import { StageContext } from './components/Quiz/StageContext';
import { StageTitleGuess } from './components/Quiz/StageTitleGuess';
import { ResultModal } from './components/Quiz/ResultModal';
import { FeedbackBanner } from './components/Quiz/FeedbackBanner';
import { useGameState } from './hooks/useGameState';
import { useAudioEngine } from './hooks/useAudioEngine';

export const App: React.FC = () => {
  const {
    selectedGame,
    setSelectedGame,
    currentTrack,
    stage,
    segmentIndex,
    currentSegmentLimit,
    feedback,
    isVictory,
    endStatus,
    correctCount,
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
  } = useGameState();

  const {
    isPlaying,
    currentTime,
    loadTrack,
    togglePlay,
    continuePlayFromCurrent,
    stop,
    getFrequencyData
  } = useAudioEngine(currentSegmentLimit, playMode);

  // When track changes, load audio and reset player
  useEffect(() => {
    if (currentTrack) {
      loadTrack(currentTrack.audioUrl);
    }
  }, [currentTrack, loadTrack]);

  const handleNextTrack = () => {
    stop();
    pickNewTrack(selectedGame);
  };

  const handleRestartGame = () => {
    stop();
    restartGame();
  };

  const handleSkipSegment = () => {
    const canSkip = skipOrAdvanceSegment();
    if (canSkip) {
      continuePlayFromCurrent();
    }
  };

  return (
    <div className="app-container">
      {/* Header with Game Switcher */}
      <Header
        selectedGame={selectedGame}
        onSelectGame={setSelectedGame}
      />

      {/* Enlarged Audio Player Card */}
      <VinylPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        segmentIndex={segmentIndex}
        playMode={playMode}
        onChangePlayMode={setPlayMode}
        onTogglePlay={togglePlay}
        onSkipSegment={handleSkipSegment}
        onGiveUp={giveUp}
        getFrequencyData={getFrequencyData}
      />

      {/* Main Quiz Card */}
      <main className="glass-card quiz-main-card">
        {/* Dedicated Feedback Slot so card doesn't jump when error appears */}
        <div className="feedback-slot-fixed">
          <FeedbackBanner feedback={feedback} />
        </div>

        {/* Top Info Bar: Stage Progress right above questions */}
        <div className="quiz-top-bar">
          <StageProgress currentStage={stage} />
        </div>

        {/* Question Header */}
        <div className="question-header">
          <h2 className="question-title">
            {stage === 1 && 'Which Region does this track belong to?'}
            {stage === 2 && 'Which specific Area does this music play in?'}
            {stage === 3 && 'What is the mood or context of this soundtrack?'}
            {(stage === 4 || stage === 5) && 'Can you name the exact track title?'}
          </h2>
          <span className="question-subtitle">Stage {stage} of 4</span>
        </div>

        {/* Centered Options Section */}
        <div className={`stage-body-centered ${isTransitioning ? 'stage-slide-out' : 'stage-slide-in'}`}>
          {stage === 1 && (
            <StageRegion
              gameId={selectedGame}
              selectedChoice={selectedChoice}
              choiceStatus={choiceStatus}
              onSelectRegion={guessRegion}
            />
          )}

          {stage === 2 && currentTrack && (
            <StageSubArea
              gameId={selectedGame}
              regionId={currentTrack.regionId}
              targetSubAreaId={currentTrack.subAreaId}
              selectedChoice={selectedChoice}
              choiceStatus={choiceStatus}
              onSelectSubArea={guessSubArea}
            />
          )}

          {stage === 3 && (
            <StageContext
              selectedChoice={selectedChoice}
              choiceStatus={choiceStatus}
              onSelectContext={guessContext}
            />
          )}

          {(stage === 4 || stage === 5) && currentTrack && (
            <StageTitleGuess
              track={currentTrack}
              selectedChoice={selectedChoice}
              choiceStatus={choiceStatus}
              onGuessTitle={guessTitle}
            />
          )}
        </div>
      </main>

      {/* Result Modal Pop Up */}
      {stage === 5 && currentTrack && (
        <ResultModal
          track={currentTrack}
          isVictory={isVictory}
          endStatus={endStatus}
          correctCount={correctCount}
          guessedSec={guessedSec}
          onNextTrack={handleNextTrack}
          onRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
};
