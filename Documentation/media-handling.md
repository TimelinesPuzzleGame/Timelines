# Media Handling Documentation

## Overview
This document outlines how the Timeline Puzzles application handles various media types, particularly YouTube video content and associated metadata.

## YouTube Video Integration

### Video Card Structure
```json
{
  "id": "unique-id",
  "label": "Movie Title",
  "date": "YYYY-MM-DD",
  "youtube": "VIDEO_URL_OR_ID",
  "description": "Optional description"
}
```

### Supported URL Formats
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct video ID: `VIDEO_ID`

## Advanced Error Detection System

### Overview
The `advancedVideoHealthChecker.js` script provides comprehensive quality assurance for YouTube videos in puzzle files. It performs dual-layer validation using both oEmbed API and YouTube Data API to catch various types of video issues.

### Error Categories Detected

#### 🚨 **Critical Errors (Block Video Usage)**
- **Video Not Found**: Deleted, removed, or never existed
- **Private Videos**: Set to private by uploader
- **Geographic Restrictions**: Blocked in target regions
- **Embedding Disabled**: Not embeddable in third-party sites
- **Invalid Video IDs**: Malformed or incorrect video identifiers
- **Trailer Detected**: Video is a movie trailer (for movie puzzles)

#### ⚠️ **Warnings (Monitor & Review)**
- **Unlisted Videos**: May become inaccessible
- **Age-Restricted Content**: Requires age verification
- **Copyright Issues**: Potential copyright claims detected
- **API Quota Issues**: Rate limiting or quota exceeded

### Validation Process

#### **Dual-Layer Checking**
1. **oEmbed API Check**:
   - Tests basic video availability
   - Checks embedding permissions
   - Fast initial validation

2. **YouTube Data API Check**:
   - Comprehensive metadata analysis
   - Privacy status verification
   - Region restriction detection
   - Content rating analysis

#### **Comprehensive Analysis**
```javascript
// Video health check result structure
{
  "videoId": "dQw4w9WgXcQ",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "status": "healthy|warning|error",
  "videoData": {
    "title": "Video Title",
    "duration": 213, // seconds
    "channelTitle": "Channel Name",
    "privacyStatus": "public",
    "embeddable": true,
    "viewCount": "1000000",
    "publishedAt": "2009-10-25T06:57:33Z"
  },
  "issues": [], // Array of warnings/errors
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Trailer Detection System

#### **Purpose**
For movie puzzles, the system automatically detects and flags trailer videos for removal. Trailers are promotional content and not suitable for timeline puzzles that should feature actual movie scenes.

#### **Detection Methods**

**Title Analysis**:
- Direct keywords: "trailer", "official trailer", "movie trailer", "teaser"
- Pattern matching: `| Official Trailer`, `[Trailer]`, `- Movie Trailer`
- End-of-title detection: `...Trailer`, `Trailer:`

**Channel Analysis**:
- Official studio channels: Warner Bros., Universal, Sony Pictures, etc.
- Trailer-specific channels: "Movie Trailers", "Cinema Trailers", etc.
- Combined with trailer keywords for high-confidence detection

**Content Analysis**:
- Description keywords: "official trailer", "movie trailer" 
- Spoiler detection: Video titles containing movie release dates (indicates spoiler content)
- Duration analysis: Extremely short videos (<3 seconds) indicate invalid content
- Release date patterns: Only combined with explicit "trailer" keywords

**Confidence Levels**:
- **High**: Explicit trailer keywords, official studio channels, extremely short duration, spoiler date detection
- **Medium**: Circumstantial evidence, promotional language with "trailer"
- **Low**: Weak indicators (not currently flagged)

#### **Spoiler Detection**
For movie puzzles, the system detects and flags potential spoiler content when:
- Video title contains the movie's exact release year
- Patterns like "(1999)", "1999 movie", "1999 film", "1999 clip", "1999 scene"
- High confidence detection as these often reveal plot details or endings

#### **Movie Puzzle Detection**
The system automatically applies trailer detection only to movie-related puzzles by checking:
- Puzzle name contains: "movie", "film", "cinema", "hollywood", "oscar"
- Card labels contain movie/film references
- Context clues suggest movie content

#### **Example Detections**
```javascript
// High confidence trailer detection
{
  "isTrailer": true,
  "reason": "Title contains 'official trailer'",
  "confidence": "high"
}

// High confidence spoiler detection
{
  "isTrailer": true,
  "reason": "Title contains release date (1999) - likely spoiler content",
  "confidence": "high"
}

// Official studio channel detection
{
  "isTrailer": true,
  "reason": "Official studio channel (Warner Bros. Pictures) posting trailer content",
  "confidence": "high"
}
```

### Usage Instructions

#### **Check All Puzzles**
```bash
node scripts/advancedVideoHealthChecker.js
```

#### **Check Specific Puzzle**
```bash
node scripts/advancedVideoHealthChecker.js --puzzle lib/puzzles/comedy-movies.json
```

#### **Check Single Video**
```bash
node scripts/advancedVideoHealthChecker.js --video "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Report Generation

#### **Console Output**
- Real-time status updates during checking
- Color-coded results (✅ Healthy, ⚠️ Warnings, ❌ Errors)
- Detailed error descriptions
- Final statistics summary

#### **JSON Report**
Automatically generates `video-health-report-YYYY-MM-DD.json` containing:
- Overall statistics and percentages
- Complete results for all checked videos
- Error/warning categorization
- Detailed metadata for healthy videos

### Performance Features

#### **Rate Limiting Protection**
- Batch processing (3 videos at a time)
- 2-second delays between batches
- 15-second API request timeouts
- Graceful error handling

#### **Parallel Processing**
- Simultaneous oEmbed and API checks
- Efficient resource utilization
- Non-blocking operations

### Integration with Existing Tools

#### **Complementary Scripts**
- Works alongside `getYouTubeDurations.js`
- Enhances `testRealComedyPlaylistVideos.js` functionality
- Integrates with `robustMovieIdentifier.js` workflow

#### **API Key Management**
- Uses environment variable `YOUTUBE_API_KEY`
- Falls back to hardcoded key for development
- Monitors quota usage and rate limits

### Quality Assurance Workflow

#### **Recommended Process**
1. **Initial Validation**: Run advanced health checker on all puzzles
2. **Error Resolution**: Fix or remove videos with critical errors
3. **Warning Review**: Evaluate videos with warnings case-by-case
4. **Regular Monitoring**: Schedule periodic health checks
5. **Report Analysis**: Track trends in video health over time

#### **Error Resolution Strategies**
- **Not Found**: Remove from puzzle or find replacement
- **Private/Unlisted**: Contact uploader or find alternative
- **Geo-Restricted**: Find region-appropriate alternative
- **Not Embeddable**: Find embeddable version or alternative
- **Copyright Issues**: Monitor for takedowns, prepare alternatives

### Configuration Options

#### **Customizable Parameters**
```javascript
// Batch size for rate limiting
const batchSize = 3;

// Timeout durations
const oembedTimeout = 10000; // 10 seconds
const apiTimeout = 15000;    // 15 seconds

// Pause between batches
const batchDelay = 2000;     // 2 seconds
```

### Future Enhancements

#### **Planned Features**
- Automated fixing of common issues
- Integration with content curation pipeline
- Historical health tracking
- Predictive failure detection
- Alternative video suggestion system

## Basic Video Quality Checks (Legacy)

### Duration-Based Filtering
```javascript
// Minimum duration requirements
const MIN_DURATION = 30; // seconds
const MAX_DURATION = 300; // 5 minutes for trailers
```

### oEmbed Validation
Basic availability checking using YouTube's oEmbed endpoint:
```javascript
const oembedUrl = `https://www.youtube.com/oembed?url=${videoUrl}&format=json`;
```

### Response Codes
- `200`: Video available and embeddable
- `401`: Video exists but embedding disabled
- `404`: Video not found, private, or removed

## Best Practices

### Video Selection Criteria
1. **Availability**: Must be publicly accessible
2. **Embeddable**: Must allow third-party embedding
3. **Duration**: Appropriate length for puzzle context
4. **Quality**: Good audio/video quality
5. **Relevance**: Clearly identifiable content
6. **Stability**: From reliable, established channels

### Maintenance Schedule
- **Weekly**: Run health checks on active puzzles
- **Monthly**: Comprehensive check of all puzzle files
- **Quarterly**: Review and update error resolution strategies

### Error Handling
- Log all validation errors with timestamps
- Maintain backup video options for critical content
- Monitor for patterns in video failures
- Keep detailed records of removed/replaced videos

## API Integration

### YouTube Data API v3
- Comprehensive video metadata
- Privacy status and restrictions
- Content ratings and warnings
- Usage statistics and engagement data

### oEmbed API
- Fast availability checking
- Basic metadata extraction
- Embedding permission verification
- Lightweight validation option

## Monitoring and Alerts

### Health Metrics
- **Health Percentage**: Ratio of healthy to total videos
- **Error Trends**: Track increasing error rates
- **Common Issues**: Identify frequent failure patterns
- **Response Times**: Monitor API performance

### Recommended Thresholds
- **Critical**: >10% videos with errors
- **Warning**: >20% videos with warnings
- **Review**: Monthly health percentage drop >5%

This comprehensive media handling system ensures reliable, performant, and secure multimedia content delivery across all Timelines puzzle categories. 