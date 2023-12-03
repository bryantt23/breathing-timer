const LENGTH = 4,
  ROUNDS = 2;
const map = new Map();

const bodyElement = document.body;
const messageElement = document.querySelector('.message');
const countElement = document.querySelector('.count');
const roundElement = document.querySelector('.round');
const inputElement = document.querySelector('input[type="number"]');
const startButton = document.querySelector('.start');

map.set('INHALE', {
  count: LENGTH,
  message: `Breathe in through the nose for ${LENGTH} seconds, feel the stomach pushing out`,
  color: 'green',
  speech: 'in'
});
map.set('HOLD', {
  count: LENGTH * 4,
  message: `Hold for ${
    LENGTH * 4
  } seconds, feel the oxygen coursing through your body`,
  color: 'yellow',
  speech: 'hold'
});
map.set('EXHALE', {
  count: LENGTH * 2,
  message: `Exhale through the mouth for ${
    LENGTH * 2
  } seconds, relax the stomach`,
  color: 'red',
  speech: 'out'
});

function speak(text, rate = 0.75, voiceIndex = 2) {
  const voices = speechSynthesis.getVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;

  if (voices.count > voiceIndex) {
    utterance.voice = voices[voiceIndex];
  } else {
    console.warn('Selected voice index not available. Using default voice.');
  }

  speechSynthesis.speak(utterance);
}

async function start() {
  for (let i = 0; i < ROUNDS; i++) {
    console.log(`Round ${i + 1}`);
    speak(`Round ${i + 1}`);
    roundElement.textContent = `${i + 1}`;
    for (const elem of map.values()) {
      await countDown(elem);
    }
  }
  console.log('congrats you rock');
  speak('congrats you rock');
}

async function countDown({ message, count, color, speech }) {
  console.log(message, color, speech);
  bodyElement.style.backgroundColor = color;
  messageElement.textContent = message;
  speak(speech);

  return new Promise(resolve => {
    const interval = setInterval(() => {
      countElement.textContent = count;
      console.log(count--);
      if (count === 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

function listVoices() {
  const voices = speechSynthesis.getVoices();
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
