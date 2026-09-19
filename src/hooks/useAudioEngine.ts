import { useRef, useState, useEffect, useCallback } from 'react';

export function useAudioEngine(unlockedLimit: number, playMode: 'beginning' | 'middle' = 'beginning') {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Always keep refs up-to-date with current settings
  const unlockedLimitRef = useRef(unlockedLimit);
  useEffect(() => {
    unlockedLimitRef.current = unlockedLimit;
  }, [unlockedLimit]);

  const playModeRef = useRef(playMode);
  useEffect(() => {
    playModeRef.current = playMode;
  }, [playMode]);

  const durationRef = useRef(duration);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Helper to compute start offset in seconds
  const getStartOffset = useCallback(() => {
    if (playModeRef.current === 'middle') {
      const dur = audioRef.current?.duration || durationRef.current;
      if (dur && Number.isFinite(dur) && dur > 0) {
        return Math.floor(dur / 2);
      }
    }
    return 0;
  }, []);

  // Setup Web Audio API on user action
  const initAudioGraph = useCallback(() => {
    if (!audioCtxRef.current && audioRef.current) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;

        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
      } catch (err) {
        console.warn('Web Audio API warning:', err);
      }
    }
  }, []);

  // Initialize audio element and attach robust native event listeners
  const getOrCreateAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';

      // Duration loaded
      audio.onloadedmetadata = () => {
        const dur = audio.duration || 0;
        setDuration(dur);
        durationRef.current = dur;
        if (playModeRef.current === 'middle' && dur > 0) {
          audio.currentTime = Math.floor(dur / 2);
        } else {
          audio.currentTime = 0;
        }
        setCurrentTime(0);
      };

      // Enforce limit on native timeupdate
      audio.ontimeupdate = () => {
        const offset = getStartOffset();
        const cur = audio.currentTime;
        const rel = Math.max(0, cur - offset);
        setCurrentTime(rel);

        const limit = unlockedLimitRef.current;
        const maxPos = offset + limit;
        if (cur >= maxPos || rel >= limit) {
          audio.pause();
          audio.currentTime = maxPos;
          setCurrentTime(limit);
          setIsPlaying(false);
        }
      };

      // Native play event
      audio.onplay = () => {
        initAudioGraph();
        const offset = getStartOffset();
        const limit = unlockedLimitRef.current;
        const maxPos = offset + limit;
        if (audio.currentTime < offset || audio.currentTime >= maxPos) {
          audio.currentTime = offset;
          setCurrentTime(0);
        }
        setIsPlaying(true);
      };

      // Native pause event
      audio.onpause = () => {
        setIsPlaying(false);
      };

      // Clamp seeking beyond bounds
      audio.onseeking = () => {
        const offset = getStartOffset();
        const limit = unlockedLimitRef.current;
        const maxPos = offset + limit;
        if (audio.currentTime < offset) {
          audio.currentTime = offset;
        } else if (audio.currentTime > maxPos) {
          audio.currentTime = maxPos;
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audioRef.current = audio;
    }
    return audioRef.current;
  }, [initAudioGraph, getStartOffset]);

  const loadTrack = useCallback((url: string) => {
    const audio = getOrCreateAudio();
    audio.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    durationRef.current = 0;
    audio.currentTime = 0;
    audio.src = url;
    audio.load();
  }, [getOrCreateAudio]);

  // When playMode changes, pause and reset playback position to new start offset
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      const offset = getStartOffset();
      audio.currentTime = offset;
      setCurrentTime(0);
    }
  }, [playMode, getStartOffset]);

  // Suspend AudioContext to release hardware audio thread and AVCTP/SMTC polling
  const suspendAudioGraph = useCallback(() => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend().catch(() => {});
    }
  }, []);

  // High-precision frame ticker (requestAnimationFrame) to enforce exact audio limit cutoff
  useEffect(() => {
    let rafId: number;
    let lastReportedTime = 0;

    const checkLimit = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        const offset = getStartOffset();
        const cur = audio.currentTime;
        const rel = Math.max(0, cur - offset);
        
        // Only trigger state update when delta is noticeable (>= 0.05s) to prevent spamming renders
        if (Math.abs(rel - lastReportedTime) >= 0.05) {
          lastReportedTime = rel;
          setCurrentTime(rel);
        }

        const limit = unlockedLimitRef.current;
        const maxPos = offset + limit;
        if (cur >= maxPos || rel >= limit) {
          audio.pause();
          audio.currentTime = maxPos;
          setCurrentTime(limit);
          setIsPlaying(false);
          suspendAudioGraph();
          return;
        }
        rafId = requestAnimationFrame(checkLimit);
      }
    };

    if (isPlaying) {
      rafId = requestAnimationFrame(checkLimit);
    } else {
      suspendAudioGraph();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPlaying, getStartOffset, suspendAudioGraph]);

  const togglePlay = useCallback(async () => {
    const audio = getOrCreateAudio();
    initAudioGraph();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      suspendAudioGraph();
    } else {
      try {
        const offset = getStartOffset();
        const maxPos = offset + unlockedLimitRef.current;
        if (audio.currentTime < offset || audio.currentTime >= maxPos) {
          audio.currentTime = offset;
          setCurrentTime(0);
        }
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error('Play error:', e);
      }
    }
  }, [initAudioGraph, getOrCreateAudio, getStartOffset, suspendAudioGraph]);

  const replay = useCallback(async () => {
    const audio = getOrCreateAudio();
    initAudioGraph();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    const offset = getStartOffset();
    audio.currentTime = offset;
    setCurrentTime(0);
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.error('Replay error:', e);
    }
  }, [initAudioGraph, getOrCreateAudio, getStartOffset]);

  const continuePlayFromCurrent = useCallback(async () => {
    const audio = getOrCreateAudio();
    initAudioGraph();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {
      console.error('Continue play error:', e);
    }
  }, [initAudioGraph, getOrCreateAudio]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      suspendAudioGraph();
    }
  }, [suspendAudioGraph]);

  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current) return new Uint8Array(18);
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    loadTrack,
    togglePlay,
    replay,
    continuePlayFromCurrent,
    stop,
    getFrequencyData
  };
}
