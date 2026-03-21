// --- passive_systems.js ---
// Handles all passive decay and background mechanics

export function initPassiveSystems(gameState, addMessage, showStatChange, updateStatsPanel, checkEndings) {
  
  const decayTimer = setInterval(() => {
    if (gameState.hasEnding) return;
    
    const oldPlanet = gameState.planetHealth;
    const oldUniverse = gameState.universeHealth;
    const oldVoid = gameState.voidAttention;
    const oldStrain = gameState.strain;
    
    // BALANCE ADJUSTMENT: Reduced decay rates
    let planetDecay = 0.15; // Was 0.3
    let universeDecay = 0.2; // Was 0.4
    let voidGrowth = 0.4; // Was 0.6
    
    // Modify based on game state
    if (gameState.planetHealth < 50) {
      planetDecay *= 1.5; // Was 2.0
    }
    
    if (gameState.universeHealth < 50) {
      universeDecay *= 1.5; // Was 2.0
    }
    
    // Blessings help more
    if (gameState.blessings > 0) {
      planetDecay *= Math.max(0.6, 1 - (gameState.blessings * 0.03)); // Was 0.7
      universeDecay *= Math.max(0.6, 1 - (gameState.blessings * 0.03));
      voidGrowth *= Math.max(0.5, 1 - (gameState.blessings * 0.04)); // Was 0.6
    }
    
    // Curses accelerate decay (slightly reduced)
    if (gameState.curses > 0) {
      planetDecay *= (1 + (gameState.curses * 0.08)); // Was 0.1
      universeDecay *= (1 + (gameState.curses * 0.08));
      voidGrowth *= (1 + (gameState.curses * 0.12)); // Was 0.15
    }
    
    // High strain causes faster decay
    if (gameState.strain > 50) {
      planetDecay *= 1.3; // Was 1.5
      universeDecay *= 1.3;
      voidGrowth *= 1.5; // Was 1.8
    }
    
    // Apply decay
    gameState.planetHealth = Math.max(0, gameState.planetHealth - planetDecay);
    gameState.universeHealth = Math.max(0, gameState.universeHealth - universeDecay);
    gameState.voidAttention = Math.min(100, gameState.voidAttention + voidGrowth);
    
    // Karma bonus: positive karma slowly recovers universe health
    const netKarma = gameState.blessings - gameState.curses;
    if (netKarma > 0 && gameState.universeHealth < 100 && Math.random() < 0.2) {
      const universeRecovery = Math.min(2, Math.floor(netKarma / 5) + 1);
      gameState.universeHealth = Math.min(100, gameState.universeHealth + universeRecovery);
      if (Math.random() < 0.1) {
        addMessage("The universe stabilizes slightly.", "machine");
      }
    }
    
    // Random idle events happen less often
    if (Math.random() < 0.2) { // Was 0.3
      triggerIdleEvent(gameState, addMessage, showStatChange);
    }
    
    // Show changes if significant
    if (Math.abs(oldPlanet - gameState.planetHealth) > 0.5) {
      showStatChange("Planet", oldPlanet, gameState.planetHealth);
    }
    if (Math.abs(oldUniverse - gameState.universeHealth) > 0.5) {
      showStatChange("Universe", oldUniverse, gameState.universeHealth);
    }
    if (Math.abs(oldVoid - gameState.voidAttention) > 0.5) {
      showStatChange("Void", oldVoid, gameState.voidAttention);
    }
    
    // Warning messages at thresholds
    if (gameState.planetHealth < 50 && oldPlanet >= 50) {
      addMessage("The planet is failing.", "machine");
    }
    if (gameState.planetHealth < 25 && oldPlanet >= 25) {
      addMessage("The planet is dying.", "machine");
    }
    if (gameState.universeHealth < 50 && oldUniverse >= 50) {
      addMessage("The universe is unraveling.", "machine");
    }
    if (gameState.universeHealth < 25 && oldUniverse >= 25) {
      addMessage("Reality is collapsing.", "machine");
    }
    if (gameState.voidAttention > 50 && oldVoid <= 50) {
      addMessage("The void presses in.", "machine");
    }
    if (gameState.voidAttention > 80 && oldVoid <= 80) {
      addMessage("The void is consuming everything.", "machine");
    }
    
    updateStatsPanel();
    checkEndings();
    
  }, 10000); // Keep at 10 seconds
  
  // Reduced damage idle events
  function triggerIdleEvent(state, addMsg, showChange) {
    const events = [
      {
        description: "A distant star explodes. The shockwave ripples through space.",
        effect: (s) => { s.universeHealth = Math.max(0, s.universeHealth - 3); s.voidAttention = Math.min(100, s.voidAttention + 2); }
      },
      {
        description: "Earthquakes shake the planet's crust.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 2); s.strain = Math.min(100, s.strain + 2); }
      },
      {
        description: "The void whispers. You try not to listen.",
        effect: (s) => { s.voidAttention = Math.min(100, s.voidAttention + 5); s.strain = Math.min(100, s.strain + 3); }
      },
      {
        description: "Transmission: 'They're coming.'",
        effect: (s) => { s.voidAttention = Math.min(100, s.voidAttention + 4); s.universeHealth = Math.max(0, s.universeHealth - 2); }
      },
      {
        description: "You feel something watching.",
        effect: (s) => { s.strain = Math.min(100, s.strain + 6); s.voidAttention = Math.min(100, s.voidAttention + 3); }
      },
      {
        description: "Volcanic eruptions darken the sky.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 3); }
      },
      {
        description: "Galactic winds sweep through the void.",
        effect: (s) => { s.universeHealth = Math.max(0, s.universeHealth - 4); s.voidAttention = Math.min(100, s.voidAttention + 2); }
      },
      {
        description: "Your reflection flickers. Was it smiling?",
        effect: (s) => { s.strain = Math.min(100, s.strain + 5); s.voidAttention = Math.min(100, s.voidAttention + 4); }
      },
      {
        description: "A solar flare scorches the surface.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 5); }
      },
      {
        description: "The void shifts its attention toward you.",
        effect: (s) => { s.voidAttention = Math.min(100, s.voidAttention + 8); s.strain = Math.min(100, s.strain + 3); }
      },
      {
        description: "A meteor shower impacts the planet.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 4); s.strain = Math.min(100, s.strain + 2); }
      },
      {
        description: "A cosmic anomaly distorts local reality.",
        effect: (s) => { s.universeHealth = Math.max(0, s.universeHealth - 3); s.realityStability = Math.max(0, s.realityStability - 2); }
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    
    const oldPlanet = state.planetHealth;
    const oldUniverse = state.universeHealth;
    const oldVoid = state.voidAttention;
    const oldStrain = state.strain;
    const oldReality = state.realityStability;
    
    event.effect(state);
    
    addMsg(` ${event.description}`, "machine");
    
    if (oldPlanet !== state.planetHealth) showChange("Planet", oldPlanet, state.planetHealth);
    if (oldUniverse !== state.universeHealth) showChange("Universe", oldUniverse, state.universeHealth);
    if (oldVoid !== state.voidAttention) showChange("Void", oldVoid, state.voidAttention);
    if (oldStrain !== state.strain) showChange("Strain", oldStrain, state.strain);
    if (oldReality !== state.realityStability) showChange("Reality", oldReality, state.realityStability);
  }
  
  return () => {
    clearInterval(decayTimer);
  };
}

export function checkCrisisThresholds(gameState, addMessage) {
  if (gameState.hasEnding) return;
  
  const crises = [];
  
  if (gameState.planetHealth < 30) {
    crises.push("PLANET CRITICAL");
  }
  if (gameState.universeHealth < 30) {
    crises.push("UNIVERSE COLLAPSING");
  }
  if (gameState.voidAttention > 70) {
    crises.push("VOID CONSUMING");
  }
  if (gameState.strain > 80) {
    crises.push("MIND SHATTERING");
  }
  if (gameState.curses >= 10) {
    crises.push("CURSES OVERWHELMING");
  }
  
  if (crises.length > 0 && Math.random() < 0.5) {
    addMessage(`CRISIS: ${crises.join(" • ")}`, "machine");
  }
}