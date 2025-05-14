// pages/index.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { EventCard, puzzles, Puzzle } from "../lib/gameData";
import { checkPlacement } from "../lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";

import { CardTooltip } from '../components/CardTooltip'; 

function shuffleArray<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type PlacedCard = { card: EventCard; correct: boolean };

export default function Home() {
  const [topic, setTopic] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [generatedPuzzle, setGeneratedPuzzle] = useState<Puzzle | null>(null);
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
const basePuzzle: Puzzle = puzzles.find((p) => p.slug === slug) ?? puzzles[0];
const puzzle: Puzzle = generatedPuzzle ?? basePuzzle;

  const {cards: masterCards, hideDates = false } = puzzle;

  const [cards, setCards] = useState<EventCard[]>([]);
  const [timeline, setTimeline] = useState<PlacedCard[]>([]);
  const [anchorCardId, setAnchorCardId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastPlacedIndex, setLastPlacedIndex] = useState<number>(0);
  const [hovered, setHovered] = useState(false); // for draggable tooltip
  const audioRef = useRef<HTMLAudioElement | null>(null);

  //update displayed puzzle when you click a new one, reset Save button
useEffect(() => {
  if (slug) {
    const found = puzzles.find((p) => p.slug === slug);
    if (found) {
      setGeneratedPuzzle(found);
      setSaveStatus("unsaved"); // ✅ reset Save button when switching puzzles
    }
  }
}, [slug]);


//subcategory grouping
function getSubcategoryMap(category: string) {
  const subMap: Record<string, Puzzle[]> = {};

  puzzles
    .filter((p) => p.category === category)
    .forEach((p) => {
      const sub = p.subcategory || "Other";
      if (!subMap[sub]) subMap[sub] = [];
      subMap[sub].push(p);
    });

  return subMap;
}



  //PUZZLE SAVING 
  const [saveStatus, setSaveStatus] = useState<"unsaved" | "saved" | "already">("unsaved");

async function handleSave() {
  if (!puzzle || !puzzle.topic) return;
  const slug = `${puzzle.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

  const res = await fetch("/api/save-puzzle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ puzzle, slug }),
  });

  const json = await res.json();
  if (json.result === "already-saved") setSaveStatus("already");
  else if (json.result === "saved") setSaveStatus("saved");
}


// Surprise me handler
async function handleSurprise(subcategory: string) {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/surprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subcategory }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Unknown error");

    const newPuzzle: Puzzle = {
      slug: `user-${Date.now()}`,
      topic: json.topic,
      category: json.category,
      subcategory: json.subcategory,
      showTooltips: false,
      hideDates: false,
      cards: json.cards,
    };

    setGeneratedPuzzle(newPuzzle);
  } catch (err) {
    console.error("Surprise error", err);
    setError("Surprise Me failed. Try again.");
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    const shuffled = shuffleArray(masterCards);
    const selection = shuffled.slice(0, 10);
    setCards(selection);
    setTimeline([{ card: selection[0], correct: true }]);
    setAnchorCardId(selection[0].id);
    setCurrentIndex(1);
    setLastPlacedIndex(0);
  }, [masterCards]);

  const currentCard = cards[currentIndex];
  const gameOver = currentIndex >= cards.length;
  const correctCount = timeline.filter(
    (p) => p.card.id !== anchorCardId && p.correct
  ).length;
  const missedCount = timeline.filter(
    (p) => p.card.id !== anchorCardId && !p.correct
  ).length;

  function handlePlace(attemptedIndex: number) {
    if (!currentCard) return;

    const dates = timeline.map((p) => p.card.date);

    // Find correct index where this card *should* go
    const sortedIndex = dates.findIndex((d) => d > currentCard.date);
    const correctIndex = sortedIndex === -1 ? timeline.length : sortedIndex;

const left = timeline[attemptedIndex - 1];
const right = timeline[attemptedIndex];

const isCorrect =
  attemptedIndex === correctIndex ||
  currentCard.date === left?.card.date ||
  currentCard.date === right?.card.date;


    // Insert the card where it *belongs*, not where the user dropped it
    setFeedback(isCorrect);
    setTimeline((prev) => {
      const newTimeline = [
        ...prev.slice(0, correctIndex),
        { card: currentCard, correct: isCorrect },
        ...prev.slice(correctIndex),
      ];
      setLastPlacedIndex(correctIndex);
      return newTimeline;
    });

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((i) => i + 1);
      setHoveredIndex(null);
    }, 700);
  }

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.effectAllowed = "move";
  }

  function onTimelineDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const slotWidth = rect.width / (timeline.length + 1);
    let idx = Math.floor(x / slotWidth);
    idx = Math.max(0, Math.min(idx, timeline.length));
    setHoveredIndex(idx);
  }

  function onTimelineDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (hoveredIndex !== null) {
      handlePlace(hoveredIndex);
    }
  }
 const handleGenerate = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Unknown error");

const newPuzzle: Puzzle = {
  slug: `user-${Date.now()}`,
  topic: topic.trim(),
  category: json.category,
      showTooltips: false,
      hideDates: false,
      cards: json.cards,
    };

    setGeneratedPuzzle(newPuzzle);
  } catch (err: any) {
    console.error("Generate error:", err);
    setError((prev) => prev || "Oopsie, the robot did a no-no. Please try again.");
  } finally {
    setLoading(false);
  }
};

  
  return (
     <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-4 py-8">
   <form onSubmit={handleGenerate} className="mb-6 flex items-center gap-2 w-full max-w-2xl">
  <input
    type="text"
    className="border rounded p-2 flex-grow"
    placeholder="Enter a topic to generate a puzzle"
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    disabled={loading}
    required
  />
  <button
    type="submit"
    className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
    disabled={loading || !topic.trim()}
  >
    {loading ? "Generating..." : "Generate Puzzle"}
  </button>
</form>

{error && (
  <div className="mb-6 text-red-600 text-center">
    <p>{error}</p>
    <button
      onClick={handleGenerate as any}
      className="mt-2 underline"
      disabled={loading}
    >
      Retry
    </button>
  </div>
)}


<div className="bg-gray-50 p-6 pb-96 w-full">
  <div className="flex items-baseline gap-2 mb-2">
  <h1 className="text-3xl font-bold">Timeline:</h1>
  <h2 className="text-2xl font-light italic">{puzzle.topic}</h2>
</div>


  {puzzle.slug?.startsWith("user-") && (
    <button
      onClick={handleSave}
      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
      disabled={saveStatus === "saved" || saveStatus === "already"}
    >
      {saveStatus === "saved"
        ? "✅ Saved!"
        : saveStatus === "already"
        ? "🟡 Already Saved"
        : "💾 Save Timeline"}
    </button>
  )}


      <div className="mb-36 flex flex-col items-center">
  <div
    draggable
    onDragStart={onDragStart}
    className="relative inline-block"
  >
    <div
  className={`${
    currentCard?.deezer?.trackId ? "w-96" : "w-32"
  } px-3 py-2 bg-gray-100 shadow rounded text-center text-base text-black cursor-move relative`}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>
  <div className="text-sm font-semibold whitespace-pre-wrap">
    {currentCard?.deezer?.trackId
      ? "Drag this song to the timeline"
      : currentCard?.label}
  </div>

  {/* ℹ️ Tooltip icon */}
  {puzzle.showTooltips && currentCard?.tooltip && (
    <span className="ml-1 text-gray-400 cursor-pointer">ⓘ</span>
  )}

  {/* 🗨️ Tooltip body */}
  {puzzle.showTooltips && currentCard?.tooltip && hovered && (
    <div className="absolute left-full top-0 ml-2 w-72 p-4 bg-white text-sm text-gray-800 rounded-lg shadow-lg z-50">
      <p className="mb-2">{currentCard.tooltip.description}</p>
      <blockquote className="italic text-gray-600 border-l-2 border-gray-300 pl-2">
        “{currentCard.tooltip.quote}”
      </blockquote>
    </div>
  )}

  {/* 🎵 Embedded Deezer Player */}
  {currentCard?.deezer?.trackId && (
    <iframe
      title="Deezer Player"
      scrolling="no"
      frameBorder="0"
      allow="autoplay; clipboard-write"
      src={`https://widget.deezer.com/widget/dark/track/${currentCard.deezer.trackId}`}
      className="rounded w-full h-20 mt-2 shadow"
    />
  )}
</div>


    <div
      className="absolute text-lg italic text-gray-600 whitespace-nowrap"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        top: "100%",
        marginTop: "0.5rem",
      }}
    >
      (Drag to timeline)
    </div>
  </div>
</div>


<div
  className="relative w-full mt-20 h-[240px]"
  onDragOver={onTimelineDragOver}
  onDrop={onTimelineDrop}
>
  <div className="flex justify-between items-end relative z-10 h-full">
    {timeline.map((p, i) => {
      const isLatest = i === lastPlacedIndex;
      const isAnchor = p.card.id === anchorCardId;
      const bgClass = isAnchor
        ? "bg-gray-300 text-black"
        : p.correct
        ? "bg-green-100 text-black"
        : "bg-red-100 text-black";

      return (
        <div key={p.card.id} className="flex flex-col items-center flex-1 min-w-[100px]">
          <TimelineCardWithTooltip
            card={p.card}
            isLatest={isLatest}
            isAnchor={isAnchor}
            bgClass={bgClass}
            hideDates={hideDates}
            showTooltip={puzzle.showTooltips ?? false}
          />
          <div className="h-14 w-0.5 bg-gray-600" />
          <div className="w-4 h-4 bg-gray-700 rounded-full -mt-2" />
        </div>
      );
    })}
  </div>

  {/* Timeline line correctly anchored at bottom of the visible card container */}
  <div className="absolute bottom-[6px] left-0 right-0 h-0.5 bg-gray-300 z-[1]" />
</div>

      {!gameOver && feedback !== null && (
        <div className="mt-6 flex justify-center">
          <div
            className={`p-2 text-4xl rounded text-center ${
              feedback ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {feedback ? "✅ Correct!" : "❌ Incorrect"}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="text-3xl font-bold">
            {missedCount === 0
              ? "Perfect Game!"
              : missedCount <= 2
              ? `So close! You only missed ${missedCount}`
              : missedCount <= 4
              ? `You placed ${correctCount} correctly. Better luck next time.`
              : "Oof. Maybe try another category?"}
          </div>
          <div className="text-2xl space-x-1">
            {timeline
              .filter((p) => p.card.id !== anchorCardId)
              .map((p, i) => (
                <span key={i}>{p.correct ? "🟩" : "🟥"}</span>
              ))}
          </div>
          <button className="bg-black text-white px-6 py-2 rounded">
            Challenge a friend!
          </button>
        </div>
      )}

      <div className="mt-40 px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
{["History", "Arts", "Entertainment", "Sports", "Current Events"].map((category) => {
  const subMap = getSubcategoryMap(category);

  return (
    <div key={category}>
      <h2 className="text-xl font-bold mb-4">{category}</h2>

      {Object.entries(subMap).map(([subcat, group]) => (
        <div key={subcat} className="mb-6 ml-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-md">{subcat}</h3>
            <button
              onClick={() => handleSurprise(subcat)}
              className="bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
            >
              Surprise Me!
            </button>
          </div>
          {group
            .sort((a, b) => a.topic.localeCompare(b.topic))
            .map((p) => (
              <div key={p.slug}>
                <Link
                  href={`/?slug=${p.slug}`}
                  className="text-blue-800 hover:underline block py-0.5"
                >
                  {p.topic}
                </Link>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
})} 
   </div>
    </div>
      <div className="mt-12 max-w-xl mx-auto text-center">
        <h3 className="text-lg font-semibold mb-2">
          Have an idea for a Timeline?
        </h3>
        <a
          href="mailto:timelinesuggestions@gmail.com?subject=Timeline Puzzle Suggestion"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Suggest a Topic
        </a>
      </div>
    </div>
     </div>
  );
}

function TimelineCardWithTooltip({
    card,
    isLatest,
    isAnchor,
    hideDates,
    showTooltip,
    bgClass,
  }: {
    card: EventCard;
    isLatest: boolean;
    isAnchor: boolean;
    hideDates: boolean;
    showTooltip: boolean;
    bgClass: string;
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
          <div
            className={`w-32 px-3 py-2 bg-gray-100 shadow rounded text-center text-sm text-black ${bgClass}`}
          >
            {card.image ? (
              <>
                <div className="text-sm font-semibold">{card.title}</div>
                {card.artist && <div className="text-xs italic">{card.artist}</div>}
                <img
                  src={card.image}
                  alt={card.title}
                  className="max-h-32 object-contain mx-auto my-1"
                />
                {!hideDates && <div className="font-bold">{card.date}</div>}
              </>
            ) : (
              <>
                <p className="italic text-sm whitespace-pre-wrap break-words text-center">
                  {card.label}
                </p>
                {!hideDates && (
                  <p className="font-bold text-4xl">{card.date}</p>
                )}
              </>
            )}
            {hasTooltip && (
              <span className="ml-1 text-gray-400 cursor-pointer">ⓘ</span>
            )}
          </div>
          {hasTooltip && hovered && (
           <div className="absolute left-full top-0 ml-2 w-72 p-4 bg-white text-sm text-gray-800 rounded-lg shadow-lg z-50">
              <p className="mb-2">{card.tooltip!.description}</p>
              <blockquote className="italic text-gray-600 border-l-2 border-gray-300 pl-2">
                “{card.tooltip!.quote}”
              </blockquote>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
);
  }
