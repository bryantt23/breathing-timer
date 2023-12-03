const LENGTH = 1,
  ROUNDS = 2;
const map = new Map();

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
    for (const elem of map.values()) {
      await countDown(elem);
    }
  }
  console.log('congrats you rock');
}

async function countDown({ message, length, color, speech }) {
  console.log(message, color, speech);
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
