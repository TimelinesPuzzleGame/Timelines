import { useState, useCallback } from 'react';
import { EventCard } from '../types';

export enum AnimationState {
  IDLE = 'idle',
  TETHERING = 'tethering',
  DETACHING = 'detaching',
  PLACING_CARD = 'placing_card',
  SHOWING_FEEDBACK = 'showing_feedback',
  ANIMATING_TIMELINE = 'animating_timeline'
}

interface AnimationContext {
  currentCard: EventCard | null;
  targetGapIndex: number | null;
  tetherPosition: { x: number; y: number } | null;
  tetherSide: 'left' | 'right' | null;
  isCorrectPlacement: boolean | null;
  feedbackPosition: { x: number; y: number } | null;
  placementStartPosition: { x: number; y: number } | null;
  placementTargetPosition: { x: number; y: number } | null;
}

export const useAnimationState = () => {
  const [state, setState] = useState<AnimationState>(AnimationState.IDLE);
  const [context, setContext] = useState<AnimationContext>({
    currentCard: null,
    targetGapIndex: null,
    tetherPosition: null,
    tetherSide: null,
    isCorrectPlacement: null,
    feedbackPosition: null,
    placementStartPosition: null,
    placementTargetPosition: null
  });

  const transition = useCallback((
    newState: AnimationState, 
    contextUpdates?: Partial<AnimationContext>
  ) => {
    setState(newState);
    if (contextUpdates) {
      setContext(prev => ({ ...prev, ...contextUpdates }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(AnimationState.IDLE);
    setContext({
      currentCard: null,
      targetGapIndex: null,
      tetherPosition: null,
      tetherSide: null,
      isCorrectPlacement: null,
      feedbackPosition: null,
      placementStartPosition: null,
      placementTargetPosition: null
    });
  }, []);

  const updateContext = useCallback((updates: Partial<AnimationContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    state,
    context,
    transition,
    reset,
    updateContext
  };
}; 