// Web Audio Engine & Synthesizer Fallback for HOYO-MiX OST Guesser

class HoyoAudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.currentTrack = null;
    this.maxDuration = 10; // default 10 seconds snippet
    this.playbackTimer = null;
    this.synthInterval = null;
    this.isUsingSynthFallback = false;
    this.onEndedCallback = null;
    this.onTimeUpdateCallback = null;

    this.initAudioElement();
  }

  initAudioElement() {
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.preload = 'auto';

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.audioElement.currentTime, this.maxDuration);
      }
      if (this.audioElement.currentTime >= this.maxDuration) {
        this.pause();
        if (this.onEndedCallback) this.onEndedCallback();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      if (this.onEndedCallback) this.onEndedCallback();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio playback error on source:', this.audioElement.src, e);
    });
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);

      try {
        if (!this.sourceNode) {
          this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
          this.sourceNode.connect(this.analyser);
          this.analyser.connect(this.gainNode);
          this.gainNode.connect(this.audioContext.destination);
        }
      } catch (err) {
        console.warn('MediaElementSource link bypassed or already attached', err);
      }
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  loadTrack(track, maxDuration = 10) {
    this.stop();
    this.currentTrack = track;
    this.maxDuration = maxDuration;
    this.audioElement.src = encodeURI(track.audioUrl);
    this.audioElement.load();
  }

  setSnippetDuration(duration) {
    this.maxDuration = duration;
  }

  play() {
    this.ensureAudioContext();
    this.isPlaying = true;

    if (this.audioElement.src) {
      this.audioElement.currentTime = 0;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Playback error:', err);
        });
      }
    }
  }

  pause() {
    this.isPlaying = false;
    this.audioElement.pause();
  }

  stop() {
    this.pause();
    this.audioElement.currentTime = 0;
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(16);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

window.hoyoAudioEngine = new HoyoAudioEngine();
