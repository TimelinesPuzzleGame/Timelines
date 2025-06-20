import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { EventCard, PartyGameState } from "../lib/types";
import YouTubeClipPlayer from "./YouTubeClipPlayer";
import FormattedDate from "./FormattedDate";
import TimelineCardWithTooltip from "./TimelineCardWithTooltip";
import { useGapCalculation } from "../lib/hooks/useGapCalculation";
import { useAnimationState, AnimationState } from "../lib/hooks/useAnimationState";
import { useAnimationSequencer } from "../lib/hooks/useAnimationSequencer";
import { useSmoothAnimations } from "../lib/hooks/useSmoothAnimations";
import { animated } from '@react-spring/web';
import Image from "next/image";

type PlacedCard = { card: EventCard; correct: boolean };

interface BigScreenPartyModeProps {
  currentCard: EventCard;
  anchorCard: EventCard;
  timeline: PlacedCard[];
  teams: Array<{ name: string; score: number }>;
  currentTurn: number;
  onCardPlacement: (correct: boolean) => void;
  locked: boolean;
  justPlacedCard?: EventCard | null;
  puzzle?: { topic: string };
  onQuit: () => void;
  onContinue?: () => void;
}

export default function BigScreenPartyMode({
  currentCard,
  anchorCard,
  timeline,
  teams,
  currentTurn,
  onCardPlacement,
  locked,
  justPlacedCard = null,
  puzzle,
  onQuit,
  onContinue,
}: BigScreenPartyModeProps) {
  // 🎯 EASILY REVERTABLE PING EFFECT SETTINGS
  const CARD_PING_COUNT = 6; // Change back to 3 to revert
  const CARD_PING_SCALE = 2.0; // Change back to 1.5 to revert
  const CARD_PING_DELAY = 80; // Change back to 100 to revert (ms between pings)
  // Animation state management - replacing 12+ scattered state variables
  const { state: animationState, context: animationContext, transition, reset: resetAnimation, updateContext } = useAnimationState();
  
  // Animation sequencer - replacing setTimeout hell
  const { startSequence, stopSequence, stopAllSequences } = useAnimationSequencer();
  
  // Smooth animations - replacing manual timing with physics
  const smoothAnimations = useSmoothAnimations();
  
  // Refs and basic state
  const timelineRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoEndedRef = useRef(false);
  
  // --- Move videoId definition here ---
  // Extract videoId from currentCard if available
  const videoId = currentCard && (currentCard as any).videoId ? (currentCard as any).videoId : (currentCard && (currentCard as any).youtube ? extractYouTubeId((currentCard as any).youtube) : null);
  // Helper to extract YouTube ID from URL
  function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/);
    return match ? match[1] : null;
  }
  
  // Enhanced UI state
  const [showCursorCard, setShowCursorCard] = useState(false);
  const [tetherTarget, setTetherTarget] = useState<{x: number, y: number, side?: 'left' | 'right'} | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [flyingBall, setFlyingBall] = useState<{fromX: number, fromY: number, toX: number, toY: number, progress: number, isAttaching: boolean} | null>(null);
  const [feedbackPosition, setFeedbackPosition] = useState<{x: number, y: number, isCorrect: boolean} | null>(null);
  const [previewCardPosition, setPreviewCardPosition] = useState<{x: number, y: number, index: number} | null>(null);

  // Placement and animation state
  const [placementAnimation, setPlacementAnimation] = useState<{
    cardId: string, 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number,
    isMagnetic?: boolean,
    elasticConfig?: {
      tension: number,
      friction: number,
      overshootClamping: boolean
    }
  } | null>(null);
  const [animatingCards, setAnimatingCards] = useState<string[]>([]);
  const [incorrectCardPositions, setIncorrectCardPositions] = useState<Map<string, {x: number, y: number}>>(new Map());
  const [disappearingCards, setDisappearingCards] = useState<string[]>([]);
  const [bounceTeam, setBounceTeam] = useState<number | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isOverVideo, setIsOverVideo] = useState(false);
  const [burstEffects, setBurstEffects] = useState<Array<{ x: number, y: number, id: number }>>([]);
  const [scorePingEffects, setScorePingEffects] = useState<Array<{ teamIndex: number, pointIndex: number, id: number }>>([]);
  const [cardPingEffects, setCardPingEffects] = useState<Array<{ cardId: string, isCorrect: boolean, id: number }>>([]);

  // Add aspect ratio state
  const [aspectRatio, setAspectRatio] = useState<number>(window.innerWidth / window.innerHeight);

  // State for the placeable area
  const [placeableArea, setPlaceableArea] = useState<{ top: number; height: number } | null>(null);

  // Add new state for full screen mode
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Add effect to update aspect ratio on resize
  useEffect(() => {
    const updateAspectRatio = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };
    window.addEventListener('resize', updateAspectRatio);
    return () => window.removeEventListener('resize', updateAspectRatio);
  }, []);

  // Reset video ended state when card changes
  useEffect(() => {
    setVideoEnded(false);
    // 🚀 FIXED: Cancel all running animations when card changes (prevents conflicts)
    stopAllSequences();
  }, [currentCard.id, stopAllSequences]);

  useLayoutEffect(() => {
    function updatePlaceableArea() {
      if (timelineRef.current && videoContainerRef.current) {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const videoRect = videoContainerRef.current.getBoundingClientRect();
        const top = timelineRect.top;
        const height = Math.max(0, videoRect.bottom - timelineRect.top);
        setPlaceableArea({ top, height });
      } else {
        setPlaceableArea(null);
      }
    }
    updatePlaceableArea();
    window.addEventListener('resize', updatePlaceableArea);
    return () => window.removeEventListener('resize', updatePlaceableArea);
  }, [currentCard, locked, videoId]);

  // Add bounce-scale animation CSS
  const bounceScaleCSS = `
    @keyframes bounce-scale {
      0% { transform: scale(0.3); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes team-bounce-in {
      0% { transform: scale(0.7); opacity: 0.7; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes placementMove {
      0% { transform: translate(-50%, -50%); }
      100% { transform: translate(calc(-50% + var(--to-x)), calc(-50% + var(--to-y))); }
    }
    
    @keyframes magneticSnap {
      0% { 
        transform: translate(-50%, -50%) scale(1); 
      }
      30% { 
        transform: translate(calc(-50% + var(--to-x) * 1.1), calc(-50% + var(--to-y) * 1.1)) scale(1.05);
      }
      60% {
        transform: translate(calc(-50% + var(--to-x) * 0.95), calc(-50% + var(--to-y) * 0.95)) scale(0.98);
      }
      80% {
        transform: translate(calc(-50% + var(--to-x) * 1.02), calc(-50% + var(--to-y) * 1.02)) scale(1.01);
      }
      100% { 
        transform: translate(calc(-50% + var(--to-x)), calc(-50% + var(--to-y))) scale(1);
      }
    }
    
    @keyframes poof {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes feedbackPoof {
      0% { transform: scale(0.5); opacity: 0; }
      20% { transform: scale(1.2); opacity: 1; }
      80% { transform: scale(1); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes burst {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    
    @keyframes scorePing {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(3); opacity: 0; }
    }
    
    @keyframes cardPing {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(${CARD_PING_SCALE}); opacity: 0; }
    }
  `;

  // Calculate timeline cards (excluding incorrect cards)
  const preAnchor = timeline.filter((p) => p?.card?.date !== undefined && p.card.date < anchorCard.date && !incorrectCardPositions.has(p.card.id));
  const postAnchor = timeline.filter((p) => p?.card?.date !== undefined && p.card.date >= anchorCard.date && !incorrectCardPositions.has(p.card.id));
  const allCards = [
    ...preAnchor.map((p) => p.card).filter(Boolean),
    anchorCard,
    ...postAnchor.map((p) => p.card).filter(Boolean)
  ].filter(card => card && card.id);

  // Gap calculation - NOW that allCards is defined
  const { calculateGapIndex, calculateGapPosition, isWithinTimelineBounds } = useGapCalculation({
    allCards,
    timelineRef
  });

  // Track mouse position and calculate tether
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over video area - adjust for fullscreen mode
      let videoBottom = 0;
      if (isFullScreen) {
        // In fullscreen, video takes up entire viewport, so use a different approach
        videoBottom = window.innerHeight * 0.5; // Use middle of screen as cutoff
      } else {
        videoBottom = document.querySelector('iframe, img, div[class*="youtube"]')?.getBoundingClientRect()?.bottom || 0;
      }
      const overVideo = e.clientY < videoBottom;
      
      // Update video state
      setIsOverVideo(overVideo);
      
      if (allCards.length > 0) {
        const timelineRect = timelineRef.current?.getBoundingClientRect();
        if (timelineRect) {
          const timelineY = timelineRect.top + timelineRect.height / 2;
          const cardWidth = timelineRect.width / allCards.length;
          
          // Simple check - only create tether if timeline is visible
          const timelineVisible = timelineRect.width > 100 && 
                                timelineRect.height > 5 &&
                                timelineRect.top > 0 && 
                                timelineRect.top < window.innerHeight;
          
          if (!overVideo && timelineVisible) {
            // Calculate positioning based on flexbox layout, not manual calculations
            // Each timeline card takes up flex-1 space within the timeline container
            const slotCount = allCards.length + 1; // +1 for the new card being placed
            
            // Determine which slot the cursor is hovering over
            const x = e.clientX - timelineRect.left;
            const slotWidth = timelineRect.width / slotCount;
            let targetIndex = Math.floor(x / slotWidth);
            targetIndex = Math.max(0, Math.min(targetIndex, allCards.length));
            
                        // Calculate where this slot would be positioned in the final flexbox layout
            const finalCardX = timelineRect.left + (targetIndex + 0.5) * slotWidth;
            
            // MEASURE actual timeline card position instead of guessing
            let finalCardY = timelineRect.top - 100; // fallback
            
            // Find any existing timeline card to measure its position
            const existingCard = timelineRef.current?.querySelector('[data-timeline-card]') as HTMLElement;
            if (existingCard) {
              const cardRect = existingCard.getBoundingClientRect();
              // Use the actual Y position of real timeline cards
              finalCardY = cardRect.top;
            }
            
            // Timeline dot is below the card - position tether there
            const timelineDotY = timelineRect.top + timelineRect.height - 20; // At the dot level
            
            // Set preview card position (always calculate this for preview card)
            setPreviewCardPosition({ 
              x: finalCardX, 
              y: finalCardY, 
              index: targetIndex 
            });
            
            // Only set tether target if cursor card is enabled (keep tether disabled)
            if (showCursorCard) {
              setTetherTarget({ 
                x: finalCardX, 
                y: timelineDotY
              });
            }
          } else {
            // Clear preview and tether when not over timeline
            setPreviewCardPosition(null);
            setTetherTarget(null);
          }
        }
      }
    };

    // Always listen for mouse moves to calculate preview card, regardless of showCursorCard
    if (!locked) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [showCursorCard, locked, allCards, anchorCard.id, tetherTarget, flyingBall, isFullScreen]);

  // Show/hide cursor card based on turn state
  // useEffect(() => {
  //   setShowCursorCard(!locked);
  // }, [locked]);

  // 🚀 ELIMINATED: Manual flying ball animation replaced with React Spring
  // (See animated flying ball component in render section)

  // 🚀 FIXED: Replace burst effect setTimeout with automatic cleanup
  useEffect(() => {
    if (burstEffects.length === 0) return;
    
    const cleanup = startSequence({
      id: 'burst-cleanup',
      steps: [
        {
          id: 'remove-burst-effects',
          duration: 500,
          action: () => setBurstEffects([])
        }
      ]
    });
    
    return () => stopSequence('burst-cleanup');
  }, [burstEffects.length, startSequence, stopSequence]);

  // 🚀 FIXED: Replace bounce setTimeout with smooth animation
  useEffect(() => {
    setBounceTeam(currentTurn);
    
    startSequence({
      id: 'team-bounce',
      steps: [
        {
          id: 'end-bounce',
          duration: 300,
          action: () => setBounceTeam(null)
        }
      ]
    });
    
    return () => stopSequence('team-bounce');
  }, [currentTurn, startSequence, stopSequence]);

  // Handle timeline mouse movement for snapping
  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || locked) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoneCount = allCards.length + 1;
    const zoneWidth = rect.width / zoneCount;
    let idx = Math.floor(x / zoneWidth);
    idx = Math.max(0, Math.min(idx, allCards.length));
    setHoveredIndex(idx);
  };

  // Handle timeline clicks with simplified placement
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (locked || !currentCard || !previewCardPosition || !timelineRef.current) return;

    console.log('handleTimelineClick fired');

    setShowCursorCard(false);
    setPreviewCardPosition(null);
    setTetherTarget(null);

    // Use the preview card position index for placement logic
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoneCount = allCards.length + 1;
    const zoneWidth = rect.width / zoneCount;
    let targetIndex = Math.floor(x / zoneWidth);
    targetIndex = Math.max(0, Math.min(targetIndex, allCards.length));

    // Calculate if placement is correct
    let correctIndex = 0;
    for (let i = 0; i < allCards.length; i++) {
      if (currentCard.date < allCards[i].date) {
        correctIndex = i;
        break;
      }
      correctIndex = i + 1;
    }

    let isCorrect = targetIndex === correctIndex;

    // Handle ties and date ranges
    if (!isCorrect && targetIndex >= 0 && targetIndex <= allCards.length) {
      const leftCard = targetIndex > 0 ? allCards[targetIndex - 1] : null;
      const rightCard = targetIndex < allCards.length ? allCards[targetIndex] : null;
      const leftHasSameDate = leftCard && leftCard.date === currentCard.date;
      const rightHasSameDate = rightCard && rightCard.date === currentCard.date;
      if (leftHasSameDate || rightHasSameDate) {
        isCorrect = true;
      }
      if (!isCorrect && leftCard && rightCard) {
        const fitsBetween = leftCard.date <= currentCard.date && currentCard.date <= rightCard.date;
        if (fitsBetween) {
          isCorrect = true;
        }
      }
    }
    console.log('targetIndex:', targetIndex, 'correctIndex:', correctIndex, 'isCorrect:', isCorrect);
    
    // Show feedback circle at the actual placed card position
    if (timelineRef.current) {
      // Calculate where the card will actually be placed after insertion
      const timelineRect = timelineRef.current.getBoundingClientRect();
      
      // Find the actual card position after placement
      setTimeout(() => {
        // Wait a frame for the card to be inserted into the DOM
        const placedCardElement = timelineRef.current?.querySelector(`[data-card-id="${currentCard.id}"]`) as HTMLElement;
        if (placedCardElement) {
          const cardRect = placedCardElement.getBoundingClientRect();
          setFeedbackPosition({
            x: cardRect.left + cardRect.width / 2,
            y: cardRect.top - 60, // Position above the actual placed card
            isCorrect: isCorrect
          });
          
          // Clear feedback after animation completes
          setTimeout(() => {
            setFeedbackPosition(null);
          }, 750);
        }
      }, 50); // Small delay to let the card render
    }
    
    // Trigger score ping effect for correct answers
    if (isCorrect) {
      // Find which point index this will be (current score)
      const currentScore = teams[currentTurn]?.score || 0;
      
      // Create multiple ping effects in rapid succession
      const newEffects = [];
      for (let i = 0; i < 3; i++) {
        newEffects.push({
          teamIndex: currentTurn,
          pointIndex: currentScore,
          id: Date.now() + i
        });
      }
      
              // Add effects with staggered timing
        newEffects.forEach((effect, index) => {
          setTimeout(() => {
            setScorePingEffects(prev => [...prev, effect]);
            // Remove this effect after animation completes
            setTimeout(() => {
              setScorePingEffects(prev => prev.filter(e => e.id !== effect.id));
            }, 400);
          }, index * 100); // 100ms delay between each ping
        });
      }

      // Create card ping effects for both correct and incorrect placements
      const cardPingEffectsToAdd = [];
      for (let i = 0; i < CARD_PING_COUNT; i++) {
        cardPingEffectsToAdd.push({
          cardId: currentCard.id,
          isCorrect: isCorrect,
          id: Date.now() + 1000 + i // Offset to avoid collision with score pings
        });
      }
      
      // Add card ping effects with staggered timing
      cardPingEffectsToAdd.forEach((effect, index) => {
        setTimeout(() => {
          setCardPingEffects(prev => [...prev, effect]);
          // Remove this effect after animation completes
                      setTimeout(() => {
              setCardPingEffects(prev => prev.filter(e => e.id !== effect.id));
            }, 500);
        }, index * CARD_PING_DELAY); // Configurable delay between each ping
      });
    
    onCardPlacement(isCorrect);
  };

  // Custom continue handler to trigger poof effect and handle video end
  const handleContinueClick = () => {
    // If video ended without card placement, just advance to next turn
    if (videoEnded && !justPlacedCard) {
      setVideoEnded(false); // Reset video ended state
      if (onContinue) onContinue();
      return;
    }
    
    // 🚀 FIXED: Replace poof setTimeout with animation sequence
    const incorrectCards = Array.from(incorrectCardPositions.keys());
    if (incorrectCards.length > 0) {
      setDisappearingCards(incorrectCards);
      
      startSequence({
        id: 'poof-cleanup',
        steps: [
          {
            id: 'clear-incorrect-cards',
            duration: 150,
            action: () => {
              setIncorrectCardPositions(new Map());
              setDisappearingCards([]);
              setVideoEnded(false);
              if (onContinue) onContinue();
            }
          }
        ]
      });
    } else {
      setVideoEnded(false);
      if (onContinue) onContinue();
    }
  };

  let youTubeStart = 0;
  let youTubeEnd = 0;
  if (currentCard?.youtube) {
    try {
      const u = new URL(currentCard.youtube);
      const t = u.searchParams.get("t") || u.searchParams.get("start");
      if (t) youTubeStart = parseInt(t.replace(/\D/g, ""), 10) || 0;
      const end = u.searchParams.get("end");
      if (end) youTubeEnd = parseInt(end.replace(/\D/g, ""), 10) || 0;
    } catch {}
  }

  // Timer-based video end detection
  useEffect(() => {
    if (!youTubeEnd || youTubeEnd <= youTubeStart) return;
    
    const videoDuration = (youTubeEnd - youTubeStart) * 1000; // Convert to milliseconds
    const timer = setTimeout(() => {
      setVideoEnded(true);
    }, videoDuration + 1000); // Add 1 second buffer
    
    return () => clearTimeout(timer);
  }, [currentCard.id, youTubeStart, youTubeEnd]);

  // Function to handle full screen toggle
  const handleFullScreenToggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-y-auto" style={{ zIndex: 1 }}>
      <style>{bounceScaleCSS}</style>
      {/* Debug info and Full Screen button */}
      <div className="fixed top-0 left-0  text-white p-2 z-[9999]" style={{width: '532px'}}>
        <div>Aspect Ratio: {aspectRatio.toFixed(2)}</div>
        {videoId && (
          <button
            onClick={handleFullScreenToggle}
            className="mt-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Full Screen
          </button>
        )}
      </div>

      {/* Video container that handles both normal and fullscreen states */}
      <div 
        ref={videoContainerRef} 
        className={`${isFullScreen ? 'fixed inset-0' : 'relative'}`}
        style={{
          aspectRatio: '16/9',
          ...(isFullScreen ? {
            height: '100vh',
            width: '100vw',
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none'
          } : {
            position: 'absolute',
            top: aspectRatio >= 1.75 ? '0' : '0',
            left: aspectRatio >= 1.75 ? 'auto' : '50%',
            right: aspectRatio >= 1.75 ? '0' : 'auto',
            transform: aspectRatio >= 1.75 ? 'none' : 'translateX(-50%)',
            maxHeight: aspectRatio >= 1.75 ? '85vh' : '70vh',
            maxWidth: aspectRatio >= 1.75 ? 
              'min(100vw, calc(85vh * 16/9))' : 
              'min(100vw, calc(70vh * 16/9))',
            width: aspectRatio >= 1.75 ? 
              'min(100vw, calc(85vh * 16/9))' : 
              'min(100vw, calc(70vh * 16/9))',
            zIndex: 10
          })
        }}
      >
        {videoId && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            ...(isFullScreen && {
              maxWidth: '177.78vh', // 16:9 aspect ratio
              maxHeight: '100vh',
            })
          }}>
            <YouTubeClipPlayer
              key={`youtube-${currentCard.id}-${videoId}`}
              videoId={videoId}
              start={youTubeStart}
              {...(youTubeEnd ? { end: youTubeEnd } : {})}
            />
          </div>
        )}
      </div>

      {aspectRatio >= 1.75 ? (
        // --- ULTRAWIDE LAYOUT ---
        <div className="flex flex-col h-full w-full relative" style={{height: '100vh'}}>
          {/* Main content: UI and Video in a single row, no negative space */}
          <div className="flex flex-row flex-shrink-0 w-full" style={{flex: '1 1 auto', alignItems: 'flex-start', minHeight: 0}}>
            {/* UI block on the left, fills all space left of video, background transparent for team names */}
            <div className="flex-1 flex flex-col items-center justify-start p-[min(4vw,32px)]" style={{zIndex: 10}}>
              {/* Title */}
              {puzzle && (
                <div className="text-left w-full" style={{zIndex: 10, marginTop: '80px'}}>
                  <h1 className="text-6xl font-light italic text-white mb-16">{puzzle.topic}</h1>
                </div>
              )}
              {/* Teams */}
              <div className="w-full flex flex-col gap-16" style={{zIndex: 10}}>
                {teams.map((team, teamIndex) => (
                  <div key={teamIndex} className={`text-left ${currentTurn === teamIndex ? '' : 'opacity-70'}`}>
                    <div 
                      className={`font-bold mb-6 ${
                        currentTurn === teamIndex ? 'text-8xl text-white' : 'text-5xl text-gray-400'
                      }`}
                      style={{
                        ...(bounceTeam === teamIndex && currentTurn === teamIndex ? { animation: 'team-bounce-in 0.4s ease-out forwards' } : {}),
                        ...(currentTurn === teamIndex ? { transform: 'scale(1.15)', transformOrigin: 'left center' } : {})
                      }}
                    >
                      {team?.name || `Team ${teamIndex + 1}`}
                    </div>
                    <div 
                      className="flex space-x-4 mb-6"
                      style={{
                        ...(bounceTeam === teamIndex && currentTurn === teamIndex ? { animation: 'team-bounce-in 0.4s ease-out forwards' } : {}),
                        ...(currentTurn === teamIndex ? { transform: 'scale(1.15)', transformOrigin: 'left center' } : {})
                      }}
                    >
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={i} className="relative">
                          <div
                            className={`rounded-full ${
                              currentTurn === teamIndex 
                                ? `w-12 h-12 ${i < (team?.score || 0) ? 'bg-green-400' : 'bg-gray-600'}`
                                : `w-8 h-8 ${i < (team?.score || 0) ? 'bg-green-600' : 'bg-gray-700'}`
                            }`}
                          />
                          {/* Ping effects for this specific point */}
                          {scorePingEffects.filter(effect => effect.teamIndex === teamIndex && effect.pointIndex === i).map(effect => (
                            <div
                              key={effect.id}
                              className={`absolute inset-0 rounded-full border-2 border-green-400 ${
                                currentTurn === teamIndex ? 'w-12 h-12' : 'w-8 h-8'
                              }`}
                              style={{
                                animation: 'scorePing 0.4s ease-out forwards',
                                backgroundColor: 'transparent'
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Continue Button */}
              {(justPlacedCard || videoEnded) && (
                <button
                  onClick={handleContinueClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-20 py-12 rounded-lg text-5xl transition-all mt-16 w-full"
                  style={{ animation: 'bounce-scale 0.3s ease-out forwards', zIndex: 10 }}
                >
                  {videoEnded && !justPlacedCard ? 'Next Turn' : 'Continue'}
                </button>
              )}
            </div>
            {/* Video flush with UI, right-justified, no overlap */}
            <div className="flex-shrink-0 flex items-start justify-end" style={{minHeight: 0, height: 'auto'}}>
              {/* Placeholder for video - actual video is rendered above */}
              <div 
                className="max-h-[85vh] relative"
                style={{
                  aspectRatio: '16/9',
                  maxWidth: 'min(100vw, calc(85vh * 16/9))',
                  width: 'min(100vw, calc(85vh * 16/9))',
                  visibility: 'hidden' // Hide this placeholder
                }}
              >
                {/* Empty placeholder to maintain layout */}
              </div>
            </div>
          </div>
          
            {/* Timeline fixed to bottom, no overlap, fully interactive */}
          <div className="fixed left-0 right-0 bottom-0 px-8 pb-4 z-40" style={{pointerEvents: 'auto'}}>
            {/* Large invisible clickable area for drop zone */}
            {!locked && !videoEnded && (
              <div
                className="fixed left-0 right-0 z-30 cursor-pointer"
                style={{
                  top: isFullScreen ? 
                    `${window.innerHeight * 0.7}px` : 
                    `${Math.max(document.querySelector('iframe, img, div[class*="youtube"]')?.getBoundingClientRect()?.bottom || 0, window.innerHeight * 0.5) + 128}px`,
                  bottom: 0,
                }}
                onMouseMove={handleTimelineMouseMove}
                onClick={handleTimelineClick}
              />
            )}
            {/* Fixed height timeline container - no more dynamic growing */}
            <div
              ref={timelineRef}
              className="relative w-full"
              style={{
                height: '200px',
                cursor: locked ? 'default' : 'pointer',
              }}
            >
              <div className="absolute bottom-0 left-0 right-0">
                <div className="flex justify-center items-end h-12 w-full">
                  {/* Spacer before first card */}
                  <div style={{ flex: 1 }} />
                  {allCards.map((card, i) => [
                    // Card
                    <div key={card.id}
                      data-timeline-card
                      data-card-id={card.id}
                      className={`
                        flex flex-col items-center min-w-[100px]
                        ${animatingCards.includes(card.id) ? 'transition-all duration-1600 ease-in-out' : ''}
                        ${placementAnimation && placementAnimation.cardId === card.id ? 'opacity-0' : 'opacity-100'}
                      `}
                      style={{ ...((placementAnimation && placementAnimation.cardId === card.id && placementAnimation.isMagnetic && timelineRef.current) ? (() => {
                        const timelineRect = timelineRef.current.getBoundingClientRect();
                        const cardCount = allCards.length;
                        const leftPercent = ((i + 1) / (cardCount + 1)) * 100;
                        const naturalX = timelineRect.left + (leftPercent / 100) * timelineRect.width;
                        const naturalY = timelineRect.top + timelineRect.height / 2;
                        const offsetX = placementAnimation.fromX - naturalX;
                        const offsetY = placementAnimation.fromY - naturalY;
                        return {
                          transform: `translate(${offsetX}px, ${offsetY}px)`,
                          animation: 'magneticSnapToNatural 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                        };
                      })() : {}) }}
                    >
                      <div className={`relative ${justPlacedCard && card.id === justPlacedCard.id ? 'animate-[bounce-scale_0.3s_ease-out_forwards]' : ''}`}>
                        <TimelineCardWithTooltip
                          card={card}
                          isLatest={false}
                          isAnchor={card.id === anchorCard.id}
                          bgClass={card.id === anchorCard.id ? "bg-gray-300 text-black" : (timeline.find((p) => p.card.id === card.id)?.correct === true ? "bg-green-500 text-black" : (timeline.find((p) => p.card.id === card.id)?.correct === false ? "bg-red-600 text-black" : "bg-gray-200 text-black"))}
                          hideDates={false}
                          showTooltip={false}
                          showImageOnPlace={false}
                          isFullScreen={aspectRatio >= 1.75}
                          justPlacedCard={justPlacedCard}
                        />
                        {/* Card ping effects */}
                        {cardPingEffects.filter(effect => effect.cardId === card.id).map(effect => (
                          <div
                            key={effect.id}
                            className={`absolute inset-0 rounded-lg border-2 ${
                              effect.isCorrect ? 'border-green-400' : 'border-red-400'
                            }`}
                            style={{
                              animation: 'cardPing 0.5s ease-out forwards',
                              backgroundColor: 'transparent',
                              pointerEvents: 'none'
                            }}
                          />
                        ))}
                      </div>
                      <div className="bg-gray-600" style={{ 
                        height: `max(48px, min(96px, 4.2vw))`,
                        width: `max(4.8px, min(9.6px, 0.6vw))`
                      }} />
                      <div className="relative flex items-center justify-center">
                        <div className="absolute bg-gray-400" style={{ 
                          left: '-200vw', 
                          right: '-200vw',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: `max(8px, min(16px, 1vw))`
                        }} />
                        <div className="w-8 h-8 rounded-full bg-gray-600 z-10" />
                      </div>
                    </div>,
                    // Spacer after each card (including after last)
                    <div key={`spacer-${i + 1}`} style={{ flex: 1 }} />
                  ])}
                </div>
              </div>
              {/* Drop zone indicators */}
              {!locked && hoveredIndex !== null && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-blue-400 z-20"
                    style={{
                      left: `${(hoveredIndex / (allCards.length + 1)) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // --- DEFAULT LAYOUT ---
        <div className="flex flex-col relative">
          {/* Video and Timeline grouped together */}
          <div className="flex flex-col">
            {/* Massive Video Section - only the space it needs */}
            <div className="flex items-center justify-center relative">
              {/* Placeholder for video - actual video is rendered above */}
              <div className="w-full max-h-[70vh] relative" style={{
                aspectRatio: '16/9',
                maxWidth: 'min(100vw, calc(70vh * 16/9))',
                visibility: 'hidden' // Hide this placeholder
              }}>
                {/* Empty placeholder to maintain layout */}
              </div>
            </div>

            
              {/* Timeline Section - locked to bottom of video */}
            <div className="relative w-full">
              {/* Large invisible clickable area for drop zone */}
              {!locked && !videoEnded && (
                <div
                  className="fixed left-0 right-0 z-30 cursor-pointer"
                  style={{
                    top: isFullScreen ? 
                      `${window.innerHeight * 0.7}px` : 
                      `${Math.max(document.querySelector('iframe, img, div[class*="youtube"]')?.getBoundingClientRect()?.bottom || 0, window.innerHeight * 0.5) + 128}px`,
                    bottom: 0,
                  }}
                  onMouseMove={handleTimelineMouseMove}
                  onClick={handleTimelineClick}
                />
              )}
              {/* Timeline - Fixed height */}
              <div
                ref={timelineRef}
                className="relative h-12"
              >
                <div className="flex justify-center items-end h-12 w-full">
                  {/* Spacer before first card */}
                  <div style={{ flex: 1 }} />
                  {allCards.map((card, i) => [
                    // Card
                    <div key={card.id}
                      data-timeline-card
                      data-card-id={card.id}
                      className={`
                        flex flex-col items-center min-w-[100px]
                        ${animatingCards.includes(card.id) ? 'transition-all duration-1600 ease-in-out' : ''}
                        ${placementAnimation && placementAnimation.cardId === card.id ? 'opacity-0' : 'opacity-100'}
                      `}
                      style={{ ...((placementAnimation && placementAnimation.cardId === card.id && placementAnimation.isMagnetic && timelineRef.current) ? (() => {
                        const timelineRect = timelineRef.current.getBoundingClientRect();
                        const cardCount = allCards.length;
                        const leftPercent = ((i + 1) / (cardCount + 1)) * 100;
                        const naturalX = timelineRect.left + (leftPercent / 100) * timelineRect.width;
                        const naturalY = timelineRect.top + timelineRect.height / 2;
                        const offsetX = placementAnimation.fromX - naturalX;
                        const offsetY = placementAnimation.fromY - naturalY;
                        return {
                          transform: `translate(${offsetX}px, ${offsetY}px)`,
                          animation: 'magneticSnapToNatural 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                        };
                      })() : {}) }}
                    >
                      <div className={`relative ${justPlacedCard && card.id === justPlacedCard.id ? 'animate-[bounce-scale_0.3s_ease-out_forwards]' : ''}`}>
                        <TimelineCardWithTooltip
                          card={card}
                          isLatest={false}
                          isAnchor={card.id === anchorCard.id}
                          bgClass={card.id === anchorCard.id ? "bg-gray-300 text-black" : (timeline.find((p) => p.card.id === card.id)?.correct === true ? "bg-green-500 text-black" : (timeline.find((p) => p.card.id === card.id)?.correct === false ? "bg-red-600 text-black" : "bg-gray-200 text-black"))}
                          hideDates={false}
                          showTooltip={false}
                          showImageOnPlace={false}
                          isFullScreen={false}
                          justPlacedCard={justPlacedCard}
                        />
                        {/* Card ping effects */}
                        {cardPingEffects.filter(effect => effect.cardId === card.id).map(effect => (
                          <div
                            key={effect.id}
                            className={`absolute inset-0 rounded-lg border-2 ${
                              effect.isCorrect ? 'border-green-400' : 'border-red-400'
                            }`}
                            style={{
                              animation: 'cardPing 0.5s ease-out forwards',
                              backgroundColor: 'transparent',
                              pointerEvents: 'none'
                            }}
                          />
                        ))}
                      </div>
                      <div className="bg-gray-600" style={{ 
                        height: `max(48px, min(96px, 4.2vw))`,
                        width: `max(4.8px, min(9.6px, 0.6vw))`
                      }} />
                      <div className="relative flex items-center justify-center">
                        <div className="absolute bg-gray-400" style={{ 
                          left: '-200vw', 
                          right: '-200vw',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: `max(8px, min(16px, 1vw))`
                        }} />
                        <div className="w-8 h-8 rounded-full bg-gray-600 z-10" />
                      </div>
                    </div>,
                    // Spacer after each card (including after last)
                    <div key={`spacer-${i + 1}`} style={{ flex: 1 }} />
                  ])}
                </div>
              </div>
              
              {/* Drop zone indicators */}
              {!locked && hoveredIndex !== null && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-blue-400 z-20"
                    style={{
                      left: `${(hoveredIndex / (allCards.length + 1)) * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
              )}

              {/* Puzzle Title - moved below timeline */}
              {puzzle && (
                <div className="text-center mt-12">
                  <h1 className="text-6xl font-light italic text-white">
                    {puzzle.topic}
                  </h1>
                </div>
              )}

              {/* Team Indicators - Dynamic grid for 2-4 teams */}
              <div className="mt-[100px]" style={{zIndex: 10}}>
                {/* Teams Grid */}
                <div className={`grid gap-8 ${
                  teams.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2'
                }`}>
                  {teams.map((team, teamIndex) => (
                    <div key={teamIndex} className="flex justify-center">
                      <div className="text-center">
                        <div className={`font-bold mb-14 ${
                          teamIndex === currentTurn ? 'text-9xl text-white' : 'text-6xl text-gray-600'
                        }`}
                        style={{
                          ...(bounceTeam === teamIndex && currentTurn === teamIndex ? { animation: 'team-bounce-in 0.4s ease-out forwards' } : {}),
                          ...(currentTurn === teamIndex ? { transform: 'scale(1.15)', transformOrigin: 'center center' } : {}),
                          zIndex: 10
                        }}>
                          {team?.name || `Team ${teamIndex + 1}`}
                        </div>
                        <div className="flex space-x-3 justify-center"
                        style={{
                          ...(bounceTeam === teamIndex && currentTurn === teamIndex ? { animation: 'team-bounce-in 0.4s ease-out forwards' } : {}),
                          ...(currentTurn === teamIndex ? { transform: 'scale(1.15)', transformOrigin: 'center center' } : {}),
                          zIndex: 10
                        }}>
                          {Array.from({ length: 9 }, (_, i) => (
                            <div key={i} className="relative">
                              <div
                                className={`rounded-full ${
                                  teamIndex === currentTurn
                                    ? `w-14 h-14 ${i < (team?.score || 0) ? 'bg-green-400' : 'bg-gray-600'}`
                                    : `w-10 h-10 ${i < (team?.score || 0) ? 'bg-green-600' : 'bg-gray-700'}`
                                }`}
                              />
                              {/* Ping effects for this specific point */}
                              {scorePingEffects.filter(effect => effect.teamIndex === teamIndex && effect.pointIndex === i).map(effect => (
                                <div
                                  key={effect.id}
                                  className={`absolute inset-0 rounded-full border-2 border-green-400 ${
                                    teamIndex === currentTurn ? 'w-14 h-14' : 'w-10 h-10'
                                  }`}
                                  style={{
                                    animation: 'scorePing 0.4s ease-out forwards',
                                    backgroundColor: 'transparent'
                                  }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Button - Centered below teams */}
                {(justPlacedCard || videoEnded) && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleContinueClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-20 py-10 rounded-lg text-6xl transition-all"
                      style={{
                        animation: 'bounce-scale 0.3s ease-out forwards',
                        zIndex: 10
                      }}
                    >
                      {videoEnded && !justPlacedCard ? 'Next Turn' : 'Continue'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incorrect Cards Positioned as Proper Timeline Cards */}
      {Array.from(incorrectCardPositions.entries()).map(([cardId, position]) => {
        const card = timeline.find(p => p.card.id === cardId)?.card;
        if (!card) return null;
        
        const isJustPlaced = justPlacedCard && card.id === justPlacedCard.id;
        
        return (
          <div
            key={cardId}
            className={`
              fixed z-40 pointer-events-none
              ${disappearingCards.includes(cardId) ? 'animate-[poof_0.15s_ease-out_forwards]' : ''}
            `}
            style={{
              left: position.x,
              top: position.y,
              transform: 'translateX(-50%)', // Center the card horizontally
            }}
          >
            {/* Just the card - no timeline elements to avoid duplication */}
            <div className={`relative ${isJustPlaced ? 'animate-[bounce-scale_0.3s_ease-out_forwards]' : ''}`}>
              <TimelineCardWithTooltip
                card={card}
                isLatest={false}
                isAnchor={false}
                bgClass="bg-red-500 text-black"
                hideDates={false}
                showTooltip={false}
                showImageOnPlace={false}
                justPlacedCard={justPlacedCard}
              />
              {/* Card ping effects for incorrect cards */}
              {cardPingEffects.filter(effect => effect.cardId === card.id).map(effect => (
                <div
                  key={effect.id}
                  className={`absolute inset-0 rounded-lg border-2 ${
                    effect.isCorrect ? 'border-green-400' : 'border-red-400'
                  }`}
                  style={{
                    animation: 'cardPing 0.5s ease-out forwards',
                    backgroundColor: 'transparent',
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Preview Card - Shows where card will be placed */}
      {previewCardPosition && currentCard && !locked && !videoEnded && (
        <>
          {/* Placement Context Label */}
          <div
            className="fixed z-40 pointer-events-none flex flex-col items-center"
            style={{
              left: previewCardPosition.x,
              top: previewCardPosition.y - 120, // Position above the preview card
              transform: 'translateX(-50%)',
            }}
          >
            {/* Context Text */}
            <div className="text-6xl font-light italic text-white text-center">
              {(() => {
                const targetIndex = previewCardPosition.index;
                const leftCard = targetIndex > 0 ? allCards[targetIndex - 1] : null;
                const rightCard = targetIndex < allCards.length ? allCards[targetIndex] : null;
                
                if (leftCard && rightCard) {
                  // Between two cards
                  return `Between ${leftCard.date} & ${rightCard.date}`;
                } else if (rightCard) {
                  // Before first card
                  return `Before ${rightCard.date}`;
                } else if (leftCard) {
                  // After last card
                  return `After ${leftCard.date}`;
                } else {
                  // Fallback
                  return "Place here";
                }
              })()}
            </div>
            
            {/* Downward Triangle */}
            <div 
              className="w-0 h-0 mt-2"
              style={{
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '16px solid white',
              }}
            />
          </div>
          
          {/* Preview Card Structure */}
          <div
            className="fixed z-30 pointer-events-none flex flex-col items-center"
            style={{
              left: previewCardPosition.x,
              top: previewCardPosition.y,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Anonymous preview card - no spoilers */}
            <div
              className="pointer-events-none"
              style={{
                opacity: 0.3
              }}
            >
              <div className="w-[12vw] min-w-[120px] max-w-[320px] px-[0.8vw] py-[0.5vw] aspect-[3/2] shadow rounded-lg text-center bg-blue-400 text-black flex items-center justify-center">
                <span className="text-black text-[clamp(2rem,8vw,8rem)] font-bold">?</span>
              </div>
            </div>
            
            {/* Vertical line - exactly like timeline cards */}
            <div className="bg-gray-600" style={{ 
              height: `max(48px, min(96px, 4.2vw))`,
              width: `max(4.8px, min(9.6px, 0.6vw))`
            }} />
            
            {/* Circular connector only - no horizontal line to avoid conflicts */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 z-10" />
            </div>
          </div>
        </>
      )}

      {/* Cursor Card with Tether Line */}
      {showCursorCard && currentCard && !locked && !isOverVideo && !placementAnimation && !videoEnded && (
        <>
          {/* Tether Line and Flying Ball */}
          {(tetherTarget || flyingBall) && (
            <svg
              className="fixed inset-0 pointer-events-none z-40"
              style={{ width: '100vw', height: '100vh' }}
            >
              {/* Regular tether when connected */}
              {tetherTarget && !flyingBall && (
                <>
                  <line
                    x1={cursorPosition.x}
                    y1={cursorPosition.y}
                    x2={tetherTarget.x}
                    y2={tetherTarget.y}
                    stroke="white"
                    strokeWidth={`max(4.8px, min(9.6px, 0.6vw))`}
                    strokeDasharray="5,5"
                    opacity="0.7"
                  />
                  <circle
                    cx={tetherTarget.x}
                    cy={tetherTarget.y}
                    r="16"
                    fill="white"
                    opacity="0.8"
                  />
                </>
              )}
              
              {/* Animated tether during flying ball */}
              {flyingBall && (
                <>
                  {/* Calculate current ball position */}
                  {(() => {
                    const ballX = flyingBall.fromX + (flyingBall.toX - flyingBall.fromX) * flyingBall.progress;
                    const ballY = flyingBall.fromY + (flyingBall.toY - flyingBall.fromY) * flyingBall.progress;
                    
                    // Line endpoint depends on direction
                    const lineEndX = flyingBall.isAttaching ? cursorPosition.x : ballX;
                    const lineEndY = flyingBall.isAttaching ? cursorPosition.y : ballY;
                    const lineStartX = flyingBall.isAttaching ? ballX : cursorPosition.x;
                    const lineStartY = flyingBall.isAttaching ? ballY : cursorPosition.y;
                    
                    return (
                      <>
                        <line
                          x1={lineStartX}
                          y1={lineStartY}
                          x2={lineEndX}
                          y2={lineEndY}
                          stroke="white"
                          strokeWidth={`max(4.8px, min(9.6px, 0.6vw))`}
                          strokeDasharray="5,5"
                          opacity="0.7"
                        />
                        {/* Flying ball - only show if not at destination */}
                        {flyingBall.progress < 1 && (
                          <circle
                            cx={ballX}
                            cy={ballY}
                            r="16"
                            fill="white"
                            opacity="0.8"
                          />
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </svg>
          )}
          
          {/* Cursor Card */}
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: cursorPosition.x - 96,
              top: cursorPosition.y - 65,
              opacity: 0.3 // Make transparent to match preview card
            }}
          >
            <div className="w-[12vw] min-w-[120px] max-w-[320px] px-[0.8vw] py-[0.5vw] aspect-[3/2] shadow rounded-lg text-center bg-gray-200 text-black flex items-center justify-center">
              <span className="text-black text-[clamp(2rem,8vw,8rem)] font-bold">?</span>
            </div>
          </div>
        </>
      )}

      {/* Burst Effects */}
      {burstEffects.map(effect => (
        <div
          key={effect.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: effect.x - 24,
            top: effect.y - 24,
          }}
        >
          <div className="w-12 h-12 rounded-full border-4 border-white opacity-60"
            style={{
              animation: 'burst 0.5s ease-out forwards'
            }}
          />
        </div>
      ))}

      {/* Quit button - Fixed position */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={onQuit}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-lg text-lg transition-all"
        >
          Quit
        </button>
      </div>

      {/* Feedback Display */}
      {feedbackPosition && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: feedbackPosition.x - 48, // Half of w-24 (96px)
            top: feedbackPosition.y - 48,  // Half of h-24 (96px)
          }}
        >
          <div className={`
            w-24 h-24 border-4 border-white rounded-full flex items-center justify-center
            ${feedbackPosition.isCorrect ? 'bg-green-500' : 'bg-red-500'}
            animate-[feedbackPoof_0.75s_ease-out_forwards]
          `}>
            <span className="text-white text-4xl font-bold">
              {feedbackPosition.isCorrect ? '✓' : '✕'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

