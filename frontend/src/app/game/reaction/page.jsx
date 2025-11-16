"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function GamePage() {
  const params = useSearchParams();
  const router = useRouter();
  const username = params.get("user");

  const [color, setColor] = useState("red");
  const [message, setMessage] = useState(
    "Click Start to begin. Click again once the screen turns green!"
  );
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const startGame = () => {
    setReactionTime(null);
    setMessage("Wait for green...");
    setColor("red");
    setWaiting(true);

    const randomDelay = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setColor("lightgreen");
      setMessage("Click now!");
      setStartTime(Date.now());
    }, randomDelay);
  };

  const handleClick = async () => {
    if (waiting && color === "lightgreen" && startTime) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setMessage(`Your reaction time: ${time} ms`);
      setWaiting(false);

      const res = await fetch("http://localhost:4000/api/updateReactionScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score: time }),
      });

      const data = await res.json();
      setMessage((m) => `${m} — ${data.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reaction Time Test</h2>

      <div
        className={styles.gameBox}
        style={{ backgroundColor: color }}
        onClick={handleClick}
      >
        <p className={styles.text}>{message}</p>
      </div>

      <button className={styles.button} onClick={startGame}>
        Start
      </button>

      {reactionTime && (
        <p className={styles.text}>Score saved for {username}</p>
      )}

      <button
        className={styles.button}
        style={{ marginTop: "auto", marginBottom: "40px" }}
        onClick={() => router.push(`/game/memory?user=${username}`)}
      >
        Switch Game
      </button>
    </div>
  );
}
