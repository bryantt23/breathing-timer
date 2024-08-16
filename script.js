const states = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED'
}

let currentState = states.IDLE

const TOTAL_ROUNDS = 3;
let currentRound = 1
const bodyElement = document.body;
const messageElement = document.querySelector('.message');
const countElement = document.querySelector('.count');
const roundElement = document.querySelector('.round');
const inputElement = document.querySelector('input[type="number"]');
const startButton = document.querySelector('.start');
const pauseButton = document.querySelector('.pause');
const breathLengthInput = document.querySelector('.breath-length');
let map

document.addEventListener('DOMContentLoaded', () => {
  const storedBreathLength = localStorage.getItem('breath-length');
  if (storedBreathLength) {
    breathLengthInput.value = storedBreathLength;
    countElement.textContent = storedBreathLength;
    messageElement.textContent = `Breathe in through the nose for ${storedBreathLength} seconds, feel the stomach pushing out`;
  }

  breathLengthInput.addEventListener('input', () => {
    localStorage.setItem('breath-length', breathLengthInput.value);
    messageElement.textContent = breathLengthInput.value;
    countElement.textContent = breathLengthInput.value;
    messageElement.textContent = `Breathe in through the nose for ${breathLengthInput.value} seconds, feel the stomach pushing out`;
  });
});

let voices;

function speak(text, rate = 0.75, voiceIndex = 2) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.voice = voices[voiceIndex];
  speechSynthesis.speak(utterance);
}

function toggleInputs(disabled) {
  const breathLengthInput = document.querySelector('.breath-length');
  const startButton = document.querySelector('.start');

  breathLengthInput.disabled = disabled;
  startButton.disabled = disabled;

  if (disabled) {
    startButton.classList.add('disabled');
    breathLengthInput.classList.add('disabled');
  } else {
    startButton.classList.remove('disabled');
    breathLengthInput.classList.remove('disabled');
  }
}

async function start() {
  toggleInputs(true);
  map = new Map();
  const length = Number(breathLengthInput.value);
  map.set('INHALE', {
    count: length,
    message: `Breathe in through the nose for ${length} seconds, feel the stomach pushing out`,
    color: 'green',
    speech: 'in'
  });
  map.set('HOLD', {
    count: length * 4,
    message: `Hold for ${length * 4
      } seconds, feel the oxygen coursing through your body`,
    color: 'yellow',
    speech: 'hold'
  });
  map.set('EXHALE', {
    count: length * 2,
    message: `Exhale through the mouth for ${length * 2
      } seconds, relax the stomach`,
    color: 'red',
    speech: 'out'
  });

  dispatch(states.RUNNING)
}

function pause() {
  dispatch(states.PAUSED)
}

async function dispatch(nextState) {
  currentState = nextState
  switch (nextState) {
    case states.RUNNING:
      startCountdownRound(currentRound)
      break;
    case states.PAUSED:
      console.log('Pausing timer')
      break;
    case states.COMPLETED:
      console.log('Congrats you rock!');
      speak('Congrats you rock!');
      messageElement.textContent = 'Congrats you rock!';
      toggleInputs(false);
      break
    default:

  }
}

function startCountdownRound(currentRound) {
  //base case
  if (currentRound === TOTAL_ROUNDS) {
    dispatch(states.COMPLETED)
    return
  }

  console.log(`Round ${currentRound}`);
  speak(`Round ${currentRound}`);
  roundElement.textContent = `Round ${currentRound}`;
  countDown(currentRound)

}

function countDown(currentRound) {
  countDownBreathPart(Array.from(map.values()), 0, currentRound);
}


async function countDownBreathPart(mapValues, pos, currentRound) {
  // base case
  if (currentRound === TOTAL_ROUNDS) {
    dispatch(states.COMPLETED)
    return;
  }

  const { message, count, color, speech } = mapValues[pos]
  bodyElement.style.backgroundColor = color;
  messageElement.textContent = message;
  speak(speech);

  let remainingTime = count * 1000;

  const interval = setInterval(() => {
    countElement.textContent = (remainingTime / 1000).toFixed(1);
    remainingTime -= 100
    if (remainingTime < 0) {
      clearInterval(interval);
      pos = (pos + 1) % mapValues.length
      if (pos === 0) {
        currentRound++
        startCountdownRound(currentRound)
      }
      else {
        countDownBreathPart(mapValues, pos, currentRound)
      }
    }
  }, 100);
}

function listVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach((voice, index) => {
    // console.log(`${index + 1}: ${voice.name} (${voice.lang})`);
  });
}

// It's a good idea to call this function after the 'voiceschanged' event,
// to ensure all voices are loaded, especially in some browsers.
speechSynthesis.onvoiceschanged = listVoices;
listVoices();

// Start the process
// start();

startButton.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
