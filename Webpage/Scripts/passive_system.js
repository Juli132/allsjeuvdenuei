// --- passive_systems.js ---
// Handles all passive decay and background mechanics

export function initPassiveSystems(gameState, addMessage, showStatChange, updateStatsPanel, checkEndings) {
  
  const decayTimer = setInterval(() => {
    if (gameState.hasEnding) return;
    
    const oldPlanet = gameState.planetHealth;
    const oldUniverse = gameState.universeHealth;
    const oldVoid = gameState.voidAttention;
    const oldStrain = gameState.strain;
    
    // Base decay rates - INCREASED SIGNIFICANTLY
    let planetDecay = 0.3; // Was 0.1
    let universeDecay = 0.4; // Was 0.15
    let voidGrowth = 0.6; // Was 0.2
    
    // Modify based on game state
    if (gameState.planetHealth < 50) {
      planetDecay *= 2.0; // Doubles when below 50
    }
    
    if (gameState.universeHealth < 50) {
      universeDecay *= 2.0;
    }
    
    // Blessings help but not enough
    if (gameState.blessings > 0) {
      planetDecay *= Math.max(0.7, 1 - (gameState.blessings * 0.02));
      universeDecay *= Math.max(0.7, 1 - (gameState.blessings * 0.02));
      voidGrowth *= Math.max(0.6, 1 - (gameState.blessings * 0.03));
    }
    
    // Curses accelerate decay a lot
    if (gameState.curses > 0) {
      planetDecay *= (1 + (gameState.curses * 0.1));
      universeDecay *= (1 + (gameState.curses * 0.1));
      voidGrowth *= (1 + (gameState.curses * 0.15));
    }
    
    // High strain causes faster decay
    if (gameState.strain > 50) {
      planetDecay *= 1.5;
      universeDecay *= 1.5;
      voidGrowth *= 1.8;
    }
    
    // Apply decay
    gameState.planetHealth = Math.max(0, gameState.planetHealth - planetDecay);
    gameState.universeHealth = Math.max(0, gameState.universeHealth - universeDecay);
    gameState.voidAttention = Math.min(100, gameState.voidAttention + voidGrowth);
    
    // Random idle events happen more often
    if (Math.random() < 0.3) { // Was 0.1
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
    
  }, 10000); // Faster ticks (was 15000)
  
  // More dangerous idle events
  function triggerIdleEvent(state, addMsg, showChange) {
    const events = [
      {
        description: "A star explodes. Nearby systems scorched.",
        effect: (s) => { s.universeHealth = Math.max(0, s.universeHealth - 5); s.voidAttention = Math.min(100, s.voidAttention + 3); }
      },
      {
        description: "Massive earthquakes rock the planet.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 4); s.strain = Math.min(100, s.strain + 3); }
      },
      {
        description: "The void whispers secrets. You shouldn't have listened.",
        effect: (s) => { s.voidAttention = Math.min(100, s.voidAttention + 8); s.strain = Math.min(100, s.strain + 5); }
      },
      {
        description: "Transmission: 'It's too late. Run.'",
        effect: (s) => { s.voidAttention = Math.min(100, s.voidAttention + 6); s.universeHealth = Math.max(0, s.universeHealth - 3); }
      },
      {
        description: "Something is in the room with you.",
        effect: (s) => { s.strain = Math.min(100, s.strain + 10); s.voidAttention = Math.min(100, s.voidAttention + 5); }
      },
      {
        description: "The planet's core destabilizes.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 6); }
      },
      {
        description: "Galaxies collide. Chaos spreads.",
        effect: (s) => { s.universeHealth = Math.max(0, s.universeHealth - 8); s.voidAttention = Math.min(100, s.voidAttention + 4); }
      },
      {
        description: "Your reflection smiles. You didn't.",
        effect: (s) => { s.strain = Math.min(100, s.strain + 8); s.voidAttention = Math.min(100, s.voidAttention + 6); }
      },
      {
        description: "A solar flare fries half the planet.",
        effect: (s) => { s.planetHealth = Math.max(0, s.planetHealth - 10); }
      },
      {
        description: "The void takes notice of you.",
        effect: (s) => { s.voidAttention = Math.min(100, s.voidAttention + 12); s.strain = Math.min(100, s.strain + 5); }
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    
    const oldPlanet = state.planetHealth;
    const oldUniverse = state.universeHealth;
    const oldVoid = state.voidAttention;
    const oldStrain = state.strain;
    
    event.effect(state);
    
    addMsg(` ${event.description}`, "machine");
    
    if (oldPlanet !== state.planetHealth) showChange("Planet", oldPlanet, state.planetHealth);
    if (oldUniverse !== state.universeHealth) showChange("Universe", oldUniverse, state.universeHealth);
    if (oldVoid !== state.voidAttention) showChange("Void", oldVoid, state.voidAttention);
    if (oldStrain !== state.strain) showChange("Strain", oldStrain, state.strain);
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