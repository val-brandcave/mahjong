// Validates user actions against expected scenario steps

import { BoardState, ExpectedAction, ActionType } from './types';

export class ScenarioValidator {
  validateAction(
    action: {
      type: ActionType;
      tileIds?: string[];
      targetPosition?: { x: number; y: number; z?: number };
    },
    expected: ExpectedAction,
    currentState: BoardState
  ): { valid: boolean; message?: string } {
    // Type must match
    if (action.type !== expected.type) {
      return {
        valid: false,
        message: `Expected ${expected.type}, got ${action.type}`
      };
    }

    // NOTE: We don't check the condition here anymore - the condition is only
    // used to determine if the STEP is complete, not if individual actions are valid.
    // This allows users to perform multiple valid actions (like tapping tiles)
    // until the step completion condition is met.

    // Validate tile IDs if specified
    if (expected.tileIds && action.tileIds) {
      const expectedSet = new Set(expected.tileIds);
      const actionSet = new Set(action.tileIds);
      
      // Check if action tiles match expected tiles
      const matches = action.tileIds.every(id => expectedSet.has(id));
      if (!matches) {
        return {
          valid: false,
          message: 'Wrong tiles selected'
        };
      }
    }

    // Validate target position if specified
    if (expected.targetPosition && action.targetPosition) {
      const { x, y } = expected.targetPosition;
      const threshold = 50; // pixels
      
      const xMatch = Math.abs(action.targetPosition.x - x) < threshold;
      const yMatch = Math.abs(action.targetPosition.y - y) < threshold;
      
      if (!xMatch || !yMatch) {
        return {
          valid: false,
          message: 'Not the right position'
        };
      }
    }

    return { valid: true };
  }

  // Check if any of the expected actions are satisfied
  validateAnyAction(
    action: {
      type: ActionType;
      tileIds?: string[];
      targetPosition?: { x: number; y: number; z?: number };
    },
    expectedActions: ExpectedAction[],
    currentState: BoardState
  ): { valid: boolean; message?: string } {
    for (const expected of expectedActions) {
      const result = this.validateAction(action, expected, currentState);
      if (result.valid) {
        return { valid: true };
      }
    }

    return {
      valid: false,
      message: 'That move is not valid here. Try something else!'
    };
  }
}

export const scenarioValidator = new ScenarioValidator();

