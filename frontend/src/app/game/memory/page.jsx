"use client";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function MemoryGame() {
  const router = useRouter();

  // Create 36 cells for 6×6 grid
  const gridItems = Array.from({ length: 36 }, (_, i) => i);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Memory Match</h1>

      <div className={styles.grid}>
        {gridItems.map((item) => (
          <button key={item} className={styles.cell}>
            {""}
          </button>
        ))}
      </div>

      <button
        className={styles.switchBtn}
        onClick={() => router.push("/game/reaction")}
      >
        Switch Game
      </button>
    </div>
  );
}
