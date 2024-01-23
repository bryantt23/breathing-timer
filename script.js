const ROUNDS = 10;
const bodyElement = document.body;
const messageElement = document.querySelector('.message');
const countElement = document.querySelector('.count');
const roundElement = document.querySelector('.round');
const inputElement = document.querySelector('input[type="number"]');
const startButton = document.querySelector('.start');
const breathLengthInput = document.querySelector('.breath-length');

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
  const map = new Map();
  const length = Number(breathLengthInput.value);
  map.set('INHALE', {
    count: length,
    message: `Breathe in through the nose for ${length} seconds, feel the stomach pushing out`,
    color: 'green',
    speech: 'in'
  });
  map.set('HOLD', {
    count: length * 4,
    message: `Hold for ${
      length * 4
    } seconds, feel the oxygen coursing through your body`,
    color: 'yellow',
    speech: 'hold'
  });
  map.set('EXHALE', {
    count: length * 2,
    message: `Exhale through the mouth for ${
      length * 2
    } seconds, relax the stomach`,
    color: 'red',
    speech: 'out'
  });

  for (let i = 0; i < ROUNDS; i++) {
    console.log(`Round ${i + 1}`);
    speak(`Round ${i + 1}`);
    roundElement.textContent = `Round ${i + 1}`;
    for (const elem of map.values()) {
      await countDown(elem);
    }
  }
  console.log('Congrats you rock!');
  speak('Congrats you rock!');
  messageElement.textContent = 'Congrats you rock!';
  toggleInputs(false);
}

async function countDown({ message, count, color, speech }) {
  bodyElement.style.backgroundColor = color;
  messageElement.textContent = message;
  speak(speech);

  let remainingTime=count*1000;

  return new Promise(resolve => {
    const interval = setInterval(() => {
      countElement.textContent = (remainingTime/1000).toFixed(1);
      remainingTime-=500
      if (remainingTime < 0) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}

function listVoices() {
  voices = speechSynthesis.getVoices();
  voices.forEach((voice, index) => {
    console.log(`${index + 1}: ${voice.name} (${voice.lang})`);
  });
}

// It's a good idea to call this function after the 'voiceschanged' event,
// to ensure all voices are loaded, especially in some browsers.
speechSynthesis.onvoiceschanged = listVoices;
listVoices();

// Start the process
// start();

startButton.addEventListener('click', start);
