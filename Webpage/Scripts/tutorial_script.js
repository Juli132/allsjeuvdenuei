// --- tutorial_script.js ---

const tutorialText = `═══════════════════════════════════════
 THE ARCHITECT - How to Play
================================

> TERMINAL
The universe is a command line. Type words. 
If they have power, events happen.

> DICTIONARY
Type /dict to see discovered words.
Words have 10 uses. After that, they die.

> COMMANDS
/read     - Gain knowledge. Learn word meanings.
/pray     - Heal planet. Something else may hear you.
/sleep    - Reduce strain. Best during NIGHT phase (60-90).
/rest     - Quick strain reduction.
/meditate - Reduce void. Costs 3 knowledge.
/deep     - Major void reduction. Costs 50 knowledge.
/stats    - See all values.
/clear    - Clear terminal.
/sound    - enable/ disable sound
press ESC to pause and ESC again to resume. 
F11 to go to full screen 

> COSMIC CYCLE
Watch the PHASE indicator:
HARMONY (20-30, 70-80) → Best for meditation
NIGHT (60-90) → Best for sleep  
VOID (45-55) → Dangerous. Avoid risky actions.
NEUTRAL → Normal.

> STATS
Planet health, universe health, reality stability.
Let any hit zero. The universe ends.

Do not let Void influence increase.

If Strain is over 50, discovered words on the terminal will automatically trigger,
keep your Strain low. If Strain is too high, you may be too stressed to meditate. 

> WORDS
Each word has 10 uses. After that, it crumbles to dust.
Use them wisely. Discover new ones by typing anything.

═══════════════════════════════════════`;

const tutorialOverlay = document.getElementById("tutorial");
const tutorialOutput = document.getElementById("tutorial-output");
const tutorialChoices = document.getElementById("tutorial-choices");

let tutorialActive = true;

// Show choice buttons
function showChoices(choices, callback) {
  tutorialChoices.style.display = 'flex';
  tutorialChoices.innerHTML = '';
  
  choices.forEach(choiceText => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choiceText;
    btn.onclick = () => {
      tutorialChoices.style.display = 'none';
      tutorialChoices.innerHTML = '';
      callback(choiceText);
    };
    tutorialChoices.appendChild(btn);
  });
}

function addMachineMessage(text) {
  const lineDiv = document.createElement('div');
  lineDiv.style.color = 'lightblue';
  lineDiv.style.marginBottom = '12px';
  lineDiv.style.fontSize = '1.2em';
  lineDiv.style.padding = '5px 10px';
  lineDiv.style.borderLeft = '3px solid lightblue';
  lineDiv.textContent = text;
  tutorialOutput.appendChild(lineDiv);
  tutorialOutput.scrollTop = tutorialOutput.scrollHeight;
}

// Start tutorial
function startTutorial() {
  tutorialActive = true;
  tutorialOverlay.style.display = 'flex';
  tutorialOutput.innerHTML = '';
  
  // Clear any existing highlights
  document.querySelectorAll('.highlight').forEach(el => {
    el.classList.remove('highlight');
  });
  
  // Greeting
  addMachineMessage("Welcome, apprentice.");
  
  setTimeout(() => {
    addMachineMessage("Do you need a refresher on what to do?");
    
    showChoices(["I got this", "Sure, tell me"], (choice) => {
      if (choice === "I got this") {
        addMachineMessage("Then begin.");
        setTimeout(() => endTutorial(), 1500);
      } else {
        addMachineMessage("I'll send you the files. Read them.");
        
        // Display the manual
        const pre = document.createElement('pre');
        pre.style.color = 'lightblue';
        pre.style.fontSize = '1em';
        pre.style.lineHeight = '1.4em';
        pre.style.margin = '10px 0';
        pre.style.padding = '10px';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.fontFamily = 'monospace';
        pre.style.borderTop = '1px solid lightblue';
        pre.style.borderBottom = '1px solid lightblue';
        pre.textContent = tutorialText;
        tutorialOutput.appendChild(pre);
        tutorialOutput.scrollTop = tutorialOutput.scrollHeight;
        
        // Ask if they're ready
        addMachineMessage("Ready to begin?");
        
        showChoices(["Begin"], () => {
          addMachineMessage("Good. My purpose is to translate divine signals.");
          addMachineMessage("Don't break everything.");
          setTimeout(() => endTutorial(), 2000);
        });
      }
    });
  }, 500);
}

// End tutorial
function endTutorial() {
  tutorialActive = false;
  tutorialOverlay.style.display = 'none';
  tutorialChoices.style.display = 'none';
  tutorialChoices.innerHTML = '';
  document.getElementById('game').style.display = 'block';
  document.getElementById('player-input').focus();
  
  document.dispatchEvent(new Event('tutorialEnded'));
}

// After intro
window.afterIntro = function() {
  console.log("Intro finished, starting tutorial...");
  document.getElementById('game').style.display = 'none';
  startTutorial();
};