import React, { useState, useEffect, useRef } from 'react'
import './BreathingTimer.css'
import { useSpeechSynthesis } from 'react-speech-kit'

const ROUNDS = 10;
const states = {
    IDLE: 'IDLE',
    INHALE: 'INHALE',
    HOLD: 'HOLD',
    EXHALE: 'EXHALE',
    COMPLETED: 'COMPLETED',
}

function BreathingTimer() {
    const [breathLength, setBreathLength] = useState(localStorage.getItem("breath-length") || 5)
    const [message, setMessage] = useState(() => {
        return breathLength ? `Breathe in through the nose for ${breathLength} seconds, feel the stomach pushing out` : ""
    })
    const [disabled, setDisabled] = useState(false)
    const [round, setRound] = useState(0)
    const [backgroundColor, setBackgroundColor] = useState('red')
    const [count, setCount] = useState(breathLength)
    const [currentState, setCurrentState] = useState(states.IDLE)
    const [breathMap, setBreathMap] = useState()

    const { speak, voices } = useSpeechSynthesis()
    const intervalRef = useRef(null)

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("breath-length", breathLength)
        setMessage(`Breathe in through the nose for ${breathLength} seconds, feel the stomach pushing out`)
    }, [breathLength])

    useEffect(() => {
        if (round === 0) {
            return
        }
        if (round === ROUNDS) {
            setCurrentState(states.COMPLETED)
            return;
        }
        handleSpeak(`Round ${round}`);
        setCurrentState(() => states.INHALE)
    }, [round])

    useEffect(() => {
        switch (currentState) {
            case states.IDLE:
                if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                }
                setDisabled(false)
                break;
            case states.INHALE:
            case states.HOLD:
            case states.EXHALE:
                countDown()
                break;
            case states.COMPLETED:
                handleSpeak('Congrats you rock!');
                setMessage('Congrats you rock!');
                setDisabled(false)
                setRound(0)
                break;
            default:
                console.error(`Unexpected state: ${currentState}`);
                break;
        }
    }, [currentState])

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
        map.set(states.INHALE, {
            count: length,
            message: `Breathe in through the nose for ${length} seconds, feel the stomach pushing out`,
            color: 'green',
            speech: 'in'
        });
        map.set(states.HOLD, {
            count: length * 4,
            message: `Hold for ${length * 4
                } seconds, feel the oxygen coursing through your body`,
            color: 'yellow',
            speech: 'hold'
        });
        map.set(states.EXHALE, {
            count: length * 2,
            message: `Exhale through the mouth for ${length * 2
                } seconds, relax the stomach`,
            color: 'red',
            speech: 'out'
        });
        setBreathMap(map)
        if (round === 0) {
            setRound(1)
        }
        else {
            setCurrentState(states.INHALE)
        }
    }

    function pause() {
        setCurrentState(states.IDLE)
    }

    function countDown() {
        const { message, count, color, speech } = breathMap.get(currentState)
        setBackgroundColor(color)
        setMessage(message)
        handleSpeak(speech);

        let remainingTime = count * 1000;

        intervalRef.current = setInterval(() => {
            setCount((remainingTime / 1000).toFixed(1))
            remainingTime -= 100
            if (remainingTime < 0) {
                clearInterval(intervalRef.current);

                if (currentState === states.INHALE) {
                    setCurrentState(() => states.HOLD)
                }
                else if (currentState === states.HOLD) {
                    setCurrentState(() => states.EXHALE)
                }
                else {
                    setRound(prev => prev + 1)
                }
            }
        }, 100);
    }

    return (
        <div style={{ backgroundColor }}
            className={"container"}
        >
            <div className={`paused-overlay ${currentState === states.IDLE && round > 0 ? 'visible' : 'hidden'}`}>
                Paused
            </div>
            <h1 className="message">
                {message}
            </h1>
            <div className="count">{count}</div>
            <div className="medium-font">Round {round}</div>
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
            <div>
                <button className="start"
                    disabled={disabled}
                    onClick={start}
                >Start</button>
                <button className="pause"
                    disabled={!disabled}
                    onClick={pause}
                >Pause</button>
            </div>
        </div>
    )
}

export default BreathingTimer