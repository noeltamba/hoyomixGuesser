// Audio Sound Effects Helper
// Plays sound effects from /sound_effect/ folder

const correctAudio = typeof Audio !== 'undefined' ? new Audio('/sound_effect/correct.wav') : null;
const wrongAudio = typeof Audio !== 'undefined' ? new Audio('/sound_effect/wrong.mp3') : null;

export const playSoundEffect = (type: 'correct' | 'wrong') => {
  try {
    const audio = type === 'correct' ? correctAudio : wrongAudio;
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.6; // comfortable SFX volume
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Auto-play policy or interrupted playback
          console.warn(`[SFX] Failed to play ${type} sound:`, err);
        });
      }
    }
  } catch (e) {
    console.warn('[SFX] Audio error:', e);
  }
};
