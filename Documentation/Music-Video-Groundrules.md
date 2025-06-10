# Music Video Groundrules

## Overview
These groundrules define the standards and processes for creating high-quality music video timeline puzzles that provide an accurate and spoiler-free gaming experience.

## Core Principles

### 1. Date Accuracy First
- **Primary Rule**: All release dates must be historically accurate
- **Research Requirement**: Web search verification for unknown songs
- **Database Priority**: Use known accurate dates when available
- **Correction Rate**: Aim for 85%+ correction rate on scraped content

### 2. Zero Date Spoilers in YouTube Titles
- **Critical Rule**: No YouTube video titles can contain date information that would spoil the puzzle
- **Rejection Criteria**: Any video with years, decades, or date references in titles must be replaced
- **Exception**: Remaster dates that don't match original release dates (e.g., "2018 Remaster" for 1971 song)

### 3. Content Quality Standards
- **Source Verification**: Only use real YouTube video titles from actual content
- **No Simulation**: Never use placeholder or simulated video data
- **Duplicate Prevention**: Intelligent filtering for artist-song combinations across different video versions

## Date Spoiler Detection Patterns

### Automatic Rejection Patterns
```regex
- Years in parentheses: (1965), (1970s)
- Years in brackets: [1965], [1970s] 
- Years at end with separators: - 1965, – 1970s
- Context indicators: "from 1965", "live 1970", "recorded 1968"
- Decade references: "60s", "1960s", "sixties", "seventies"
- Era indicators: "early 60s", "late 70s", "mid 80s"
- Show/venue dates: "Ed Sullivan 1964", "TopPop 1975"
- Format dates: "remastered 1987", "original 1965"
- Chart references: "#1 1973", "Hit 1969"
- Album dates: "single 1966", "LP 1972"
- Explicit years: 1954-2024 range
```

### Special Cases
- **Keep**: John Lennon "Ultimate Mix 2018" (remaster ≠ original 1971 release)
- **Keep**: Technical format indicators that don't reveal song dates
- **Remove**: Any show-specific branding with dates ("TopPop", venue years)

## Release Date Research Protocol

### Priority Order
1. **Known Database**: Check comprehensive accurate release date database first
2. **Web Search**: Google search for `"artist" "song" release date year`
3. **Pattern Recognition**: Extract most frequent reasonable year from search results
4. **Era Estimation**: Fallback based on artist's known active period
5. **Conservative Default**: Use 1975 as safe middle ground if all else fails

### Validation Rules
- Years must be between 1950-2024
- Prefer original release over remaster dates
- Cross-reference multiple sources for accuracy
- Flag suspicious results for manual review

## Content Processing Workflow

### 1. Initial Scraping
- Use Puppeteer for reliable YouTube playlist extraction
- Handle multiple page load strategies for different playlist formats
- Extract clean video titles, URLs, and metadata
- Save raw data for audit trail

### 2. Spoiler Filtering
- Apply comprehensive date spoiler pattern matching
- Log all rejected videos with specific rejection reasons
- Calculate and report spoiler rates for quality metrics
- Flag edge cases for manual review

### 3. Date Research & Assignment
- Parse artist-song combinations from video titles
- Execute web searches with rate limiting (1 second delays)
- Apply intelligent date estimation for failed searches
- Validate all dates against reasonable ranges

### 4. Duplicate Prevention
- Implement fuzzy matching for artist and song titles
- Handle common variations ("The Beatles" vs "Beatles")
- Use Levenshtein distance for typo detection
- Apply special rules for well-known artist variations

### 5. Puzzle Creation
- Sort cards chronologically by release date
- Group into 10-card batches for optimal gameplay
- Generate descriptive metadata with date ranges
- Create unique IDs and proper puzzle structure

## Quality Metrics & Targets

### Accuracy Standards
- **Date Correction Rate**: >85% of scraped dates corrected
- **Spoiler Detection Rate**: >95% of date spoilers caught
- **Duplicate Filtering**: >90% of duplicates prevented
- **Research Success**: >80% successful web research results

### Content Standards
- **Puzzle Size**: 10 cards per test puzzle
- **Date Range**: Clear year spans in descriptions
- **Title Quality**: Clean, professional card labels
- **Video Quality**: Working YouTube URLs only

## Implementation Notes

### Technical Requirements
- Node.js with Puppeteer for web scraping
- Rate limiting for respectful web searching
- Comprehensive logging and audit trails
- JSON output for easy integration

### Manual Review Triggers
- Songs with estimated dates only
- High spoiler rates in source playlists
- Unusual artist name patterns
- Failed web search results

### Maintenance Protocols
- Regular verification of YouTube URL validity
- Periodic updates to known date database
- Review and refinement of spoiler detection patterns
- Quality metric monitoring and improvement

## Historical Context

### Problem Discovery
- Initial 56-song test set had 87.5% date inaccuracies
- 19.6% of videos contained date spoilers in YouTube titles
- Manual correction required for 49 out of 56 songs
- Web scraping proved essential due to YouTube API quota violations

### Solution Evolution
- Developed comprehensive spoiler detection (12+ patterns)
- Built intelligent duplicate prevention system
- Created web-based release date research pipeline
- Established quality metrics and success criteria

## Future Enhancements

### Planned Improvements
- Enhanced web search accuracy with multiple sources
- Machine learning for better artist-song parsing
- Automated YouTube URL health checking
- Integration with music databases (MusicBrainz, Last.fm)

### Scalability Considerations
- Batch processing for large playlist sets
- Caching systems for repeated date lookups
- Distributed processing for high-volume operations
- API integration alternatives to web scraping

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Production Ready

These groundrules ensure consistent, high-quality music video timeline puzzles that provide an engaging and fair gaming experience without spoilers or historical inaccuracies. 