// --- tutorial_script.js ---

const tutorialText = `═══════════════════════════════════════
         REALITY ARCHITECT MANUAL
═══════════════════════════════════════

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

> COSMIC CYCLE
Watch the PHASE indicator:
HARMONY (20-30, 70-80) → Best for meditation
NIGHT (60-90) → Best for sleep  
VOID (45-55) → Dangerous. Avoid risky actions.
NEUTRAL → Normal.

> STATS
Planet health, universe health, reality stability.
Let any hit zero. The universe ends.

Do not let Void influence increase 

> WORDS
Each word has 10 uses. After that, it crumbles to dust.
Use them wisely. Discover new ones by typing anything.

═══════════════════════════════════════`;

const tutorialOverlay = document.getElementById("tutorial");
const tutorialOutput = document.getElementById("tutorial-output");
const tutorialChoices = document.getElementById("tutorial-choices");

let timeoutTimer = null;
let tutorialActive = true;

// Clear timeout
function clearTutorialTimeout() {
  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
}

// Show choice buttons
function showChoices(choices, callback) {
  tutorialChoices.style.display = 'flex';
  tutorialChoices.innerHTML = '';
  
  choices.forEach(choiceText => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choiceText;
    btn.onclick = () => {
      clearTutorialTimeout();
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
  
  // Greeting and question
  addMachineMessage("Welcome, apprentice.");
  
  setTimeout(() => {
    addMachineMessage("Do you need a refresher on what to do?");
    
    setTimeout(() => {
      // Show initial choice
      showChoices(["I got this", "Sure, tell me"], (choice) => {
        if (choice === "I got this") {
          addMachineMessage("Then begin.");
          setTimeout(() => endTutorial(), 1500);
        } else {
          // Send the files
          addMachineMessage("I'll send you the files. Read them.");
          
          setTimeout(() => {
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
            
            // After manual, ask if they're good
            setTimeout(() => {
              addMachineMessage("Read it?");
              
              setTimeout(() => {
                showChoices(["I'm good", "I don't need to"], (followUp) => {
                  if (followUp === "I'm good") {
                    addMachineMessage("Good. My purpose is to translate divine signals.");
                    addMachineMessage("Don't break everything.");
                    setTimeout(() => endTutorial(), 2000);
                  } else {
                    addMachineMessage("You sure?");
                    setTimeout(() => {
                      addMachineMessage("Fine. Good luck. You'll need it.");
                      setTimeout(() => endTutorial(), 2000);
                    }, 1000);
                  }
                });
                
                // 15 second timeout for follow-up choice
                timeoutTimer = setTimeout(() => {
                  tutorialChoices.style.display = 'none';
                  addMachineMessage("...");
                  setTimeout(() => {
                    addMachineMessage("Fine. Good luck.");
                    setTimeout(() => endTutorial(), 1500);
                  }, 1000);
                }, 15000);
                
              }, 500);
            }, 800);
          }, 800);
        }
      });
      
      // 10 second timeout for initial choice
      timeoutTimer = setTimeout(() => {
        tutorialChoices.style.display = 'none';
        addMachineMessage("...");
        setTimeout(() => {
          addMachineMessage("Fine. Good luck.");
          setTimeout(() => endTutorial(), 1500);
        }, 1000);
      }, 10000);
      
    }, 500);
  }, 500);
}

// End tutorial
function endTutorial() {
  tutorialActive = false;
  clearTutorialTimeout();
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