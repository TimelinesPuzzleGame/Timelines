import { useCallback, RefObject } from 'react';
import { EventCard } from '../types';

interface UseGapCalculationProps {
  allCards: EventCard[];
  timelineRef: RefObject<HTMLDivElement>;
}

export const useGapCalculation = ({ allCards, timelineRef }: UseGapCalculationProps) => {
  
  const calculateGapIndex = useCallback((clientX: number): number => {
    if (!timelineRef.current || allCards.length === 0) return 0;
    
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const cardWidth = timelineRect.width / allCards.length;
    
    // Single authoritative gap calculation method
    // Find which gap the cursor is in using card centers as thresholds
    for (let i = 0; i < allCards.length; i++) {
      const cardCenterX = timelineRect.left + (i + 0.5) * cardWidth;
      if (clientX < cardCenterX) {
        return i;
      }
    }
    
    // If past all cards, return last gap
    return allCards.length;
  }, [allCards, timelineRef]);

  const calculateGapPosition = useCallback((gapIndex: number): { x: number; y: number } => {
    if (!timelineRef.current) return { x: 0, y: 0 };
    
    const timelineRect = timelineRef.current.getBoundingClientRect();
    const cardWidth = timelineRect.width / allCards.length;
    const timelineY = timelineRect.top + timelineRect.height / 2;
    
    let gapX: number;
    
    if (gapIndex === 0) {
      // Before first card
      const firstCardCenter = timelineRect.left + 0.5 * cardWidth;
      gapX = (timelineRect.left + firstCardCenter) / 2;
    } else if (gapIndex === allCards.length) {
      // After last card
      const lastCardCenter = timelineRect.left + (allCards.length - 0.5) * cardWidth;
      gapX = (lastCardCenter + timelineRect.right) / 2;
    } else {
      // Between cards
      const leftCardCenter = timelineRect.left + (gapIndex - 0.5) * cardWidth;
      const rightCardCenter = timelineRect.left + (gapIndex + 0.5) * cardWidth;
      gapX = (leftCardCenter + rightCardCenter) / 2;
    }
    
    return { x: gapX, y: timelineY };
  }, [allCards, timelineRef]);

  const isWithinTimelineBounds = useCallback((clientX: number): boolean => {
    if (!timelineRef.current) return false;
    
    const timelineRect = timelineRef.current.getBoundingClientRect();
    return clientX >= timelineRect.left && clientX <= timelineRect.right;
  }, [timelineRef]);

  return {
    calculateGapIndex,
    calculateGapPosition,
    isWithinTimelineBounds
  };
}; 