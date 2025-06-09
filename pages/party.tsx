// pages/party.tsx
import { puzzles } from "../lib/gameData";
import React, { useEffect, useState } from "react";
import { ScoreTurnIndicator } from "../components/ScoreTurnIndicator";
import { loadPuzzle } from "../lib/puzzleLoader";
import { PartyGameEngine } from "../lib/partyGameEngine";
import Link from "next/link";
import type { Puzzle, EventCard, PartyGameState } from "../lib/types";
import { ErrorBoundary, PartyModeErrorFallback } from "../components/ErrorBoundary";

import TimelinePuzzleGame, { PlacedCard } from "../components/TimelinePuzzleGame";
import BigScreenPartyMode from "../components/BigScreenPartyMode";
import TimelineCardWithTooltip from "../components/TimelineCardWithTooltip";

// --- NEW: setup flow state ---
type SetupStep = "count" | "names" | "category" | "subcategory" | "puzzles" | "play";

const MIN_TEAMS = 2;
const MAX_TEAMS = 4;

export default function PartyModePage() {
  return (
    <ErrorBoundary fallback={PartyModeErrorFallback}>
      <PartyModeContent />
    </ErrorBoundary>
  );
}

function PartyModeContent() {

// above your `useState` calls for team names / engine / gameState…
const [step, setStep] = useState<"count"|"names"|"subcategory"|"category"|"puzzles"|"play">("count");
const [selectedCategory, setSelectedCategory] = useState<string|null>(null);
const [pickSubcategory, setPickSubcategory] = useState(false);

// --- NEW: Subcategory and puzzle selection state ---
const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
const [selectedPuzzles, setSelectedPuzzles] = useState<Set<string>>(new Set());

  // which puzzle slug the user picks
  const [selectedPuzzleSlug, setSelectedPuzzleSlug] = useState<string>("");

  // how many teams, default 2
  const [teamCount, setTeamCount] = useState<number>(2);
  // their names, default Team 1…Team N
  const [teamNames, setTeamNames] = useState<string[]>(["Team 1", "Team 2"]);

  // --- NEW: Load previous team names from localStorage ---
  const loadPreviousTeamNames = (newTeamCount: number): string[] => {
    try {
      const savedTeamNames = localStorage.getItem('party-team-names');
      const savedTeamCount = localStorage.getItem('party-team-count');
      
      if (savedTeamNames && savedTeamCount) {
        const parsedNames = JSON.parse(savedTeamNames);
        const parsedCount = parseInt(savedTeamCount);
        
        // If team count matches and we have the right number of names, use them
        if (parsedCount === newTeamCount && Array.isArray(parsedNames) && parsedNames.length === newTeamCount) {
          console.log(`🔄 Loaded previous team names:`, parsedNames);
          return parsedNames;
        }
      }
    } catch (error) {
      console.warn('Failed to load previous team names:', error);
    }
    
    // Fall back to default names
    return Array.from({length: newTeamCount}, (_, i) => `Team ${i + 1}`);
  };

  // --- NEW: Save team names to localStorage ---
  const saveTeamNames = (names: string[], count: number) => {
    try {
      localStorage.setItem('party-team-names', JSON.stringify(names));
      localStorage.setItem('party-team-count', count.toString());
      console.log(`💾 Saved team names:`, names);
    } catch (error) {
      console.warn('Failed to save team names:', error);
    }
  };

  const [engine, setEngine] = useState<PartyGameEngine | null>(null);
  const [gameState, setGameState] = useState<PartyGameState | null>(null);

  const [currentCard, setCurrentCard] = useState<EventCard | null>(null);
  const [teamTurn, setTeamTurn] = useState(0); // 🟢 Track current team turn in UI
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [justPlacedCard, setJustPlacedCard] = useState<EventCard | null>(null);
  const [timelineLockedForFeedback, setTimelineLockedForFeedback] = useState(false);
  const [showNextTurnButton, setShowNextTurnButton] = useState(false);
  const [nextTurnData, setNextTurnData] = useState<{
    nextCard: EventCard | null;
    newState: PartyGameState;
  } | null>(null);

  // --- NEW: Track current puzzle for displaying title ---
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);

  // --- NEW: Track used subcategories for no-repeat logic ---
  const [usedSubcategories, setUsedSubcategories] = useState<Set<string>>(new Set());

  // --- NEW: Helper function to filter puzzles by minimum card count ---
  const filterPuzzlesByCardCount = (puzzlesList: Puzzle[]): Puzzle[] => {
    const minCards = teamCount * 10;
    return puzzlesList
      .filter((p: Puzzle) => p.cards.length >= minCards)
      .filter((p: Puzzle) => !p.hideDates); // Exclude fictional timelines that can't be combined
  };

  // --- NEW: Map your UI categories to actual puzzle categories ---
  const getCategoryMapping = (uiCategory: string): string[] => {
    switch (uiCategory) {
      case "Music":
        return ["Entertainment"]; // Most music puzzles are under Entertainment
      case "TV/Film": 
        return ["Entertainment"];
      case "History":
        return ["History"];
      case "Random":
        return ["Entertainment", "History", "Arts", "Sports", "Current Events"];
      default:
        return ["Entertainment"];
    }
  };

  // --- NEW: Get puzzles filtered by category AND card count ---
  const getPuzzlesByCategory = (uiCategory: string): Puzzle[] => {
    const mappedCategories = getCategoryMapping(uiCategory);
    const categoryPuzzles = puzzles.filter((p: Puzzle) => mappedCategories.includes(p.category));
    return filterPuzzlesByCardCount(categoryPuzzles);
  };

  // --- NEW: Random puzzle selection from category with card count filtering ---
  const selectRandomPuzzle = async (uiCategory: string): Promise<string | null> => {
    const categoryPuzzles = getPuzzlesByCategory(uiCategory);
    
    if (categoryPuzzles.length === 0) {
      console.error(`No puzzles with enough cards (${teamCount * 10}+) found for category:`, uiCategory);
      return null;
    }

    // Group by subcategory
    const subcategoryMap: Record<string, Puzzle[]> = {};
    categoryPuzzles.forEach((p: Puzzle) => {
      const sub = p.subcategory || "Other";
      if (!subcategoryMap[sub]) subcategoryMap[sub] = [];
      subcategoryMap[sub].push(p);
    });

    // Get available subcategories (not used this session)
    const availableSubcategories = Object.keys(subcategoryMap).filter(
      (sub: string) => !usedSubcategories.has(sub)
    );

    // If all used, reset and use all
    const subsToUse = availableSubcategories.length > 0 
      ? availableSubcategories 
      : Object.keys(subcategoryMap);

    // Pick random subcategory
    const randomSub = subsToUse[Math.floor(Math.random() * subsToUse.length)];
    
    // Pick random puzzle from that subcategory  
    const subcategoryPuzzles = subcategoryMap[randomSub];
    const randomPuzzle = subcategoryPuzzles[Math.floor(Math.random() * subcategoryPuzzles.length)];

    // Mark subcategory as used
    setUsedSubcategories(prev => new Set(Array.from(prev).concat(randomSub)));

    console.log(`🎲 Selected random puzzle: ${randomPuzzle.topic} from ${randomSub} (${randomPuzzle.cards.length} cards)`);
    return randomPuzzle.slug;
  };

  // --- NEW: Handle surprise me button with card count filtering ---
  const handleSurprise = (subcategory: string) => {
    const subcategoryPuzzles = puzzles.filter((p: Puzzle) => p.subcategory === subcategory);
    const filteredPuzzles = filterPuzzlesByCardCount(subcategoryPuzzles);
    if (filteredPuzzles.length > 0) {
      const randomPuzzle = filteredPuzzles[Math.floor(Math.random() * filteredPuzzles.length)];
      setSelectedPuzzleSlug(randomPuzzle.slug);
      setStep("play");
    } else {
      console.error(`No puzzles in subcategory "${subcategory}" have enough cards (${teamCount * 10}+)`);
    }
  };

  // --- NEW: Handle puzzle selection from subcategory grid ---
  const handlePuzzleSelect = (puzzleSlug: string) => {
    setSelectedPuzzleSlug(puzzleSlug);
    setStep("play");
  };

  // --- NEW: Subcategory selection helpers ---
  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategory)) {
        newSet.delete(subcategory);
      } else {
        newSet.add(subcategory);
      }
      return newSet;
    });
  };

  // Filter categories based on selection
  const getRelevantCategories = () => {
    if (!selectedCategory) return [];
    
    const mappedCategories = getCategoryMapping(selectedCategory);
    const LIST_CATS = ["History", "Arts", "Entertainment", "Sports", "Current Events"] as const;
    
    return LIST_CATS.filter(cat => mappedCategories.includes(cat));
  };

  // helper to group puzzles under each subcategory with card count filtering
  const getSubcategoryMap = (cat: string) => {
    const map: Record<string, Puzzle[]> = {};
    const categoryPuzzles = puzzles.filter((p: Puzzle) => p.category === cat);
    const filteredPuzzles = filterPuzzlesByCardCount(categoryPuzzles);
    
    filteredPuzzles.forEach((p: Puzzle) => {
      const sub = p.subcategory || "Other";
      if (!map[sub]) map[sub] = [];
      map[sub].push(p);
    });
    return map;
  };

  const selectAllSubcategories = () => {
    const relevantCategories = getRelevantCategories();
    const allSubs = new Set<string>();
    relevantCategories.forEach(category => {
      const subMap = getSubcategoryMap(category);
      Object.keys(subMap).forEach(sub => allSubs.add(sub));
    });
    setSelectedSubcategories(allSubs);
  };

  const clearAllSubcategories = () => {
    setSelectedSubcategories(new Set());
  };

  // --- NEW: Puzzle selection helpers ---
  const togglePuzzle = (puzzleSlug: string) => {
    setSelectedPuzzles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(puzzleSlug)) {
        newSet.delete(puzzleSlug);
      } else {
        newSet.add(puzzleSlug);
      }
      return newSet;
    });
  };

  const selectAllPuzzles = () => {
    const availablePuzzles = getAvailablePuzzles();
    setSelectedPuzzles(new Set(availablePuzzles.map(p => p.slug)));
  };

  const clearAllPuzzles = () => {
    setSelectedPuzzles(new Set());
  };

  // --- NEW: Get puzzles filtered by selected subcategories ---
  const getAvailablePuzzles = (): Puzzle[] => {
    if (!selectedCategory) return [];
    
    const mappedCategories = getCategoryMapping(selectedCategory);
    let categoryPuzzles = puzzles.filter((p: Puzzle) => mappedCategories.includes(p.category));
    categoryPuzzles = filterPuzzlesByCardCount(categoryPuzzles);
    
    // Filter by selected subcategories if any are selected
    if (selectedSubcategories.size > 0) {
      categoryPuzzles = categoryPuzzles.filter((p: Puzzle) => 
        p.subcategory && selectedSubcategories.has(p.subcategory)
      );
    }
    
    return categoryPuzzles;
  };

  // --- NEW: Combine multiple puzzles into one ---
  const createCombinedPuzzle = async (puzzleSlugs: string[]): Promise<Puzzle | null> => {
    if (puzzleSlugs.length === 0) return null;
    
    const loadedPuzzles = await Promise.all(
      puzzleSlugs.map(slug => loadPuzzle(slug))
    );
    
    const validPuzzles = loadedPuzzles.filter((p: Puzzle | null): p is Puzzle => p !== null);
    if (validPuzzles.length === 0) return null;
    
    // Combine all cards from selected puzzles
    const allCards: EventCard[] = [];
    validPuzzles.forEach((puzzle: Puzzle) => {
      allCards.push(...puzzle.cards);
    });
    
    // Create combined puzzle
    const combinedPuzzle: Puzzle = {
      slug: `combined-${Date.now()}`,
      topic: validPuzzles.map((p: Puzzle) => p.topic).join(" + "),
      category: validPuzzles[0].category,
      subcategory: "Combined",
      cards: allCards,
      hideDates: false,
      showImageOnPlace: false
    };
    
    console.log(`🔗 Combined ${validPuzzles.length} puzzles into one with ${allCards.length} cards`);
    return combinedPuzzle;
  };

  useEffect(() => {
     // No init here: we only start when user finishes setup
  }, []);
 
  // --- UPDATED: INIT ENGINE WHEN SETUP COMPLETE ---
  useEffect(() => {
    if (step !== "play") return;

    (async () => {
      let puzzleToLoad: Puzzle | null = null;

      // Check if we have multiple selected puzzles to combine
      if (selectedPuzzles.size > 1) {
        console.log(`🔗 Combining ${selectedPuzzles.size} selected puzzles...`);
        puzzleToLoad = await createCombinedPuzzle(Array.from(selectedPuzzles));
      } 
      // Single puzzle selected
      else if (selectedPuzzles.size === 1) {
        const puzzleSlug = Array.from(selectedPuzzles)[0];
        puzzleToLoad = await loadPuzzle(puzzleSlug);
      }
      // No specific puzzles selected, use the single slug or random selection
      else {
        let slugToLoad = selectedPuzzleSlug;

        // If no specific puzzle selected, use default for Movies or randomly choose from category
        if (!slugToLoad && selectedCategory) {
          // Default to Best Movie Scenes for TV/Film category
          if (selectedCategory === "TV/Film") {
            slugToLoad = "best-movie-scenes";
            console.log("🎬 Defaulting to Best Movie Scenes for TV/Film category");
          } else {
            const randomSlug = await selectRandomPuzzle(selectedCategory);
            if (randomSlug) {
              slugToLoad = randomSlug;
            }
          }
        }

        if (slugToLoad) {
          puzzleToLoad = await loadPuzzle(slugToLoad);
        }
      }

      if (!puzzleToLoad || puzzleToLoad.cards.length < teamCount * 10) {
        console.error("Not enough cards for", teamCount, "teams. Need", teamCount * 10, "cards, have", puzzleToLoad?.cards.length || 0);
        return;
      }

      const newEngine = new PartyGameEngine(puzzleToLoad, teamNames);
      newEngine.startGame();

      const initialState = newEngine.getState();
      setEngine(newEngine);
      setGameState(initialState);
      setTeamTurn(initialState.currentTurn);
      setCurrentCard(newEngine.getCurrentTeamCard());
      setCurrentPuzzle(puzzleToLoad);
      
      // --- NEW: Save team names for next time ---
      saveTeamNames(teamNames, teamCount);
      
      console.log(`✅ Game started with puzzle: ${puzzleToLoad.topic}`);
    })();
  }, [step, selectedPuzzles, selectedPuzzleSlug, selectedCategory, teamCount, teamNames]);

  // --- RENDER SETUP FLOW ---
  if (step === "count") {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-[min(2vw,16px)] py-[min(4vw,32px)]">
        <button
          className="absolute top-[2vw] right-[2vw] px-[1vw] py-[.5vw] bg-red-100 text-red-600 rounded text-[clamp(1rem,6vw,3rem)] hover:shadow-lg hover:scale-105 hover:bg-red-200 transition-all"
           onClick={() => window.location.href = "/"}
        >
          Back
        </button>
        <div className="text-center">
          <h1 className="text-[clamp(2rem,8vw,18rem)] font-bold mb-[min(6vw,48px)] whitespace-nowrap text-center">How many teams?</h1>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-[min(6vw,48px)]">
            {[2,3,4].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setTeamCount(n);
                  setTeamNames(loadPreviousTeamNames(n));
                  setStep("names");
                }}
                className="px-[min(8vw,64px)] py-[min(4vw,32px)] bg-gray-200 rounded-xl hover:bg-purple-100 hover:shadow-lg hover:scale-105 transition-all text-[clamp(2rem,8vw,27rem)] font-bold min-w-[min(20vw,400px)] min-h-[min(12vw,240px)] flex items-center justify-center"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

 if (step === "names") {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-[min(2vw,16px)] py-[min(4vw,32px)]">
      {/* Back button, top-right corner */}
      <button
        onClick={() => setStep("count")}
        className="absolute top-[2vw] right-[2vw] px-[1vw] py-[.5vw] bg-red-100 text-red-600 rounded text-[clamp(1rem,6vw,3rem)] hover:shadow-lg hover:scale-105 hover:bg-red-200 transition-all"
      >
        Back
      </button>
      <div className="text-center">
        <h1 className="text-[clamp(2rem,8vw,18rem)] font-bold mb-[min(6vw,48px)] whitespace-nowrap text-center">Name your teams</h1>
        <div className="space-y-[min(3vw,24px)] max-w-4xl mx-auto w-full">
          {teamNames.map((name, idx) => (
            <input
              key={idx}
              value={name}
              onChange={(e) => {
                const copy = [...teamNames];
                copy[idx] = e.target.value || `Team ${idx+1}`;
                setTeamNames(copy);
              }}
              onFocus={(e) => e.target.select()}
              className="block w-full px-[min(3vw,24px)] py-[min(2vw,16px)] border-2 border-gray-300 rounded-xl bg-white text-[clamp(1.2rem,4vw,6rem)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 hover:shadow-md transition-all"
              placeholder={`Team ${idx+1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setStep("category")}
          className="mt-[min(6vw,48px)] w-[12.5vw] py-[min(2vw,16px)] bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all text-[clamp(1rem,4vw,9rem)] font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
 }
 
// — UPDATED: category-selection screen —
if (step === "category") {
  const CATS = ["Music", "TV/Film", "History", "Random"] as const;
  const ICONS: Record<typeof CATS[number], string> = {
    Music:    "🎵",
    "TV/Film": "🍿",
    History:  "🏺",
    Random:   "🎲",
  };

  return (
    <div className="min-h-screen p-[1vw] relative flex flex-col items-center justify-center">
      {/* Back button */}
      <button
        onClick={() => setStep("names")}
        className="absolute top-[2vw] right-[2vw] px-[1vw] py-[.5vw] bg-red-100 text-red-600 rounded text-[clamp(1rem,6vw,3rem)] hover:shadow-lg hover:scale-105 hover:bg-red-200 transition-all"
      >
        Back
      </button>

      {/* TEST debug button */}
      <button
        onClick={() => {
          setSelectedCategory("TEST");
          setSelectedPuzzleSlug("test-puzzle");
          setStep("play");
        }}
        className="absolute top-[2vw] left-[2vw] px-[1vw] py-[.5vw] bg-yellow-500 text-black rounded text-[clamp(0.8rem,2vw,1.5rem)] hover:bg-yellow-600 transition-all font-bold"
      >
        TEST
      </button>

      <div className="text-center w-full">
        {/* Title */}
        <h1 className="text-[clamp(2rem,8vw,18rem)] font-bold mb-[4vw] text-center">
          Select a Category
        </h1>

        {/* Category buttons */}
        <div className="flex flex-nowrap w-full gap-[0.5vw] mb-[6vw]">
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={
                `flex-1 min-w-0 h-[9.5vw] min-h-[114px]
                 rounded-xl whitespace-nowrap
                 text-[clamp(1.2rem,4.5vw,16rem)] font-semibold
                 transition-all outline-none focus:outline-none hover:shadow-lg hover:scale-105 ` +
                (selectedCategory === cat
                  ? "bg-green-100 text-black"
                  : "bg-gray-200 text-gray-800 hover:bg-purple-100")
              }
            >
              <span className="mr-[0.5vw]">{ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Pick Subcategory toggle - centered */}
        <div className="flex flex-col items-center mb-[6vw]">
          <label className="inline-flex items-center space-x-[2vw] text-[clamp(1rem,3vw,6rem)]">
            <input
              type="checkbox"
              checked={pickSubcategory}
              onChange={() => setPickSubcategory((b) => !b)}
              className="h-[3vw] w-[3vw]"
            />
            <span>Pick a Specific Topic</span>
          </label>
        </div>

        {/* Start button - centered under checkbox */}
        <div className="flex justify-center">
          <button
            onClick={() => (pickSubcategory ? setStep("subcategory") : setStep("play"))}
            disabled={!selectedCategory}
            className={
              `w-[12.5vw] py-[0.5vw]
               text-[clamp(1.5rem,4vw,6rem)] font-bold text-white rounded-xl
               transition-all outline-none focus:outline-none hover:shadow-lg hover:scale-105 ` +
              (selectedCategory
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-blue-500 opacity-50 cursor-not-allowed")
            }
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

// — UPDATED: Subcategory-selection screen — 
if (step === "subcategory") {
  const relevantCategories = getRelevantCategories();

  // Get all available subcategories
  const getAllSubcategories = () => {
    const allSubs = new Set<string>();
    relevantCategories.forEach(category => {
      const subMap = getSubcategoryMap(category);
      Object.keys(subMap).forEach(sub => allSubs.add(sub));
    });
    return Array.from(allSubs).sort();
  };

  const allSubcategories = getAllSubcategories();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-[min(2vw,16px)] py-[min(4vw,32px)]">
      {/* Back button */}
      <button
        onClick={() => setStep("category")}
        className="absolute top-[2vw] right-[2vw] px-[1vw] py-[.5vw] bg-red-100 text-red-600 rounded text-[clamp(1rem,6vw,3rem)] hover:shadow-lg hover:scale-105 hover:bg-red-200 transition-all"
      >
        Back
      </button>
      
      <div className="text-center w-full max-w-6xl">
        <h1 className="text-[clamp(2rem,8vw,18rem)] font-bold mb-[min(6vw,48px)]">
          Select Topic Categories
        </h1>
        
        {/* Select All/None Buttons */}
        <div className="mb-[min(3vw,24px)] flex justify-center gap-[min(2vw,16px)]">
          <button
            onClick={selectAllSubcategories}
            className="text-[clamp(1rem,3vw,3rem)] px-[min(2vw,16px)] py-[min(1vw,8px)] bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Select All
          </button>
          <button
            onClick={clearAllSubcategories}
            className="text-[clamp(1rem,3vw,3rem)] px-[min(2vw,16px)] py-[min(1vw,8px)] bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Clear All
          </button>
          <span className="text-[clamp(1rem,3vw,3rem)] text-gray-600 flex items-center">
            {selectedSubcategories.size === 0 
              ? "No categories selected" 
              : `${selectedSubcategories.size} categories selected`
            }
          </span>
        </div>
        
        {/* Checkbox Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[min(2vw,16px)] mb-[min(6vw,48px)]">
          {allSubcategories.map((subcategory) => (
            <label 
              key={subcategory} 
              className="flex items-center gap-[min(1vw,8px)] cursor-pointer text-[clamp(1rem,3vw,3rem)] hover:bg-gray-50 p-[min(1vw,8px)] rounded border min-w-[200px]"
              title={subcategory}
            >
              <input
                type="checkbox"
                checked={selectedSubcategories.has(subcategory)}
                onChange={() => toggleSubcategory(subcategory)}
                className="w-[min(2vw,20px)] h-[min(2vw,20px)]"
              />
              <span className="truncate" title={subcategory}>{subcategory}</span>
            </label>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setStep("puzzles")}
          disabled={selectedSubcategories.size === 0}
          className={
            `w-[12.5vw] py-[min(2vw,16px)] text-[clamp(1.5rem,4vw,6rem)] font-bold text-white rounded-xl transition-all ` +
            (selectedSubcategories.size > 0
              ? "bg-blue-500 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
              : "bg-blue-500 opacity-50 cursor-not-allowed")
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

// — NEW: Puzzle selection screen —
if (step === "puzzles") {
  const availablePuzzles = getAvailablePuzzles();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-[min(2vw,16px)] py-[min(4vw,32px)]">
      {/* Back button */}
      <button
        onClick={() => setStep("subcategory")}
        className="absolute top-[2vw] right-[2vw] px-[1vw] py-[.5vw] bg-red-100 text-red-600 rounded text-[clamp(1rem,6vw,3rem)] hover:shadow-lg hover:scale-105 hover:bg-red-200 transition-all"
      >
        Back
      </button>
      
      <div className="text-center w-full max-w-6xl">
        <h1 className="text-[clamp(2rem,8vw,18rem)] font-bold mb-[min(6vw,48px)]">
          Select Puzzle(s) to Play
        </h1>
        
        {/* Select All/None Buttons */}
        <div className="mb-[min(3vw,24px)] flex justify-center gap-[min(2vw,16px)]">
          <button
            onClick={selectAllPuzzles}
            className="text-[clamp(1rem,3vw,3rem)] px-[min(2vw,16px)] py-[min(1vw,8px)] bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Select All
          </button>
          <button
            onClick={clearAllPuzzles}
            className="text-[clamp(1rem,3vw,3rem)] px-[min(2vw,16px)] py-[min(1vw,8px)] bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Clear All
          </button>
          <span className="text-[clamp(1rem,3vw,3rem)] text-gray-600 flex items-center">
            {selectedPuzzles.size === 0 
              ? "No puzzles selected" 
              : selectedPuzzles.size === 1
              ? "1 puzzle selected"
              : `${selectedPuzzles.size} puzzles selected (will be combined)`
            }
          </span>
        </div>
        
        {/* Puzzle List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mb-[min(6vw,48px)] max-h-[60vh] overflow-y-auto px-4">
          {availablePuzzles
            .sort((a, b) => a.topic.localeCompare(b.topic))
            .map((puzzle) => {
              const hasVideo = puzzle.cards.some((c: any) => !!c.youtube);
              const hasAudio = puzzle.cards.some((c: any) => !!c.deezer);
              const hasImage = puzzle.cards.some((c: any) => !!c.image);

              let emoji = "";
              if (hasVideo) emoji = "🎬";
              else if (hasAudio) emoji = "🎵";
              else if (hasImage) emoji = "🖼️";

              return (
                <label 
                  key={puzzle.slug} 
                  className="relative flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all min-w-[320px]"
                  title={puzzle.topic}
                >
                  <input
                    type="checkbox"
                    checked={selectedPuzzles.has(puzzle.slug)}
                    onChange={() => togglePuzzle(puzzle.slug)}
                    className="w-5 h-5 mt-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="text-xl flex-shrink-0">{emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-base leading-tight" title={puzzle.topic}>
                          {puzzle.topic}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {puzzle.cards.length} cards • {puzzle.subcategory}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced tooltip on hover */}
                  <div className="absolute invisible group-hover:visible opacity-0 hover:opacity-100 transition-all duration-200 left-0 bottom-full mb-2 z-50 bg-gray-900 text-white p-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                    <div className="text-sm">{puzzle.topic}</div>
                  </div>
                </label>
              );
            })}
        </div>

        {/* Start Game Button */}
        <button
          onClick={() => setStep("play")}
          disabled={selectedPuzzles.size === 0}
          className={
            `w-[12.5vw] py-[min(2vw,16px)] text-[clamp(1.5rem,4vw,6rem)] font-bold text-white rounded-xl transition-all ` +
            (selectedPuzzles.size > 0
              ? "bg-blue-500 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
              : "bg-blue-500 opacity-50 cursor-not-allowed")
          }
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

  if (!engine || !gameState) return <div className="p-8 text-xl">Loading Party Mode…</div>;

const { teams, anchorCards, status } = gameState;
  const currentTeam = teams[teamTurn];
  const currentAnchor = anchorCards[teamTurn];

  console.log("👥 Current Turn (engine):", engine.getState().currentTurn);
  console.log("🎯 Current Team:", currentTeam?.name);
  console.log("📌 Anchor card:", currentAnchor?.label);
  console.log("🎵 Current team card:", currentCard?.label);

  const handleCardPlacement = (placement: PlacedCard) => {
    if (!engine || timelineLockedForFeedback) return;

    console.log("🎯 Card placed:", placement);
    
    // Lock timeline immediately
    setTimelineLockedForFeedback(true);
    
    // Set the just-placed card for visual effects
    setJustPlacedCard(placement.card);
    
    // Record in engine and get the new state
    const result = engine.recordPlacement(placement);
    
    // Update state immediately with the result from engine
    if (result && result.state) {
      setGameState(result.state);
      
      // Show immediate feedback
      const team = result.state.teams[teamTurn];
      const feedbackMessage = placement.correct 
        ? `🎉 ${team.name} nailed it! +1 point!` 
        : `💀 ${team.name} missed that one!`;
      
      setFeedback({ 
        correct: placement.correct, 
        message: feedbackMessage 
      });

      // Check win condition
      if (result.state.status === "finished") {
        // Game ended due to running out of cards
        console.log("🏁 Game ended - updating to finished state");
        setGameState(result.state);
        setTimelineLockedForFeedback(false);
        setJustPlacedCard(null);
      } else {
        // Store next turn data for when button is clicked
        if (result.nextCard) {
          setNextTurnData({
            nextCard: result.nextCard,
            newState: result.state
          });
          setShowNextTurnButton(true);
        } else {
          // No next card available - unexpected case since we already checked for finished status above
          console.error("No next card available after placement");
          setCurrentCard(null);
          setTimelineLockedForFeedback(false);
          setJustPlacedCard(null);
        }
      }
    } else {
      // Engine didn't return a proper result - unlock and log error
      console.error("Engine recordPlacement didn't return expected result");
      setTimelineLockedForFeedback(false);
      setJustPlacedCard(null);
    }
  };

  const handleNextTurn = () => {
    if (!nextTurnData) return;
    
    // Clear placement effects and feedback
    setJustPlacedCard(null);
    setFeedback(null);
    setTimelineLockedForFeedback(false);
    setShowNextTurnButton(false);
    
    // Update to the new current turn and card
    setTeamTurn(nextTurnData.newState.currentTurn);
    setCurrentCard(nextTurnData.nextCard);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    
    // Clear the stored data
    setNextTurnData(null);
  };

  if (status === "finished") {
    const winner = teams[gameState.winningTeamIndex!].name;
    const winnerScore = teams[gameState.winningTeamIndex!].score;
    const totalRounds = teams.reduce((sum, team) => sum + team.score + team.discardedCards.length, 0);
    
    // Sort teams by ranking (score descending)
    const rankedTeams = teams
      .map((team, index) => ({ ...team, originalIndex: index }))
      .sort((a, b) => b.score - a.score);
    
    return (
      <div className="min-h-screen bg-gray-900 text-white overflow-y-auto">
        {/* Header Content - No background box */}
        <div className="text-center py-12">
          <h1 className="text-[clamp(4rem,12vw,16rem)] font-bold mb-4 text-white">
            🎉 {winner} Wins! 🎉
          </h1>
          
          <div className="mb-6">
            <p className="text-6xl text-white mb-2">
              Final Score: {winnerScore} - 1
            </p>
            
          </div>

          {/* Puzzle Title */}
          {currentPuzzle && (
            <div className="text-center mt-8">
              <h2 className="text-[clamp(2rem,4vw,12rem)] font-light italic text-white">
                {currentPuzzle.topic}
              </h2>
            </div>
          )}
        </div>

        {/* Team Timelines Section */}
        <div className="px-[min(2vw,16px)] py-[min(3vw,24px)]">
          
          {rankedTeams.map((team, position) => {
            const teamIndex = team.originalIndex;
            const isWinner = teamIndex === gameState.winningTeamIndex;
            const isLastPlace = position === rankedTeams.length - 1 && rankedTeams.length > 1;
            
            // Build complete timeline: anchor + placed cards + discarded cards
            const anchorCard = gameState.anchorCards[teamIndex];
            const allTeamCards = [
              // Correctly placed cards
              ...team.placedCards.map(card => ({ card, correct: true })),
              // Incorrectly placed cards
              ...team.discardedCards.map(card => ({ card, correct: false }))
            ];
            
            // Sort all cards chronologically for proper timeline display
            allTeamCards.sort((a, b) => a.card.date - b.card.date);
            
            // Split into pre/post anchor for visual layout
            const preAnchor = allTeamCards.filter(p => p.card.date < anchorCard.date);
            const postAnchor = allTeamCards.filter(p => p.card.date >= anchorCard.date);
            const timelineCards = [
              ...preAnchor.map(p => p.card),
              anchorCard,
              ...postAnchor.map(p => p.card)
            ].filter(card => card && card.id);
            
            return (
              <div key={team.name} className={`
                mb-[min(6vw,48px)] rounded-lg border-[max(2px,min(0.4vw,6px))] p-[min(3vw,24px)]
                min-h-[min(45vw,600px)] w-full
                ${isWinner 
                  ? 'bg-yellow-900/30 border-yellow-400' 
                  : 'bg-gray-800/50 border-gray-600'
                }
              `}>
                {/* Team Header - Fixed at top with large padding */}
                <div className="px-[min(2vw,16px)] pt-[min(3vw,24px)] pb-[min(25vw,200px)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[min(1.5vw,12px)]">
                      <div className={`
                        text-[clamp(3rem,6vw,6rem)] font-bold
                        ${isWinner ? 'text-yellow-400' : 'text-gray-300'}
                      `}>
                        #{position + 1} {team.name}
                      </div>
                      {isWinner && <div className="text-[clamp(2.5rem,5vw,5rem)]">👑</div>}
                      {isLastPlace && <div className="text-[clamp(2.5rem,5vw,5rem)]">🤡</div>}
                      {/* Alternative last place emojis:
                          🗑️ (trash can)
                          🚮 (litter bin)
                          ❌ (X mark)
                          💀 (skull)
                          🪦 (tombstone)
                          📉 (chart decreasing)
                          ⬇️ (down arrow)
                          🥴 (woozy face)
                          😵 (dizzy face)
                          🤡 (clown)
                      */}
                    </div>
                    <div className="text-right">
                      {/* TUNE THESE COLORS: Change text-green-XXX and text-red-XXX below */}
                      <div className="text-[clamp(1.5rem,3vw,3rem)] font-bold text-green-200">
                        {team.score} correct
                      </div>
                      <div className="text-[clamp(1.5rem,3vw,3rem)] text-red-400">
                        {team.discardedCards.length} incorrect
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Timeline - Positioned at bottom */}
                <div className="px-[min(2vw,16px)] pb-[min(3vw,24px)]">
                  <div className="px-[min(1.5vw,12px)] py-[min(3vw,24px)]">
                    <div className="relative" style={{ height: `max(96px, min(192px, 12vw))` }}>
                      {/* Horizontal line spanning full container width */}
                      <div 
                        className="absolute bg-gray-400" 
                        style={{ 
                          bottom: `calc(max(36px, min(72px, 4.5vw)) / 2 - max(12px, min(24px, 1.5vw)) / 2)`,
                          height: `max(12px, min(24px, 1.5vw))`,
                          left: 0,
                          right: 0,
                          zIndex: 1
                        }} 
                      />
                      <div className="flex justify-center items-end h-full relative">
                        {timelineCards.map((card, i) => {
                          if (!card || !card.id) return null;
                          
                          const isAnchor = card.id === anchorCard.id;
                          const cardData = !isAnchor ? allTeamCards.find(p => p.card.id === card.id) : undefined;
                          const correct = cardData?.correct;
                          
                          const bgClass = isAnchor
                            ? "bg-gray-300 text-black"
                            : correct === true
                            ? "bg-green-100 text-black"
                            : correct === false
                            ? "bg-red-100 text-black"
                            : "bg-gray-200 text-black";

                          return (
                            <div key={card.id} className="flex flex-col items-center flex-1 relative" style={{ minWidth: `max(120px, min(240px, 15vw))` }}>
                              <TimelineCardWithTooltip
                                card={card}
                                isLatest={false}
                                isAnchor={isAnchor}
                                bgClass={bgClass}
                                hideDates={false}
                                showTooltip={false}
                                showImageOnPlace={false}
                              />
                              <div className="bg-gray-600" style={{ 
                                height: `max(36px, min(72px, 4.5vw))`,
                                width: `max(7.2px, min(14.4px, 0.9vw))`,
                                zIndex: 10
                              }} />
                              <div className="relative flex items-center justify-center">
                                <div style={{ 
                                  width: `max(36px, min(72px, 4.5vw))`,
                                  height: `max(36px, min(72px, 4.5vw))`,
                                  zIndex: 10
                                }} className="rounded-full bg-gray-600" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[min(3vw,24px)] justify-center pb-[min(6vw,48px)]">
          <button
            className="px-[min(4vw,32px)] py-[min(2vw,16px)] bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 hover:shadow-lg hover:scale-105 transition-all text-[clamp(1.5rem,4vw,4rem)]"
            onClick={() => {
              // Quick rematch with same teams
              setStep("category");
              setGameState(null);
              setEngine(null);
              setCurrentCard(null);
              setTeamTurn(0);
              setFeedback(null);
              setUsedSubcategories(new Set());
            }}
          >
            🔄 Rematch
          </button>
          
          <button
            className="px-[min(4vw,32px)] py-[min(2vw,16px)] bg-green-200 text-green-900 font-bold rounded-lg hover:bg-green-300 hover:shadow-lg hover:scale-105 transition-all text-[clamp(1.5rem,4vw,4rem)]"
            onClick={() => {
              // New game setup
              setStep("count");
              setGameState(null);
              setEngine(null);
              setCurrentCard(null);
              setTeamTurn(0);
              setFeedback(null);
              setTeamCount(2);
              setTeamNames(loadPreviousTeamNames(2));
              setSelectedCategory(null);
              setPickSubcategory(false);
              setSelectedPuzzleSlug("");
              setUsedSubcategories(new Set());
            }}
          >
            🎮 New Game
          </button>
          
          <button
            className="px-[min(4vw,32px)] py-[min(2vw,16px)] bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 hover:shadow-lg hover:scale-105 transition-all text-[clamp(1.5rem,4vw,4rem)]"
            onClick={() => window.location.href = "/"}
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">                    
      {/* Game Area */}
      {step === "play" && gameState.status === "playing" && engine && currentCard && (
        <BigScreenPartyMode
          currentCard={currentCard}
          anchorCard={currentAnchor}
          timeline={gameState.teams[teamTurn].placedCards.map(card => ({ card, correct: true })).concat(
            // Only include the just-placed incorrect card (if any) - never include old discarded cards
            justPlacedCard && gameState.teams[teamTurn].discardedCards.find(card => card.id === justPlacedCard.id)
              ? [{ card: justPlacedCard, correct: false }]
              : []
          )}
          teams={teams}
          currentTurn={teamTurn}
          onCardPlacement={(correct: boolean) => {
            const placement: PlacedCard = {
              card: currentCard,
              correct
            };
            handleCardPlacement(placement);
          }}
          locked={timelineLockedForFeedback}
          justPlacedCard={justPlacedCard}
          puzzle={currentPuzzle || undefined}
          onQuit={() => setStep("category")}
          onContinue={showNextTurnButton ? handleNextTurn : undefined}
        />
      )}

      {/* Continue Button - Only show when needed and not in big screen mode */}
      {showNextTurnButton && nextTurnData && step !== "play" && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleNextTurn}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-6 rounded-lg text-4xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
