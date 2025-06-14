// components/TimelinePuzzleGame.tsx
import React, { useState, useEffect, useMemo } from "react";
import { EventCard, PartyGameState } from "../lib/types";
import YouTubeClipPlayer from "./YouTubeClipPlayer";
import FormattedDate from "./FormattedDate";
import TimelineCardWithTooltip from "./TimelineCardWithTooltip";

export type PlacedCard = { card: EventCard; correct: boolean };

interface TimelinePuzzleGameProps {
  anchorCard: EventCard;
timeline: PlacedCard[];
  currentCard: EventCard;
  setTimeline?: (newTimeline: PlacedCard[]) => void;
  setGameState?: (state: any) => void;
  setCurrentCard?: (card: EventCard) => void;
onTimelineChange?: (newTimeline: PlacedCard[], correct: boolean) => void;
  hideDates?: boolean;
  showTooltips?: boolean;
  showImageOnPlace?: boolean;
  engine: any;
  setForceRerender?: React.Dispatch<React.SetStateAction<number>>;
  locked?: boolean;
  justPlacedCard?: EventCard | null;
  puzzle?: any; // Add puzzle prop to access slug
}

export default function TimelinePuzzleGame({
  anchorCard,
  currentCard,
  timeline,
  onTimelineChange,
  setGameState,
  setCurrentCard,
  hideDates,
  showTooltips,
  showImageOnPlace,
setTimeline,
engine, 
  setForceRerender,
  locked = false,
  justPlacedCard = null,
  puzzle,
}: TimelinePuzzleGameProps & {
  setGameState?: (newState: PartyGameState) => void;
}) {

  console.log("🧩 Timeline length:", timeline.length);
  console.log("📦 Timeline contents:", timeline.map((c) => ({ id: c.card.id, date: c.card.date })));

  const [lastPlacedCardId, setLastPlacedCardId] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastPlacedIndex, setLastPlacedIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [singlePlayerJustPlaced, setSinglePlayerJustPlaced] = useState<{cardId: string, correct: boolean} | null>(null);
  const [isDragging, setIsDragging] = useState(false); // Track drag state to fix iframe interference
  

  const [teamTurn, setTeamTurn] = useState<number>(0);

  // Select a random variant if available (for non-party mode)
  const selectedCard = React.useMemo(() => {
    if (!currentCard) return currentCard;
    
    // Only select variants in non-party mode (party mode handles this differently)
    const cardWithVariants = currentCard as any;
    if (!engine && cardWithVariants.variants && cardWithVariants.variants.length > 0) {
      const randomIndex = Math.floor(Math.random() * cardWithVariants.variants.length);
      const selectedVariant = cardWithVariants.variants[randomIndex];
      
      // Return a new card object with the variant's YouTube URL
      return {
        ...currentCard,
        youtube: selectedVariant.youtube
      };
    }
    
    return currentCard;
  }, [currentCard, engine]);

  // Extract video info
  const videoId = (() => {
    if (!selectedCard?.youtube) return null;
    try {
      const u = new URL(selectedCard.youtube);
      return u.searchParams.get("v") || u.pathname.split("/").pop() || null;
    } catch {
      return null;
    }
  })();

  // Enhanced YouTube parameter extraction with randomization (MEMOIZED to prevent re-randomization on mouseover)
  const { youTubeStart, youTubeEnd } = useMemo(() => {
    let start = 0;
    let end = 0;
    
    if (selectedCard?.youtube) {
      try {
        const u = new URL(selectedCard.youtube);
        
        // Check if this is a randomized puzzle (music videos or dance scenes)
        const isRandomizedPuzzle = puzzle?.slug === "best-music-videos-randomized" || 
                                  puzzle?.slug === "iconic-movie-dance-scenes-randomized" ||
                                  puzzle?.slug?.includes("randomized") || 
                                  puzzle?.description?.includes("randomized");
        
        // Debug logging for randomization detection
        console.log("🔍 Randomization Debug:", {
          puzzleSlug: puzzle?.slug,
          puzzleDescription: puzzle?.description,
          isRandomizedPuzzle,
          cardDuration: selectedCard.duration,
          cardLabel: selectedCard.label
        });
        
        if (isRandomizedPuzzle && selectedCard.duration && selectedCard.duration >= 45) {
          // Generate random 45-second segment (ONLY ONCE per card selection)
          const maxStartTime = selectedCard.duration - 45;
          const randomStart = Math.floor(Math.random() * maxStartTime);
          start = randomStart;
          end = randomStart + 45;
          
          console.log(`🎲 Randomized segment for "${selectedCard.label}": ${start}s-${end}s (total: ${selectedCard.duration}s)`);
        } else if (isRandomizedPuzzle && selectedCard.duration && selectedCard.duration < 45) {
          // For videos shorter than 45 seconds, play entire video 
          start = 0;
          end = 0; // Let it play to natural end
          
          console.log(`🎵 Playing full video for "${selectedCard.label}": ${selectedCard.duration}s (shorter than 45s)`);
        } else {
          // Standard behavior for non-randomized puzzles or missing duration data
          const t = u.searchParams.get("t") || u.searchParams.get("start");
          if (t) start = parseInt(t.replace(/\D/g, ""), 10) || 0;
          const endParam = u.searchParams.get("end");
          if (endParam) end = parseInt(endParam.replace(/\D/g, ""), 10) || 0;
        }
      } catch {
        // Fallback to no timing parameters
        start = 0;
        end = 0;
      }
    }
    
    return { youTubeStart: start, youTubeEnd: end };
  }, [selectedCard?.id, selectedCard?.youtube, selectedCard?.duration, puzzle?.slug, puzzle?.description]); // Only recalculate when card actually changes

  // Calculate the visual timeline cards early so it can be used in drag handlers
  const preAnchor = (timeline ?? []).filter((p) => p?.card?.date !== undefined && p.card.date < anchorCard.date);
  const postAnchor = (timeline ?? []).filter((p) => p?.card?.date !== undefined && p.card.date >= anchorCard.date);
  const allCards = [
    ...preAnchor.map((p) => p.card).filter(Boolean), 
    anchorCard, 
    ...postAnchor.map((p) => p.card).filter(Boolean)
  ].filter(card => card && card.id); // Extra safety check to ensure all cards have an id

const handlePlace = (attemptedIndex: number) => {
  if (locked) return; // Prevent placement when locked
  
  console.log("🎯 Placement attempt:", {
    attemptedIndex,
    currentCardDate: currentCard.date,
    currentCardLabel: currentCard.label
  });
  
  // Use the SAME timeline construction as the visual display
  // This ensures consistency between what the user sees and how we validate
  const visualTimeline = allCards; // This is already calculated above for rendering
  
  console.log("📊 Visual timeline:", visualTimeline.map(c => ({
    label: c.label,
    date: c.date,
    isAnchor: c.id === anchorCard.id
  })));
  
  // Find where the current card SHOULD go in the visual timeline
  let correctIndex = 0;
  for (let i = 0; i < visualTimeline.length; i++) {
    if (currentCard.date < visualTimeline[i].date) {
      correctIndex = i;
      break;
    }
    correctIndex = i + 1;
  }
  
  console.log("✅ Correct position should be:", correctIndex);
  console.log("❓ Attempted position was:", attemptedIndex);
  
  // Check if placement is correct
  let isCorrect = attemptedIndex === correctIndex;
  
  // Handle ties: if dates are equal, allow some flexibility
  if (!isCorrect && attemptedIndex >= 0 && attemptedIndex <= visualTimeline.length) {
    // Check adjacent cards for same date
    const leftCard = attemptedIndex > 0 ? visualTimeline[attemptedIndex - 1] : null;
    const rightCard = attemptedIndex < visualTimeline.length ? visualTimeline[attemptedIndex] : null;
    
    // More lenient tie handling - if the current card's date equals either adjacent card's date
    const leftHasSameDate = leftCard && leftCard.date === currentCard.date;
    const rightHasSameDate = rightCard && rightCard.date === currentCard.date;
    
    if (leftHasSameDate || rightHasSameDate) {
      console.log("🤝 Tie detected, allowing placement");
      isCorrect = true;
    }
    
    // Additional check: if we're placing between two cards and our date is between theirs
    if (!isCorrect && leftCard && rightCard) {
      const fitsBetween = leftCard.date <= currentCard.date && currentCard.date <= rightCard.date;
      if (fitsBetween) {
        console.log("📍 Card fits between adjacent cards, allowing placement");
        isCorrect = true;
      }
    }
  }
  
  console.log("🎮 Placement result:", isCorrect ? "CORRECT" : "INCORRECT");

  if (setFeedback) setFeedback(isCorrect);

  if (engine) {
    // PARTY MODE
    const placedCard: PlacedCard = { card: currentCard, correct: isCorrect };
    // delegate everything to the parent
    onTimelineChange?.([...timeline, placedCard], isCorrect);
    // clear the feedback banner after a brief pause
    setTimeout(() => setFeedback(null), 2000);
  } else {
    // SINGLEPLAYER MODE
    const placedCard = { card: currentCard, correct: isCorrect };
    
    // Insert the card in the correct position for display
    // Use the timeline without the anchor card for insertion
    const timelineWithoutAnchor = timeline.filter(p => p.card.id !== anchorCard.id);
    const insertIndex = timelineWithoutAnchor.findIndex((p) => p?.card?.date !== undefined && p.card.date > currentCard.date);
    const newTimeline = [...timelineWithoutAnchor];

    if (insertIndex === -1) {
      newTimeline.push(placedCard);
    } else {
      newTimeline.splice(insertIndex, 0, placedCard);
    }

    // Sort to ensure chronological order
    newTimeline.sort((a, b) => (a.card?.date ?? 0) - (b.card?.date ?? 0));

    // ✅ Set single player celebration effect
    setSinglePlayerJustPlaced({ cardId: currentCard.id, correct: isCorrect });

    // ✅ Immediately update the timeline and lastPlacedCardId so bounce happens now
    setTimeline?.(newTimeline);
    setLastPlacedCardId?.(currentCard.id);

    // ✅ Trigger feedback now too
    if (onTimelineChange) onTimelineChange(newTimeline, isCorrect);

    const newIndex = lastPlacedIndex + 1;
    const nextCard = engine?.puzzle?.cards?.[newIndex];
    setLastPlacedIndex(newIndex);

    // ✅ Now defer only the card switch + feedback reset + clear celebration
    setTimeout(() => {
      setFeedback(null);
      setSinglePlayerJustPlaced(null); // Clear celebration
      if (nextCard) {
        setCurrentCard?.(nextCard);
      }
    }, 2000); // You can tune this delay — 1000ms is a solid default
  }
};

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const onTimelineDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move"; // Fix: Signal valid drop zone to browser
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Debug info
    const slotCount = allCards.length + 1; // n cards = n+1 drop positions
    const slotWidth = rect.width / slotCount;
    
    // Calculate which drop zone we're in
    // For end placement, we need to ensure we can select the last position
    let idx = Math.floor(x / slotWidth);
    
    // Ensure the index is valid (0 to allCards.length inclusive)
    idx = Math.max(0, Math.min(idx, allCards.length));
    
    // Special handling for the end zone - if we're very close to the right edge
    if (x >= rect.width - slotWidth * 0.2) {
      idx = allCards.length;
    }
    
    console.log("🎯 Drag over:", {
      mouseX: x,
      rectWidth: rect.width,
      slotCount,
      slotWidth,
      calculatedIndex: idx,
      totalCards: allCards.length,
      isNearEnd: x >= rect.width - slotWidth * 0.2
    });
    
    setHoveredIndex(idx);
  };

  const onTimelineDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false); // Fix: Re-enable iframe pointer events after drop
    if (hoveredIndex !== null) handlePlace(hoveredIndex);
  };

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false); // Fix: Re-enable iframe pointer events if drag ends without drop
  };

  // Determine if the just-placed card was correct
  const justPlacedCardData = justPlacedCard ? timeline.find((p) => p.card.id === justPlacedCard.id) : null;
  const justPlacedWasCorrect = justPlacedCardData?.correct;

  // Add CSS keyframes for scaling bounce animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scaleBounceSingle {
        0% { transform: scale(0.3); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      @keyframes floatUpFade {
        0% { 
          opacity: 1; 
          transform: translate(0, 0); 
        }
        100% { 
          opacity: 0; 
          transform: translate(0, -60px); 
        }
      }
      @keyframes organicPing1 {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        25% { transform: scale(0.3) translate(-25px, -15px); opacity: 0.8; }
        50% { transform: scale(0.6) translate(-40px, -25px); opacity: 0.5; }
        75% { transform: scale(0.9) translate(-55px, -35px); opacity: 0.2; }
        100% { transform: scale(1.2) translate(-70px, -45px); opacity: 0; }
      }
      @keyframes organicPing2 {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        25% { transform: scale(0.4) translate(30px, -20px); opacity: 0.9; }
        50% { transform: scale(0.7) translate(45px, -35px); opacity: 0.6; }
        75% { transform: scale(1.0) translate(60px, -50px); opacity: 0.3; }
        100% { transform: scale(1.3) translate(75px, -65px); opacity: 0; }
      }
      @keyframes organicPing3 {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        25% { transform: scale(0.2) translate(-20px, 25px); opacity: 0.7; }
        50% { transform: scale(0.5) translate(-35px, 40px); opacity: 0.4; }
        75% { transform: scale(0.8) translate(-50px, 55px); opacity: 0.2; }
        100% { transform: scale(1.1) translate(-65px, 70px); opacity: 0; }
      }
      @keyframes organicPing4 {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        25% { transform: scale(0.35) translate(25px, 30px); opacity: 0.8; }
        50% { transform: scale(0.65) translate(40px, 50px); opacity: 0.5; }
        75% { transform: scale(0.95) translate(55px, 70px); opacity: 0.25; }
        100% { transform: scale(1.25) translate(70px, 90px); opacity: 0; }
      }
      @keyframes organicPing5 {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        25% { transform: scale(0.25) translate(-35px, -25px); opacity: 0.9; }
        50% { transform: scale(0.55) translate(-55px, -45px); opacity: 0.6; }
        75% { transform: scale(0.85) translate(-75px, -65px); opacity: 0.3; }
        100% { transform: scale(1.15) translate(-95px, -85px); opacity: 0; }
      }
      @keyframes organicPing6 {
        0% { transform: scale(0) translate(0, 0); opacity: 1; }
        25% { transform: scale(0.3) translate(40px, -10px); opacity: 0.85; }
        50% { transform: scale(0.6) translate(65px, -20px); opacity: 0.55; }
        75% { transform: scale(0.9) translate(90px, -30px); opacity: 0.25; }
        100% { transform: scale(1.2) translate(115px, -40px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-gray-50 p-[min(0.5vw,2px)] pb-0 pt-2 w-full relative">
      <div className="mb-0 flex flex-col items-center relative">
        <div draggable={!locked} onDragStart={!locked ? onDragStart : undefined} onDragEnd={!locked ? onDragEnd : undefined} className="relative inline-block">
          <div
            className={`${
              videoId ? "w-[min(90vw,calc(100vh*1.6))] max-w-[1400px]" : selectedCard?.deezer?.trackId ? "w-[60vw] max-w-[800px]" : "w-[20vw] min-w-[280px]"
            } px-[min(0.5vw,2px)] py-[min(0.25vw,1px)] bg-gray-100 shadow rounded-lg text-center text-[clamp(1rem,3vw,2.5rem)] text-black ${
              locked ? 'cursor-not-allowed' : 'cursor-move'
            } relative transition-all duration-300 ${
              locked ? '' : 'hover:shadow-lg hover:scale-105'
            }`}
            onMouseEnter={() => !locked && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className={`font-semibold whitespace-pre-wrap ${
              videoId 
                ? "text-[clamp(0.875rem,2.5vw,2.5rem)]" 
                : selectedCard?.deezer?.trackId
                ? "text-[clamp(1.125rem,3.5vw,2.5rem)]"
                : "text-[clamp(0.875rem,2.5vw,6rem)]"
            }`}>
              {locked ? (
                videoId
                  ? "Video Placed on Timeline"
                  : selectedCard?.deezer?.trackId
                  ? "Song Placed on Timeline"
                  : selectedCard?.label
              ) : (
                videoId
                  ? "Drag this video to the Timeline"
                  : selectedCard?.deezer?.trackId
                  ? "Drag this song to the Timeline"
                  : selectedCard?.label
              )}
            </div>

            {videoId ? (
              <div className="mt-1 mb-1 w-full relative" style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                <YouTubeClipPlayer
                  key={`youtube-${selectedCard.id}-${videoId}`}
                  videoId={videoId}
                  start={youTubeStart}
                  {...(youTubeEnd ? { end: youTubeEnd } : {})}
                />
              </div>
            ) : selectedCard?.deezer?.trackId ? (
              <iframe
                title="Deezer Player"
                src={`https://widget.deezer.com/widget/dark/track/${selectedCard.deezer.trackId}`}
                allow="autoplay; clipboard-write"
                className="rounded w-full h-20 mt-0 shadow"
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
              />
            ) : selectedCard?.image ? (
              <img
                src={selectedCard.image.replace(/^public\//, "/")}
                alt={selectedCard.label}
                className="object-contain mx-auto my-0"
                style={{ maxHeight: "40vh" }}
              />
            ) : null}

            {showTooltips && selectedCard?.tooltip && (
              <>
                <span className="ml-1 text-gray-400 cursor-pointer">ⓘ</span>
                {hovered && (
                  <div className="absolute left-full top-0 ml-2 w-72 p-4 bg-white text-sm text-gray-800 rounded-lg shadow-lg z-50">
                    <p className="mb-2">{selectedCard.tooltip.description}</p>
                    <blockquote className="italic text-gray-600 border-l-2 border-gray-300 pl-2">
                      "{selectedCard.tooltip.quote}"
                    </blockquote>
                  </div>
                )}
              </>
            )}
          </div>
          {!locked && (
            <div
              className="absolute text-[clamp(1rem,2.5vw,1.75rem)] italic text-gray-600 whitespace-nowrap"
              style={{ left: "50%", transform: "translateX(-50%)", top: "calc(100% + 0.25rem)" }}
            >
              (Drag to Timeline)
            </div>
          )}
        </div>
      </div>

      <div className={`text-center ${locked ? 'mt-8' : 'mt-4'}`}>
        <div className="relative w-full h-[calc(20vw+4vw+1vw)] min-h-[calc(160px+32px+20px)] max-h-[calc(25vh+4vw+1vw)] z-10"
             onDragOver={!locked ? onTimelineDragOver : undefined} 
             onDrop={!locked ? onTimelineDrop : undefined}>
          <div className="flex justify-center items-end relative z-10" style={{ height: 'calc(100% - 4vw - 1vw)' }}>
          {allCards.map((card, i) => {
              if (!card || !card.id) return null; // Safety check
              
            const isLatest = card.id === lastPlacedCardId;
            const isAnchor = card.id === anchorCard.id;
            const cardData = !isAnchor ? timeline.find((p) => p.card.id === card.id) : undefined;
            const correct = cardData?.correct;
              
              // Use justPlacedCard from party mode OR singlePlayerJustPlaced from single player mode
              const isJustPlaced = (justPlacedCard && card.id === justPlacedCard.id) || 
                                   (singlePlayerJustPlaced && card.id === singlePlayerJustPlaced.cardId);
              
              // Get the correct value from the appropriate source
              const justPlacedCorrect = justPlacedCard 
                ? (timeline.find((p) => p.card.id === justPlacedCard.id)?.correct)
                : singlePlayerJustPlaced?.correct;

            const bgClass = isAnchor
              ? "bg-gray-300 text-black"
              : correct === true
              ? "bg-green-100 text-black"
              : correct === false
              ? "bg-red-100 text-black"
              : "bg-gray-200 text-black";

            return (
                <div key={card.id} className={`flex flex-col items-center ${allCards.length === 1 ? 'flex-none' : 'flex-1'} min-w-[7vw] max-w-[365px] ${
                  isJustPlaced ? 'relative z-[100]' : ''
                } ${allCards.length > 1 ? 'mx-[1vw]' : ''}`}>
                  <div
                    className={`relative transition-all duration-500 ${
                      isJustPlaced
                        ? justPlacedCorrect
                          ? 'shadow-2xl ring-4 ring-green-400 ring-opacity-75 rounded-lg'
                          : 'shadow-2xl ring-4 ring-red-400 ring-opacity-75 rounded-lg'
                        : ''
                    }`}
                    style={isJustPlaced ? {
                      animation: 'scaleBounceSingle 0.3s ease-out forwards',
                      transformOrigin: 'center'
                    } : {}}
                  >
                    {/* Enhanced particle effect for correct placement */}
                    {isJustPlaced && (
                      <div className="absolute pointer-events-none z-[200]" style={{ top: '-20px', left: '-20px', right: '-20px', bottom: '-20px' }}>
                        {justPlacedCorrect ? (
                          // Correct placement effects (green theme)
                          <>
                            {/* Multi-layered organic ping effects */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2" style={{ animation: 'organicPing1 2s ease-out' }}>
                              <div className="w-16 h-16 bg-green-400 rounded-full opacity-80"></div>
                            </div>
                            <div className="absolute top-1/4 right-0 transform translate-x-1/2" style={{ animation: 'organicPing2 2.2s ease-out 0.1s' }}>
                              <div className="w-12 h-12 bg-yellow-400 rounded-full opacity-70"></div>
                            </div>
                            <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2" style={{ animation: 'organicPing3 1.8s ease-out 0.2s' }}>
                              <div className="w-14 h-14 bg-blue-400 rounded-full opacity-75"></div>
                            </div>
                            <div className="absolute bottom-0 right-1/4" style={{ animation: 'organicPing4 2.4s ease-out 0.3s' }}>
                              <div className="w-10 h-10 bg-purple-400 rounded-full opacity-65"></div>
                            </div>
                            <div className="absolute top-1/4 left-1/4" style={{ animation: 'organicPing5 2.1s ease-out 0.15s' }}>
                              <div className="w-12 h-12 bg-pink-400 rounded-full opacity-70"></div>
                            </div>
                            <div className="absolute top-1/2 right-1/4" style={{ animation: 'organicPing6 1.9s ease-out 0.25s' }}>
                              <div className="w-8 h-8 bg-emerald-400 rounded-full opacity-80"></div>
                            </div>
                            
                            {/* Traditional ping effects for layering */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping">
                              <div className="w-12 h-12 bg-green-400 rounded-full opacity-75"></div>
                            </div>
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-ping" style={{ animationDelay: '150ms' }}>
                              <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-75"></div>
                            </div>
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 animate-ping" style={{ animationDelay: '300ms' }}>
                              <div className="w-10 h-10 bg-blue-400 rounded-full opacity-60"></div>
                            </div>
                            
                            {/* Celebration particles - more random positions */}
                            <div className="absolute animate-bounce delay-100" style={{ top: '15%', right: '10%' }}>
                              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            </div>
                            <div className="absolute animate-bounce delay-200" style={{ top: '25%', left: '5%' }}>
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            </div>
                            <div className="absolute animate-bounce delay-300" style={{ bottom: '20%', left: '15%' }}>
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            </div>
                            <div className="absolute animate-bounce delay-75" style={{ bottom: '10%', right: '20%' }}>
                              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                            </div>
                            
                            {/* Success text overlay - moved higher up and to the right */}
                            <div className="absolute text-green-600 font-bold text-[clamp(2rem,8vw,6rem)]" style={{ 
                              top: '-200px',
                              left: '60%',
                              animation: 'floatUpFade 4s ease-out forwards',
                              transformOrigin: 'center'
                            }}>
                              ✨ Nice! ✨
                            </div>
                          </>
                        ) : (
                          // Incorrect placement effects (red theme)
                          <>
                            {/* Multi-layered organic ping effects for errors */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2" style={{ animation: 'organicPing1 2s ease-out' }}>
                              <div className="w-16 h-16 bg-red-400 rounded-full opacity-80"></div>
                            </div>
                            <div className="absolute top-1/4 right-0 transform translate-x-1/2" style={{ animation: 'organicPing2 2.2s ease-out 0.1s' }}>
                              <div className="w-12 h-12 bg-orange-400 rounded-full opacity-70"></div>
                            </div>
                            <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2" style={{ animation: 'organicPing3 1.8s ease-out 0.2s' }}>
                              <div className="w-14 h-14 bg-yellow-500 rounded-full opacity-75"></div>
                            </div>
                            <div className="absolute bottom-0 right-1/4" style={{ animation: 'organicPing4 2.4s ease-out 0.3s' }}>
                              <div className="w-10 h-10 bg-red-500 rounded-full opacity-65"></div>
                            </div>
                            <div className="absolute top-1/4 left-1/4" style={{ animation: 'organicPing5 2.1s ease-out 0.15s' }}>
                              <div className="w-12 h-12 bg-orange-500 rounded-full opacity-70"></div>
                            </div>
                            <div className="absolute top-1/2 right-1/4" style={{ animation: 'organicPing6 1.9s ease-out 0.25s' }}>
                              <div className="w-8 h-8 bg-amber-400 rounded-full opacity-80"></div>
                            </div>
                            
                            {/* Traditional ping effects for layering */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-ping">
                              <div className="w-12 h-12 bg-red-400 rounded-full opacity-75"></div>
                            </div>
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-ping" style={{ animationDelay: '150ms' }}>
                              <div className="w-8 h-8 bg-orange-400 rounded-full opacity-75"></div>
                            </div>
                            <div className="absolute top-1/2 right-1/4 animate-ping" style={{ animationDelay: '300ms' }}>
                              <div className="w-10 h-10 bg-yellow-500 rounded-full opacity-60"></div>
                            </div>
                            
                            {/* Miss indication particles - more random positions */}
                            <div className="absolute animate-bounce delay-100" style={{ top: '20%', right: '15%' }}>
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div className="absolute animate-bounce delay-200" style={{ top: '30%', left: '8%' }}>
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            </div>
                            <div className="absolute animate-bounce delay-300" style={{ bottom: '25%', left: '12%' }}>
                              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            </div>
                            <div className="absolute animate-bounce delay-75" style={{ bottom: '15%', right: '18%' }}>
                              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                            </div>
                            
                            {/* Miss text overlay - moved higher up and to the right */}
                            <div className="absolute text-red-600 font-bold text-[clamp(2rem,8vw,6rem)]" style={{ 
                              top: '-200px',
                              left: '60%',
                              animation: 'floatUpFade 4s ease-out forwards',
                              transformOrigin: 'center'
                            }}>
                              😅 Oops! 😅
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                <TimelineCardWithTooltip
                 key={card.id}
                  card={card}
                  isLatest={isLatest}
                  isAnchor={isAnchor}
                  bgClass={bgClass}
                      hideDates={hideDates ?? false}
                      showTooltip={showTooltips ?? false}
                      showImageOnPlace={showImageOnPlace ?? false}
                      justPlacedCard={justPlacedCard}
                    />
                  </div>
                  <div className={`h-[4vw] min-h-[32px] w-[0.2vw] min-w-[2px] max-w-[9px] transition-all duration-500 ${
                    isJustPlaced 
                      ? justPlacedCorrect 
                        ? 'bg-green-500 animate-pulse shadow-lg' 
                        : 'bg-red-500 animate-pulse shadow-lg'
                      : 'bg-gray-600'
                  }`} />
                  <div className="relative flex items-center justify-center">
                    {/* Horizontal line segment that spans beyond this container */}
                    <div className="absolute h-[0.2vw] min-h-[2px] max-h-[9px] bg-gray-300" style={{ 
                      left: '-100vw', 
                      right: '-100vw',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }} />
                    {/* Connector circle */}
                    <div className={`w-[1.25vw] h-[1.25vw] min-w-[10px] min-h-[10px] max-w-[48px] max-h-[48px] rounded-full transition-all duration-500 z-10 ${
                      isJustPlaced 
                        ? justPlacedCorrect 
                          ? 'bg-green-500 animate-bounce shadow-lg ring-2 ring-green-300' 
                          : 'bg-red-500 animate-bounce shadow-lg ring-2 ring-red-300'
                        : 'bg-gray-700'
                    }`} />
                  </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
