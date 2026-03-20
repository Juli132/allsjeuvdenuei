// game_script.js
import { eventPool } from "./events.js";
import { machineReactions, playerThoughts, getRandom, voidMessages, transmissions } from "./dialogue.js";
import { initPassiveSystems, checkCrisisThresholds } from "./passive_system.js";

// --- STATE ---
let gameState = {
  knowledge: 0,
  dictionary: {},
  planetHealth: 100,
  universeHealth: 100,
  strain: 0,
  wordUsage: {},
  cycles: 0,
  voidAttention: 0,  
  realityStability: 100,
  currentPhase: "NEUTRAL",
  hasEnding: false,
  transmissions: [],
  blessings: 0,
  curses: 0,
  cosmicCycle: 50,
  cycleDirection: 1,
  cycleVelocity: 1,
  lastSleepCycle: 0,     
  lastMeditateCycle: 0,
  deepMeditationActive: false,
  deepMeditationEndTime: 0
};

// --- HELPER FUNCTIONS ---
function getNetKarma() {
  return gameState.blessings - gameState.curses;
}

// --- FAINT SYSTEM ---
let faintActive = false;
let voidTimerCountdown = null;
let realityChaosInterval = null;

function triggerFaint() {
  if (faintActive || gameState.hasEnding) return;
  
  faintActive = true;
  const faintOverlay = document.getElementById("faint-overlay");
  const faintText = document.getElementById("faint-text");
  
  if (!faintOverlay) return;
  
  faintOverlay.classList.add("active");
  faintOverlay.style.opacity = "1";
  
  const faintMessages = [
    "C O N S C I O U S N E S S   F A D I N G . . .",
    "T H E   S T R A I N   T A K E S   Y O U . . .",
    "S L E E P   C O M E S . . .",
    "R E A L I T Y   D I S S O L V E S . . .",
    "Y O U   F A L L   I N T O   D A R K N E S S . . .",
    "T H E   S T A R S   G O   D I M . . .",
    "M I N D   C O L L A P S I N G . . .",
    "T H E   W E I G H T   I S   T O O   M U C H . . ."
  ];
  
  if (faintText) {
    faintText.textContent = getRandom(faintMessages);
    faintText.style.animation = 'none';
    faintText.offsetHeight;
    faintText.style.animation = 'fade-text 3s ease-out forwards';
  }
  
  setTimeout(() => {
    if (faintActive) {
      faintOverlay.classList.add("blink");
    }
  }, 2000);
  
  const input = document.getElementById("player-input");
  const submitBtn = document.getElementById("submit-btn");
  const actionButtons = ["learn-btn", "pray-btn", "sleep-btn", "meditate-btn", "deep-meditate-btn", "dict-btn"];
  
  if (input) input.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  actionButtons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) btn.disabled = true;
  });
  
  setTimeout(() => {
    recoverFromFaint();
  }, 5000);
}

function recoverFromFaint() {
  if (!faintActive) return;
  
  const faintOverlay = document.getElementById("faint-overlay");
  
  if (faintOverlay) {
    faintOverlay.classList.remove("blink");
    faintOverlay.style.transition = "opacity 1s ease";
    faintOverlay.style.opacity = "0";
    
    setTimeout(() => {
      faintOverlay.classList.remove("active");
      faintOverlay.style.opacity = "";
      faintOverlay.style.transition = "";
      
      const input = document.getElementById("player-input");
      const submitBtn = document.getElementById("submit-btn");
      const actionButtons = ["learn-btn", "pray-btn", "sleep-btn", "meditate-btn", "deep-meditate-btn", "dict-btn"];
      
      if (input && !gamePaused) input.disabled = false;
      if (submitBtn && !gamePaused) submitBtn.disabled = false;
      actionButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn && !gamePaused) btn.disabled = false;
      });
      
      if (input && !gamePaused) input.focus();
      
      addMessage("I wake up. Something changed.", "player");
      addMessage("The void feels much closer.", "machine");
      
      if (Math.random() < 0.4) {
        addMessage("I don't feel rested at all.", "player");
        gameState.strain = Math.min(100, gameState.strain + 15);
        updateStatsPanel();
      }
      
      faintActive = false;
    }, 1000);
  } else {
    faintActive = false;
  }
}

// --- AUDIO SYSTEM ---
let audioEnabled = true;
let audioCtx = null;
let audioInitialized = false;

function initAudio() {
  if (audioInitialized || !audioEnabled) return;
  
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioInitialized = true;
    console.log("Audio initialized");
    
    const resumeAudio = () => {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
        console.log("Audio context resumed");
      }
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keypress', resumeAudio);
    };
    
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keypress', resumeAudio);
  } catch(e) {
    console.log("Web Audio API not supported");
    audioEnabled = false;
  }
}

function playTypingSound() {
  if (!audioEnabled || !audioCtx || audioCtx.state !== 'running') return;
  
  try {
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 65 + Math.random() * 25;
    
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    filter.Q.value = 4;
    
    gainNode.gain.value = 0.02;
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    
    oscillator.start();
    oscillator.stop(now + 0.12);
  } catch(e) {
    console.log("Audio error:", e);
  }
}

function playErrorSound() {
  if (!audioEnabled || !audioCtx || audioCtx.state !== 'running') return;
  
  try {
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 98;
    oscillator.frequency.exponentialRampToValue(72, now + 0.6);
    
    filter.type = 'bandpass';
    filter.frequency.value = 180;
    filter.Q.value = 6;
    
    gainNode.gain.value = 0.08;
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    
    oscillator.start();
    oscillator.stop(now + 0.8);
  } catch(e) {
    console.log("Audio error:", e);
  }
}

// --- PAUSE SYSTEM ---
let gamePaused = false;
let pauseTimers = {
  voidTimer: null,
  transmissionTimer: null,
  cycleTimer: null,
  ambientTimer: null
};

function togglePause() {
  gamePaused = !gamePaused;
  const input = document.getElementById("player-input");
  const submitBtn = document.getElementById("submit-btn");
  
  const actionButtons = [
    "learn-btn", "pray-btn", "sleep-btn", 
    "meditate-btn", "deep-meditate-btn", "dict-btn"
  ];
  
  if (gamePaused) {
    addMessage("═══════════════════════════════", "machine");
    addMessage("      GAME PAUSED", "machine");
    addMessage("═══════════════════════════════", "machine");
    addMessage("Press ESC to resume.", "machine");
    addMessage("Type /quit to return to menu.", "machine");
    addMessage("═══════════════════════════════", "machine");
    
    if (input) {
      input.disabled = true;
      input.placeholder = "Game paused - press ESC to resume";
    }
    if (submitBtn) submitBtn.disabled = true;
    
    actionButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) btn.disabled = true;
    });
    
    if (pauseTimers.voidTimer) clearInterval(pauseTimers.voidTimer);
    if (pauseTimers.transmissionTimer) clearInterval(pauseTimers.transmissionTimer);
    if (pauseTimers.cycleTimer) clearInterval(pauseTimers.cycleTimer);
    if (pauseTimers.ambientTimer) clearInterval(pauseTimers.ambientTimer);
    
    if (window.passiveCleanup) {
      window.passiveCleanup(true);
    }
  } else {
    addMessage("═══════════════════════════════", "machine");
    addMessage("      GAME RESUMED", "machine");
    addMessage("═══════════════════════════════", "machine");
    
    if (input) {
      input.disabled = false;
      input.placeholder = "Type your command here...";
      input.focus();
    }
    if (submitBtn) submitBtn.disabled = false;
    
    actionButtons.forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) btn.disabled = false;
    });
    
    startTimers();
    startAmbientTimer();
    
    if (window.passiveCleanup) {
      window.passiveCleanup(false);
    }
  }
}

function quitToMenu() {
  addMessage("Returning to menu...", "machine");
  setTimeout(() => {
    if (pauseTimers.voidTimer) clearInterval(pauseTimers.voidTimer);
    if (pauseTimers.transmissionTimer) clearInterval(pauseTimers.transmissionTimer);
    if (pauseTimers.cycleTimer) clearInterval(pauseTimers.cycleTimer);
    if (pauseTimers.ambientTimer) clearInterval(pauseTimers.ambientTimer);
    
    const game = document.getElementById("game");
    if (game) game.style.display = "none";
    
    const menu = document.getElementById("menu");
    if (menu) menu.style.display = "flex";
    
    gamePaused = false;
  }, 1000);
}

// --- FLOW ---
let inputLocked = false;
let voidTimer = null;
let transmissionTimer = null;
let cycleTimer = null;    
let ambientTimer = null;

function lockInput(time = 1500) {
  inputLocked = true;
  const input = document.getElementById("player-input");
  if (input && !gamePaused) input.disabled = true;

  setTimeout(() => {
    inputLocked = false;
    if (input && !gamePaused) {
      input.disabled = false;
      input.focus();
    }
  }, time);
}

// --- UI ---
function addMessage(text, speaker = "machine") {
  const output = document.getElementById("output");
  if (!output) return;

  const div = document.createElement("div");
  div.style.marginBottom = "8px";
  div.style.opacity = "0";
  div.style.transition = "opacity 0.2s ease";
  div.setAttribute("data-speaker", speaker);
  div.textContent = text;

  output.appendChild(div);

  setTimeout(() => {
    div.style.opacity = "1";
  }, 20);

  while (output.children.length > 12) {
    output.removeChild(output.firstChild);
  }

  output.scrollTop = output.scrollHeight;
}

// --- STATS PANEL ---
function createStatsPanel() {
  if (document.getElementById("stats-panel")) return;

  const panel = document.createElement("div");
  panel.id = "stats-panel";

  panel.innerHTML = `
    <div class="stat-row">
      <div class="stat-label">KNOWLEDGE</div>
      <div class="stat-value" id="stat-knowledge">0</div>
    </div>
    <div class="stat-row">
      <div class="stat-label">PLANET</div>
      <div class="stat-value" id="stat-planet">100%</div>
      <div class="stat-bar"><div class="stat-fill" id="bar-planet" style="width:100%; background:#0f0;"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-label">UNIVERSE</div>
      <div class="stat-value" id="stat-universe">100%</div>
      <div class="stat-bar"><div class="stat-fill" id="bar-universe" style="width:100%; background:#0f0;"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-label">STRAIN</div>
      <div class="stat-value" id="stat-strain">0%</div>
      <div class="stat-bar"><div class="stat-fill" id="bar-strain" style="width:0%; background:#ff0;"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-label">VOID</div>
      <div class="stat-value" id="stat-void">0%</div>
      <div class="stat-bar"><div class="stat-fill" id="bar-void" style="width:0%; background:#8a2be2;"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-label">REALITY</div>
      <div class="stat-value" id="stat-reality">100%</div>
      <div class="stat-bar"><div class="stat-fill" id="bar-reality" style="width:100%; background:#87CEEB;"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-label">BLESSINGS</div>
      <div class="stat-value" id="stat-blessings">0</div>
    </div>
    <div class="stat-row">
      <div class="stat-label">CURSES</div>
      <div class="stat-value" id="stat-curses">0</div>
    </div>
    <div class="stat-row">
      <div class="stat-label">KARMA</div>
      <div class="stat-value" id="stat-karma">0</div>
    </div>
    <div class="stat-row">
      <div class="stat-label">CYCLE</div>
      <div class="stat-value" id="stat-cycle">50%</div>
      <div class="stat-bar"><div class="stat-fill" id="bar-cycle" style="width:50%; background:#87CEEB;"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-label">PHASE</div>
      <div class="stat-value" id="stat-phase">NEUTRAL</div>
    </div>
  `;

  document.getElementById("game")?.appendChild(panel);
}

// Visual feedback for stat changes
function showStatChange(stat, oldValue, newValue) {
  if (oldValue === newValue) return;
  
  const diff = Math.round((newValue - oldValue) * 10) / 10;
  const sign = diff > 0 ? "+" : "";
  const color = diff > 0 ? "#90EE90" : "#ff6b6b";
  
  const indicator = document.createElement("div");
  indicator.style.position = "absolute";
  indicator.style.color = color;
  indicator.style.fontSize = "0.9em";
  indicator.style.fontWeight = "bold";
  indicator.style.textShadow = "0 0 5px currentColor";
  indicator.style.pointerEvents = "none";
  indicator.style.zIndex = "100";
  indicator.style.whiteSpace = "nowrap";
  indicator.textContent = `${stat} ${sign}${diff}`;
  
  const statPanel = document.getElementById("stats-panel");
  if (statPanel) {
    const rect = statPanel.getBoundingClientRect();
    indicator.style.left = rect.left + "px";
    indicator.style.top = (rect.top - 20) + "px";
    indicator.style.animation = "float-up 2s ease-out forwards";
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (indicator.parentNode) indicator.remove();
    }, 2000);
  }
}

// Get current phase name based on cycle
function getCyclePhase() {
  const cycle = gameState.cosmicCycle;
  
  if (cycle >= 20 && cycle <= 30) return "HARMONY";
  if (cycle >= 70 && cycle <= 80) return "HARMONY";
  if (cycle >= 45 && cycle <= 55) return "VOID";
  if (cycle >= 60 && cycle <= 90) return "NIGHT";
  return "NEUTRAL";
}

// Reality Chaos Effects
function updateRealityChaos() {
  const gameEl = document.getElementById("game");
  if (!gameEl) return;
  
  gameEl.classList.remove(
    "reality-chaos-mild", 
    "reality-chaos-moderate", 
    "reality-chaos-severe", 
    "reality-chaos-extreme"
  );
  
  if (gameState.realityStability < 60 && !gameState.hasEnding) {
    if (gameState.realityStability < 10) {
      gameEl.classList.add("reality-chaos-extreme");
    } else if (gameState.realityStability < 20) {
      gameEl.classList.add("reality-chaos-severe");
    } else if (gameState.realityStability < 30) {
      gameEl.classList.add("reality-chaos-moderate");
    } else if (gameState.realityStability < 60) {
      gameEl.classList.add("reality-chaos-mild");
    }
    
    if (gameState.realityStability < 30 && Math.random() < 0.03 && !gameState.hasEnding) {
      const chaosMessages = [
        "The screen flickers...",
        "Reality ripples around you...",
        "Colors bleed into each other...",
        "The terminal warps...",
        "Nothing feels solid anymore...",
        "The text is melting...",
        "Your vision distorts...",
        "The world bends...",
        "Shapes lose meaning...",
        "Time feels wrong...",
        "The edges blur...",
        "Something is breaking..."
      ];
      addMessage(getRandom(chaosMessages), "machine");
    }
  }
}

function updateRealityEffects() {
  const gameEl = document.getElementById("game");
  if (!gameEl) return;
  
  gameEl.classList.remove("reality-mild", "reality-moderate", "reality-severe");
  
  updateRealityChaos();
  
  if (gameState.realityStability < 30) {
    gameEl.classList.add("reality-severe");
    if (Math.random() < 0.1 && !gameState.hasEnding) {
      addMessage(getRandom(playerThoughts.weirdness), "player");
    }
  } else if (gameState.realityStability < 60) {
    gameEl.classList.add("reality-moderate");
  } else if (gameState.realityStability < 85) {
    gameEl.classList.add("reality-mild");
  }
}

function updateStatsPanel() {
  const planetBar = document.getElementById("bar-planet");
  const barUniverse = document.getElementById("bar-universe");
  const barStrain = document.getElementById("bar-strain");
  const barVoid = document.getElementById("bar-void");
  const barReality = document.getElementById("bar-reality");
  const barCycle = document.getElementById("bar-cycle");
  const statKnowledge = document.getElementById("stat-knowledge");
  const statPlanet = document.getElementById("stat-planet");
  const statUniverse = document.getElementById("stat-universe");
  const statStrain = document.getElementById("stat-strain");
  const statVoid = document.getElementById("stat-void");
  const statReality = document.getElementById("stat-reality");
  const statBlessings = document.getElementById("stat-blessings");
  const statCurses = document.getElementById("stat-curses");
  const statKarma = document.getElementById("stat-karma");
  const statCycle = document.getElementById("stat-cycle");
  const statPhase = document.getElementById("stat-phase");

  if (!planetBar || !barUniverse || !barStrain || !barVoid || !barReality || !barCycle) return;

  const previousPhase = gameState.currentPhase;
  const currentPhase = getCyclePhase();
  const netKarma = getNetKarma();
  
  if (statKnowledge) statKnowledge.textContent = gameState.knowledge.toFixed(1);
  if (statPlanet) statPlanet.textContent = `${Math.floor(gameState.planetHealth)}%`;
  if (statUniverse) statUniverse.textContent = `${Math.floor(gameState.universeHealth)}%`;
  if (statStrain) statStrain.textContent = `${Math.floor(gameState.strain)}%`;
  if (statVoid) statVoid.textContent = `${Math.floor(gameState.voidAttention)}%`;
  if (statReality) statReality.textContent = `${Math.floor(gameState.realityStability)}%`;
  if (statBlessings) statBlessings.textContent = gameState.blessings;
  if (statCurses) statCurses.textContent = gameState.curses;
  if (statKarma) statKarma.textContent = netKarma;
  if (statCycle) statCycle.textContent = `${Math.floor(gameState.cosmicCycle)}%`;
  if (statPhase) statPhase.textContent = currentPhase;
  
  gameState.currentPhase = currentPhase;

  planetBar.style.width = `${gameState.planetHealth}%`;
  planetBar.style.background = gameState.planetHealth > 70 ? "#0f0" : gameState.planetHealth > 40 ? "#ff0" : gameState.planetHealth > 20 ? "#f90" : "#f00";

  barUniverse.style.width = `${gameState.universeHealth}%`;
  barUniverse.style.background = gameState.universeHealth > 70 ? "#0f0" : gameState.universeHealth > 40 ? "#ff0" : gameState.universeHealth > 20 ? "#f90" : "#f00";

  barStrain.style.width = `${gameState.strain}%`;
  barStrain.style.background = gameState.strain > 70 ? "#f00" : gameState.strain > 40 ? "#ff0" : "#ff0";
  
  barVoid.style.width = `${gameState.voidAttention}%`;
  barVoid.style.background = gameState.voidAttention > 70 ? "#ff00ff" : gameState.voidAttention > 40 ? "#b266ff" : "#8a2be2";
  
  if (barReality) {
    barReality.style.width = `${gameState.realityStability}%`;
    barReality.style.background = gameState.realityStability > 70 ? "#87CEEB" : 
                                  gameState.realityStability > 40 ? "#b266ff" : "#ff00ff";
  }
  
  barCycle.style.width = `${gameState.cosmicCycle}%`;
  barCycle.style.background = "#87CEEB";
  
  [statPlanet, statUniverse, statStrain, statVoid, statReality, statCycle].forEach(stat => {
    if (stat) {
      stat.classList.add("changed");
      setTimeout(() => stat.classList.remove("changed"), 500);
    }
  });
  
  const planetEl = document.getElementById("planet");
  if (planetEl) {
    planetEl.classList.remove("warning", "critical", "dead");
    
    if (gameState.planetHealth <= 0) {
      planetEl.classList.add("dead");
    } else if (gameState.planetHealth < 20) {
      planetEl.classList.add("critical");
    } else if (gameState.planetHealth < 50) {
      planetEl.classList.add("warning");
    }
  }
  
  const gameEl = document.getElementById("game");
  if (gameEl) {
    gameEl.classList.remove("universe-healthy", "universe-mild", "universe-warning", "universe-critical", "universe-severe", "universe-dead");
    
    if (gameState.universeHealth <= 0) {
      gameEl.classList.add("universe-dead");
    } else if (gameState.universeHealth < 20) {
      gameEl.classList.add("universe-severe");
    } else if (gameState.universeHealth < 40) {
      gameEl.classList.add("universe-critical");
    } else if (gameState.universeHealth < 60) {
      gameEl.classList.add("universe-warning");
    } else if (gameState.universeHealth < 80) {
      gameEl.classList.add("universe-mild");
    } else {
      gameEl.classList.add("universe-healthy");
    }
    
    gameEl.classList.remove("void-low", "void-medium", "void-high", "void-critical", "void-max", "void-dim");
    
    if (gameState.voidAttention > 90) {
      gameEl.classList.add("void-max", "void-dim");
    } else if (gameState.voidAttention > 75) {
      gameEl.classList.add("void-critical", "void-dim");
    } else if (gameState.voidAttention > 55) {
      gameEl.classList.add("void-high", "void-dim");
    } else if (gameState.voidAttention > 25) {
      gameEl.classList.add("void-medium", "void-dim");
    } else if (gameState.voidAttention > 0) {
      gameEl.classList.add("void-low", "void-dim");
    }
  }
  
  updateRealityEffects();
}

// --- CAPS ---
function clampStats() {
  gameState.planetHealth = Math.max(0, Math.min(100, gameState.planetHealth));
  gameState.universeHealth = Math.max(0, Math.min(100, gameState.universeHealth));
  gameState.strain = Math.max(0, Math.min(100, gameState.strain));
  gameState.voidAttention = Math.max(0, Math.min(100, gameState.voidAttention));
  gameState.realityStability = Math.max(0, Math.min(100, gameState.realityStability));
  gameState.blessings = Math.max(0, Math.min(20, gameState.blessings));
  gameState.curses = Math.max(0, Math.min(20, gameState.curses));
  gameState.cosmicCycle = Math.max(0, Math.min(100, gameState.cosmicCycle));
}

// Get cosmic alignment factor (0-1) - affects meditation and prayer
function getCosmicAlignment() {
  const cycle = gameState.cosmicCycle;
  
  if (cycle >= 20 && cycle <= 30) {
    return 0.8 + (cycle - 20) * 0.02;
  } else if (cycle >= 70 && cycle <= 80) {
    return 0.8 + (80 - cycle) * 0.02;
  } else if (cycle >= 45 && cycle <= 55) {
    return 0.2;
  } else if (cycle < 10) {
    return 0.1 + cycle * 0.01;
  } else if (cycle > 90) {
    return 0.1 + (100 - cycle) * 0.01;
  } else {
    return 0.4 + Math.random() * 0.2;
  }
}

// Get sleep effectiveness - affects how well you rest
function getSleepEffectiveness() {
  const cycle = gameState.cosmicCycle;
  
  if (cycle > 60 && cycle < 90) {
    return 1.2;
  } else if (cycle > 30 && cycle < 60) {
    return 1.0;
  } else if (cycle > 10 && cycle < 30) {
    return 0.6;
  } else {
    return 0.3;
  }
}

// Check if word is dead from overuse
function isWordDead(word) {
  const usage = gameState.wordUsage[word] || 0;
  return usage >= 10;
}

function getWordPower(word) {
  const usage = gameState.wordUsage[word] || 0;
  const netKarma = getNetKarma();
  
  // Karma bonus/penalty (capped between -0.6 and +0.6)
  const karmaBonus = Math.max(-0.6, Math.min(0.6, netKarma * 0.03));
  
  let basePower = 1.0;
  if (usage <= 3) basePower = 1.0;
  else if (usage <= 6) basePower = 0.8;
  else if (usage <= 9) basePower = 0.5;
  else basePower = 0.2;
  
  return Math.max(0.1, Math.min(1.5, basePower + karmaBonus));
}

// Speak a word
function speakWord(word) {
  if (!word) return;
  playTypingSound();
  addMessage(word, "player");
  gameState.wordUsage[word] = (gameState.wordUsage[word] || 0) + 1;

  const wordPower = getWordPower(word);
  const netKarma = getNetKarma();
  const misfireChance = Math.max(0, (gameState.strain > 60 ? 0.4 : 0) - (Math.max(0, netKarma) * 0.02));
  
  gameState.universeHealth = Math.max(0, gameState.universeHealth - (0.2 * wordPower));
  gameState.voidAttention = Math.min(100, gameState.voidAttention + (0.5 * wordPower));
  
  setTimeout(() => {
    if (gameState.dictionary[word]) {
      if (isWordDead(word)) {
        addMessage(`The word "${word}" crumbles to dust.`, "machine");
        addMessage("It can never be spoken again.", "machine");
        delete gameState.dictionary[word];
        delete gameState.wordUsage[word];
        gameState.curses = Math.min(20, gameState.curses + 2);
        showStatChange("Curses", gameState.curses - 2, gameState.curses);
        playErrorSound();
        return;
      }
      
      const entry = gameState.dictionary[word];
      
      const oldPlanet = gameState.planetHealth;
      const oldUniverse = gameState.universeHealth;
      const oldStrain = gameState.strain;
      const oldVoid = gameState.voidAttention;
      const oldKnowledge = gameState.knowledge;
      const oldReality = gameState.realityStability;
      
      const originalEffect = entry.event.effect;
      
      const scaledEffect = (s) => {
        const planetBefore = s.planetHealth;
        const universeBefore = s.universeHealth;
        const strainBefore = s.strain;
        const voidBefore = s.voidAttention;
        
        originalEffect(s);
        
        s.planetHealth = planetBefore + (s.planetHealth - planetBefore) * wordPower;
        s.universeHealth = universeBefore + (s.universeHealth - universeBefore) * wordPower;
        s.strain = strainBefore + (s.strain - strainBefore) * wordPower;
        s.voidAttention = voidBefore + (s.voidAttention - voidBefore) * wordPower;
      };
      
      scaledEffect(gameState);

      if (!entry.known) {
        addMessage("I finally understand what that does.", "player");
        entry.known = true;
      }

      if (entry.event.type === "weird") {
        gameState.realityStability = Math.max(0, gameState.realityStability - 5);
        showStatChange("Reality", oldReality, gameState.realityStability);
      } else if (entry.event.type === "healing") {
        gameState.realityStability = Math.min(100, gameState.realityStability + 2);
        showStatChange("Reality", oldReality, gameState.realityStability);
      } else if (entry.event.type === "destruction") {
        gameState.realityStability = Math.max(0, gameState.realityStability - 3);
        showStatChange("Reality", oldReality, gameState.realityStability);
      }

      setTimeout(() => {
        addMessage(entry.event.description, "machine");
        addMessage(getRandom(machineReactions[entry.event.type]), "machine");
        if (gameState.wordUsage[word] >= 8) {
          addMessage("The word is fading...", "machine");
        }
      }, 500);

      gameState.knowledge += 1 * wordPower;
      
      showStatChange("Planet", oldPlanet, gameState.planetHealth);
      showStatChange("Universe", oldUniverse, gameState.universeHealth);
      showStatChange("Strain", oldStrain, gameState.strain);
      showStatChange("Void", oldVoid, gameState.voidAttention);
      showStatChange("Knowledge", oldKnowledge, gameState.knowledge);

    } else {
      if (Math.random() < misfireChance) {
        const event = eventPool[Math.floor(Math.random() * eventPool.length)];
        
        const oldPlanet = gameState.planetHealth;
        const oldUniverse = gameState.universeHealth;
        const oldStrain = gameState.strain;
        const oldVoid = gameState.voidAttention;
        const oldCurses = gameState.curses;
        const oldReality = gameState.realityStability;
        
        gameState.dictionary[word] = { event, known: true };
        event.effect(gameState);
        
        gameState.realityStability = Math.max(0, gameState.realityStability - 3);
        
        addMessage("That came out wrong...", "player");
        addMessage(event.description, "machine");
        addMessage(getRandom(machineReactions[event.type]), "machine");
        
        gameState.strain += 5;
        gameState.knowledge += 2;
        gameState.voidAttention += 2;
        gameState.curses = Math.min(20, gameState.curses + 1);
        
        showStatChange("Planet", oldPlanet, gameState.planetHealth);
        showStatChange("Universe", oldUniverse, gameState.universeHealth);
        showStatChange("Strain", oldStrain, gameState.strain);
        showStatChange("Void", oldVoid, gameState.voidAttention);
        showStatChange("Curses", oldCurses, gameState.curses);
        showStatChange("Reality", oldReality, gameState.realityStability);
        
        playErrorSound();
        
      } else {
        let baseChance = 0.2;
        
        let strainPenalty = 0;
        if (gameState.strain > 30) {
          strainPenalty = (gameState.strain - 30) * 0.004;
        }
        
        const netKarma = getNetKarma();
        let karmaBonus = Math.max(0, netKarma) * 0.01;
        let knowledgeBonus = gameState.knowledge * 0.002;
        
        let discoveryPenalty = 1.0;
        if (gameState.deepMeditationActive) {
          discoveryPenalty = 0.3;
          if (Date.now() > gameState.deepMeditationEndTime) {
            gameState.deepMeditationActive = false;
            discoveryPenalty = 1.0;
            addMessage("The deep meditation haze lifts.", "player");
          }
        }
        
        const chance = Math.max(0.05, Math.min(0.6, baseChance - strainPenalty + knowledgeBonus + karmaBonus)) * discoveryPenalty;

        if (Math.random() < chance) {
          const event = eventPool[Math.floor(Math.random() * eventPool.length)];
          
          const oldStrain = gameState.strain;
          const oldKnowledge = gameState.knowledge;
          const oldBlessings = gameState.blessings;
          const oldReality = gameState.realityStability;
          
          gameState.dictionary[word] = { event, known: false };

          addMessage(getRandom(machineReactions.discovery), "machine");
          addMessage("The word has power.", "machine");
          setTimeout(() => addMessage("I should remember that word.", "player"), 700);

          gameState.strain += 5;
          gameState.knowledge += 5;
          gameState.blessings = Math.min(20, gameState.blessings + 1);
          gameState.realityStability = Math.min(100, gameState.realityStability + 1);
          
          showStatChange("Strain", oldStrain, gameState.strain);
          showStatChange("Knowledge", oldKnowledge, gameState.knowledge);
          showStatChange("Blessings", oldBlessings, gameState.blessings);
          showStatChange("Reality", oldReality, gameState.realityStability);
          
        } else {
          addMessage(getRandom(machineReactions.nothing), "machine");
          
          const oldStrain = gameState.strain;
          gameState.strain += 3;
          showStatChange("Strain", oldStrain, gameState.strain);
          
          playErrorSound();
        }
      }
    }

    applyStrain();
    advanceTime();
    clampStats();
    updateStatsPanel();
    checkHealth();
    checkEndings();
  }, 400);
}

// --- TIME & VOID MECHANICS ---
function advanceTime() {
  gameState.cycles++;
  
  const oldVoid = gameState.voidAttention;
  const netKarma = getNetKarma();
  
  // Base void increase
  gameState.voidAttention = Math.min(100, gameState.voidAttention + 0.8);
  
  // Net karma effect on void
  if (netKarma !== 0) {
    const karmaVoidEffect = netKarma * 0.2;
    gameState.voidAttention = Math.min(100, Math.max(0, gameState.voidAttention - karmaVoidEffect));
  }
  
  // Every 5 cycles, karma affects void more strongly
  if (gameState.cycles % 5 === 0 && netKarma !== 0) {
    const cycleEffect = netKarma * 0.3;
    gameState.voidAttention = Math.min(100, Math.max(0, gameState.voidAttention - cycleEffect));
  }
  
  if (Math.abs(oldVoid - gameState.voidAttention) > 0.5) {
    showStatChange("Void", oldVoid, gameState.voidAttention);
  }
  
  if (gameState.cycles % 10 === 0) {
    gameState.voidAttention = Math.min(100, gameState.voidAttention + 5);
    
    if (Math.random() < 0.4) {
      addMessage(getRandom(voidMessages), "machine");
    }
  }
  
  if (Math.random() < 0.15) {
    receiveTransmission();
  }
}

function receiveTransmission() {
  const transmission = getRandom(transmissions);
  const sectors = ["Alpha", "Beta", "Gamma", "Delta", "Void-7", "Ceti", "Andromeda", "Unknown"];
  const sector = getRandom(sectors);
  
  const gibberish = generateGibberish();
  
  addMessage(`TRANSMISSION RECEIVED: "${gibberish}" from Sector ${sector}`, "machine");
  addMessage(transmission, "machine");
  
  const netKarma = getNetKarma();
  const discoverChance = 0.1 + (Math.max(0, netKarma) * 0.02);
  
  if (Math.random() < discoverChance && !gameState.dictionary[gibberish]) {
    const event = eventPool[Math.floor(Math.random() * eventPool.length)];
    gameState.dictionary[gibberish] = { event, known: false };
    addMessage(`"${gibberish}" added to dictionary.`, "machine");
  }
}

function generateGibberish() {
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const vowels = "aeiou";
  let word = "";
  const length = 3 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      word += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      word += vowels[Math.floor(Math.random() * vowels.length)];
    }
  }
  return word;
}

// --- STRAIN & SLEEP ---
function applyStrain() {
  const oldStrain = gameState.strain;
  const netKarma = getNetKarma();
  
  gameState.strain = Math.min(100, gameState.strain + 2);
  
  // Net karma effect on strain
  if (netKarma > 0 && Math.random() < 0.1) {
    const strainReduction = Math.min(20, netKarma);
    gameState.strain = Math.max(0, gameState.strain - strainReduction);
  } else if (netKarma < 0 && Math.random() < 0.1) {
    const strainIncrease = Math.min(20, Math.abs(netKarma));
    gameState.strain = Math.min(100, gameState.strain + strainIncrease);
  }
  
  if (Math.abs(oldStrain - gameState.strain) > 0.5) {
    showStatChange("Strain", oldStrain, gameState.strain);
  }

  if (gameState.strain >= 100) {
    forcedSleep();
  } else if (gameState.strain > 80) {
    addMessage("I feel unstable somehow.", "player");
  } else if (gameState.strain > 60) {
    if (Math.random() < 0.2) {
      addMessage("My thoughts are getting fuzzy...", "player");
    }
  }
}

function forcedSleep() {
  if (faintActive) return;
  
  triggerFaint();
  lockInput(5000);
  addMessage("I can't keep my eyes open...", "player");
  addMessage("Your mind collapses from strain.", "machine");

  let eventsToRun = 5;
  let eventsRun = 0;
  
  let interval = setInterval(() => {
    if (!faintActive) {
      clearInterval(interval);
      return;
    }
    
    const event = getRandom(eventPool);
    
    const oldPlanet = gameState.planetHealth;
    const oldUniverse = gameState.universeHealth;
    const oldStrain = gameState.strain;
    const oldVoid = gameState.voidAttention;
    const oldReality = gameState.realityStability;
    
    event.effect(gameState);
    gameState.realityStability = Math.max(0, gameState.realityStability - 2);
    
    addMessage(event.description, "machine");
    
    showStatChange("Planet", oldPlanet, gameState.planetHealth);
    showStatChange("Universe", oldUniverse, gameState.universeHealth);
    showStatChange("Strain", oldStrain, gameState.strain);
    showStatChange("Void", oldVoid, gameState.voidAttention);
    showStatChange("Reality", oldReality, gameState.realityStability);

    eventsRun++;
    if (eventsRun >= eventsToRun) {
      clearInterval(interval);
      
      const strainRecovery = 20 + Math.floor(Math.random() * 20);
      gameState.strain = Math.max(10, gameState.strain - strainRecovery);
      gameState.voidAttention = Math.min(100, gameState.voidAttention + 15);
      gameState.curses = Math.min(20, gameState.curses + 2);
      
      clampStats();
      updateStatsPanel();
    }
  }, 800);
}

function sleep() {
  if (gameState.strain < 20) {
    addMessage("I'm not tired yet.", "player");
    return;
  }

  const effectiveness = getSleepEffectiveness();
  const now = gameState.cosmicCycle;
  const cycleDiff = Math.abs(now - gameState.lastSleepCycle);
  
  let diminishingFactor = 1.0;
  if (cycleDiff < 20) {
    diminishingFactor = 0.5;
    addMessage("I just slept... still tired?", "player");
  }
  
  gameState.lastSleepCycle = now;
  
  if (effectiveness < 0.5) {
    addMessage("It's not a good time to sleep...", "player");
  }

  lockInput(3000);
  addMessage("I should rest for a bit.", "player");

  setTimeout(() => {
    const sleepMisfire = Math.random() < (0.3 - (Math.max(0, getNetKarma()) * 0.015)) / effectiveness;
    
    if (sleepMisfire) {
      addMessage("My sleep was restless...", "player");
      const event = getRandom(eventPool);
      
      const oldPlanet = gameState.planetHealth;
      const oldUniverse = gameState.universeHealth;
      const oldStrain = gameState.strain;
      const oldVoid = gameState.voidAttention;
      const oldReality = gameState.realityStability;
      
      event.effect(gameState);
      addMessage(event.description, "machine");
      
      const strainReduction = Math.floor((10 + Math.floor(Math.random() * 15)) * effectiveness * diminishingFactor);
      gameState.strain = Math.max(0, gameState.strain - strainReduction);
      gameState.voidAttention = Math.min(100, gameState.voidAttention + (8 / effectiveness));
      gameState.curses = Math.min(20, gameState.curses + 1);
      gameState.realityStability = Math.max(0, gameState.realityStability - 2);
      
      showStatChange("Planet", oldPlanet, gameState.planetHealth);
      showStatChange("Universe", oldUniverse, gameState.universeHealth);
      showStatChange("Strain", oldStrain, gameState.strain);
      showStatChange("Void", oldVoid, gameState.voidAttention);
      showStatChange("Curses", gameState.curses - 1, gameState.curses);
      showStatChange("Reality", oldReality, gameState.realityStability);
      
      addMessage("I feel a bit better, but not great.", "player");
      playErrorSound();
      
      if (effectiveness < 0.3 && gameState.strain > 80) {
        triggerFaint();
      }
    } else {
      const event = getRandom(eventPool);
      
      const oldPlanet = gameState.planetHealth;
      const oldUniverse = gameState.universeHealth;
      const oldStrain = gameState.strain;
      const oldVoid = gameState.voidAttention;
      const oldBlessings = gameState.blessings;
      const oldReality = gameState.realityStability;
      
      const originalEffect = event.effect;
      const scaledEffect = (s) => {
        const planetBefore = s.planetHealth;
        const universeBefore = s.universeHealth;
        const strainBefore = s.strain;
        
        originalEffect(s);
        
        s.planetHealth = planetBefore + (s.planetHealth - planetBefore) * 0.5;
        s.universeHealth = universeBefore + (s.universeHealth - universeBefore) * 0.5;
        s.strain = strainBefore + (s.strain - strainBefore) * 0.5;
      };
      
      scaledEffect(gameState);
      
      addMessage(event.description, "machine");
      
      const strainReduction = Math.floor((20 + Math.floor(Math.random() * 20)) * effectiveness * diminishingFactor);
      const voidReduction = Math.floor(3 * effectiveness);
      gameState.strain = Math.max(0, gameState.strain - strainReduction);
      gameState.voidAttention = Math.max(0, gameState.voidAttention - voidReduction);
      gameState.blessings = Math.min(20, gameState.blessings + 1);
      gameState.realityStability = Math.min(100, gameState.realityStability + 2);
      
      showStatChange("Planet", oldPlanet, gameState.planetHealth);
      showStatChange("Universe", oldUniverse, gameState.universeHealth);
      showStatChange("Strain", oldStrain, gameState.strain);
      showStatChange("Void", oldVoid, gameState.voidAttention);
      showStatChange("Blessings", oldBlessings, gameState.blessings);
      showStatChange("Reality", oldReality, gameState.realityStability);
      
      if (effectiveness > 1.0) {
        addMessage("I slept deeply. Perfect timing.", "player");
      } else if (effectiveness < 0.5) {
        addMessage("I barely rested at all.", "player");
      } else {
        addMessage("I feel more stable now.", "player");
      }
    }

    clampStats();
    updateStatsPanel();
  }, 1500);
}

// --- ACTIONS ---
function pray() {
  addMessage(getRandom(playerThoughts.pray), "player");
  lockInput();

  setTimeout(() => {
    const oldPlanet = gameState.planetHealth;
    const oldUniverse = gameState.universeHealth;
    const oldStrain = gameState.strain;
    const oldVoid = gameState.voidAttention;
    const oldBlessings = gameState.blessings;
    const oldCurses = gameState.curses;
    const oldReality = gameState.realityStability;
    
    const alignment = getCosmicAlignment();
    const netKarma = getNetKarma();
    const prayerPower = Math.floor((3 + (Math.max(0, netKarma) * 0.2)) * (0.8 + alignment * 0.4));
    gameState.planetHealth = Math.min(100, gameState.planetHealth + prayerPower);
    gameState.voidAttention = Math.max(0, gameState.voidAttention - 1 - Math.max(0, netKarma) * 0.1);

    // Failure chance decreases with positive karma
    const failureChance = (0.25 - (Math.max(0, netKarma) * 0.02)) / alignment;
    
    if (Math.random() < failureChance) {
      addMessage("Something else heard you.", "machine");
      gameState.universeHealth = Math.max(0, gameState.universeHealth - 8);
      gameState.strain = Math.min(100, gameState.strain + 12);
      gameState.voidAttention = Math.min(100, gameState.voidAttention + 10);
      gameState.curses = Math.min(20, gameState.curses + 2);
      gameState.realityStability = Math.max(0, gameState.realityStability - 3);
      addMessage("That felt wrong.", "player");
      playErrorSound();
    } else {
      addMessage(getRandom(machineReactions.healing), "machine");
      addMessage("That felt right.", "player");
      gameState.blessings = Math.min(20, gameState.blessings + 1);
      gameState.realityStability = Math.min(100, gameState.realityStability + 1);
    }

    showStatChange("Planet", oldPlanet, gameState.planetHealth);
    showStatChange("Universe", oldUniverse, gameState.universeHealth);
    showStatChange("Strain", oldStrain, gameState.strain);
    showStatChange("Void", oldVoid, gameState.voidAttention);
    showStatChange("Blessings", oldBlessings, gameState.blessings);
    showStatChange("Curses", oldCurses, gameState.curses);
    showStatChange("Reality", oldReality, gameState.realityStability);

    clampStats();
    updateStatsPanel();
  }, 500);
}

function read() {
  if (gameState.strain > 90) {
    addMessage("Too strained to focus.", "player");
    return;
  }
  
  addMessage(getRandom(playerThoughts.read), "player");
  lockInput(2000);

  setTimeout(() => {
    const oldKnowledge = gameState.knowledge;
    const oldStrain = gameState.strain;
    const oldBlessings = gameState.blessings;
    const oldReality = gameState.realityStability;
    
    const alignment = getCosmicAlignment();
    const netKarma = getNetKarma();
    const knowledgeGain = (Math.max(1, 3 - Math.floor(gameState.strain / 30)) + (Math.max(0, netKarma) * 0.2)) * (0.7 + alignment * 0.6);
    gameState.knowledge += knowledgeGain;
    
    const strainIncrease = Math.max(3, 6 - Math.floor(gameState.strain / 20));
    gameState.strain = Math.min(100, gameState.strain + strainIncrease);
    
    gameState.realityStability = Math.min(100, gameState.realityStability + 1);
    
    addMessage("I understand a little more.", "player");

    const unknownWords = Object.keys(gameState.dictionary).filter(w => !gameState.dictionary[w].known);
    const learnChance = Math.max(0.05, 0.25 - (gameState.strain / 200) + (Math.max(0, netKarma) * 0.01));
    
    if (unknownWords.length > 0 && Math.random() < learnChance) {
      const wordToLearn = unknownWords[Math.floor(Math.random() * unknownWords.length)];
      gameState.dictionary[wordToLearn].known = true;
      addMessage(`I now understand what "${wordToLearn}" does.`, "player");
      gameState.strain = Math.min(100, gameState.strain + 3);
      gameState.blessings = Math.min(20, gameState.blessings + 1);
    }

    const discoverChance = Math.max(0.05, 0.15 - (gameState.strain / 150) + (Math.max(0, netKarma) * 0.01));
    
    if (Math.random() < discoverChance) {
      const syllables = ["ka", "ta", "na", "ma", "ra", "sa", "la", "va", "da", "ba", 
                        "shi", "ru", "ke", "mo", "no", "po", "so", "zo", "ga", "za",
                        "te", "ri", "ku", "me", "pa", "ki", "su", "mi", "fu"];
      const wordLength = 2 + Math.floor(Math.random() * 3);
      let newWord = "";
      for (let i = 0; i < wordLength; i++) {
        newWord += syllables[Math.floor(Math.random() * syllables.length)];
      }
      
      if (!gameState.dictionary[newWord]) {
        const event = eventPool[Math.floor(Math.random() * eventPool.length)];
        gameState.dictionary[newWord] = { event, known: false };
        addMessage(`I found a new word in the text: "${newWord}"`, "player");
        gameState.strain = Math.min(100, gameState.strain + 4);
        gameState.blessings = Math.min(20, gameState.blessings + 1);
      }
    }

    showStatChange("Knowledge", oldKnowledge, gameState.knowledge);
    showStatChange("Strain", oldStrain, gameState.strain);
    showStatChange("Blessings", oldBlessings, gameState.blessings);
    showStatChange("Reality", oldReality, gameState.realityStability);

    clampStats();
    updateStatsPanel();
  }, 1200);
}

function rest() {
  if (gameState.strain < 10) {
    addMessage("I feel fine actually.", "player");
    return;
  }

  addMessage("I need a moment.", "player");
  lockInput(2500);

  setTimeout(() => {
    const oldStrain = gameState.strain;
    const oldPlanet = gameState.planetHealth;
    const oldVoid = gameState.voidAttention;
    const oldReality = gameState.realityStability;
    
    const alignment = getCosmicAlignment();
    const netKarma = getNetKarma();
    const restAmount = Math.floor((15 + (Math.max(0, netKarma) * 1.5)) * (0.7 + alignment * 0.6));
    gameState.strain = Math.max(0, gameState.strain - restAmount);
    gameState.planetHealth = Math.min(100, gameState.planetHealth + 1);
    gameState.voidAttention = Math.max(0, gameState.voidAttention - 0.5);
    gameState.realityStability = Math.min(100, gameState.realityStability + 1);
    addMessage("That's better.", "player");

    showStatChange("Strain", oldStrain, gameState.strain);
    showStatChange("Planet", oldPlanet, gameState.planetHealth);
    showStatChange("Void", oldVoid, gameState.voidAttention);
    showStatChange("Reality", oldReality, gameState.realityStability);

    clampStats();
    updateStatsPanel();
  }, 1000);
}

function meditate() {
  if (gameState.strain > 50) {
    addMessage("Too strained to meditate.", "player");
    return;
  }
  
  if (gameState.knowledge < 3) {
    addMessage("I don't have the mental energy to meditate.", "player");
    return;
  }
  
  if (gameState.knowledge >= 50 && !gameState.deepMeditationActive) {
    addMessage("You feel you could channel 50 knowledge into a deep meditation.", "machine");
    addMessage("Type /deep to attempt it.", "machine");
  }
  
  const alignment = getCosmicAlignment();
  const now = gameState.cosmicCycle;
  const cycleDiff = Math.abs(now - gameState.lastMeditateCycle);
  
  let diminishingFactor = 1.0;
  if (cycleDiff < 15) {
    diminishingFactor = 0.6;
    addMessage("I'm trying too hard...", "player");
  }
  
  gameState.lastMeditateCycle = now;
  
  const oldKnowledge = gameState.knowledge;
  gameState.knowledge -= 3;
  
  addMessage(getRandom(playerThoughts.meditate), "player");
  lockInput(3000);
  
  setTimeout(() => {
    const oldVoid = gameState.voidAttention;
    const oldStrain = gameState.strain;
    const oldBlessings = gameState.blessings;
    const oldCurses = gameState.curses;
    const oldReality = gameState.realityStability;
    
    let voidReduction = Math.floor((3 + Math.floor(Math.random() * 8)) * alignment * diminishingFactor);
    
    if (alignment < 0.3 && Math.random() < 0.4) {
      addMessage("The void interferes with your meditation...", "machine");
      gameState.voidAttention = Math.min(100, gameState.voidAttention + 12);
      gameState.strain += 10;
      gameState.curses = Math.min(20, gameState.curses + 1);
      gameState.realityStability = Math.max(0, gameState.realityStability - 5);
      addMessage("That was a mistake.", "player");
      playErrorSound();
    } else {
      gameState.voidAttention = Math.max(0, gameState.voidAttention - voidReduction);
      gameState.blessings = Math.min(20, gameState.blessings + 1);
      gameState.realityStability = Math.min(100, gameState.realityStability + 3);
      
      if (alignment > 0.7) {
        addMessage("Perfect alignment. The void barely touches me.", "player");
      } else if (voidReduction > 0) {
        addMessage(`The void recedes. (-${voidReduction})`, "machine");
        addMessage("I feel more centered.", "player");
      } else {
        addMessage("The meditation did nothing...", "player");
      }
    }
    
    gameState.strain += 2;
    
    showStatChange("Knowledge", oldKnowledge, gameState.knowledge);
    showStatChange("Void", oldVoid, gameState.voidAttention);
    showStatChange("Strain", oldStrain, gameState.strain);
    showStatChange("Blessings", oldBlessings, gameState.blessings);
    showStatChange("Curses", oldCurses, gameState.curses);
    showStatChange("Reality", oldReality, gameState.realityStability);
    
    clampStats();
    updateStatsPanel();
  }, 2000);
}

function deepMeditate() {
  if (gameState.strain > 70) {
    addMessage("Too strained for deep meditation.", "player");
    return;
  }
  
  if (gameState.knowledge < 50) {
    addMessage("I need 50 knowledge for deep meditation.", "player");
    return;
  }
  
  if (gameState.deepMeditationActive) {
    addMessage("Already in a deep meditative state.", "player");
    return;
  }
  
  const alignment = getCosmicAlignment();
  const oldKnowledge = gameState.knowledge;
  gameState.knowledge -= 50;
  
  addMessage("I channel my knowledge into a deep meditation...", "player");
  lockInput(5000);
  
  setTimeout(() => {
    const oldVoid = gameState.voidAttention;
    const oldStrain = gameState.strain;
    const oldBlessings = gameState.blessings;
    const oldCurses = gameState.curses;
    const oldReality = gameState.realityStability;
    
    let voidReduction = Math.floor((15 + Math.floor(Math.random() * 20)) * alignment);
    
    if (alignment < 0.4 && Math.random() < 0.5) {
      addMessage("The void attacks your meditation!", "machine");
      gameState.voidAttention = Math.min(100, gameState.voidAttention + 25);
      gameState.strain += 20;
      gameState.curses = Math.min(20, gameState.curses + 3);
      gameState.blessings = Math.max(0, gameState.blessings - 2);
      gameState.realityStability = Math.max(0, gameState.realityStability - 10);
      addMessage("That was a terrible mistake.", "player");
      playErrorSound();
    } else {
      gameState.voidAttention = Math.max(0, gameState.voidAttention - voidReduction);
      gameState.blessings = Math.min(20, gameState.blessings + 3);
      gameState.realityStability = Math.min(100, gameState.realityStability + 10);
      
      gameState.deepMeditationActive = true;
      gameState.deepMeditationEndTime = Date.now() + 60000;
      
      addMessage(`The void recedes dramatically! (-${voidReduction})`, "machine");
      addMessage("I feel one with the cosmos.", "player");
      addMessage("Word discovery is harder for a while, but my mind is protected.", "player");
    }
    
    gameState.strain += 5;
    
    showStatChange("Knowledge", oldKnowledge, gameState.knowledge);
    showStatChange("Void", oldVoid, gameState.voidAttention);
    showStatChange("Strain", oldStrain, gameState.strain);
    showStatChange("Blessings", oldBlessings, gameState.blessings);
    showStatChange("Curses", oldCurses, gameState.curses);
    showStatChange("Reality", oldReality, gameState.realityStability);
    
    clampStats();
    updateStatsPanel();
  }, 3000);
}

// --- DICTIONARY ---
function toggleDictionary() {
  const panel = document.getElementById("dictionary-panel");
  const content = document.getElementById("dictionary-content");
  if (!panel || !content) return;

  if (panel.style.display === "block") {
    panel.style.display = "none";
    return;
  }

  content.innerHTML = "";
  const words = Object.keys(gameState.dictionary);

  if (words.length === 0) {
    const div = document.createElement("div");
    div.textContent = "No words discovered yet.";
    div.style.color = "#666";
    div.style.padding = "10px";
    content.appendChild(div);
  } else {
    words.sort().forEach(word => {
      const entry = gameState.dictionary[word];
      const usage = gameState.wordUsage[word] || 0;
      const div = document.createElement("div");

      const wordSpan = document.createElement("span");
      wordSpan.className = entry.known ? "word-known" : "word-unknown";
      wordSpan.textContent = word;

      div.appendChild(wordSpan);

      const usageSpan = document.createElement("span");
      usageSpan.style.fontSize = "0.7em";
      usageSpan.style.marginLeft = "5px";
      usageSpan.style.color = usage > 8 ? "#ff0000" : usage > 5 ? "#ff6b6b" : "#666";
      usageSpan.textContent = `(${usage}/10)`;
      div.appendChild(usageSpan);

      if (entry.known) {
        const descDiv = document.createElement("div");
        descDiv.className = "word-desc";
        descDiv.textContent = entry.event.description;
        
        if (usage > 8) {
          descDiv.textContent += ` [FADING]`;
          descDiv.style.color = "#ff0000";
        } else if (usage > 5) {
          descDiv.textContent += ` [WEAK]`;
          descDiv.style.color = "#ffaa00";
        }
        
        div.appendChild(descDiv);
      } else {
        const unknownDiv = document.createElement("div");
        unknownDiv.className = "word-desc";
        unknownDiv.textContent = "???";
        unknownDiv.style.color = "#444";
        div.appendChild(unknownDiv);
      }

      content.appendChild(div);
    });
  }

  panel.style.display = "block";
}

// --- ENDINGS ---
function checkEndings() {
  if (gameState.hasEnding) return;
  
  if (voidTimerCountdown) {
    clearTimeout(voidTimerCountdown);
    voidTimerCountdown = null;
  }
  
  const netKarma = getNetKarma();
  
  if (gameState.planetHealth >= 100 && 
      gameState.voidAttention <= 3 && 
      netKarma >= 10 && 
      gameState.knowledge >= 150 && 
      gameState.cycles >= 75 &&
      Object.keys(gameState.dictionary).length >= 25) {
    triggerEnding("good");
  }
  else if (gameState.voidAttention >= 100 && gameState.cycles >= 15) {
    if (!voidTimerCountdown) {
      triggerEnding("void");
    }
  }
  else if (netKarma <= -12 && gameState.strain >= 90 && gameState.cycles >= 25) {
    triggerEnding("reality");
  }
  else if (gameState.cycles >= 150) {
    triggerEnding("survive");
  }
  else if (gameState.universeHealth <= 0 && gameState.cycles >= 5) {
    triggerEnding("universe");
  }
  else if (Object.keys(gameState.dictionary).length >= 40 && 
           netKarma >= 8 && 
           gameState.knowledge >= 200 && 
           gameState.cycles >= 60) {
    triggerEnding("scholar");
  }
  else if (gameState.planetHealth <= 0 && gameState.cycles >= 5) {
    triggerEnding("destruction");
  }
}

function triggerEnding(type) {
  gameState.hasEnding = true;
  inputLocked = true;
  
  if (voidTimerCountdown) {
    clearTimeout(voidTimerCountdown);
    voidTimerCountdown = null;
  }
  
  if (voidTimer) clearInterval(voidTimer);
  if (transmissionTimer) clearInterval(transmissionTimer);
  if (cycleTimer) clearInterval(cycleTimer);
  if (ambientTimer) clearInterval(ambientTimer);
  
  const endings = {
    good: [
      "The planet thrives. Life blooms.",
      "The void retreats, satisfied.",
      "You've done it. You saved them.",
      "The guardians return. They nod approvingly.",
      "You are one of them now.",
      "The Keeper.",
      "...",
      "ENDING: THE KEEPER"
    ],
    void: [
      "The void speaks your name.",
      "Not the one you were given. Your real name.",
      "You turn around. There's nothing there.",
      "When you turn back, the terminal is gone.",
      "The planet is gone. The universe is gone.",
      "Only you remain.",
      "Only you.",
      "...",
      "ENDING: CONSUMED"
    ],
    universe: [
      "The universe collapses.",
      "All light fades.",
      "No stars. No planets. No void.",
      "Just nothing.",
      "Absolute silence.",
      "I'm alone.",
      "...",
      "ENDING: VOID"
    ],
    reality: [
      "Reality tears like wet paper.",
      "You see behind the curtain.",
      "It's just words. Just text.",
      "You're typing to yourself.",
      "There is no planet. No universe.",
      "Just you and the void.",
      "Just you.",
      "...",
      "ENDING: THE TRUTH"
    ],
    survive: [
      "150 cycles. 150 days.",
      "You've said everything that can be said.",
      "The language is complete.",
      "The universe nods, satisfied.",
      "You close the terminal.",
      "You walk away.",
      "You're free.",
      "...",
      "ENDING: RELEASE"
    ],
    scholar: [
      "40 words. The language is yours.",
      "You speak the final word.",
      "The universe understands you now.",
      "You are no longer the apprentice.",
      "You are the Keeper.",
      "For real this time.",
      "...",
      "ENDING: MASTER"
    ],
    destruction: [
      "The planet cracks apart.",
      "I watched it happen.",
      "Couldn't stop it.",
      "All those lives...",
      "Gone.",
      "I failed.",
      "...",
      "ENDING: FAILURE"
    ]
  };
  
  endings[type].forEach((line, i) => {
    setTimeout(() => addMessage(line, i % 2 === 0 ? "machine" : "player"), i * 2000);
  });
  
  setTimeout(() => {
    if (confirm("Play again?")) resetGame();
  }, endings[type].length * 2000 + 2000);
}

// --- HEALTH ---
function checkHealth() {
  if (gameState.planetHealth <= 0 && !gameState.hasEnding) {
    addMessage("The planet is dying...", "machine");
  }

  if (gameState.universeHealth <= 0 && !gameState.hasEnding) {
    addMessage("The universe is collapsing...", "machine");
  }
}

// --- RESET ---
function resetGame() {
  if (faintActive) {
    const faintOverlay = document.getElementById("faint-overlay");
    if (faintOverlay) {
      faintOverlay.classList.remove("active", "blink");
      faintOverlay.style.opacity = "";
      faintOverlay.style.transition = "";
    }
    faintActive = false;
  }
  
  if (voidTimerCountdown) {
    clearTimeout(voidTimerCountdown);
    voidTimerCountdown = null;
  }
  
  gameState = {
    knowledge: 0,
    dictionary: {},
    planetHealth: 100,
    universeHealth: 100,
    strain: 0,
    wordUsage: {},
    cycles: 0,
    voidAttention: 0,
    realityStability: 100,
    hasEnding: false,
    transmissions: [],
    blessings: 0,
    curses: 0,
    cosmicCycle: 50,
    cycleDirection: 1,
    cycleVelocity: 1,
    lastSleepCycle: 0,
    lastMeditateCycle: 0,
    deepMeditationActive: false,
    deepMeditationEndTime: 0
  };
  
  const output = document.getElementById("output");
  if (output) output.innerHTML = "";
  addMessage("A new universe begins.", "machine");
  addMessage("I'll do better this time.", "player");
  updateStatsPanel();
  
  if (window.passiveCleanup) {
    window.passiveCleanup(false);
  }
  if (ambientTimer) clearInterval(ambientTimer);
  
  const panel = document.getElementById("dictionary-panel");
  if (panel) panel.style.display = "none";
  
  startTimers();
  startAmbientTimer();
}

// --- COMMAND ---
function handleCommand(input) {
  if (inputLocked || !input) return;

  const cmd = input.trim().toLowerCase();
  if (!cmd) return;

  if (cmd === "/rest") return rest();
  if (cmd === "/read") return read();
  if (cmd === "/pray") return pray();
  if (cmd === "/sleep") return sleep();
  if (cmd === "/meditate") return meditate();
  if (cmd === "/deep") return deepMeditate();
  if (cmd === "/dict") return toggleDictionary();
  if (cmd === "/pause") return togglePause();
  if (cmd === "/quit") return quitToMenu();
  if (cmd === "/resume") {
    if (gamePaused) togglePause();
    else addMessage("Game is not paused. Press ESC to pause.", "machine");
    return;
  }
  if (cmd === "/sound") {
    audioEnabled = !audioEnabled;
    addMessage(`Sound ${audioEnabled ? "ON" : "OFF"}`, "machine");
    if (audioEnabled && !audioCtx) initAudio();
    if (audioEnabled && audioCtx && audioCtx.state !== 'running') {
      audioCtx.resume();
    }
    return;
  }
  if (cmd === "/clear") {
    const output = document.getElementById("output");
    if (output) output.innerHTML = "";
    return;
  }
  if (cmd === "/stats") {
    const netKarma = getNetKarma();
    addMessage(`Knowledge: ${gameState.knowledge.toFixed(1)}`, "machine");
    addMessage(`Planet: ${Math.floor(gameState.planetHealth)}%`, "machine");
    addMessage(`Universe: ${Math.floor(gameState.universeHealth)}%`, "machine");
    addMessage(`Strain: ${Math.floor(gameState.strain)}%`, "machine");
    addMessage(`Void: ${Math.floor(gameState.voidAttention)}%`, "machine");
    addMessage(`Reality: ${Math.floor(gameState.realityStability)}%`, "machine");
    addMessage(`Words: ${Object.keys(gameState.dictionary).length}`, "machine");
    addMessage(`Cycles: ${gameState.cycles}`, "machine");
    addMessage(`Blessings: ${gameState.blessings}`, "machine");
    addMessage(`Curses: ${gameState.curses}`, "machine");
    addMessage(`Karma: ${netKarma}`, "machine");
    addMessage(`Cycle: ${Math.floor(gameState.cosmicCycle)}%`, "machine");
    addMessage(`Phase: ${getCyclePhase()}`, "machine");
    return;
  }

  speakWord(cmd);
}

// ==================== AMBIENT EVENT SYSTEM ====================
function triggerAmbientEvent() {
  if (gameState.hasEnding) return;
  
  const isHealthy = gameState.planetHealth > 70 && 
                    gameState.universeHealth > 70 && 
                    gameState.voidAttention < 30 &&
                    gameState.realityStability > 70;
  
  const isStruggling = gameState.planetHealth < 40 || 
                       gameState.universeHealth < 40 || 
                       gameState.voidAttention > 60 ||
                       gameState.realityStability < 40;
  
  if (isStruggling) return;
  
  let eventList = [];
  
  if (isHealthy) {
    eventList = [
      () => {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = Math.random() * 80 + '%';
        star.style.top = Math.random() * 30 + '%';
        document.getElementById('game').appendChild(star);
        setTimeout(() => star.remove(), 2000);
      },
      () => {
        for (let i = 0; i < 5; i++) {
          const dust = document.createElement('div');
          dust.className = 'dust-particle';
          dust.style.left = (50 + (Math.random() - 0.5) * 20) + '%';
          dust.style.top = (50 + (Math.random() - 0.5) * 20) + '%';
          document.getElementById('game').appendChild(dust);
          setTimeout(() => dust.remove(), 5000);
        }
      },
      () => {
        const planet = document.getElementById('planet');
        planet.classList.add('planet-pulse');
        setTimeout(() => planet.classList.remove('planet-pulse'), 500);
      },
      () => {
        const planet = document.getElementById('planet');
        planet.classList.add('ring-glow');
        setTimeout(() => planet.classList.remove('ring-glow'), 1000);
      },
      () => {
        const happyMessages = [
          "The planet hums contentedly.",
          "A shooting star traces the sky.",
          "The void seems... distant.",
          "Reality feels solid.",
          "The stars shine brighter for a moment.",
          "You feel a sense of peace.",
          "The universe sighs with relief."
        ];
        if (Math.random() < 0.3) {
          addMessage(getRandom(happyMessages), "machine");
        }
      }
    ];
  } else {
    eventList = [
      () => {
        for (let i = 0; i < 2; i++) {
          const dust = document.createElement('div');
          dust.className = 'dust-particle';
          dust.style.left = (50 + (Math.random() - 0.5) * 30) + '%';
          dust.style.top = (50 + (Math.random() - 0.5) * 30) + '%';
          document.getElementById('game').appendChild(dust);
          setTimeout(() => dust.remove(), 5000);
        }
      },
      () => {
        const planet = document.getElementById('planet');
        planet.style.opacity = '0.98';
        setTimeout(() => planet.style.opacity = '', 100);
      }
    ];
  }
  
  if (eventList.length > 0) {
    const event = getRandom(eventList);
    event();
  }
}

function startAmbientTimer() {
  if (ambientTimer) clearInterval(ambientTimer);
  ambientTimer = setInterval(() => {
    if (gameState.hasEnding || gamePaused) return;
    
    const chance = gameState.planetHealth > 70 ? 0.2 : 0.05;
    
    if (Math.random() < chance) {
      triggerAmbientEvent();
    }
  }, 45000);
}

// --- TIMERS ---
function startTimers() {
  if (voidTimer) clearInterval(voidTimer);
  if (transmissionTimer) clearInterval(transmissionTimer);
  if (cycleTimer) clearInterval(cycleTimer);
  
  voidTimer = setInterval(() => {
    if (gameState.hasEnding || gamePaused) return;
    
    const oldVoid = gameState.voidAttention;
    gameState.voidAttention = Math.min(100, gameState.voidAttention + 0.5);
    
    if (gameState.voidAttention >= 100 && !voidTimerCountdown && !gameState.hasEnding) {
      voidTimerCountdown = setTimeout(() => {
        if (gameState.voidAttention >= 100 && gameState.cycles >= 15) {
          triggerEnding("void");
        }
        voidTimerCountdown = null;
      }, 3000);
      addMessage("The void is at 100%! You have 3 seconds to act...", "machine");
    }
    
    if (gameState.voidAttention < 100 && voidTimerCountdown) {
      clearTimeout(voidTimerCountdown);
      voidTimerCountdown = null;
    }
    
    if (gameState.voidAttention > 70 && Math.random() < 0.3 && !gameState.hasEnding && !voidTimerCountdown) {
      addMessage(getRandom(voidMessages), "machine");
    }
    
    if (Math.abs(oldVoid - gameState.voidAttention) > 0.5) {
      showStatChange("Void", oldVoid, gameState.voidAttention);
    }
    
    updateStatsPanel();
    checkEndings();
  }, 10000);
  
  transmissionTimer = setInterval(() => {
    if (gameState.hasEnding || gamePaused) return;
    if (Math.random() < 0.4) {
      receiveTransmission();
    }
  }, 15000);
  
  cycleTimer = setInterval(() => {
    if (gameState.hasEnding || gamePaused) return;
    
    const oldCycle = gameState.cosmicCycle;
    
    if (Math.random() < 0.3) {
      gameState.cycleDirection *= -1;
    }
    
    if (Math.random() < 0.2) {
      gameState.cycleVelocity = 1 + Math.floor(Math.random() * 5);
    }
    
    if (Math.random() < 0.1) {
      gameState.cycleVelocity = 0;
      setTimeout(() => {
        if (!gamePaused && !gameState.hasEnding) {
          gameState.cycleVelocity = 1 + Math.floor(Math.random() * 3);
        }
      }, 2000 + Math.random() * 3000);
    }
    
    if (gameState.cycleVelocity > 0) {
      gameState.cosmicCycle += gameState.cycleDirection * gameState.cycleVelocity;
    }
    
    if (gameState.cosmicCycle >= 100) {
      gameState.cosmicCycle = 100;
      if (Math.random() < 0.2) {
        gameState.cycleVelocity = 0;
        setTimeout(() => {
          if (!gamePaused && !gameState.hasEnding) {
            gameState.cycleDirection = -1;
            gameState.cycleVelocity = 1 + Math.floor(Math.random() * 3);
          }
        }, 2000);
      } else {
        gameState.cycleDirection = -1;
      }
    } else if (gameState.cosmicCycle <= 0) {
      gameState.cosmicCycle = 0;
      if (Math.random() < 0.2) {
        gameState.cycleVelocity = 0;
        setTimeout(() => {
          if (!gamePaused && !gameState.hasEnding) {
            gameState.cycleDirection = 1;
            gameState.cycleVelocity = 1 + Math.floor(Math.random() * 3);
          }
        }, 2000);
      } else {
        gameState.cycleDirection = 1;
      }
    }
    
    if (Math.random() < 0.05) {
      const jump = (Math.random() < 0.5 ? 5 : -5);
      gameState.cosmicCycle = Math.max(0, Math.min(100, gameState.cosmicCycle + jump));
      addMessage("The cycle hiccups.", "machine");
    }
    
    if (Math.abs(oldCycle - gameState.cosmicCycle) > 2) {
      showStatChange("Cycle", oldCycle, gameState.cosmicCycle);
    }
    
    updateStatsPanel();
  }, 5000);
  
  pauseTimers.voidTimer = voidTimer;
  pauseTimers.transmissionTimer = transmissionTimer;
  pauseTimers.cycleTimer = cycleTimer;
  pauseTimers.ambientTimer = ambientTimer;
}

// --- KEYBOARD HANDLER ---
function handleKeyPress(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    e.preventDefault();
    togglePause();
  }
}

// --- INIT ---
function initGame() {
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.getElementById('game')?.style.setProperty('--mouse-x', x + '%');
    document.getElementById('game')?.style.setProperty('--mouse-y', y + '%');
  });

  document.addEventListener('keydown', handleKeyPress);

  const cleanupPassive = initPassiveSystems(
    gameState, 
    addMessage, 
    showStatChange, 
    updateStatsPanel, 
    checkEndings
  );

  window.passiveCleanup = cleanupPassive;
  
  console.log("Initializing game...");
  
  const game = document.getElementById("game");
  if (game) game.style.display = "block";

  createStatsPanel();

  addMessage("The terminal is active.", "machine");
  addMessage("I need to learn the language.", "player");
  addMessage("Type /dict to see discovered words.", "machine");
  addMessage("The void watches...", "machine");
  addMessage("The cosmic cycle affects sleep and meditation.", "machine");
  addMessage("Watch the PHASE indicator for current cycle effects.", "machine");
  addMessage("Karma is the balance of blessings and curses.", "machine");
  addMessage("Press ESC to pause/resume the game.", "machine");
  addMessage("Commands: /stats, /sound, /clear, /quit (when paused)", "machine");

  const submitBtn = document.getElementById("submit-btn");
  const playerInput = document.getElementById("player-input");
  const learnBtn = document.getElementById("learn-btn");
  const prayBtn = document.getElementById("pray-btn");
  const sleepBtn = document.getElementById("sleep-btn");
  const meditateBtn = document.getElementById("meditate-btn");
  const deepMeditateBtn = document.getElementById("deep-meditate-btn");
  const dictBtn = document.getElementById("dict-btn");

  if (submitBtn && playerInput) {
    submitBtn.onclick = () => { 
      handleCommand(playerInput.value); 
      playerInput.value = ""; 
    };
  }

  if (playerInput) {
    playerInput.onkeypress = e => { 
      if (e.key === "Enter" && submitBtn) submitBtn.click(); 
    };
  }

  if (learnBtn) learnBtn.onclick = read;
  if (prayBtn) prayBtn.onclick = pray;
  if (sleepBtn) sleepBtn.onclick = sleep;
  if (meditateBtn) meditateBtn.onclick = meditate;
  if (deepMeditateBtn) deepMeditateBtn.onclick = deepMeditate;
  if (dictBtn) dictBtn.onclick = toggleDictionary;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-up {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-30px); }
    }
    .stat-value.changed {
      animation: pulse-stat 0.5s ease-out;
    }
    @keyframes pulse-stat {
      0% { color: white; transform: scale(1); }
      50% { color: yellow; transform: scale(1.2); }
      100% { color: inherit; transform: scale(1); }
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);

  updateStatsPanel();
  startTimers();
  startAmbientTimer();

  const panel = document.getElementById("dictionary-panel");
  if (panel) panel.style.display = "none";

  const initAudioHandler = () => {
    if (!audioInitialized && audioEnabled) {
      initAudio();
    }
  };
  document.body.addEventListener('click', initAudioHandler);
  document.body.addEventListener('keypress', initAudioHandler);

  window.debug = {
    ambient: () => triggerAmbientEvent(),
    healthy: () => {
      gameState.planetHealth = 100;
      gameState.universeHealth = 100;
      gameState.voidAttention = 0;
      gameState.realityStability = 100;
      updateStatsPanel();
      addMessage("Debug: Set to healthy state.", "machine");
      console.log("Debug: Set to healthy");
    },
    stats: () => {
      console.log("=== Debug Stats ===");
      console.log("Planet:", gameState.planetHealth);
      console.log("Universe:", gameState.universeHealth);
      console.log("Void:", gameState.voidAttention);
      console.log("Reality:", gameState.realityStability);
      console.log("Blessings:", gameState.blessings);
      console.log("Curses:", gameState.curses);
      console.log("Karma:", getNetKarma());
    }
  };
}

// --- AUTO START ---
let gameInitialized = false;

document.addEventListener("tutorialEnded", () => {
  if (!gameInitialized) {
    console.log("Tutorial ended, starting game...");
    gameInitialized = true;
    initGame();
  }
});

setTimeout(() => {
  if (!gameInitialized && document.getElementById("game")?.style.display === "none") {
    console.log("Fallback: starting game...");
    gameInitialized = true;
    initGame();
  }
}, 30000);