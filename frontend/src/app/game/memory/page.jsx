"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

// Import all 18 images from src/app
import autumnleaf from "@/app/autumnleaf.png";
import basketball from "@/app/basketball.png";
import books from "@/app/books.png";
import chocolate from "@/app/chocolate.png";
import christmastree from "@/app/christmastree.png";
import cupcake from "@/app/cupcake.png";
import domino from "@/app/domino.png";
import gameconsole from "@/app/gameconsole.png";
import jam from "@/app/jam.png";
import luffyhat from "@/app/luffyhat.png";
import penguin from "@/app/penguin.png";
import popcorn from "@/app/popcorn.png";
import ship from "@/app/ship.png";
import snowman from "@/app/snowman.png";
import sun from "@/app/sun.png";
import testtube from "@/app/testtube.png";
import umbrella from "@/app/umbrella.png";
import witchhat from "@/app/witchhat.png";

export default function MemoryGame() {
  const router = useRouter();
  const params = useSearchParams();
  const username = params.get("user");

  // List of all image imports
  const images = [
    autumnleaf, basketball, books, chocolate, christmastree,
    cupcake, domino, gameconsole, jam, luffyhat,
    penguin, popcorn, ship, snowman, sun,
    testtube, umbrella, witchhat
  ];

  // Create pairs and shuffle
  const generateShuffledTiles = () => {
    const allTiles = [...images, ...images] // 18 pairs
      .map((img, index) => ({ id: index, img, revealed: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    return allTiles;
  };

  const [tiles, setTiles] = useState(generateShuffledTiles());
  const [selected, setSelected] = useState([]); // holds 2 clicked tiles
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Handle tile click
  const handleTileClick = (index) => {
    const tile = tiles[index];

    // ignore if already revealed/matched
    if (tile.revealed || tile.matched) return;

    // start timer on first click
    if (!isRunning) setIsRunning(true);

    const updated = [...tiles];
    updated[index].revealed = true;
    setTiles(updated);

    const newSelected = [...selected, { index, img: tile.img }];
    setSelected(newSelected);

    // When 2 tiles have been selected, check match
    if (newSelected.length === 2) {
      setTimeout(() => checkMatch(newSelected), 800);
    }
  };

  // Match logic
  const checkMatch = (pair) => {
    const [a, b] = pair;

    if (a.img === b.img) {
      // Correct match
      const updated = [...tiles];
      updated[a.index].matched = true;
      updated[b.index].matched = true;
      setTiles(updated);
      setPoints((p) => p + 1);

      // All pairs found
      if (points + 1 === 18) {
        setIsRunning(false); // stop timer
      }
    } else {
      // Not a match → flip back
      const updated = [...tiles];
      updated[a.index].revealed = false;
      updated[b.index].revealed = false;
      setTiles(updated);
    }

    setSelected([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Memory Match</h1>

      <p className={styles.info}>
        Points: {points} / 18 &nbsp;|&nbsp; Time: {timer}s
      </p>

      <div className={styles.grid}>
        {tiles.map((tile, idx) => (
          <button
            key={tile.id}
            className={`${styles.cell} ${tile.revealed || tile.matched ? styles.revealed : ""}`}
            onClick={() => handleTileClick(idx)}
          >
            {(tile.revealed || tile.matched) && (
              <img src={tile.img.src} alt="" className={styles.img}/>
            )}
          </button>
        ))}
      </div>

      <button
        className={styles.switchBtn}
        style={{ marginTop: "auto", marginBottom: "40px" }}
        onClick={() => router.push(`/game/reaction?user=${username}`)}
      >
        Switch Game
      </button>
    </div>
  );
}
