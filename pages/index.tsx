// pages/index.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { EventCard, puzzles, Puzzle } from "../lib/gameData";
import { checkPlacement } from "../lib/gameLogic";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const puzzle: Puzzle = puzzles.find((p) => p.slug === slug) ?? puzzles[0];
  const { topic, cards: masterCards, hideDates = false } = puzzle;

  const [cards, setCards] = useState<EventCard[]>([]);
  const [timeline, setTimeline] = useState<PlacedCard[]>([]);
  const [anchorCardId, setAnchorCardId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastPlacedIndex, setLastPlacedIndex] = useState<number>(0);

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

    // Determine if user's drop was correct
    const isCorrect = attemptedIndex === correctIndex;

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-96">
      <h1 className="text-3xl font-bold mb-1">Today's Timeline:</h1>
      <p className="text-lg mb-6 ml-10">{topic}</p>

      {!gameOver && currentCard && (
        <div className="mb-36 flex flex-col items-center">
          <div
            draggable
            onDragStart={onDragStart}
            className="relative inline-block"
          >
            <div
              className={`${
                currentCard.image ? "w-96" : "w-32"
              } px-3 py-2 bg-gray-100 shadow rounded text-center text-base text-black cursor-move`}
            >
              {!currentCard.image ? (
                <div className="text-sm font-semibold whitespace-pre-wrap">
                  {currentCard.label}
                </div>
              ) : (
                <img
                  src={currentCard.image}
                  alt={currentCard.title}
                  className="h-96 object-contain mx-auto"
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
      )}

      <div
        className="relative w-full mt-20"
        onDragOver={onTimelineDragOver}
        onDrop={onTimelineDrop}
      >
        <div className="absolute bottom-[8px] left-0 right-0 h-0.5 bg-gray-300 z-0" />
        {!gameOver && feedback === null && hoveredIndex !== null && (
          <div
            className="absolute inset-y-0 bg-green-50 opacity-30 transition-opacity duration-150"
            style={{
              left: `${(hoveredIndex * 100) / (timeline.length + 1)}%`,
              width: `${100 / (timeline.length + 1)}%`,
              zIndex: 5,
            }}
          />
        )}

        <div className="flex justify-between items-end relative z-10">
          {timeline.map((p, i) => {
            const isLatest = i === lastPlacedIndex;
            const isAnchor = p.card.id === anchorCardId;
            const bgClass = isAnchor
              ? "bg-gray-300 text-black"
              : p.correct
              ? "bg-green-100 text-black"
              : "bg-red-100 text-black";

            return (
              <div
                key={p.card.id}
                className="flex flex-col items-center flex-1 min-w-[100px]"
              >
                <AnimatePresence>
                  <motion.div
                    className="timeline-slot"
                    initial={isLatest ? { scale: 0.5 } : false}
                    animate={isLatest ? { scale: [0.5, 1.1, 1] } : false}
                    transition={
                      isLatest ? { duration: 0.3, ease: "easeOut" } : undefined
                    }
                  >
                    <div
                      className={`w-32 px-3 py-2 bg-gray-100 shadow rounded text-center text-sm text-black ${bgClass}`}
                    >
                      {p.card.image ? (
                        <>
                          <div className="text-sm font-semibold">
                            {p.card.title}
                          </div>
                          {p.card.artist && (
                            <div className="text-xs italic">
                              {p.card.artist}
                            </div>
                          )}
                          <img
                            src={p.card.image}
                            alt={p.card.title}
                            className="max-h-32 object-contain mx-auto my-1"
                          />
                          {!hideDates && (
                            <div className="font-bold">{p.card.date}</div>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="italic text-sm whitespace-pre-wrap break-words text-center">
                            {p.card.label}
                          </p>
                          {!hideDates && (
                            <p className="font-bold text-4xl">{p.card.date}</p>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
                <div className="h-14 w-0.5 bg-gray-600" />
                <div className="w-4 h-4 bg-gray-700 rounded-full -mt-2" />
              </div>
            );
          })}
        </div>
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
            SHARE
          </button>
        </div>
      )}

      <div className="mt-40 px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {["History", "Arts", "Entertainment", "Sports", "Current Events"].map(
            (category) => (
              <div key={category}>
                <h2 className="text-lg font-bold mb-2">{category}</h2>
                {puzzles
                  .filter((p) => p.category === category)
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
            )
          )}
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
  );
}
