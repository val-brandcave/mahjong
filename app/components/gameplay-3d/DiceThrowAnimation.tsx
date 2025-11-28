"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Dice } from "./Dice";

interface DiceThrowAnimationProps {
  onComplete: () => void;
  startPosition: [number, number, number];
  playerName?: string; // For debugging
}

export function DiceThrowAnimation({ onComplete, startPosition }: DiceThrowAnimationProps) {
  const [phase, setPhase] = useState<"throwing" | "settling" | "done">("throwing");
  const startTime = useRef<number | null>(null);
  
  // Dice state
  const [dice1Pos, setDice1Pos] = useState<[number, number, number]>(startPosition);
  const [dice1Rot, setDice1Rot] = useState<[number, number, number]>([0, 0, 0]);
  const [dice2Pos, setDice2Pos] = useState<[number, number, number]>(startPosition);
  const [dice2Rot, setDice2Rot] = useState<[number, number, number]>([0, 0, 0]);

  // Fixed outcome: Dice 1 = 6, Dice 2 = 5
  const dice1Value = 6;
  const dice2Value = 5;

  useFrame(({ clock }) => {
    if (phase === "done") return;

    // Initialize start time
    if (startTime.current === null) {
      startTime.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTime.current;
    const throwDuration = 1.8; // Throwing phase
    const settleDuration = 0.7; // Settling phase

    if (phase === "throwing") {
      if (elapsed < throwDuration) {
        const progress = elapsed / throwDuration;
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Arc trajectory from start position to center
        const [startX, startY, startZ] = startPosition;
        const endX = 0;
        const endZ = 0;
        
        const x = startX + (endX - startX) * easeOut;
        const z = startZ + (endZ - startZ) * easeOut;
        const height = Math.sin(progress * Math.PI) * 0.8; // Arc height
        
        // Dice 1 (slight offset)
        const x1 = x - 0.15 + Math.sin(progress * Math.PI) * 0.05;
        const y1 = 0.2 + height;
        
        // Dice 2 (slight offset)
        const x2 = x + 0.15 - Math.sin(progress * Math.PI) * 0.05;
        const y2 = 0.2 + height * 0.9;
        
        // Rotation (tumbling)
        const rotSpeed1 = 8;
        const rotSpeed2 = 6;
        const rot1: [number, number, number] = [
          elapsed * rotSpeed1,
          elapsed * rotSpeed1 * 1.3,
          elapsed * rotSpeed1 * 0.7,
        ];
        const rot2: [number, number, number] = [
          elapsed * rotSpeed2 * 0.8,
          elapsed * rotSpeed2,
          elapsed * rotSpeed2 * 1.2,
        ];
        
        // Update positions
        setDice1Pos([x1, y1, z]);
        setDice1Rot(rot1);
        setDice2Pos([x2, y2, z]);
        setDice2Rot(rot2);
      } else {
        // Transition to settling
        setPhase("settling");
        startTime.current = clock.getElapsedTime();
      }
    } else if (phase === "settling") {
      if (elapsed < settleDuration) {
        const progress = elapsed / settleDuration;
        const bounce = Math.abs(Math.sin(progress * Math.PI * 3)) * 0.05 * (1 - progress);
        
        // Settle to final positions
        const finalY1 = 0.075 + bounce;
        const finalY2 = 0.075 + bounce * 0.8;
        
        // Gradually align to show correct face (top face)
        const targetRot1: [number, number, number] = [0, 0, 0]; // 6 on top
        const targetRot2: [number, number, number] = [Math.PI / 2, 0, 0]; // 5 on top
        
        // Interpolate rotation
        const lerpFactor = progress * 0.3;
        setDice1Pos([-0.15, finalY1, 0]);
        setDice1Rot([
          dice1Rot[0] + (targetRot1[0] - dice1Rot[0]) * lerpFactor,
          dice1Rot[1] + (targetRot1[1] - dice1Rot[1]) * lerpFactor,
          dice1Rot[2] + (targetRot1[2] - dice1Rot[2]) * lerpFactor,
        ]);
        
        setDice2Pos([0.15, finalY2, 0]);
        setDice2Rot([
          dice2Rot[0] + (targetRot2[0] - dice2Rot[0]) * lerpFactor,
          dice2Rot[1] + (targetRot2[1] - dice2Rot[1]) * lerpFactor,
          dice2Rot[2] + (targetRot2[2] - dice2Rot[2]) * lerpFactor,
        ]);
      } else {
        // Final position
        setDice1Pos([-0.15, 0.075, 0]);
        setDice1Rot([0, 0, 0]);
        setDice2Pos([0.15, 0.075, 0]);
        setDice2Rot([Math.PI / 2, 0, 0]);
        setPhase("done");
        onComplete();
      }
    }
  });

  return (
    <>
      <Dice position={dice1Pos} rotation={dice1Rot} value={dice1Value} />
      <Dice position={dice2Pos} rotation={dice2Rot} value={dice2Value} />
    </>
  );
}

