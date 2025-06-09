import { NextApiRequest, NextApiResponse } from 'next';
import { YouTubePlaylistParser } from '../../scripts/youtubePlaylistParser';
import type { Puzzle } from '../../scripts/youtubePlaylistParser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from environment variables
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'YouTube API key not configured. Please set YOUTUBE_API_KEY environment variable.' 
      });
    }

    // Extract request data
    const {
      playlistUrl,
      topic,
      category,
      subcategory,
      sortBy = 'chronological',
      maxCards = 200,
      hideDates = false,
      showTooltips = true,
      includeTooltips = true,
    } = req.body;

    // Validate required fields
    if (!playlistUrl || !topic || !category || !subcategory) {
      return res.status(400).json({ 
        error: 'Missing required fields: playlistUrl, topic, category, subcategory' 
      });
    }

    // Validate category
    const validCategories = ['History', 'Arts', 'Entertainment', 'Sports', 'Current Events'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category. Must be one of: ' + validCategories.join(', ') 
      });
    }

    // Initialize parser and parse playlist
    const parser = new YouTubePlaylistParser(apiKey);
    
    const puzzle: Puzzle = await parser.parsePlaylist(playlistUrl, {
      topic,
      category,
      subcategory,
      sortBy,
      maxCards,
      hideDates,
      showTooltips,
      includeTooltips,
      // Don't save to file in API - return data instead
    });

    // Return the generated puzzle
    res.status(200).json({
      success: true,
      puzzle,
      message: `Successfully generated puzzle with ${puzzle.cards.length} cards`,
    });

  } catch (error) {
    console.error('Playlist parsing error:', error);
    
    // Handle specific YouTube API errors
    if (error instanceof Error) {
      if (error.message.includes('YouTube API error: 403')) {
        return res.status(403).json({ 
          error: 'YouTube API access denied. Check your API key and quota limits.' 
        });
      }
      if (error.message.includes('YouTube API error: 404')) {
        return res.status(404).json({ 
          error: 'Playlist not found or is private/deleted.' 
        });
      }
      if (error.message.includes('Invalid YouTube playlist URL')) {
        return res.status(400).json({ 
          error: 'Invalid YouTube playlist URL format.' 
        });
      }
    }

    // Generic error response
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to parse playlist' 
    });
  }
} 