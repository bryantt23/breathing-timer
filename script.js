const LENGTH = 4,
  ROUNDS = 1;
const map = new Map();

map.set('INHALE', {
  length: LENGTH,
  message: `Breathe in through the nose for ${length} seconds, feel the stomach pushing out`,
  color: 'green'
});
map.set('HOLD', {
  length: LENGTH * 4,
  message: `Breathe in through the nose for ${length} seconds, feel the stomach pushing out`,
  color: 'yellow'
});
map.set('EXHALE', {
  length: LENGTH * 2,
  message: `Breathe in through the nose for ${length} seconds, feel the stomach pushing out`,
  color: 'red'
});

async function start() {
  for (let i = 0; i < ROUNDS; i++) {
    for (const elem of map.values()) {
      await countDown(elem);
    }
  }
}

async function countDown({ message, length, color }) {
  console.log(message);
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
