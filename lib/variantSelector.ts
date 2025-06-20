import type { EventCard } from "./types";

interface VariantCard extends EventCard {
  variants?: Array<{
    id: string;
    title: string;
    youtube: string;
    confidence?: number;
    description?: string;
  }>;
  variantCount?: number;
  primaryVariantId?: string;
}

/**
 * Safely selects a variant from a card with error handling
 */
export function selectSafeVariant(card: VariantCard): EventCard {
  try {
    // If no variants, return the card as-is
    if (!card.variants || !Array.isArray(card.variants) || card.variants.length === 0) {
      return card;
    }

    // Filter out invalid variants
    const validVariants = card.variants.filter(variant => 
      variant &&
      typeof variant.id === 'string' &&
      typeof variant.youtube === 'string' &&
      variant.id.length > 0 &&
      variant.youtube.length > 0
    );

    if (validVariants.length === 0) {
      // No valid variants, return the original card
      return card;
    }

    // Select a random valid variant
    const selectedVariant = validVariants[Math.floor(Math.random() * validVariants.length)];

    // Return a new card with the selected variant's data
    return {
      ...card,
      id: selectedVariant.id,
      youtube: selectedVariant.youtube,
      label: selectedVariant.title || card.label,
      tooltip: card.tooltip ? {
        ...card.tooltip,
        description: selectedVariant.description || card.tooltip.description
      } : undefined
    };
  } catch (error) {
    console.error('Error selecting variant:', error, 'Card:', card.label);
    // On any error, return the original card
    return card;
  }
}

/**
 * Process cards with fair movie distribution - select movies first, then variants
 * This prevents bias toward movies with more variants
 */
export function processCardsWithFairDistribution(cards: any[], targetCount?: number): EventCard[] {
  if (!Array.isArray(cards)) {
    console.error('processCardsWithFairDistribution: cards is not an array:', cards);
    return [];
  }

  // Step 1: Group cards by movie (using label as movie identifier)
  const movieGroups = new Map<string, any[]>();
  
  cards.forEach(card => {
    if (!card || typeof card !== 'object') {
      console.error('Invalid card:', card);
      return;
    }

    const movieKey = card.label || card.movie || card.topic || 'Unknown';
    if (!movieGroups.has(movieKey)) {
      movieGroups.set(movieKey, []);
    }
    movieGroups.get(movieKey)!.push(card);
  });

  console.log(`🎬 Fair distribution: Found ${movieGroups.size} unique movies`);
  
  // Step 2: Convert to array and shuffle movies for fair selection
  const movieList = Array.from(movieGroups.entries());
  const shuffledMovies = shuffleMovies(movieList);
  
  // Step 3: Select movies (if targetCount specified, otherwise use all)
  const moviesToUse = targetCount && targetCount < shuffledMovies.length 
    ? shuffledMovies.slice(0, targetCount)
    : shuffledMovies;
  
  console.log(`🎲 Fair distribution: Selected ${moviesToUse.length} movies for processing`);
  
  // Step 4: For each selected movie, randomly pick one variant
  const result: EventCard[] = [];
  
  moviesToUse.forEach(([movieName, movieCards]) => {
    try {
      // Pick a random card from this movie's variants
      const randomCard = movieCards[Math.floor(Math.random() * movieCards.length)];
      
      // Process the selected card (handle variants if present)
      const processedCard = processSingleCardWithVariants(randomCard);
      result.push(processedCard);
      
      console.log(`🎯 Selected variant for "${movieName}": ${movieCards.length} variants available`);
    } catch (error) {
      console.error('Error processing movie variants:', error, movieName);
      // Add a safe fallback card
      result.push(createSafeCard(movieCards[0]));
    }
  });
  
  console.log(`✅ Fair distribution complete: ${result.length} cards processed`);
  return result;
}

/**
 * Helper function to shuffle movie groups fairly
 */
function shuffleMovies<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Process a single card with variants (extracted from the main function)
 */
function processSingleCardWithVariants(card: any): EventCard {
  try {
    // Validate card structure
    if (!card || typeof card !== 'object') {
      console.error('Invalid card:', card);
      return createSafeCard(card);
    }

    // If no variants, return the card as-is with validation
    if (!card.variants || !Array.isArray(card.variants) || card.variants.length === 0) {
      return validateCard(card);
    }

    // Randomly select a variant
    const selectedVariant = card.variants[Math.floor(Math.random() * card.variants.length)];
    
    // Validate the selected variant
    if (!selectedVariant || typeof selectedVariant !== 'object') {
      console.error('Invalid variant selected:', selectedVariant);
      return validateCard(card);
    }

    // Merge the selected variant with the base card
    const mergedCard = {
      ...card,
      ...selectedVariant,
      // Preserve these fields from the base card
      id: card.id || generateCardId(),
      date: card.date || selectedVariant.date || new Date(2000, 0, 1).getTime(),
      label: selectedVariant.label || card.label || 'Unknown',
      // Remove variants from the final card
      variants: undefined
    };

    return validateCard(mergedCard);
  } catch (error) {
    console.error('Error processing card with variants:', error, card);
    return createSafeCard(card);
  }
}

/**
 * Process cards that have variants and randomly select one variant per card
 * UPDATED: Now uses fair distribution by default to prevent variant bias
 */
export function processCardsWithVariants(cards: any[]): EventCard[] {
  if (!Array.isArray(cards)) {
    console.error('processCardsWithVariants: cards is not an array:', cards);
    return [];
  }

  // Use the new fair distribution method
  return processCardsWithFairDistribution(cards);
}

/**
 * Validate and ensure card has all required fields
 */
function validateCard(card: any): EventCard {
  try {
    const year = normalizeYear(card?.year || card?.date);
    const validatedCard: EventCard = {
      id: card?.id || generateCardId(),
      date: normalizeDate(card?.date, year),
      label: card?.label || card?.movie || card?.topic || 'Unknown Event',
      image: card?.image || undefined,
      youtube: normalizeYouTubeUrl(card?.youtube),
      deezer: card?.deezer || undefined
    };

    return validatedCard;
  } catch (error) {
    console.error('Error validating card:', error, card);
    return createSafeCard(card);
  }
}

/**
 * Create a safe fallback card when data is invalid
 */
function createSafeCard(originalCard: any): EventCard {
  const id = originalCard?.id || generateCardId();
  const label = originalCard?.label || originalCard?.movie || 'Unknown Event';
  const year = normalizeYear(originalCard?.year || originalCard?.date);
  
  return {
    id,
    date: new Date(year, 0, 1).getTime(),
    label,
    image: undefined,
    youtube: undefined,
    deezer: undefined
  };
}

/**
 * Generate a unique card ID
 */
function generateCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Normalize year to ensure it's a valid number
 */
function normalizeYear(yearOrDate: any): number {
  // If it's a timestamp, extract year from it
  if (typeof yearOrDate === 'number' && yearOrDate > 1000000) {
    return new Date(yearOrDate).getFullYear();
  }
  
  if (typeof yearOrDate === 'number' && !isNaN(yearOrDate) && yearOrDate > 0 && yearOrDate < 3000) {
    return Math.floor(yearOrDate);
  }
  
  // Try to parse if it's a string
  if (typeof yearOrDate === 'string') {
    const parsed = parseInt(yearOrDate, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 3000) {
      return parsed;
    }
  }
  
  // Default to 2000 if invalid
  console.warn('Invalid year, defaulting to 2000:', yearOrDate);
  return 2000;
}

/**
 * Normalize date to ensure it's a valid timestamp
 */
function normalizeDate(date: any, year: number): number {
  // If it's already a valid date timestamp (larger than 1000000), keep it
  if (typeof date === 'number' && !isNaN(date) && date > 1000000) {
    return date;
  }
  
  // If it's a simple year (0-3000), keep it as is
  if (typeof date === 'number' && !isNaN(date) && date >= 0 && date <= 3000) {
    return date;
  }
  
  // If no valid date, use the year directly (don't convert to timestamp)
  return year;
}

/**
 * Normalize YouTube URL to ensure it's valid
 */
function normalizeYouTubeUrl(url: any): string | undefined {
  if (!url || typeof url !== 'string') {
    return undefined;
  }
  
  try {
    // Basic validation - check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return url;
    }
    
    // If it's just a video ID, construct a full URL
    if (url.match(/^[A-Za-z0-9_-]{11}$/)) {
      return `https://www.youtube.com/watch?v=${url}`;
    }
    
    return undefined;
  } catch (error) {
    console.error('Error normalizing YouTube URL:', error, url);
    return undefined;
  }
} 