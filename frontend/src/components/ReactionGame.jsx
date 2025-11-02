"use client";
import { useState } from "react";

export default function ReactionGame({ username }) {
    const [color, setColor] = useState("red");
    const [message, setMessage] = useState("Click Start to begin. Click again once the screen turns green!");
    const [startTime, setStartTime] = useState(null);
    const [reactionTime, setReactionTime] = useState(null);
    const [waiting, setWaiting] = useState(false);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const startGame = () => {
        setReactionTime(null);
        setMessage("Wait for green...");
        setColor("red");
        setWaiting(true);

        const delay = Math.random() * 3000 + 2000; // 2–5s delay
        setTimeout(() => {
            setColor("green");
            setMessage("Click now!");
            setStartTime(Date.now());
        }, delay);
    };

    const handleClick = async () => {
        if (waiting && color === "green" && startTime) {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setMessage(`Your reaction time: ${time} ms`);
            setWaiting(false);

            const res = await fetch(`${API}/api/updateReactionScore`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, score: time }),
            });

            const data = await res.json();
            setMessage((m) => `${m} — ${data.message}`);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Reaction Time Game</h2>
            <div
                onClick={handleClick}
                style={{
                    width: 320,
                    height: 320,
                    backgroundColor: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 18,
                    cursor: "pointer",
                    margin: "1rem auto",
                }}
            >
                <p>{message}</p>
            </div>
            <button onClick={startGame}>Start</button>
            {reactionTime && <p>Score saved for {username}</p>}
        </div>
    );
}
