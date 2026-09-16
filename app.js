// Main Game Engine & Controller for HOYO-MiX OST Guesser

(function () {
  const { GAMES_DATA, GENSHIN_TRACKS, TIME_CONTEXTS } = window.HOYOMIX_DATA;
  const audio = window.hoyoAudioEngine;

  // Game State
  let currentGameId = 'genshin';
  let currentTrack = null;
  let currentStage = 1; // 1: Region, 2: Sub-Area, 3: Time/Context, 4: Title Guess, 5: Finished
  let streak = 0;
  let hearts = 3;
  let playedTrackIds = [];
  let availableSnippetDuration = 6; // Starts at 6s, unlocks up to 15s on mistake
  let visualizerAnimFrame = null;

  // DOM Elements
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const vinylDisc = document.getElementById('vinyl-disc');
  const progressFill = document.getElementById('progress-fill');
  const timeCurrentEl = document.getElementById('time-current');
  const timeTotalEl = document.getElementById('time-total');
  const visualizerContainer = document.getElementById('visualizer-bars');
  const streakCountEl = document.getElementById('streak-count');
  const heartsCountEl = document.getElementById('hearts-count');
  const gameTabs = document.querySelectorAll('.game-tab');
  const stageContentEl = document.getElementById('stage-content');
  const feedbackContainer = document.getElementById('feedback-container');
  const extendSnippetBtn = document.getElementById('extend-snippet-btn');
  const replayBtn = document.getElementById('replay-btn');

  // Initialize visualizer bars
  function initVisualizer() {
    visualizerContainer.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const bar = document.createElement('div');
      bar.className = 'v-bar';
      visualizerContainer.appendChild(bar);
    }
  }

  function updateVisualizer() {
    if (audio.isPlaying) {
      const data = audio.getFrequencyData();
      const bars = visualizerContainer.querySelectorAll('.v-bar');
      bars.forEach((bar, index) => {
        let val = data[index % data.length] || 10;
        let height = Math.max(4, (val / 255) * 44);
        bar.style.height = `${height}px`;
      });
    } else {
      const bars = visualizerContainer.querySelectorAll('.v-bar');
      bars.forEach(b => b.style.height = '4px');
    }
    visualizerAnimFrame = requestAnimationFrame(updateVisualizer);
  }

  // Audio Engine Hookups
  audio.onTimeUpdateCallback = (current, total) => {
    const curSec = Math.min(current, total);
    timeCurrentEl.textContent = `${curSec.toFixed(1)}s`;
    timeTotalEl.textContent = `${total.toFixed(0)}s`;
    const percent = Math.min(100, (curSec / total) * 100);
    progressFill.style.width = `${percent}%`;
  };

  audio.onEndedCallback = () => {
    playIcon.textContent = '▶';
    vinylDisc.classList.remove('playing');
  };

  function togglePlay() {
    if (audio.isPlaying) {
      audio.pause();
      playIcon.textContent = '▶';
      vinylDisc.classList.remove('playing');
    } else {
      audio.play();
      playIcon.textContent = '⏸';
      vinylDisc.classList.add('playing');
    }
  }

  // Pick Random Track (Murni Diacak setiap reload / F5)
  function pickRandomTrack() {
    const pool = GENSHIN_TRACKS.filter(t => !playedTrackIds.includes(t.id));
    if (pool.length === 0) {
      playedTrackIds = [];
      const randIdx = Math.floor(Math.random() * GENSHIN_TRACKS.length);
      const chosen = GENSHIN_TRACKS[randIdx];
      playedTrackIds.push(chosen.id);
      return chosen;
    }
    const randIdx = Math.floor(Math.random() * pool.length);
    const selected = pool[randIdx];
    playedTrackIds.push(selected.id);
    return selected;
  }

  function startNewRound() {
    currentTrack = pickRandomTrack();
    currentStage = 1;
    availableSnippetDuration = 6;
    clearFeedback();
    
    audio.loadTrack(currentTrack, availableSnippetDuration);
    timeCurrentEl.textContent = '0.0s';
    timeTotalEl.textContent = `${availableSnippetDuration}s`;
    progressFill.style.width = '0%';
    playIcon.textContent = '▶';
    vinylDisc.classList.remove('playing');

    updateStepperUI();
    renderCurrentStage();

    // Auto-play snippet for immersive experience
    setTimeout(() => {
      togglePlay();
    }, 400);
  }

  // Stepper UI
  function updateStepperUI() {
    for (let i = 1; i <= 4; i++) {
      const stepEl = document.getElementById(`step-${i}`);
      if (!stepEl) continue;
      stepEl.classList.remove('active', 'completed');

      if (i < currentStage) {
        stepEl.classList.add('completed');
        stepEl.querySelector('.step-number').textContent = '✓';
      } else if (i === currentStage) {
        stepEl.classList.add('active');
        stepEl.querySelector('.step-number').textContent = `${i}`;
      } else {
        stepEl.querySelector('.step-number').textContent = `${i}`;
      }
    }
  }

  function showFeedback(msg, isSuccess = false) {
    feedbackContainer.innerHTML = `
      <div class="feedback-banner ${isSuccess ? 'success' : 'error'}">
        <span>${isSuccess ? '✨' : '❌'}</span>
        <span>${msg}</span>
      </div>
    `;
  }

  function clearFeedback() {
    feedbackContainer.innerHTML = '';
  }

  function handleMistake(hintMessage) {
    hearts--;
    heartsCountEl.textContent = '❤️'.repeat(Math.max(0, hearts)) + '🖤'.repeat(Math.max(0, 3 - hearts));
    
    // Unlock more audio snippet as hint (+4 seconds)
    availableSnippetDuration = Math.min(20, availableSnippetDuration + 4);
    audio.setSnippetDuration(availableSnippetDuration);
    timeTotalEl.textContent = `${availableSnippetDuration}s`;

    showFeedback(`${hintMessage} Nyawa berkurang! Durasi cuplikan diperpanjang menjadi ${availableSnippetDuration}s. Coba dengar lagi!`, false);
    
    // Replay audio
    audio.play();
    playIcon.textContent = '⏸';
    vinylDisc.classList.add('playing');

    if (hearts <= 0) {
      setTimeout(() => {
        alert('💔 Game Over! Nyawa kamu habis. Streak kamu di-reset.');
        streak = 0;
        hearts = 3;
        streakCountEl.textContent = streak;
        heartsCountEl.textContent = '❤️❤️❤️';
        startNewRound();
      }, 1000);
    }
  }

  // Stage 1: Region Selection
  function renderStage1() {
    const game = GAMES_DATA[currentGameId];
    let buttonsHtml = game.regions.map(reg => `
      <button class="region-btn" data-id="${reg.id}" style="border-color: ${reg.color}40;">
        <span class="reg-icon">${reg.icon}</span>
        <span class="reg-name" style="color: ${reg.color}">${reg.name}</span>
        <span class="reg-element">${reg.element || ''}</span>
      </button>
    `).join('');

    stageContentEl.innerHTML = `
      <div class="stage-card">
        <div class="stage-header">
          <span class="stage-tag">Tahap 1 / 4 • Wilayah Teyvat</span>
          <h2 class="stage-title">Dengarkan lagunya! Di Region mana OST ini berada?</h2>
          <p class="stage-desc">Pilih satu dari 7 Wilayah utama Teyvat yang menjadi asal alunan musik ini.</p>
        </div>
        <div class="region-grid">
          ${buttonsHtml}
        </div>
      </div>
    `;

    stageContentEl.querySelectorAll('.region-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedRegion = btn.getAttribute('data-id');
        if (selectedRegion === currentTrack.regionId) {
          showFeedback('🎉 Tepat sekali! Region berhasil ditebak. Lanjut ke Sub-Area / Kota.', true);
          currentStage = 2;
          updateStepperUI();
          setTimeout(renderCurrentStage, 500);
        } else {
          const guessedRegName = game.regions.find(r => r.id === selectedRegion)?.name;
          handleMistake(`Bukan dari wilayah ${guessedRegName}.`);
        }
      });
    });
  }

  // Stage 2: Sub-Area Selection
  function renderStage2() {
    const game = GAMES_DATA[currentGameId];
    const region = game.regions.find(r => r.id === currentTrack.regionId);
    
    let chipsHtml = region.subAreas.map(sub => `
      <button class="subarea-btn" data-id="${sub.id}">
        <span>📍</span>
        <span>${sub.name}</span>
      </button>
    `).join('');

    stageContentEl.innerHTML = `
      <div class="stage-card">
        <div class="stage-header">
          <span class="stage-tag">Tahap 2 / 4 • Lokasi Spesifik (${region.name})</span>
          <h2 class="stage-title">Di area / kota manakah lagu ini diputar?</h2>
          <p class="stage-desc">Kamu sudah benar di <strong>${region.name}</strong>. Sekarang persempit lokasinya!</p>
        </div>
        <div class="subarea-grid">
          ${chipsHtml}
        </div>
      </div>
    `;

    stageContentEl.querySelectorAll('.subarea-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedSub = btn.getAttribute('data-id');
        if (selectedSub === currentTrack.subAreaId) {
          showFeedback('✨ Luar biasa! Lokasi spesifik tepat. Sekarang tentukan suasananya!', true);
          currentStage = 3;
          updateStepperUI();
          setTimeout(renderCurrentStage, 500);
        } else {
          const subName = region.subAreas.find(s => s.id === selectedSub)?.name;
          handleMistake(`Bukan di ${subName}.`);
        }
      });
    });
  }

  // Stage 3: Time & Context Selection
  function renderStage3() {
    let optionsHtml = TIME_CONTEXTS.map(ctx => `
      <button class="context-btn" data-id="${ctx.id}">
        <div class="context-btn-top">
          <span>${ctx.icon}</span>
          <span>${ctx.name}</span>
        </div>
        <div class="context-desc">${ctx.desc}</div>
      </button>
    `).join('');

    stageContentEl.innerHTML = `
      <div class="stage-card">
        <div class="stage-header">
          <span class="stage-tag">Tahap 3 / 4 • Waktu & Konteks Lagu</span>
          <h2 class="stage-title">Kapan / pada situasi apa lagu ini berbunyi?</h2>
          <p class="stage-desc">Apakah ini lagu Siang hari yang cerah, Malam yang tenang, Pertarungan, atau Tempat Tertutup?</p>
        </div>
        <div class="context-grid">
          ${optionsHtml}
        </div>
      </div>
    `;

    stageContentEl.querySelectorAll('.context-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedCtx = btn.getAttribute('data-id');
        if (selectedCtx === currentTrack.timeContext) {
          showFeedback('🔥 Sempurna! Semua konteks lagu sudah benar. Siap menebak judul lagunya?', true);
          currentStage = 4;
          updateStepperUI();
          setTimeout(renderCurrentStage, 500);
        } else {
          const ctxObj = TIME_CONTEXTS.find(c => c.id === selectedCtx);
          handleMistake(`Suasana/Waktunya bukan ${ctxObj.name}.`);
        }
      });
    });
  }

  // Stage 4: Song Title Guessing (Autocomplete Search)
  function renderStage4() {
    stageContentEl.innerHTML = `
      <div class="stage-card">
        <div class="stage-header">
          <span class="stage-tag">Tahap 4 / 4 (Final) • Tebak Judul OST</span>
          <h2 class="stage-title">Apa Judul Resmi Lagu Ini?</h2>
          <p class="stage-desc">Ketik sebagian judul lagu untuk melihat rekomendasi autocomplete, atau lewati jika sudah puas!</p>
        </div>
        <div class="title-guess-wrap">
          <div class="input-container">
            <input type="text" id="title-search-input" class="search-input" placeholder="Contoh: A Day in Mondstadt, Hustle and Bustle..." autocomplete="off" />
            <button id="submit-guess-btn" class="submit-guess-btn">Tebak! 🎯</button>
          </div>
          <div id="autocomplete-list" class="autocomplete-dropdown"></div>
          <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
            <button id="skip-title-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; text-decoration: underline; font-size: 0.85rem;">
              Buka Jawaban & Selesaikan Ronde ➡️
            </button>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('title-search-input');
    const dropdown = document.getElementById('autocomplete-list');
    const submitBtn = document.getElementById('submit-guess-btn');
    const skipBtn = document.getElementById('skip-title-btn');

    // Autocomplete filter
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length === 0) {
        dropdown.classList.remove('show');
        return;
      }

      const matches = GENSHIN_TRACKS.filter(t => t.title.toLowerCase().includes(q));
      if (matches.length > 0) {
        dropdown.innerHTML = matches.map(m => `<div class="autocomplete-item" data-title="${m.title}">${m.title} <span style="color:var(--text-dim);font-size:0.75rem;">(${m.album})</span></div>`).join('');
        dropdown.classList.add('show');

        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
          item.addEventListener('click', () => {
            input.value = item.getAttribute('data-title');
            dropdown.classList.remove('show');
          });
        });
      } else {
        dropdown.classList.remove('show');
      }
    });

    const checkGuess = () => {
      const val = input.value.trim().toLowerCase();
      if (val === currentTrack.title.toLowerCase()) {
        finishRound(true);
      } else {
        handleMistake('Judul lagu kurang tepat!');
      }
    };

    submitBtn.addEventListener('click', checkGuess);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkGuess();
    });

    skipBtn.addEventListener('click', () => finishRound(false));
  }

  // Victory / Round Summary Card
  function finishRound(guessedTitle) {
    currentStage = 5;
    streak++;
    streakCountEl.textContent = streak;

    const game = GAMES_DATA[currentGameId];
    const region = game.regions.find(r => r.id === currentTrack.regionId);
    const subArea = region.subAreas.find(s => s.id === currentTrack.subAreaId);
    const ctx = TIME_CONTEXTS.find(c => c.id === currentTrack.timeContext);

    clearFeedback();

    stageContentEl.innerHTML = `
      <div class="result-card">
        <div class="result-badge">${guessedTitle ? '👑' : '⭐'}</div>
        <h2 class="result-title">${guessedTitle ? 'SEMPURNA! 100% TEBAKAN TEPAT!' : 'RONDE SELESAI!'}</h2>
        <p style="color: var(--accent-gold); font-size: 1.15rem; font-weight: 700;">🎵 "${currentTrack.title}"</p>
        
        <div class="result-details">
          <div class="result-detail-row">
            <span class="result-detail-label">Album / OST</span>
            <span class="result-detail-val">${currentTrack.album}</span>
          </div>
          <div class="result-detail-row">
            <span class="result-detail-label">Komposer</span>
            <span class="result-detail-val">${currentTrack.composer || 'HOYO-MiX'}</span>
          </div>
          <div class="result-detail-row">
            <span class="result-detail-label">Wilayah (Region)</span>
            <span class="result-detail-val">${region.name} (${region.element})</span>
          </div>
          <div class="result-detail-row">
            <span class="result-detail-label">Sub-Area / Landmark</span>
            <span class="result-detail-val">${subArea ? subArea.name : '-'}</span>
          </div>
          <div class="result-detail-row">
            <span class="result-detail-label">Waktu / Situasi</span>
            <span class="result-detail-val">${ctx ? `${ctx.icon} ${ctx.name}` : '-'}</span>
          </div>
          <div class="result-detail-row" style="flex-direction: column; gap: 0.25rem; margin-top: 0.35rem;">
            <span class="result-detail-label">Deskripsi Musik:</span>
            <span style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.4;">${currentTrack.description}</span>
          </div>
        </div>

        <button id="next-track-btn" class="next-round-btn">
          Lagu Berikutnya ➔ (Streak: ${streak})
        </button>
      </div>
    `;

    document.getElementById('next-track-btn').addEventListener('click', () => {
      startNewRound();
    });
  }

  function renderCurrentStage() {
    clearFeedback();
    if (currentStage === 1) renderStage1();
    else if (currentStage === 2) renderStage2();
    else if (currentStage === 3) renderStage3();
    else if (currentStage === 4) renderStage4();
  }

  // Event Listeners
  playBtn.addEventListener('click', togglePlay);

  replayBtn.addEventListener('click', () => {
    audio.audioElement.currentTime = 0;
    audio.play();
    playIcon.textContent = '⏸';
    vinylDisc.classList.add('playing');
  });

  extendSnippetBtn.addEventListener('click', () => {
    availableSnippetDuration = Math.min(30, availableSnippetDuration + 5);
    audio.setSnippetDuration(availableSnippetDuration);
    timeTotalEl.textContent = `${availableSnippetDuration}s`;
    showFeedback(`Durasi snippet diperpanjang menjadi ${availableSnippetDuration}s!`, true);
    audio.play();
    playIcon.textContent = '⏸';
    vinylDisc.classList.add('playing');
  });

  // Game Switcher Tabs
  gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const gid = tab.getAttribute('data-game');
      if (gid !== 'genshin') {
        alert('🌟 Mode Honkai: Star Rail & Zenless Zone Zero akan segera ditambahkan! Saat ini mode uji coba Genshin Impact aktif.');
        return;
      }
    });
  });

  // Init App
  initVisualizer();
  updateVisualizer();
  startNewRound();
})();
