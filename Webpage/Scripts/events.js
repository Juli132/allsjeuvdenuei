// --- events.js ---

export const eventPool = [
  // ===== HEALING EVENTS =====
  {
    type: "healing",
    description: "A gentle rain falls on the damaged lands.",
    effect: (s) => { s.planetHealth += 3; }
  },
  {
    type: "healing",
    description: "The wind carries seeds to barren soil.",
    effect: (s) => { s.planetHealth += 4; s.strain -= 2; }
  },
  {
    type: "healing",
    description: "A distant star flickers warmly.",
    effect: (s) => { s.universeHealth += 3; s.knowledge += 1; }
  },
  {
    type: "healing",
    description: "The planet's magnetic field strengthens.",
    effect: (s) => { s.planetHealth += 5; }
  },
  {
    type: "healing",
    description: "New flowers bloom across the wasteland.",
    effect: (s) => { s.planetHealth += 8; s.knowledge += 2; }
  },
  {
    type: "healing",
    description: "The oceans calm. Life stabilizes.",
    effect: (s) => { s.planetHealth += 10; s.realityStability = Math.min(100, s.realityStability + 1); }
  },
  {
    type: "healing",
    description: "Light spreads across the surface.",
    effect: (s) => { s.planetHealth += 5; s.universeHealth += 5; s.realityStability = Math.min(100, s.realityStability + 1); }
  },
  {
    type: "healing",
    description: "Ancient forests regrow in days.",
    effect: (s) => { s.planetHealth += 12; s.strain -= 3; }
  },
  {
    type: "healing",
    description: "The atmosphere clears. Skies turn blue.",
    effect: (s) => { s.planetHealth += 10; s.knowledge += 3; }
  },
  {
    type: "healing",
    description: "The planet's core stabilizes.",
    effect: (s) => { s.planetHealth += 15; s.strain -= 5; s.realityStability = Math.min(100, s.realityStability + 2); }
  },
  {
    type: "healing",
    description: "A new moon forms, bringing balance.",
    effect: (s) => { s.planetHealth += 15; s.universeHealth += 10; s.realityStability = Math.min(100, s.realityStability + 2); }
  },
  {
    type: "healing",
    description: "Extinct species return. Life finds a way.",
    effect: (s) => { s.planetHealth += 20; s.knowledge += 5; s.realityStability = Math.min(100, s.realityStability + 1); }
  },
  {
    type: "healing",
    description: "The planet's rotation slows. Days grow longer.",
    effect: (s) => { s.planetHealth += 18; s.strain -= 8; }
  },
  {
    type: "healing",
    description: "A protective shield forms around the planet.",
    effect: (s) => { s.planetHealth += 25; s.universeHealth += 5; }
  },
  {
    type: "healing",
    description: "The void retreats. Briefly.",
    effect: (s) => { s.universeHealth += 10; s.planetHealth -= 5; s.voidAttention = Math.max(0, s.voidAttention - 5); }
  },
  {
    type: "healing",
    description: "Distant galaxies emit harmonious light.",
    effect: (s) => { s.universeHealth += 15; s.knowledge += 8; s.realityStability = Math.min(100, s.realityStability + 3); }
  },
  {
    type: "healing",
    description: "A supernova births new possibilities.",
    effect: (s) => { s.universeHealth += 20; s.strain -= 10; s.realityStability = Math.min(100, s.realityStability + 2); }
  },
  {
    type: "healing",
    description: "The cosmic background radiation hums in tune.",
    effect: (s) => { s.universeHealth += 12; s.planetHealth += 8; s.realityStability = Math.min(100, s.realityStability + 1); }
  },

  // ===== DESTRUCTION EVENTS =====
  {
    type: "destruction",
    description: "Small earthquakes rumble across continents.",
    effect: (s) => { s.planetHealth -= 5; }
  },
  {
    type: "destruction",
    description: "A volcano erupts. Ash darkens the sky.",
    effect: (s) => { s.planetHealth -= 8; s.strain += 3; }
  },
  {
    type: "destruction",
    description: "Crops wither. Food becomes scarce.",
    effect: (s) => { s.planetHealth -= 6; s.knowledge -= 1; }
  },
  {
    type: "destruction",
    description: "A small asteroid impacts the surface.",
    effect: (s) => { s.planetHealth -= 10; }
  },
  {
    type: "destruction",
    description: "The moon shifts violently.",
    effect: (s) => { s.planetHealth -= 20; s.realityStability = Math.max(0, s.realityStability - 2); }
  },
  {
    type: "destruction",
    description: "The ground fractures. Cities collapse.",
    effect: (s) => { s.planetHealth -= 25; }
  },
  {
    type: "destruction",
    description: "A city vanishes. No one remembers it.",
    effect: (s) => { s.planetHealth -= 15; s.knowledge -= 3; s.realityStability = Math.max(0, s.realityStability - 3); }
  },
  {
    type: "destruction",
    description: "Pandemics sweep across populations.",
    effect: (s) => { s.planetHealth -= 18; s.strain += 5; }
  },
  {
    type: "destruction",
    description: "The atmosphere thins. Skies turn orange.",
    effect: (s) => { s.planetHealth -= 22; s.universeHealth -= 3; }
  },
  {
    type: "destruction",
    description: "Tidal waves reshape continents.",
    effect: (s) => { s.planetHealth -= 30; s.universeHealth -= 5; s.realityStability = Math.max(0, s.realityStability - 2); }
  },
  {
    type: "destruction",
    description: "You moved the moon. Half the population is gone.",
    effect: (s) => { s.planetHealth -= 35; s.realityStability = Math.max(0, s.realityStability - 4); }
  },
  {
    type: "destruction",
    description: "The planet cracks. Magma floods the surface.",
    effect: (s) => { s.planetHealth -= 40; s.strain += 10; }
  },
  {
    type: "destruction",
    description: "The atmosphere bleeds into space.",
    effect: (s) => { s.planetHealth -= 35; s.universeHealth -= 8; }
  },
  {
    type: "destruction",
    description: "A nearby star goes supernova. Radiation spikes.",
    effect: (s) => { s.planetHealth -= 30; s.universeHealth -= 15; s.realityStability = Math.max(0, s.realityStability - 3); }
  },
  {
    type: "destruction",
    description: "A black hole forms at the edge of the system.",
    effect: (s) => { s.universeHealth -= 20; s.planetHealth -= 10; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "destruction",
    description: "Reality tears. Other things look through.",
    effect: (s) => { s.universeHealth -= 25; s.strain += 15; s.voidAttention += 10; s.realityStability = Math.max(0, s.realityStability - 10); }
  },
  {
    type: "destruction",
    description: "Galaxies collide. Chaos spreads.",
    effect: (s) => { s.universeHealth -= 30; s.knowledge -= 5; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "destruction",
    description: "The universe expands too fast. Matter tears apart.",
    effect: (s) => { s.universeHealth -= 35; s.planetHealth -= 15; s.realityStability = Math.max(0, s.realityStability - 8); }
  },

  // ===== WEIRD EVENTS =====
  {
    type: "weird",
    description: "Time stutters. Something skips.",
    effect: (s) => { s.universeHealth -= 10; s.realityStability = Math.max(0, s.realityStability - 2); }
  },
  {
    type: "weird",
    description: "Your shadow moves on its own.",
    effect: (s) => { s.strain += 5; s.realityStability = Math.max(0, s.realityStability - 1); }
  },
  {
    type: "weird",
    description: "Birds fly backward. Time is confused.",
    effect: (s) => { s.universeHealth -= 12; s.realityStability = Math.max(0, s.realityStability - 2); }
  },
  {
    type: "weird",
    description: "You hear whispers in unknown languages.",
    effect: (s) => { s.knowledge += 2; s.strain += 3; s.voidAttention += 2; s.realityStability = Math.max(0, s.realityStability - 1); }
  },
  {
    type: "weird",
    description: "You hear something that shouldn't exist.",
    effect: (s) => { s.universeHealth -= 8; s.strain += 5; s.realityStability = Math.max(0, s.realityStability - 3); }
  },
  {
    type: "weird",
    description: "Your reflection waves. You didn't.",
    effect: (s) => { s.universeHealth -= 5; s.strain += 10; s.voidAttention += 5; s.realityStability = Math.max(0, s.realityStability - 4); }
  },
  {
    type: "weird",
    description: "Gravity fluctuates. Things float briefly.",
    effect: (s) => { s.universeHealth -= 10; s.planetHealth -= 5; s.realityStability = Math.max(0, s.realityStability - 2); }
  },
  {
    type: "weird",
    description: "You remember something that hasn't happened yet.",
    effect: (s) => { s.knowledge += 8; s.strain += 8; s.realityStability = Math.max(0, s.realityStability - 3); }
  },
  {
    type: "weird",
    description: "The stars rearrange into patterns you almost recognize.",
    effect: (s) => { s.knowledge += 5; s.universeHealth -= 8; s.realityStability = Math.max(0, s.realityStability - 2); }
  },
  {
    type: "weird",
    description: "Reality shifted. It resisted.",
    effect: (s) => { s.universeHealth -= 15; s.strain += 8; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "weird",
    description: "Something noticed.",
    effect: (s) => { s.universeHealth -= 20; s.knowledge += 10; s.voidAttention += 10; s.realityStability = Math.max(0, s.realityStability - 6); }
  },
  {
    type: "weird",
    description: "You shouldn't have done that.",
    effect: (s) => { s.universeHealth -= 18; s.planetHealth -= 10; s.realityStability = Math.max(0, s.realityStability - 4); }
  },
  {
    type: "weird",
    description: "The universe blinked.",
    effect: (s) => { s.universeHealth -= 22; s.strain += 12; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "weird",
    description: "You see yourself from outside yourself.",
    effect: (s) => { s.knowledge += 15; s.strain += 15; s.voidAttention += 15; s.realityStability = Math.max(0, s.realityStability - 8); }
  },
  {
    type: "weird",
    description: "The fourth wall trembles. Something writes this down.",
    effect: (s) => { s.universeHealth -= 25; s.knowledge += 20; s.realityStability = Math.max(0, s.realityStability - 10); }
  },
  {
    type: "weird",
    description: "You understand everything. Then you forget.",
    effect: (s) => { s.knowledge += 30; s.strain += 25; s.realityStability = Math.max(0, s.realityStability - 12); }
  },
  {
    type: "weird",
    description: "The terminal types by itself. It knows.",
    effect: (s) => { s.universeHealth -= 30; s.strain += 20; s.voidAttention += 20; s.realityStability = Math.max(0, s.realityStability - 15); }
  },
  
  // ===== NEW COSMIC HORROR EVENTS =====
  {
    type: "weird",
    description: "The terminal shows your face. You're not making that expression.",
    effect: (s) => { s.strain += 15; s.voidAttention += 5; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "weird",
    description: "Words appear before you type them. They're not yours.",
    effect: (s) => { s.knowledge -= 5; s.strain += 10; s.realityStability = Math.max(0, s.realityStability - 4); }
  },
  {
    type: "destruction",
    description: "Something whispers your failures back to you. In your voice.",
    effect: (s) => { s.strain += 20; s.planetHealth -= 10; s.voidAttention += 10; s.realityStability = Math.max(0, s.realityStability - 6); }
  },
  {
    type: "healing",
    description: "The void returns something you lost. You wish it hadn't.",
    effect: (s) => { s.knowledge += 15; s.strain += 25; s.voidAttention += 5; s.realityStability = Math.max(0, s.realityStability - 3); }
  },
  {
    type: "weird",
    description: "Static resolves into a voice. It's yours from the future. It says 'stop'.",
    effect: (s) => { s.strain += 30; s.knowledge += 10; s.realityStability = Math.max(0, s.realityStability - 8); }
  },
  {
    type: "destruction",
    description: "The lights dim. Something is in the room. You can feel it breathing.",
    effect: (s) => { s.strain += 25; s.universeHealth -= 15; s.voidAttention += 15; s.realityStability = Math.max(0, s.realityStability - 10); }
  },
  {
    type: "weird",
    description: "Your last transmission echoes back. It's corrupted. It's begging.",
    effect: (s) => { s.strain += 20; s.knowledge -= 5; s.realityStability = Math.max(0, s.realityStability - 7); }
  },
  {
    type: "paradox",
    description: "You get a transmission from this terminal. From 5 seconds ago. It says 'run'.",
    effect: (s) => { s.strain += 35; s.voidAttention += 20; s.realityStability = Math.max(0, s.realityStability - 12); }
  },

  // ===== PARADOX EVENTS =====
  {
    type: "weird",
    description: "You meet yourself. You argue. You lose.",
    effect: (s) => { s.knowledge += 10; s.strain += 15; s.planetHealth -= 5; s.realityStability = Math.max(0, s.realityStability - 8); }
  },
  {
    type: "healing",
    description: "The dead return. They are not the same.",
    effect: (s) => { s.planetHealth += 15; s.universeHealth -= 10; s.strain += 10; s.voidAttention += 5; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "destruction",
    description: "The planet dies. Then lives. The memory remains.",
    effect: (s) => { s.planetHealth -= 20; s.knowledge += 15; s.strain += 15; s.realityStability = Math.max(0, s.realityStability - 6); }
  },
  {
    type: "weird",
    description: "Cause and effect swap places. Confusion reigns.",
    effect: (s) => { s.universeHealth -= 15; s.strain += 20; s.knowledge -= 5; s.realityStability = Math.max(0, s.realityStability - 10); }
  },
  {
    type: "healing",
    description: "The universe resets. You keep your memories.",
    effect: (s) => { 
      s.planetHealth = Math.min(100, s.planetHealth + 30);
      s.universeHealth = Math.min(100, s.universeHealth + 30);
      s.strain = Math.max(0, s.strain - 20);
      s.realityStability = Math.min(100, s.realityStability + 15);
    }
  },
  {
    type: "destruction",
    description: "Your future self warns you. You don't listen.",
    effect: (s) => { s.knowledge += 20; s.planetHealth -= 15; s.strain += 10; s.realityStability = Math.max(0, s.realityStability - 5); }
  },
  {
    type: "weird",
    description: "You dream someone else's life. They dream yours.",
    effect: (s) => { s.knowledge += 12; s.strain += 12; s.realityStability = Math.max(0, s.realityStability - 4); }
  },



// ===== VOID-REDUCING EVENTS =====
{
  type: "void",
  description: "The void trembles. Something pushes back.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 8); s.realityStability = Math.min(100, s.realityStability + 2); }
},
{
  type: "void",
  description: "A beacon of light pierces the darkness.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 5); s.knowledge += 3; }
},
{
  type: "void",
  description: "The void recedes, confused by your presence.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 12); s.strain += 5; }
},
{
  type: "void",
  description: "You feel the void's attention shift elsewhere.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 15); s.blessings = Math.min(20, s.blessings + 1); }
},
{
  type: "void",
  description: "The void whimpers. It's afraid of you.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 20); s.curses = Math.max(0, s.curses - 1); }
},

// ===== REALITY-STABILIZING EVENTS =====
{
  type: "reality",
  description: "Reality solidifies. Things feel real again.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 15); s.strain -= 5; }
},
{
  type: "reality",
  description: "The laws of physics reaffirm themselves.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 10); s.universeHealth += 5; }
},
{
  type: "reality",
  description: "The universe corrects a small inconsistency.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 8); s.knowledge += 2; }
},
{
  type: "reality",
  description: "Everything makes sense. For a moment.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 20); s.strain += 8; }
},
{
  type: "reality",
  description: "Reality glitches fix themselves. You feel relief.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 12); s.voidAttention = Math.max(0, s.voidAttention - 3); }
},

// ===== MIXED BLESSING EVENTS =====
{
  type: "healing",
  description: "The void releases its grip. Reality breathes.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 10); s.realityStability = Math.min(100, s.realityStability + 10); s.planetHealth += 5; }
},
{
  type: "weird",
  description: "The void and reality dance. Balance is found.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 5); s.realityStability = Math.min(100, s.realityStability + 5); s.knowledge += 5; }
},
{
  type: "destruction",
  description: "Something breaks. The void loses its grip.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 15); s.planetHealth -= 10; s.realityStability = Math.min(100, s.realityStability + 5); }
},

// ===== POWERFUL RARE EVENTS =====
{
  type: "paradox",
  description: "The void forgets why it was watching.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 30); s.realityStability = Math.min(100, s.realityStability + 15); s.strain += 10; }
},
{
  type: "cosmic",
  description: "A cosmic reset. The void is pushed back.",
  effect: (s) => { 
    s.voidAttention = Math.max(0, s.voidAttention - 40); 
    s.realityStability = Math.min(100, s.realityStability + 25); 
    s.planetHealth = Math.min(100, s.planetHealth + 10);
    s.universeHealth = Math.min(100, s.universeHealth + 10);
  }
},
// Add these to your eventPool:

// ===== UNIVERSE HEALING EVENTS =====
{
  type: "healing",
  description: "Distant galaxies emit a healing pulse.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 12); s.realityStability = Math.min(100, s.realityStability + 3); }
},
{
  type: "healing",
  description: "Cosmic strings realign, strengthening spacetime.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 8); s.voidAttention = Math.max(0, s.voidAttention - 5); }
},
{
  type: "healing",
  description: "The cosmic web weaves new connections.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 15); s.knowledge += 5; }
},
{
  type: "healing",
  description: "A wave of creation sweeps through the void.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 20); s.strain -= 5; }
},
{
  type: "healing",
  description: "Dark energy stabilizes. Expansion slows.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 10); s.realityStability = Math.min(100, s.realityStability + 5); }
},
{
  type: "healing",
  description: "New stars ignite in the darkness.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 8); s.planetHealth += 3; }
},
{
  type: "healing",
  description: "The void's grip loosens on reality.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 12); s.voidAttention = Math.max(0, s.voidAttention - 8); }
},
{
  type: "healing",
  description: "Cosmic harmony resonates through existence.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 18); s.blessings = Math.min(20, s.blessings + 2); }
},
{
  type: "healing",
  description: "A nebula births new possibilities.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 10); s.knowledge += 4; s.realityStability = Math.min(100, s.realityStability + 2); }
},
{
  type: "healing",
  description: "The cosmic microwave background hums with life.",
  effect: (s) => { s.universeHealth = Math.min(100, s.universeHealth + 14); s.strain -= 3; s.planetHealth += 2; }
},

// ===== MORE VOID-REDUCING EVENTS =====
{
  type: "void",
  description: "A shard of light pierces the void.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 15); s.universeHealth = Math.min(100, s.universeHealth + 5); }
},
{
  type: "void",
  description: "The void shrinks, confused by your persistence.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 20); s.knowledge += 8; }
},
{
  type: "void",
  description: "Something pushes back against the darkness.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 12); s.blessings = Math.min(20, s.blessings + 1); }
},
{
  type: "void",
  description: "The void retreats, leaving behind clarity.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 18); s.realityStability = Math.min(100, s.realityStability + 5); }
},
{
  type: "void",
  description: "Light pushes back the shadows.",
  effect: (s) => { s.voidAttention = Math.max(0, s.voidAttention - 10); s.planetHealth += 5; s.universeHealth += 3; }
},

// ===== MORE REALITY-STABILIZING EVENTS =====
{
  type: "reality",
  description: "Reality knits itself back together.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 12); s.universeHealth = Math.min(100, s.universeHealth + 5); }
},
{
  type: "reality",
  description: "The laws of physics reinforce.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 8); s.voidAttention = Math.max(0, s.voidAttention - 5); }
},
{
  type: "reality",
  description: "Existence solidifies. Things feel real again.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 15); s.strain -= 5; }
},
{
  type: "reality",
  description: "The universe remembers how to be stable.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 10); s.universeHealth = Math.min(100, s.universeHealth + 8); }
},
{
  type: "reality",
  description: "Reality's foundations strengthen.",
  effect: (s) => { s.realityStability = Math.min(100, s.realityStability + 18); s.knowledge += 3; s.strain += 2; }
},

// ===== MIXED BLESSING EVENTS (already have some, add more) =====
{
  type: "healing",
  description: "A cosmic reset. The void is pushed back.",
  effect: (s) => { 
    s.universeHealth = Math.min(100, s.universeHealth + 15);
    s.voidAttention = Math.max(0, s.voidAttention - 10);
    s.realityStability = Math.min(100, s.realityStability + 5);
  }
},
{
  type: "healing",
  description: "Light spreads through the darkness.",
  effect: (s) => { 
    s.universeHealth = Math.min(100, s.universeHealth + 10);
    s.voidAttention = Math.max(0, s.voidAttention - 8);
    s.planetHealth = Math.min(100, s.planetHealth + 5);
  }
},
{
  type: "paradox",
  description: "The universe corrects its own decay.",
  effect: (s) => { 
    s.universeHealth = Math.min(100, s.universeHealth + 20);
    s.realityStability = Math.min(100, s.realityStability + 8);
    s.strain += 5;
  }
},
{
  type: "weird",
  description: "Reality and void dance. Balance emerges.",
  effect: (s) => {
    s.realityStability = Math.min(100, s.realityStability + 10);
    s.voidAttention = Math.max(0, s.voidAttention - 10);
    s.universeHealth = Math.min(100, s.universeHealth + 5);
  }
},
{
  type: "cosmic",
  description: "A wave of pure existence washes over everything.",
  effect: (s) => {
    s.universeHealth = Math.min(100, s.universeHealth + 25);
    s.realityStability = Math.min(100, s.realityStability + 15);
    s.voidAttention = Math.max(0, s.voidAttention - 20);
    s.blessings = Math.min(20, s.blessings + 3);
  }
},

// ===== DARK EVENTS (balance) =====
{
  type: "destruction",
  description: "The void surges. Reality cracks.",
  effect: (s) => {
    s.voidAttention = Math.min(100, s.voidAttention + 15);
    s.realityStability = Math.max(0, s.realityStability - 12);
    s.universeHealth = Math.max(0, s.universeHealth - 8);
  }
},
{
  type: "weird",
  description: "Reality bleeds. Something looks through.",
  effect: (s) => {
    s.realityStability = Math.max(0, s.realityStability - 20);
    s.voidAttention = Math.min(100, s.voidAttention + 10);
    s.strain += 15;
  }
},
{
  type: "destruction",
  description: "A star dies. The void feeds.",
  effect: (s) => {
    s.universeHealth = Math.max(0, s.universeHealth - 12);
    s.voidAttention = Math.min(100, s.voidAttention + 8);
    s.planetHealth = Math.max(0, s.planetHealth - 3);
  }
}
];

