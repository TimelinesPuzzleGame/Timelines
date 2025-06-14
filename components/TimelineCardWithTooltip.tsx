// components/TimelineCardWithTooltip.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EventCard } from "../lib/types";
import FormattedDate from "./FormattedDate";

// Convert background classes to transparent versions for fullscreen mode (80% transparent = 20% opacity)
function getTransparentBgClass(bgClass: string): string {
  if (bgClass.includes('bg-gray-300')) return 'bg-gray-300/20'; // Anchor card
  if (bgClass.includes('bg-green-500')) return 'bg-green-500/20'; // Correct card (brighter)
  if (bgClass.includes('bg-green-300')) return 'bg-green-500/20'; // Correct card (brighter)
  if (bgClass.includes('bg-red-600')) return 'bg-red-600/20'; // Incorrect card (brighter)
  if (bgClass.includes('bg-red-400')) return 'bg-red-600/20'; // Incorrect card (brighter)
  if (bgClass.includes('bg-gray-200')) return 'bg-gray-200/20'; // Default card
  return bgClass.replace(/bg-\w+-\d+/, 'bg-gray-200/20'); // Fallback
}


export default function TimelineCardWithTooltip({
  card,
  isLatest,
  isAnchor,
  hideDates,
  showTooltip,
  showImageOnPlace,
  bgClass,
  isFullScreen,
  justPlacedCard,
}: {
  card: EventCard;
  isLatest: boolean;
  isAnchor: boolean;
  hideDates: boolean;
  showTooltip: boolean;
  showImageOnPlace: boolean;
  bgClass: string;
  isFullScreen?: boolean;
  justPlacedCard?: EventCard | null;
}) {
  const [hovered, setHovered] = React.useState(false);
  const hasTooltip = showTooltip && card.tooltip;

  return (
    <AnimatePresence>
      <motion.div
        className="timeline-slot relative"
        initial={isLatest ? { scale: 0.5 } : false}
        animate={isLatest ? { scale: [0.5, 1.1, 1] } : false}
        transition={isLatest ? { duration: 0.3, ease: "easeOut" } : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={`w-[12vw] min-w-[120px] max-w-[320px] px-[0.8vw] py-[0.5vw] aspect-[3/2] shadow rounded-lg text-center text-[clamp(0.65rem,1.6vw,2rem)] text-black ${isFullScreen && (!justPlacedCard || card.id !== justPlacedCard.id) ? getTransparentBgClass(bgClass) : bgClass}`}>
          {card.image && showImageOnPlace ? (
            <>
              <div className="text-[clamp(0.65rem,1.6vw,2rem)] font-bold">{card.title}</div>
              {card.artist && <div className="text-[clamp(0.55rem,1.2vw,1.6rem)] italic">{card.artist}</div>}
              <img src={card.image} alt={card.title} className="max-h-[7vw] min-h-[50px] max-h-[140px] object-contain mx-auto my-[0.25vw]" />
              {!hideDates && <div className="font-bold text-[clamp(1rem,5vw,5.5rem)]"><FormattedDate date={card.date} /></div>}
            </>
          ) : (
            <>
              <p className="font-bold text-[clamp(0.65rem,1.6vw,2rem)] whitespace-pre-wrap break-words text-center">
                {card.label}
              </p>
              {!hideDates && <p className="font-bold text-[clamp(1rem,5vw,5.5rem)]"><FormattedDate date={card.date} /></p>}
            </>
          )}
          {hasTooltip && (
            <span className="ml-[0.3vw] text-gray-400 cursor-pointer text-[clamp(0.65rem,1.6vw,2rem)]">ⓘ</span>
          )}
        </div>
        {hasTooltip && hovered && (
          <div className="absolute left-full top-0 ml-[1vw] w-[30vw] min-w-[250px] max-w-[300px] p-[1.2vw] bg-white text-[clamp(0.7rem,1.8vw,1rem)] text-gray-800 rounded-lg shadow-lg z-50">
            <p className="mb-[0.8vw]">{card.tooltip?.description}</p>
            <blockquote className="italic text-gray-600 border-l-2 border-gray-300 pl-[0.8vw]">
              "{card.tooltip?.quote}"
            </blockquote>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
