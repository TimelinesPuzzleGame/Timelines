import { useSpring, useSpringValue, useChain, useSpringRef } from '@react-spring/web';
import { useCallback } from 'react';

export const useSmoothAnimations = () => {
  
  // Flying ball animation with physics
  const useFlyingBallAnimation = (
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    isAttaching: boolean,
    onComplete?: () => void
  ) => {
    return useSpring({
      from: { x: fromX, y: fromY, scale: 0.8, opacity: 1 },
      to: { x: toX, y: toY, scale: 1, opacity: 1 },
      config: isAttaching 
        ? { tension: 280, friction: 120 } // Snap to position
        : { tension: 170, friction: 140 }, // Smooth departure
      onRest: onComplete
    });
  };

  // Burst effect animation
  const useBurstAnimation = (trigger: boolean) => {
    return useSpring({
      from: { scale: 0, opacity: 1 },
      to: { scale: trigger ? 2 : 0, opacity: trigger ? 0 : 1 },
      config: { tension: 300, friction: 10 },
      reset: trigger
    });
  };

  // Card placement animation with smooth physics
  const useCardPlacementAnimation = (
    fromX: number,
    fromY: number, 
    toX: number,
    toY: number,
    trigger: boolean,
    onComplete?: () => void
  ) => {
    return useSpring({
      from: { x: fromX, y: fromY, scale: 1, rotate: 0 },
      to: { 
        x: trigger ? toX : fromX, 
        y: trigger ? toY : fromY, 
        scale: trigger ? 1.1 : 1,
        rotate: trigger ? (Math.random() - 0.5) * 10 : 0 // Slight random rotation
      },
      config: { tension: 200, friction: 80 },
      onRest: onComplete
    });
  };

  // Feedback popup animation
  const useFeedbackAnimation = (isVisible: boolean, isCorrect: boolean) => {
    return useSpring({
      from: { scale: 0.5, opacity: 0, y: 20 },
      to: { 
        scale: isVisible ? 1.2 : 0.5, 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20 
      },
      config: isCorrect 
        ? { tension: 300, friction: 60 } // Bouncy for correct
        : { tension: 200, friction: 100 } // Smoother for incorrect
    });
  };

  // Timeline card spacing animation
  const useTimelineSpacingAnimation = (trigger: boolean) => {
    return useSpring({
      from: { scale: 1, x: 0 },
      to: { scale: trigger ? 1.05 : 1, x: trigger ? 0 : 0 },
      config: { tension: 280, friction: 120 }
    });
  };

  // Team bounce animation
  const useTeamBounceAnimation = (trigger: boolean) => {
    return useSpring({
      from: { scale: 1 },
      to: { scale: trigger ? 1.15 : 1 },
      config: { tension: 300, friction: 10 },
      reset: trigger
    });
  };

  // Poof disappear animation
  const usePoofAnimation = (trigger: boolean, onComplete?: () => void) => {
    return useSpring({
      from: { scale: 1, opacity: 1 },
      to: { scale: trigger ? 2 : 1, opacity: trigger ? 0 : 1 },
      config: { tension: 400, friction: 40 },
      onRest: onComplete,
      reset: trigger
    });
  };

  return {
    useFlyingBallAnimation,
    useBurstAnimation,
    useCardPlacementAnimation,
    useFeedbackAnimation,
    useTimelineSpacingAnimation,
    useTeamBounceAnimation,
    usePoofAnimation
  };
}; 