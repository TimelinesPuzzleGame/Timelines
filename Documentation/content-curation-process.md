# Content Curation Process

## Overview
This document outlines the comprehensive 6-layer system for identifying and curating content across all Timelines puzzle categories: movies, music, history, arts, sports, and current events.

## Layer Architecture

The content curation process uses a hierarchical approach with confidence scoring. Each layer attempts to identify content with increasing sophistication, with higher-numbered layers having higher confidence levels.

## Layer 0: Human Context Analysis (95-100% Confidence)
**Purpose**: Apply domain knowledge and pattern recognition to identify obvious content that algorithms might miss.

**Implementation**: Expert review and correction of obvious errors:
- **Pattern Recognition**: Identify common formatting issues (missing articles, ALL CAPS, typos)
- **Context Clues**: Use surrounding information to infer correct content
- **Domain Expertise**: Apply knowledge of entertainment, history, sports, etc.
- **Error Detection**: Spot obvious mismatches between content and metadata

**Examples**:
- Movie titles: "Flas ance" → "Flashdance", "he Matrix" → "The Matrix"
- Music tracks: Artist name extraction from collaborative titles
- Historical events: Date correction for well-known events
- Sports: Team name standardization and league identification

**Process**:
1. Review content with obvious errors or low confidence scores
2. Apply domain knowledge to make corrections
3. Create manual mappings for future reference
4. Document reasoning for corrections

## Layer 1: Manual Mappings (90-95% Confidence)
**Purpose**: Handle known problematic cases and maintain curated corrections.

**Implementation**: Pre-defined mappings stored in JSON files:
- **Content-specific mappings**: Known corrections for each category
- **Source-specific fixes**: Platform-specific content issues (YouTube, Deezer, etc.)
- **Common variations**: Multiple titles/names for same content
- **Error corrections**: Historical fixes that should be preserved

**Examples**:
```javascript
// Movie mappings
"dQw4w9WgXcQ": { title: "Rick Astley - Never Gonna Give You Up", year: 1987, category: "music" }

// Music mappings  
"track_12345": { title: "Bohemian Rhapsody", artist: "Queen", year: 1975, album: "A Night at the Opera" }

// Historical event mappings
"berlin_wall": { title: "Fall of Berlin Wall", date: "1989-11-09", category: "history" }
```

**Maintenance**:
- Regular review of mappings for accuracy
- Addition of new corrections as they're discovered
- Removal of outdated or incorrect mappings
- Version control for mapping changes

## Layer 2: Source Metadata Analysis (70-85% Confidence)
**Purpose**: Extract and parse information from content source metadata.

**Implementation**: Platform-specific parsers for different content sources:

### YouTube (Movies/Video Content)
- **Title parsing**: Extract movie/show names from video titles
- **Channel analysis**: Identify official vs. fan content
- **Description mining**: Find additional context in video descriptions
- **Upload date correlation**: Match with known release windows

### Deezer/Spotify (Music Content)
- **Track metadata**: Title, artist, album, release date
- **Genre classification**: Automatic genre assignment
- **Duration analysis**: Identify previews vs. full tracks
- **Popularity metrics**: Chart positions and play counts

### Wikipedia/Database Sources (Historical/Educational)
- **Structured data extraction**: Infobox parsing
- **Date normalization**: Convert various date formats
- **Category identification**: Auto-classify content type
- **Cross-reference validation**: Verify facts across sources

**Processing Steps**:
1. Fetch raw metadata from source APIs
2. Parse and normalize text fields
3. Extract dates and convert to standard format
4. Identify content category and type
5. Score confidence based on metadata completeness

## Layer 3: Database Search with Variations (60-85% Confidence)
**Purpose**: Match content against authoritative databases using fuzzy matching and variations.

**Implementation**: Multi-database search with intelligent query generation:

### Primary Databases
- **TMDB**: Movies and TV shows with cast, crew, release dates
- **MusicBrainz**: Music metadata with artists, albums, recordings
- **Wikipedia**: General knowledge with structured data
- **Sports databases**: League-specific APIs for games and statistics

### Search Strategies
1. **Exact match**: Direct title/name search
2. **Fuzzy matching**: Handle typos and variations
3. **Stemming**: Remove common suffixes and prefixes
4. **Year filtering**: Use release date constraints
5. **Cross-reference**: Verify matches across multiple sources

**Query Variations**:
```javascript
// Title variations for "The Dark Knight"
variations = [
  "The Dark Knight",
  "Dark Knight", 
  "Batman: The Dark Knight",
  "The Dark Knight (2008)"
]

// Artist variations for "The Beatles"
variations = [
  "The Beatles",
  "Beatles", 
  "The Fab Four",
  "Liverpool Lads"
]
```

## Layer 4: Wikipedia Fallback (50-75% Confidence)
**Purpose**: Use Wikipedia as a secondary source for content not found in specialized databases.

**Implementation**: Wikipedia API integration with intelligent parsing:
- **Disambiguation pages**: Handle multiple meanings
- **Redirect following**: Chase page redirects automatically  
- **Infobox extraction**: Parse structured information
- **Category analysis**: Use Wikipedia categories for classification
- **External link validation**: Cross-check with other sources

**Process**:
1. Search Wikipedia with content title/name
2. Handle disambiguation if multiple results
3. Extract infobox data (dates, categories, etc.)
4. Parse first paragraph for context
5. Score confidence based on information completeness

## Layer 5: Simple Visual Recognition (40-70% Confidence)
**Purpose**: Identify content based on visual elements when metadata fails.

**Current Implementation**: Basic thumbnail analysis
- **YouTube thumbnails**: Access via `https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`
- **Visual patterns**: Recognize distinctive scenes, album covers, sports imagery
- **Human/AI review**: Visual identification by expert or AI assistant

**Process**:
1. Extract thumbnail or representative image
2. Analyze visual elements (people, text, objects, settings)
3. Match against known visual patterns
4. Apply human expertise for identification
5. Create mapping for future reference

**Example - Pulp Fiction identification**:
- Video shows diner scene with orange booth seating
- Classic 1990s cinematography style
- Distinctive dialogue and character interactions
- Visual elements match known Pulp Fiction scenes
- Confidence: 65% (requires human verification)

**Future Enhancements** (Not Currently Implemented):
- Automated frame extraction at multiple timestamps
- AI vision services integration (Google Vision, AWS Rekognition)
- Machine learning models for content recognition
- Batch visual analysis capabilities

## Confidence Scoring System

### Score Ranges
- **95-100%**: Human verified, manual mapping, or exact database match
- **85-94%**: High-quality metadata with database confirmation
- **70-84%**: Good metadata match with minor uncertainties
- **60-69%**: Fuzzy match or incomplete information
- **40-59%**: Visual recognition or weak metadata
- **Below 40%**: Insufficient information for reliable identification

### Scoring Factors
- **Source reliability**: Official vs. user-generated content
- **Metadata completeness**: All fields present and consistent
- **Database matches**: Number of confirming sources
- **Date accuracy**: Release date within expected ranges
- **Cross-validation**: Agreement between multiple sources

## Category-Specific Considerations

### Movies & TV
- **Release date validation**: Check against known theatrical/broadcast dates
- **Cast verification**: Match actors with known filmographies
- **Genre consistency**: Verify content matches expected genre
- **Region handling**: Account for different release dates by country

### Music
- **Chart data correlation**: Match with Billboard/UK charts for popular songs
- **Album association**: Verify track belongs to claimed album
- **Artist disambiguation**: Handle artists with similar names
- **Remix/cover detection**: Identify alternate versions

### Historical Events
- **Date precision**: Handle exact dates vs. date ranges
- **Geographic context**: Location-specific events and timelines
- **Source verification**: Multiple historical sources required
- **Bias detection**: Account for different perspectives on events

### Sports
- **Season/league validation**: Verify games within correct time periods
- **Team name changes**: Handle franchise moves and rebrandings
- **Statistic verification**: Cross-check player/team statistics
- **Competition format**: Different rules for playoffs vs. regular season

## Quality Assurance

### Validation Checks
1. **Date range validation**: Content dates within reasonable bounds
2. **Category consistency**: All content matches declared category  
3. **Duplicate detection**: Prevent same content appearing multiple times
4. **Source verification**: Confirm content actually exists at source URLs
5. **Manual spot checks**: Regular human review of automated results

### Error Handling
- **Graceful degradation**: System continues with partial information
- **Error logging**: Track failed identifications for review
- **Fallback strategies**: Multiple identification attempts
- **User reporting**: Allow corrections from end users

## Maintenance and Updates

### Regular Tasks
- **Database updates**: Refresh content databases monthly
- **Mapping review**: Quarterly review of manual mappings
- **Error analysis**: Monthly analysis of failed identifications
- **Performance monitoring**: Track identification success rates

### Process Improvements
- **Pattern detection**: Identify new error patterns for automated fixes
- **Source additions**: Integrate new content databases
- **Algorithm tuning**: Adjust confidence scoring based on results
- **User feedback integration**: Incorporate crowd-sourced corrections

## Tools and Scripts

### Primary Tools
- `robustContentIdentifier.js` - Main identification engine
- `categorySpecificProcessor.js` - Category-specific processing
- `confidenceScorer.js` - Scoring and validation
- `manualMappingManager.js` - Manual correction system

### Analysis Tools  
- `contentAnalyzer.js` - Puzzle analysis and reporting
- `failureReporter.js` - Generate lists of failed identifications
- `visualPatternGenerator.js` - Create visual recognition mappings
- `qualityAssessment.js` - Automated quality checks

This comprehensive system ensures high-quality content curation across all Timelines categories while maintaining scalability and accuracy. 