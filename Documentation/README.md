# Timelines Platform Documentation

## Overview
This folder contains comprehensive documentation for the Timelines puzzle platform - a multi-category timeline game supporting various content types including movies, music, history, arts, sports, and current events.

## Platform Architecture

### Core Systems
The Timelines platform consists of three main puzzle creation systems:
1. **Static Puzzles**: Pre-authored JSON files with curated content
2. **"Surprise Me"**: GPT-generated puzzles from category prompts  
3. **User Generated Content (UGP)**: Natural language puzzle creation via API

### Technology Stack
- **Frontend**: Next.js with TypeScript, Tailwind CSS, Framer Motion
- **Backend APIs**: `/api/generate`, `/api/surprise`, `/api/save-puzzle`
- **AI Integration**: OpenAI GPT for content generation
- **Media Services**: Deezer (music), YouTube (videos), Spotify (tracks)
- **Data Validation**: Zod schemas for type-safe puzzle validation
- **Content Sources**: TMDB (movies), Wikipedia, Deezer API

## Documentation Structure

### Core Documents

#### 1. [Content Curation Process](./content-curation-process.md)
Comprehensive guide for identifying and curating content across all categories:
- **Layer 0**: Human Context Analysis
- **Layer 1**: Manual Mappings and Known Corrections
- **Layer 2**: Source Metadata Analysis (YouTube, Deezer, etc.)
- **Layer 3**: Database Search with Variations (TMDB, Wikipedia)
- **Layer 4**: Wikipedia Fallback and Cross-referencing
- **Layer 5**: Simple Visual Recognition for Unknown Content

#### 2. [Content Pipeline](./content-pipeline.md)
Multi-stage content processing workflow:
- **Stage 1**: Source Data Collection
- **Stage 2**: Content Identification and Validation
- **Stage 3**: Data Enrichment and Enhancement
- **Stage 4**: Quality Assurance and Deduplication
- **Stage 5**: Final Processing and Storage

#### 3. [API Reference](./api-reference.md)
Complete documentation of backend endpoints:
- Puzzle generation endpoints
- Content validation APIs
- User creation workflows
- Response schemas and error handling

#### 4. [GPT Integration Guide](./gpt-integration.md)
AI-powered content generation:
- System prompt architecture
- Category-specific generation rules
- Content validation and filtering
- Quality control mechanisms

#### 5. [Media Handling](./media-handling.md)
Multi-media content support:
- YouTube video integration with timestamps
- Deezer music previews and metadata
- Spotify track embedding
- Image and visual content handling

#### 6. [Content Crawler Operations](./content-crawler.md)
Automated content discovery and curation:
- Deezer crawler implementation
- Content expansion strategies
- Deduplication and quality filtering
- Database maintenance

## Content Categories

### Entertainment
- **Movies**: TMDB integration, scene identification, release date validation
- **Music**: Deezer API, 30-second previews, artist and album metadata
- **Games**: Release dates, platform information, genre classification
- **Books**: Publication dates, author information, genre classification

### History & Education  
- **Historical Events**: Cold War timeline, economic events, major inventions
- **Arts**: Painting dates, artist information, art movement classification
- **Current Events**: Celebrity news, cultural moments, recent controversies

### Sports
- **NBA**: Game dates, player statistics, team information
- **Football**: Match results, tournament dates, player transfers

## Key Features

### Advanced Content Processing
- **Auto-deduplication**: Prevents duplicate content across puzzles
- **Content Enrichment**: Wikipedia and database integration for enhanced metadata
- **Quality Validation**: Zod schemas ensure data integrity
- **Variant Management**: Multiple scenes/clips per content item

### User Experience
- **Drag-and-Drop Interface**: Framer Motion powered interactions
- **Responsive Design**: Tailwind CSS implementation
- **Media Previews**: Inline audio/video playback
- **Tooltip System**: Optional descriptions and contextual information
- **Timeline Enhancements**: Color coding, placement indicators

### Content Management
- **Persistent Storage**: Automatic saving to `gameData.ts`
- **Manual Override System**: Expert curation for edge cases
- **Content Verification**: Multi-layer validation process
- **Error Handling**: Graceful degradation for missing content

## Development Notes

### File Structure Updates
- `/api` directory contains backend endpoints
- `/lib` modularized with specialized content handlers
- `/data` stores crawled and curated content
- Enhanced type definitions in `types.ts`

### Recent Additions
- OpenAI integration for dynamic content generation
- Deezer API crawler for automated music discovery  
- Enhanced validation with Zod schemas
- Multi-category support architecture
- User-generated content workflows

## Getting Started

1. **For Content Creators**: Start with [Content Curation Process](./content-curation-process.md)
2. **For Developers**: Review [API Reference](./api-reference.md) and [Content Pipeline](./content-pipeline.md)  
3. **For System Administrators**: See [Content Crawler Operations](./content-crawler.md)

## Legacy Documentation

Previous movie-specific documentation has been preserved and expanded:
- Original movie identification process evolved into general content curation
- Movie-specific examples maintained for reference
- Backward compatibility preserved for existing movie puzzles 