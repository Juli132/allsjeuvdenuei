// --- index_script.js ---

const introSentences = [
  "Reality Architect.",
  "Apprentice.",
  "That's what the job description said.",
  "I never really paid attention during training.",
  "\"The fate of this universe is in your hands,\" the guardians said.",
  "Then they left for their lunch break.",
  "...",
  "How hard can it be?"
];

const introElement = document.getElementById("intro-text");
const introOverlay = document.getElementById("intro");
let sentenceIndex = 0;
let typingTimeout;
let skipped = false;

// Type one sentence character by character
function typeSentence(sentence, callback) {
  let i = 0;
  introElement.innerHTML = "";

  function typeChar() {
    if (skipped) return;
    if (i < sentence.length) {
      introElement.innerHTML += sentence.charAt(i);
      i++;
      typingTimeout = setTimeout(typeChar, 50);
    } else {
      typingTimeout = setTimeout(callback, 1500);
    }
  }

  typeChar();
}

// Show sentences sequentially
function nextSentence() {
  if (skipped) return endIntro();

  if (sentenceIndex < introSentences.length) {
    typeSentence(introSentences[sentenceIndex], () => {
      if (skipped) return endIntro();
      introElement.style.opacity = 0;
      setTimeout(() => {
        if (skipped) return endIntro();
        introElement.style.opacity = 1;
        sentenceIndex++;
        nextSentence();
      }, 800);
    });
  } else {
    endIntro();
  }
}

// End intro and trigger tutorial
function endIntro() {
  clearTimeout(typingTimeout);
  introOverlay.style.display = "none";
  
  // Make sure game is hidden, tutorial will show it
  document.getElementById('game').style.display = 'none';
  
  // Start tutorial if afterIntro exists
  if (typeof window.afterIntro === "function") {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      window.afterIntro();
    }, 100);
  } else {
    // Fallback if afterIntro isn't defined yet
    document.getElementById("game").style.display = "block";
  }
}

// Skip intro on click
introOverlay.addEventListener("click", () => {
  skipped = true;
  endIntro();
});

// Start intro
nextSentence();