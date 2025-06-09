// pages/index.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { puzzles } from "../lib/gameData";
import { EventCard, Puzzle } from "../lib/types";
import TimelinePuzzleGame from "../components/TimelinePuzzleGame";
import FormattedDate from "../components/FormattedDate";
import { PlacedCard } from "../components/TimelinePuzzleGame";

function shuffleArray<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPuzzle, setGeneratedPuzzle] = useState<Puzzle | null>(null);
  const router = useRouter();
  const { slug } = router.query as { slug?: string };
  const basePuzzle: Puzzle = puzzles.find((p) => p.slug === slug) ?? puzzles[0];
  const puzzle: Puzzle = generatedPuzzle ?? basePuzzle;
  const previousPuzzleSlugRef = useRef<string | null>(null);

  const { cards: masterCards, hideDates = false, showImageOnPlace = false, showTooltips = false } = puzzle;

  const [cards, setCards] = useState<EventCard[]>([]);
  const [timeline, setTimeline] = useState<PlacedCard[]>([]);
  const [anchorCardId, setAnchorCardId] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"unsaved" | "saved" | "already">("unsaved");

  // Update displayed puzzle when you click a new one, reset Save button
  useEffect(() => {
    if (slug) {
      const found = puzzles.find((p) => p.slug === slug);
      if (found) {
        setGeneratedPuzzle(found);
        setSaveStatus("unsaved");
      }
    }
  }, [slug]);

  // Subcategory grouping
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

  // Puzzle saving
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
    if (puzzle?.slug && previousPuzzleSlugRef.current !== puzzle.slug) {
      const shuffled = shuffleArray(
        puzzle.cards.map((card, index) => ({
          ...card,
          id: card.id || `card-${index}-${Date.now()}`
        }))
      );

      const selection = shuffled.slice(0, 10);
      setCards(selection);
      // Initialize timeline as empty - the anchor card is handled separately by TimelinePuzzleGame
      setTimeline([]);
      setAnchorCardId(selection[0].id);
      setCurrentIndex(1);
      setScore(0);
      previousPuzzleSlugRef.current = puzzle.slug;
    }
  }, [puzzle?.slug]);

  const currentCard = cards[currentIndex];
  const gameOver = currentIndex >= cards.length;
  const correctCount = timeline.filter(
    (p) => p.card.id !== anchorCardId && p.correct
  ).length;
  const missedCount = timeline.filter(
    (p) => p.card.id !== anchorCardId && !p.correct
  ).length;

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
      setError("Failed to generate puzzle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center px-[min(2vw,16px)] py-[min(4vw,32px)]">
      <form onSubmit={handleGenerate} className="mb-[min(3vw,24px)] flex items-center gap-[min(1vw,8px)] w-full max-w-2xl">
        <input
          type="text"
          className="border rounded p-[min(1vw,8px)] flex-grow text-[clamp(0.875rem,2.5vw,1.25rem)]"
          placeholder="Enter a topic to generate a puzzle"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-[min(2vw,16px)] py-[min(1vw,8px)] disabled:opacity-50 text-[clamp(0.875rem,2.5vw,1.25rem)]"
          disabled={loading || !topic.trim()}
        >
          {loading ? "Generating..." : "Generate Puzzle"}
        </button>
      </form>

      <div className="mb-[min(3vw,1.5rem)]">
        <Link href="/party" passHref legacyBehavior>
          <a className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-[min(1vw,8px)] px-[min(2vw,16px)] rounded shadow transition text-[clamp(1rem,3vw,2rem)]">
            🎉 Play Party Mode
          </a>
        </Link>
      </div>

      {error && (
        <div className="mb-[min(3vw,24px)] text-red-600 text-center">
          <p className="text-[clamp(1rem,3vw,1.5rem)]">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-[min(3vw,24px)] pb-0 w-full">
        <div className="flex items-baseline gap-[min(1vw,12px)] mb-[min(1vw,12px)]">
          <h1 className="text-[clamp(1.8rem,6vw,6rem)] font-bold">Timelines:</h1>
          <h2 className="text-[clamp(1.4rem,4.5vw,4.5rem)] font-light italic">{puzzle.topic}</h2>
        </div>

        {puzzle.slug?.startsWith("user-") && (
          <button
            onClick={handleSave}
            className="text-[clamp(0.75rem,2vw,1.5rem)] bg-blue-600 text-white px-[min(1.5vw,18px)] py-[min(0.5vw,6px)] rounded hover:bg-gray-800 transition"
            disabled={saveStatus === "saved" || saveStatus === "already"}
          >
            {saveStatus === "saved"
              ? "✅ Saved!"
              : saveStatus === "already"
              ? "🟡 Already Saved"
              : "💾 Save Timeline"}
          </button>
        )}

        {cards.length > 0 && (
          <TimelinePuzzleGame
            engine={null}
            anchorCard={cards[0]}
            currentCard={currentCard || cards[cards.length - 1]}
            timeline={timeline}
            setTimeline={setTimeline}
            onTimelineChange={(newTimeline, correct) => {
              setTimeline(newTimeline);
              if (correct) {
                setScore((s) => s + 1);
              }
              setCurrentIndex((i) => i + 1);
            }}
            hideDates={hideDates}
            showImageOnPlace={showImageOnPlace}
            showTooltips={showTooltips}
            locked={gameOver}
          />
        )}
      </div>

      {gameOver && (
        <div className="mt-[min(4vw,32px)] mb-[min(8vw,64px)] flex flex-col items-center space-y-[min(2.8vw,22px)]">
          <div className="text-[clamp(3.15rem,12.6vw,6.3rem)] font-bold text-center">
            {missedCount === 0
              ? "Perfect Game!"
              : missedCount <= 2
              ? `So close! You only missed ${missedCount}`
              : missedCount <= 4
              ? `You placed ${correctCount} correctly. Better luck next time.`
              : "Oof. Maybe try another category?"}
          </div>
          <div className="text-[clamp(2.625rem,8.4vw,4.2rem)] space-x-[min(1.05vw,8px)]">
            {timeline
              .filter((p) => p.card.id !== anchorCardId)
              .map((p, i) => (
                <span key={i}>{p.correct ? "🟩" : "🟥"}</span>
              ))}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-[min(4.2vw,34px)] py-[min(2.1vw,17px)] rounded-lg text-[clamp(2.1rem,6.3vw,3.15rem)] transition"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="-mt-[min(8vw,96px)] px-[min(3vw,36px)] pb-[min(10vw,120px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[min(6vw,3rem)]">
          {["History", "Arts", "Entertainment", "Sports", "Current Events"].map((category) => {
            const subMap = getSubcategoryMap(category);

            return (
              <div key={category}>
                <h2 className="text-[clamp(1.2rem,4vw,3.75rem)] font-bold mb-[min(2vw,1.5rem)]">{category}</h2>

                {Object.entries(subMap).map(([subcat, group]) => (
                  <div key={subcat} className="mb-[min(3vw,2.25rem)] ml-[min(2vw,1.5rem)]">
                    <div className="flex items-center gap-[min(1vw,12px)] mb-[min(0.5vw,6px)]">
                      <h3 className="font-bold text-[clamp(1rem,3vw,2.7rem)]">{subcat}</h3>
                      {subcat.toLowerCase() !== "other" && (
                        <button
                          className="ml-[min(1vw,12px)] text-[clamp(0.75rem,2vw,1.5rem)] px-[min(1vw,12px)] py-[min(0.5vw,6px)] bg-blue-500 text-white rounded"
                          onClick={() => handleSurprise(subcat)}
                        >
                          Surprise Me
                        </button>
                      )}
                    </div>
                    {group
                      .sort((a, b) => a.topic.localeCompare(b.topic))
                      .map((p) => {
                        const hasVideo = p.cards.some((c: any) => !!c.youtube);
                        const hasAudio = p.cards.some((c: any) => !!c.deezer);
                        const hasImage = p.cards.some((c: any) => !!c.image);

                        let emoji = "";
                        if (hasVideo) emoji = "🎬";
                        else if (hasAudio) emoji = "🎵";
                        else if (hasImage) emoji = "🖼️";

                        return (
                          <div key={p.slug}>
                            <Link
                              href={`/?slug=${p.slug}`}
                              className="text-blue-800 hover:underline block py-[min(0.5vw,3px)] text-[clamp(0.9rem,2.5vw,2.25rem)]"
                            >
                              {emoji} {p.topic}
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-[min(1vw,8px)] max-w-xl mx-auto text-center">
        <h3 className="text-[clamp(1rem,3vw,1.5rem)] font-semibold mb-[min(1vw,8px)]">
          Have an idea for a Timeline?
        </h3>
        <a
          href="mailto:timelinesuggestions@gmail.com?subject=Timeline Puzzle Suggestion"
          className="inline-block bg-blue-600 text-white px-[min(2vw,16px)] py-[min(1vw,8px)] rounded hover:bg-blue-700 transition text-[clamp(0.875rem,2.5vw,1.25rem)]"
        >
          Suggest a Topic
        </a>
      </div>
    </div>
  );
}