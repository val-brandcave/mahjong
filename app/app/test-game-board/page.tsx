"use client";

import { useState } from 'react';
import { MobileContainer } from '@/components/mobile/MobileContainer';
import { MobileHeader } from '@/components/mobile/MobileHeader';
import { ScenarioPlayer } from '@/components/game-board/ScenarioPlayer';
import { lesson02TileSorting } from '@/lib/game-engine/scenarios/lesson-02-tile-sorting';
import { lesson03WallBuilding } from '@/lib/game-engine/scenarios/lesson-03-wall-building';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TestGameBoardPage() {
  const router = useRouter();
  const [activeScenario, setActiveScenario] = useState<'lesson2' | 'lesson3' | null>(null);

  const handleComplete = () => {
    setActiveScenario(null);
  };

  if (activeScenario === 'lesson2') {
    return (
      <MobileContainer>
        <MobileHeader title="Lesson 2: Tile Sorting" showBack onBack={() => setActiveScenario(null)} />
        <div className="fixed inset-0 top-16 overflow-hidden">
          <ScenarioPlayer
            scenario={lesson02TileSorting}
            onComplete={handleComplete}
          />
        </div>
      </MobileContainer>
    );
  }

  if (activeScenario === 'lesson3') {
    return (
      <MobileContainer>
        <MobileHeader title="Lesson 3: Wall Building" showBack onBack={() => setActiveScenario(null)} />
        <div className="fixed inset-0 top-16 overflow-hidden">
          <ScenarioPlayer
            scenario={lesson03WallBuilding}
            onComplete={handleComplete}
          />
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <MobileHeader title="Game Board Test" showBack />
      
      <div className="mobile-content pt-16 space-y-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Interactive Game Board</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Test the scripted game engine with interactive scenarios from Lessons 2 and 3.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => setActiveScenario('lesson2')}
              className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
            >
              🎋 Lesson 2: Tile Sorting Exercise
            </Button>

            <Button
              onClick={() => setActiveScenario('lesson3')}
              className="w-full h-14 text-base font-semibold bg-secondary hover:bg-secondary/90"
            >
              🧱 Lesson 3: Wall Building Exercise
            </Button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">How it works:</h3>
          <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
            <li>Tap tiles to flip them face-down</li>
            <li>Drag tiles to move or stack them</li>
            <li>Follow on-screen instructions</li>
            <li>Invalid moves show error messages</li>
            <li>Hints appear after 3 failed attempts</li>
          </ul>
        </div>

        <Button
          onClick={() => router.push('/home')}
          variant="outline"
          className="w-full h-12"
        >
          Back to Home
        </Button>
      </div>
    </MobileContainer>
  );
}

