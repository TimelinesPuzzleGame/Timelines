import { useCallback, useRef } from 'react';

interface AnimationStep {
  id: string;
  duration: number;
  action: () => void;
  cleanup?: () => void;
}

interface AnimationSequence {
  id: string;
  steps: AnimationStep[];
  onComplete?: () => void;
}

export const useAnimationSequencer = () => {
  const activeSequences = useRef<Map<string, { timers: NodeJS.Timeout[]; cleanup: (() => void)[] }>>(new Map());

  const startSequence = useCallback((sequence: AnimationSequence) => {
    // Cancel any existing sequence with the same ID
    stopSequence(sequence.id);

    const timers: NodeJS.Timeout[] = [];
    const cleanup: (() => void)[] = [];
    let currentDelay = 0;

    sequence.steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        try {
          step.action();
          if (step.cleanup) {
            cleanup.push(step.cleanup);
          }

          // If this is the last step, run onComplete
          if (index === sequence.steps.length - 1 && sequence.onComplete) {
            sequence.onComplete();
          }
        } catch (error) {
          console.error(`Animation step ${step.id} failed:`, error);
        }
      }, currentDelay);

      timers.push(timer);
      currentDelay += step.duration;
    });

    activeSequences.current.set(sequence.id, { timers, cleanup });
  }, []);

  const stopSequence = useCallback((sequenceId: string) => {
    const sequence = activeSequences.current.get(sequenceId);
    if (sequence) {
      // Clear all timers
      sequence.timers.forEach(timer => clearTimeout(timer));
      
      // Run all cleanup functions
      sequence.cleanup.forEach(cleanupFn => {
        try {
          cleanupFn();
        } catch (error) {
          console.error(`Cleanup function failed:`, error);
        }
      });

      activeSequences.current.delete(sequenceId);
    }
  }, []);

  const stopAllSequences = useCallback(() => {
    Array.from(activeSequences.current.keys()).forEach(stopSequence);
  }, [stopSequence]);

  const isSequenceActive = useCallback((sequenceId: string) => {
    return activeSequences.current.has(sequenceId);
  }, []);

  return {
    startSequence,
    stopSequence,
    stopAllSequences,
    isSequenceActive
  };
}; 