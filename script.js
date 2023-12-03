const LENGTH = 1,
  ROUNDS = 2;
const map = new Map();

const voices = speechSynthesis.getVoices();
const utterance = new SpeechSynthesisUtterance();
utterance.rate = 0.75;
utterance.voice = voices[2];

map.set('INHALE', {
  length: LENGTH,
  message: `Breathe in through the nose for ${LENGTH} seconds, feel the stomach pushing out`,
  color: 'green',
  speech: 'in'
});
map.set('HOLD', {
  length: LENGTH * 4,
  message: `Hold for ${
    LENGTH * 4
  } seconds, feel the oxygen coursing through your body`,
  color: 'yellow',
  speech: 'hold'
});
map.set('EXHALE', {
  length: LENGTH * 2,
  message: `Exhale through the mouth for ${
    LENGTH * 2
  } seconds, relax the stomach`,
  color: 'red',
  speech: 'out'
});

async function start() {
  for (let i = 0; i < ROUNDS; i++) {
    console.log(`Round ${i + 1}`);
    const utterance = new SpeechSynthesisUtterance(`Round ${i + 1}`);
    speechSynthesis.speak(utterance);
    for (const elem of map.values()) {
      await countDown(elem);
    }
  }
  console.log('congrats you rock');
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

async function countDown({ message, length, color, speech }) {
  console.log(message, color, speech);
  //say the speech using some voice api
  // Convert the speech text to spoken words
  const voices = speechSynthesis.getVoices();
  const utterance = new SpeechSynthesisUtterance(speech);
  utterance.rate = 0.75;

  // Optional: Set properties like voice, pitch, rate, volume etc.
  // utterance.voice = ...; // Select a voice from the available voices
  // utterance.pitch = 1; // Default is 1
  // utterance.rate = 1; // Default is 1
  // utterance.volume = 1; // Default is 1 (max)

  //   speechSynthesis.speak(utterance);

  //   if (voices.length === 0) {
  //     speechSynthesis.onvoiceschanged = () => {
  //       const voices = speechSynthesis.getVoices();
  //       utterance.voice = voices[2]; // Make sure this index exists
  //       speechSynthesis.speak(utterance);
  //     };
  //   } else {
  utterance.voice = voices[2]; // Make sure this index exists
  speechSynthesis.speak(utterance);
  //   }

  return new Promise(resolve => {
    const interval = setInterval(() => {
      console.log(length--);
      if (length === 0) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}
start();
// setTimeout(start, 1000);

/*
TODO

states:
not running
running
    inhale
    hold
    exhale
finished
    messages: congrats you rock
    color: light blue

messages:     
    inhale: Breathe in through the nose for {x} seconds, feel the stomach pushing out
    hold: Hold for {x*4} seconds, feel the oxygen coursing through your body
    exhale: Breathe out through the mouth for {x*2} seconds, feel the stomach pulling in

colors: 
    inhale: green
    hold: yellow
    exhale: red

breathCount:
secondsRemaining

ui
not running
    have seconds for input & start button
running
    reset button

sequence
enter seconds (default 4)
hit start button

loop 10 times
    inhale
    hold
    exhale

show finish message
reset    

maybe for each say what to do & have a countdown 

*/
