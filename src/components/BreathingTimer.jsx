import React from 'react'
import './BreathingTimer.css'

function BreathingTimer() {
    return (
        <div>
            <h1 className="message">
                Breathe in through the nose for 5 seconds, feel the stomach pushing out
            </h1>
            <div className="count">5</div>
            <div className="round medium-font">Round 1</div>
            <div className="medium-font">
                <label>Breath length</label>
                <input type="number" className="breath-length" value="5" min="4" max="21" step="0.1" />
            </div>
            <button className="start">Start</button>
        </div>
    )
}

export default BreathingTimer