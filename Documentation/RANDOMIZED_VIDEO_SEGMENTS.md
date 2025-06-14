# Randomized Video Segments Feature

## 🎲 **Overview**

The Randomized Video Segments feature enhances puzzle gameplay by generating random 45-second clips from videos instead of playing the full video. This creates a more dynamic and replayable experience where players get different segments each time they interact with a card.

## 🎯 **Purpose & Benefits**

### **Enhanced Replay Value**
- **Dynamic Content**: Each playthrough offers different video segments
- **Surprise Factor**: Players can't predict which part of the video will play
- **Increased Engagement**: Keeps content fresh across multiple sessions
- **Reduced Predictability**: Prevents players from memorizing specific video moments

### **Optimal Gameplay Experience**
- **Consistent Duration**: All segments are exactly 45 seconds for uniform experience
- **Quick Sampling**: Provides enough content to identify the video without being too long
- **Attention Retention**: Shorter clips maintain player focus and engagement
- **Mobile Friendly**: Reduces data usage and loading times

## 🔧 **Technical Implementation**

### **Frontend Logic (TimelinePuzzleGame.tsx)**

The randomization occurs in the `TimelinePuzzleGame` component using a memoized calculation:

```typescript
// Enhanced YouTube parameter extraction with randomization (MEMOIZED to prevent re-randomization on mouseover)
const { youTubeStart, youTubeEnd } = useMemo(() => {
  let start = 0;
  let end = 0;
  
  if (selectedCard?.youtube) {
    try {
      const u = new URL(selectedCard.youtube);
      
      // Check if this is a randomized puzzle
      const isRandomizedPuzzle = puzzle?.slug?.includes("randomized") || 
                                puzzle?.description?.includes("randomized");
      
      if (isRandomizedPuzzle && selectedCard.duration && selectedCard.duration >= 45) {
        // Generate random 45-second segment (ONLY ONCE per card selection)
        const maxStartTime = selectedCard.duration - 45;
        const randomStart = Math.floor(Math.random() * maxStartTime);
        start = randomStart;
        end = randomStart + 45;
        
        console.log(`🎲 Randomized segment for "${selectedCard.label}": ${start}s-${end}s (total: ${selectedCard.duration}s)`);
      }
      // ... existing URL parameter parsing logic
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
    }
  }
  
  return { youTubeStart: start, youTubeEnd: end };
}, [selectedCard, puzzle]);
```

### **Key Technical Features**

#### **Memoization**
- Uses `useMemo` to prevent re-randomization on component re-renders
- Ensures consistent segment for each card selection session
- Prevents flickering or changing segments during mouseover events

#### **Puzzle Detection**
- Checks puzzle slug for "randomized" keyword
- Also checks puzzle description for "randomized" mention
- Flexible detection allows for multiple randomized puzzle types

#### **Duration Requirements**
- Only applies to videos with `duration >= 45` seconds
- Prevents errors with short videos that can't provide 45-second segments
- Falls back to normal playback for videos without duration data

#### **Random Calculation**
```javascript
const maxStartTime = selectedCard.duration - 45;
const randomStart = Math.floor(Math.random() * maxStartTime);
start = randomStart;
end = randomStart + 45;
```

## 📊 **Data Structure Requirements**

### **Puzzle Configuration**

For a puzzle to use randomized segments, it needs:

```json
{
  "slug": "puzzle-name-randomized",
  "topic": "Puzzle Name (Randomized)",
  "description": "Description mentioning 'randomized 45-second video segments'",
  "cards": [
    {
      "id": "card-1",
      "label": "Video Title",
      "date": 2020,
      "youtube": "https://www.youtube.com/watch?v=VIDEO_ID",
      "duration": 180
    }
  ]
}
```

### **Required Properties**

#### **Puzzle Level**
- **slug**: Must contain "randomized" OR
- **description**: Must mention "randomized" for detection

#### **Card Level**
- **duration**: Video duration in seconds (required for randomization)
- **youtube**: Valid YouTube URL (standard requirement)
- **duration >= 45**: Minimum duration for 45-second segments

### **Optional Properties**
- **duration: null**: Videos without duration fall back to normal playback
- **duration < 45**: Short videos play normally without randomization

## 🎮 **User Experience**

### **Player Interaction**
1. **Card Selection**: Player clicks/hovers on a card
2. **Segment Generation**: System calculates random 45-second segment
3. **Video Playback**: YouTube player loads and plays the specific segment
4. **Consistent Experience**: Same segment plays for that card during the session
5. **New Session**: Different random segment on next game session

### **Visual Feedback**
- Console logging shows randomized segment details for debugging
- No visual indication to player that segments are randomized (maintains surprise)
- Standard YouTube player controls work within the segment timeframe

## 🔨 **Implementation Guide**

### **Step 1: Add Duration Data**

Use the duration extraction script to add duration properties:

```javascript
// Example script to add durations
const fs = require('fs');
const puzzle = JSON.parse(fs.readFileSync('puzzle.json', 'utf8'));

puzzle.cards.forEach(card => {
  if (card.youtube && !card.duration) {
    // Extract duration from YouTube API or video metadata
    card.duration = extractDuration(card.youtube);
  }
});

fs.writeFileSync('puzzle.json', JSON.stringify(puzzle, null, 2));
```

### **Step 2: Update Puzzle Metadata**

```json
{
  "slug": "original-puzzle-randomized",
  "topic": "Original Puzzle (Randomized)",
  "description": "Enhanced with randomized 45-second video segments for improved replay value"
}
```

### **Step 3: Test Implementation**

1. Load the puzzle in the game
2. Select various cards and verify random segments play
3. Check console logs for randomization confirmation
4. Verify videos < 45 seconds play normally
5. Confirm memoization prevents re-randomization

## 📈 **Performance Considerations**

### **Memory Usage**
- Memoization stores one random calculation per card selection
- Minimal memory impact due to simple numeric values
- Automatic cleanup when component unmounts

### **Network Efficiency**
- YouTube player only loads the specific 45-second segment
- Reduces bandwidth usage compared to full video loading
- Faster initial playback due to shorter content length

### **API Impact**
- No additional YouTube API calls required
- Duration data should be pre-calculated and stored
- Randomization happens client-side with no server requests

## 🧪 **Testing & Quality Assurance**

### **Test Cases**

#### **Basic Functionality**
- ✅ Videos ≥45 seconds generate random segments
- ✅ Videos <45 seconds play normally
- ✅ Videos without duration data play normally
- ✅ Memoization prevents re-randomization during session

#### **Edge Cases**
- ✅ Exactly 45-second videos (start at 0, end at 45)
- ✅ Invalid duration values (null, undefined, negative)
- ✅ Malformed YouTube URLs
- ✅ Network errors during video loading

#### **User Experience**
- ✅ Smooth playback without buffering issues
- ✅ Consistent segment during card interaction session
- ✅ Different segments across game sessions
- ✅ No visual glitches or timing issues

### **Debugging Tools**

#### **Console Logging**
```javascript
console.log(`🎲 Randomized segment for "${selectedCard.label}": ${start}s-${end}s (total: ${selectedCard.duration}s)`);
```

#### **Development Checks**
- Verify puzzle detection logic
- Confirm duration data accuracy
- Test randomization distribution
- Monitor performance impact

## 🔮 **Future Enhancements**

### **Advanced Randomization**
- **Weighted Segments**: Prefer certain parts of videos (intro, chorus, climax)
- **Content Analysis**: Use AI to identify most interesting segments
- **User Preferences**: Allow players to set preferred segment types

### **Customization Options**
- **Variable Duration**: Allow different segment lengths (30s, 60s, 90s)
- **Segment Overlap**: Ensure segments don't repeat too closely
- **Quality Scoring**: Prioritize high-quality video segments

### **Analytics Integration**
- **Engagement Tracking**: Monitor which segments generate most engagement
- **Replay Analysis**: Track how randomization affects replay rates
- **Performance Metrics**: Measure impact on loading times and user satisfaction

## 📚 **Related Documentation**

- **[Media Handling](media-handling.md)**: YouTube video integration
- **[Game Overview](game-overview.md)**: Core gameplay mechanics
- **[Variant System](VARIANT_CHOP_UP_SYSTEM.md)**: Video segmentation for variants
- **[Content Pipeline](content-pipeline.md)**: Content creation and processing

## 🏷️ **Tags**
`randomization` `video-segments` `youtube` `gameplay` `replay-value` `performance` `user-experience` 