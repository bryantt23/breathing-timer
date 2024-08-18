import React, { useState, useEffect } from 'react'
import './BreathingTimer.css'
import { useSpeechSynthesis } from 'react-speech-kit'

const ROUNDS = 3;

function BreathingTimer() {
    const [breathLength, setBreathLength] = useState(localStorage.getItem("breath-length") || 5)
    const [message, setMessage] = useState(() => {
        return breathLength ? `Breathe in through the nose for ${breathLength} seconds, feel the stomach pushing out` : ""
    })
    const [disabled, setDisabled] = useState(false)
    const [round, setRound] = useState(1)
    const [backgroundColor, setBackgroundColor] = useState('red')
    const [count, setCount] = useState(breathLength)
    const { speak, voices } = useSpeechSynthesis()

    useEffect(() => {
        localStorage.setItem("breath-length", breathLength)
        setMessage(`Breathe in through the nose for ${breathLength} seconds, feel the stomach pushing out`)
    }, [breathLength])


    function handleSpeak(text, rate = 0.75, voiceIndex = 2) {
        speak({
            text,
            rate,
            voice: voices[voiceIndex]
        })
    }

    async function start() {
        setDisabled(true);
        const length = Number(breathLength);
        const map = new Map();
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
            handleSpeak(`Round ${i + 1}`);
            setRound(i + 1);
            for (const elem of map.values()) {
                await countDown(elem);
            }
        }
        console.log('Congrats you rock!');
        handleSpeak('Congrats you rock!');
        setMessage('Congrats you rock!');
        setDisabled(false)
    }

    async function countDown({ message, count, color, speech }) {
        setBackgroundColor(color)
        setMessage(message)
        handleSpeak(speech);

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
        <div style={{ backgroundColor }} className='container'>
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