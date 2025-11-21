"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { MahjongBoard } from './MahjongBoard';
import { LessonScenario, ActionType, BoardState, createTile } from '@/lib/game-engine/types';
import { scenarioValidator } from '@/lib/game-engine/scenario-validator';
import { toast } from 'sonner';
import { Lightbulb, X } from 'lucide-react';

interface ScenarioPlayerProps {
  scenario: LessonScenario;
  onComplete: () => void;
}

export function ScenarioPlayer({ scenario, onComplete }: ScenarioPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [boardState, setBoardState] = useState<BoardState>(scenario.steps[0].boardState);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [sortedTiles, setSortedTiles] = useState<{ [tileId: string]: 'suits' | 'honor' | 'special' }>({});
  const [hintDismissed, setHintDismissed] = useState(false);

  const currentStep = scenario.steps[currentStepIndex];
  const isLastStep = currentStepIndex === scenario.steps.length - 1;

  // Calculate progress for current step
  const getStepProgress = () => {
    if (currentStep.id === 'flip-tiles') {
      const flippedCount = boardState.centerTiles.filter(t => !t.faceUp).length;
      return `${flippedCount}/38 flipped`;
    }
    if (currentStep.id === 'create-pairs') {
      const pairsCount = boardState.centerTiles.filter(t => t.position.z && t.position.z > 0).length;
      return `${pairsCount}/19 pairs created`;
    }
    if (currentStep.id === 'arrange-wall') {
      const placedCount = boardState.centerTiles.filter(t => t.position.y > 500).length;
      return `${placedCount}/19 pairs placed in wall`;
    }
    if (currentStep.id === 'sorting-intro') {
      // Count tiles that have been moved off-screen (into bins)
      const sortedCount = boardState.centerTiles.filter(t => t.position.x < 0 || t.position.y < 0).length;
      return `${sortedCount}/15 sorted`;
    }
    return '';
  };

  const currentProgress = getStepProgress();

  // Calculate bin counts for Lesson 2
  const binCounts = {
    suits: Object.values(sortedTiles).filter(bin => bin === 'suits').length,
    honor: Object.values(sortedTiles).filter(bin => bin === 'honor').length,
    special: Object.values(sortedTiles).filter(bin => bin === 'special').length,
  };

  // Update board state when step changes
  useEffect(() => {
    setBoardState(currentStep.boardState);
    setShowHint(false);
    setHintIndex(0);
    setAttempts(0);
    setSortedTiles({});
    setHintDismissed(false);
  }, [currentStepIndex, currentStep]);

  const handleAction = useCallback((action: {
    type: ActionType;
    tileIds?: string[];
    targetPosition?: { x: number; y: number; z?: number };
    metadata?: any;
  }) => {
    setAttempts(prev => prev + 1);

    // Validate action against expected actions
    const validation = scenarioValidator.validateAnyAction(
      action,
      currentStep.expectedActions,
      boardState
    );

    if (validation.valid) {
      // Update board state based on action
      const newBoardState = applyAction(boardState, action);
      setBoardState(newBoardState);

      // Track sorted tiles by bin type for Lesson 2
      if (action.type === 'drag-tile' && currentStep.id === 'sorting-intro' && action.metadata?.binType && action.tileIds) {
        const newSortedTiles = {
          ...sortedTiles,
          [action.tileIds[0]]: action.metadata.binType
        };
        setSortedTiles(newSortedTiles);
        
        toast.success('Nice Job - Correct! ✓', {
          duration: 1500,
          style: {
            background: '#22c55e',
            color: 'white',
            border: 'none'
          }
        });

        // Auto-complete after 4 tiles sorted
        const sortedCount = Object.keys(newSortedTiles).length;
        if (sortedCount === 4) {
          setTimeout(() => {
            // Auto-sort remaining tiles
            const remainingTiles = newBoardState.centerTiles.filter(
              t => t.position.x >= 0 && t.position.y >= 0
            );
            
            const autoSortedState = {
              ...newBoardState,
              centerTiles: newBoardState.centerTiles.map(tile => {
                if (tile.position.x < 0) return tile; // Already sorted
                return {
                  ...tile,
                  position: { x: -1000, y: -1000, z: 0 }
                };
              })
            };
            
            // Track all remaining tiles as sorted
            const allSorted: any = { ...newSortedTiles };
            remainingTiles.forEach(tile => {
              if (tile.category === 'suit') allSorted[tile.id] = 'suits';
              else if (tile.category === 'honor') allSorted[tile.id] = 'honor';
              else allSorted[tile.id] = 'special';
            });
            setSortedTiles(allSorted);
            
            setBoardState(autoSortedState);
            toast.success('Auto-completing... Great job! 🎉', {
              duration: 2000,
              style: {
                background: '#22c55e',
                color: 'white',
                border: 'none'
              }
            });
            
            // Check if step is complete after auto-sort
            setTimeout(() => {
              const stepComplete = currentStep.expectedActions.some(expected =>
                expected.condition ? expected.condition(autoSortedState) : false
              );
              
              if (stepComplete) {
                toast.success('All tiles sorted! 🎉', {
                  duration: 1500,
                  icon: '🎉',
                  style: {
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none'
                  }
                });
                
                setTimeout(() => {
                  if (isLastStep) {
                    toast.success(scenario.completionMessage, {
                      duration: 3000,
                      icon: '🎉'
                    });
                    setTimeout(onComplete, 2000);
                  } else {
                    setCurrentStepIndex(prev => prev + 1);
                  }
                }, 1500);
              }
            }, 1000);
          }, 800);
        }
      }

      // Lesson 3 Step 1: Auto-flip after 4 tiles
      if (action.type === 'tap-tile' && currentStep.id === 'flip-tiles') {
        const flippedCount = newBoardState.centerTiles.filter(t => !t.faceUp).length;
        if (flippedCount === 4) {
          toast.success('Auto-flipping remaining tiles... Great job! 🎉', {
            duration: 2000,
            style: {
              background: '#8b5cf6',
              color: 'white',
              border: 'none'
            }
          });
          
          // Animate tiles flipping one by one
          let flipped = 0;
          const tilesToFlip = newBoardState.centerTiles.filter(t => t.faceUp);
          
          const flipInterval = setInterval(() => {
            if (flipped >= tilesToFlip.length) {
              clearInterval(flipInterval);
              return;
            }
            
            setBoardState(prev => ({
              ...prev,
              centerTiles: prev.centerTiles.map((tile, idx) => {
                if (tile.faceUp && idx === flipped + 4) {
                  return { ...tile, faceUp: false };
                }
                return tile;
              })
            }));
            
            flipped++;
          }, 50); // Flip every 50ms for smooth animation
        }
      }

      // Lesson 3 Step 2: Auto-pair after 1 pair created
      if (action.type === 'stack-tiles' && currentStep.id === 'create-pairs') {
        const pairedCount = newBoardState.centerTiles.filter(t => t.position.z && t.position.z > 0).length;
        if (pairedCount === 1) {
          toast.success('Auto-pairing tiles... Perfect! 🎉', {
            duration: 2000,
            style: {
              background: '#8b5cf6',
              color: 'white',
              border: 'none'
            }
          });
          
          // Animate tiles pairing up one by one
          let paired = 1; // Already have 1 pair
          const symbols = ['Sou1', 'Sou2', 'Pin3', 'Man4', 'Ton', 'Nan', 'Chun', 'Hatsu'];
          
          const pairInterval = setInterval(() => {
            if (paired >= 19) {
              clearInterval(pairInterval);
              // Move to next step
              setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
              }, 500);
              return;
            }
            
            setBoardState(prev => {
              const newTiles = [...prev.centerTiles];
              // Add a new pair at scattered positions
              const row = Math.floor(paired / 5);
              const col = paired % 5;
              const symbol = symbols[paired % symbols.length];
              
              newTiles.push(createTile(
                symbol as any,
                { x: 50 + col * 60, y: 100 + row * 70, z: 1 },
                false,
                false
              ));
              
              return {
                ...prev,
                centerTiles: newTiles
              };
            });
            
            paired++;
          }, 100); // Create pair every 100ms
        }
      }

      // Lesson 3 Step 3: Auto-arrange after 1 tile dragged to wall area
      if (action.type === 'drag-tile' && currentStep.id === 'arrange-wall') {
        const wallTiles = newBoardState.centerTiles.filter(t => t.position.y > 500);
        if (wallTiles.length === 1) {
          toast.success('Auto-arranging wall... Excellent! 🎉', {
            duration: 2000,
            style: {
              background: '#8b5cf6',
              color: 'white',
              border: 'none'
            }
          });
          
          // Animate remaining pairs moving to wall position one by one
          let arranged = 1; // Already have 1 in wall
          
          const arrangeInterval = setInterval(() => {
            if (arranged >= 19) {
              clearInterval(arrangeInterval);
              // Step complete - will auto-advance
              return;
            }
            
            setBoardState(prev => ({
              ...prev,
              centerTiles: prev.centerTiles.map((tile, idx) => {
                // Move next tile to wall position
                if (tile.position.y <= 500 && idx === arranged) {
                  return {
                    ...tile,
                    position: {
                      x: 50 + arranged * 35,
                      y: 550,
                      z: tile.position.z
                    }
                  };
                }
                return tile;
              })
            }));
            
            arranged++;
          }, 80); // Arrange every 80ms for smooth animation
        }
      }

      // Check if step is complete
      const stepComplete = currentStep.expectedActions.some(expected =>
        expected.condition ? expected.condition(newBoardState) : false
      );

      if (stepComplete) {
        // Step complete - move to next
        toast.success(currentStep.validationMessage?.success || 'Step complete!', {
          duration: 1500,
          icon: '🎉'
        });
        
        setTimeout(() => {
          if (isLastStep) {
            toast.success(scenario.completionMessage, {
              duration: 3000,
              icon: '🎉'
            });
            setTimeout(onComplete, 2000);
          } else {
            setCurrentStepIndex(prev => prev + 1);
          }
        }, 800);
      }
    } else {
      // Don't show error messages for drag actions in sorting
      // User is just exploring - no wrong moves in practice mode
      
      // Show hint after 3 failed attempts (only if not dismissed)
      if (!hintDismissed && attempts >= 2 && currentStep.hints && currentStep.hints.length > 0) {
        setShowHint(true);
      }
    }
  }, [boardState, currentStep, isLastStep, attempts, scenario.completionMessage, onComplete, sortedTiles, hintDismissed]);

  const handleNextHint = useCallback(() => {
    if (currentStep.hints && hintIndex < currentStep.hints.length - 1) {
      setHintIndex(prev => prev + 1);
    }
  }, [currentStep.hints, hintIndex]);

  const applyAction = (state: BoardState, action: {
    type: ActionType;
    tileIds?: string[];
    targetPosition?: { x: number; y: number; z?: number };
  }): BoardState => {
    // Create a deep copy to avoid mutations
    const newState = {
      ...state,
      centerTiles: [...state.centerTiles]
    };

    switch (action.type) {
      case 'tap-tile':
        // Flip tile or select it
        if (action.tileIds && action.tileIds.length > 0) {
          newState.centerTiles = newState.centerTiles.map(tile => {
            if (action.tileIds!.includes(tile.id)) {
              return { ...tile, faceUp: !tile.faceUp };
            }
            return tile;
          });
        }
        break;

      case 'drag-tile':
        // Move tile to new position
        if (action.tileIds && action.tileIds.length > 0 && action.targetPosition) {
          newState.centerTiles = newState.centerTiles.map(tile => {
            if (action.tileIds!.includes(tile.id)) {
              return {
                ...tile,
                position: {
                  x: action.targetPosition!.x,
                  y: action.targetPosition!.y,
                  z: tile.position.z || 0
                }
              };
            }
            return tile;
          });
        }
        break;

      case 'stack-tiles':
        // Stack one tile on top of another
        if (action.tileIds && action.tileIds.length === 2) {
          const [topTileId, bottomTileId] = action.tileIds;
          const bottomTile = newState.centerTiles.find(t => t.id === bottomTileId);
          
          if (bottomTile) {
            newState.centerTiles = newState.centerTiles.map(tile => {
              if (tile.id === topTileId) {
                return {
                  ...tile,
                  position: {
                    ...bottomTile.position,
                    z: (bottomTile.position.z || 0) + 1
                  }
                };
              }
              return tile;
            });
          }
        }
        break;
    }

    return newState;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Progress indicator */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">{scenario.title}</h3>
          <span className="text-xs text-muted-foreground">
            Step {currentStepIndex + 1} of {scenario.steps.length}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / scenario.steps.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Game board */}
      <div className="flex-1 p-4">
        <MahjongBoard
          boardState={boardState}
          onAction={handleAction}
          instruction={`${currentStep.instruction.split('(')[0].trim()}\n${currentProgress}`}
          showBins={scenario.exerciseId === 'tile-sorting'}
          binCounts={scenario.exerciseId === 'tile-sorting' ? binCounts : undefined}
          showWallGuide={currentStep.id === 'arrange-wall'}
        />
      </div>

      {/* Hint section */}
      <AnimatePresence>
        {showHint && currentStep.hints && currentStep.hints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-lg z-20"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 mb-1">Hint:</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {currentStep.hints[hintIndex]}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowHint(false);
                  setHintDismissed(true);
                }}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-amber-200 flex items-center justify-center transition-colors"
                aria-label="Dismiss hint"
              >
                <X className="w-4 h-4 text-amber-700" />
              </button>
            </div>
            {hintIndex < currentStep.hints.length - 1 && (
              <Button
                onClick={handleNextHint}
                size="sm"
                variant="ghost"
                className="mt-3 text-amber-700 hover:text-amber-900"
              >
                Show next hint
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

