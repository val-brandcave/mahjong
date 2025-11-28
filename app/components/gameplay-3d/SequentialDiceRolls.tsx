"use client";

import React, { useState, useEffect } from "react";
import { DiceThrowAnimation } from "./DiceThrowAnimation";

interface SequentialDiceRollsProps {
  onAllComplete: () => void;
}

type RollPhase = "player" | "opponent1" | "opponent2" | "opponent3" | "complete";

export function SequentialDiceRolls({ onAllComplete }: SequentialDiceRollsProps) {
  const [currentPhase, setCurrentPhase] = useState<RollPhase>("player");
  const [currentDiceVisible, setCurrentDiceVisible] = useState<string | null>("player");

  const handleDiceComplete = (player: string) => {
    console.log(`🎲 ${player} dice settled`);
    
    // Hide current dice after 1 second
    setTimeout(() => {
      console.log(`🎲 ${player} dice disappearing`);
      setCurrentDiceVisible(null);
      
      // Wait a brief moment, then start next roll
      setTimeout(() => {
        if (currentPhase === "player") {
          setCurrentPhase("opponent1");
          setCurrentDiceVisible("opponent1");
        } else if (currentPhase === "opponent1") {
          setCurrentPhase("opponent2");
          setCurrentDiceVisible("opponent2");
        } else if (currentPhase === "opponent2") {
          setCurrentPhase("opponent3");
          setCurrentDiceVisible("opponent3");
        } else if (currentPhase === "opponent3") {
          setCurrentPhase("complete");
          onAllComplete();
        }
      }, 300); // Brief gap between rolls
    }, 1000); // Dice visible for 1s after settling
  };

  // Dice start positions for each player
  const positions: { [key: string]: [number, number, number] } = {
    player: [0, 0.2, 1.5],        // South - from player
    opponent1: [2.3, 0.2, 0],     // East - from blue
    opponent2: [0, 0.2, -1.5],    // North - from pink
    opponent3: [-2.3, 0.2, 0],    // West - from green
  };

  return (
    <>
      {currentDiceVisible === "player" && (
        <DiceThrowAnimation
          startPosition={positions.player}
          onComplete={() => handleDiceComplete("player")}
          playerName="Player"
        />
      )}
      {currentDiceVisible === "opponent1" && (
        <DiceThrowAnimation
          startPosition={positions.opponent1}
          onComplete={() => handleDiceComplete("opponent1")}
          playerName="Opponent 1"
        />
      )}
      {currentDiceVisible === "opponent2" && (
        <DiceThrowAnimation
          startPosition={positions.opponent2}
          onComplete={() => handleDiceComplete("opponent2")}
          playerName="Opponent 2"
        />
      )}
      {currentDiceVisible === "opponent3" && (
        <DiceThrowAnimation
          startPosition={positions.opponent3}
          onComplete={() => handleDiceComplete("opponent3")}
          playerName="Opponent 3"
        />
      )}
    </>
  );
}

