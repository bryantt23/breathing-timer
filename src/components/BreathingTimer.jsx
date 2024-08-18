import React, { useState, useEffect } from 'react'
import './BreathingTimer.css'

const ROUNDS = 3;
let voices;
function speak(text, rate = 0.75, voiceIndex = 2) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.voice = voices[voiceIndex];
    speechSynthesis.speak(utterance);
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

function BreathingTimer() {
    const [breathLength, setBreathLength] = useState(localStorage.getItem("breath-length") || 5)
    const [message, setMessage] = useState(() => {
        return breathLength ? `Breathe in through the nose for ${breathLength} seconds, feel the stomach pushing out` : ""
    })
    const [disabled, setDisabled] = useState(false)
    const [round, setRound] = useState(1)
    const [backgroundColor, setBackgroundColor] = useState('red')
    const [count, setCount] = useState(localStorage.getItem("breath-length") || 5)

    useEffect(() => {
        localStorage.setItem("breath-length", breathLength)
        setMessage(`Breathe in through the nose for ${breathLength} seconds, feel the stomach pushing out`)
    }, [breathLength])

    async function start() {
        setDisabled(true);
        const map = new Map();
        const length = Number(breathLength);
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

        for (let i = 0; i < ROUNDS; i++) {
            console.log(`Round ${i + 1}`);
            speak(`Round ${i + 1}`);
            setRound(i + 1);
            for (const elem of map.values()) {
                await countDown(elem);
            }
        }
        console.log('Congrats you rock!');
        speak('Congrats you rock!');
        setMessage('Congrats you rock!');
        setDisabled(false)
    }


    async function countDown({ message, count, color, speech }) {
        setBackgroundColor(color)
        setMessage(message)
        speak(speech);

        let remainingTime = count * 1000;

        return new Promise(resolve => {
            const interval = setInterval(() => {
                setCount((remainingTime / 1000).toFixed(1))
                remainingTime -= 100
                if (remainingTime < 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }

    return (
        <div style={{ backgroundColor }}>
            <h1 className="message">
                {message}
            </h1>
            <div className="count">{count}</div>
            <div className="round medium-font">Round {round}</div>
            <div className="medium-font">
                <label>Breath length</label>
                <input
                    type="number"
                    className="breath-length"
                    value={breathLength}
                    disabled={disabled}
                    onChange={e => setBreathLength(e.target.value)}
                    min="4"
                    max="21"
                    step="0.1" />
            </div>
            <button className="start"
                disabled={disabled}
                onClick={start}
            >Start</button>
        </div>
    )
}

export default BreathingTimer