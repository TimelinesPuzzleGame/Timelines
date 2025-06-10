# Content Crawler Operations

## Overview
This document describes the automated content discovery and curation systems used to expand the Timelines puzzle database. The crawler operations include Deezer music discovery, TMDB movie updates, Wikipedia historical events, and sports data aggregation.

## Crawler Architecture

### Core Components
- **Scheduler**: Manages crawler execution timing and frequency
- **Workers**: Individual crawler processes for different content sources
- **Queue Manager**: Handles job queuing and priority management
- **Data Processor**: Normalizes and validates crawled content
- **Storage Manager**: Persists processed content to database
- **Monitoring**: Tracks crawler performance and health

### Execution Flow
1. **Schedule Planning**: Determine what content to crawl and when
2. **Job Creation**: Generate specific crawl tasks with parameters
3. **Worker Assignment**: Distribute tasks to appropriate crawler workers
4. **Content Extraction**: Fetch and parse content from sources
5. **Data Processing**: Apply content curation pipeline
6. **Quality Assurance**: Validate content meets standards
7. **Storage**: Save approved content to database
8. **Reporting**: Generate performance and discovery metrics

## Deezer Music Crawler

### Configuration
```typescript
interface DeezerCrawlerConfig {
  apiBaseUrl: string;
  rateLimit: {
    requestsPerSecond: number;
    burstLimit: number;
    cooldownPeriod: number;
  };
  discovery: {
    genresToCrawl: string[];
    yearRange: { start: number; end: number; };
    chartTypes: string[];
    maxTracksPerRequest: number;
  };
  filters: {
    minDuration: number;      // Exclude very short tracks
    maxDuration: number;      // Exclude very long tracks
    explicitContent: boolean; // Include explicit content
    previewRequired: boolean; // Require 30-second preview
  };
}
```

### Discovery Strategies
```typescript
class DeezerMusicCrawler {
  async crawlCharts(country: string, date: string): Promise<DeezerTrack[]> {
    const response = await this.deezerClient.getChart({
      country,
      date,
      limit: 100
    });
    
    return this.processTrackList(response.data);
  }
  
  async crawlGenre(genreId: string): Promise<DeezerTrack[]> {
    const artists = await this.deezerClient.getGenreArtists(genreId, { limit: 50 });
    const tracks: DeezerTrack[] = [];
    
    for (const artist of artists.data) {
      const topTracks = await this.deezerClient.getArtistTopTracks(artist.id);
      tracks.push(...this.processTrackList(topTracks.data));
      
      // Rate limiting
      await this.delay(100);
    }
    
    return tracks;
  }
  
  async crawlAlbumsByYear(year: number): Promise<DeezerTrack[]> {
    const albums = await this.deezerClient.searchAlbums({
      year,
      limit: 100
    });
    
    const tracks: DeezerTrack[] = [];
    
    for (const album of albums.data) {
      const albumTracks = await this.deezerClient.getAlbumTracks(album.id);
      tracks.push(...this.processTrackList(albumTracks.data));
      
      await this.delay(50);
    }
    
    return tracks;
  }
  
  private async processTrackList(tracks: any[]): Promise<DeezerTrack[]> {
    return tracks
      .filter(track => this.meetsQualityStandards(track))
      .map(track => this.normalizeTrackData(track));
  }
}
```

### Content Quality Filters
```typescript
class DeezerQualityFilter {
  meetsQualityStandards(track: any): boolean {
    // Duration check
    if (track.duration < 30 || track.duration > 600) {
      return false;
    }
    
    // Preview availability
    if (!track.preview || track.preview.length === 0) {
      return false;
    }
    
    // Explicit content filter (if enabled)
    if (!this.config.includeExplicit && track.explicit_lyrics) {
      return false;
    }
    
    // Artist popularity threshold
    if (track.artist.nb_fan < 1000) {
      return false;
    }
    
    // Release date validation
    const releaseYear = new Date(track.release_date).getFullYear();
    if (releaseYear < 1950 || releaseYear > new Date().getFullYear()) {
      return false;
    }
    
    return true;
  }
  
  normalizeTrackData(track: any): DeezerTrack {
    return {
      id: track.id.toString(),
      title: this.cleanTitle(track.title),
      artist: track.artist.name,
      album: track.album.title,
      releaseDate: track.release_date,
      duration: track.duration,
      previewUrl: track.preview,
      albumCover: track.album.cover_xl,
      popularity: track.rank,
      explicit: track.explicit_lyrics,
      genres: this.extractGenres(track),
      source: 'deezer'
    };
  }
  
  private cleanTitle(title: string): string {
    return title
      .replace(/\(feat\..*?\)/gi, '') // Remove feat. credits
      .replace(/\[.*?\]/g, '') // Remove bracketed content
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }
}
```

## TMDB Movie/TV Crawler

### Movie Discovery
```typescript
class TMDBCrawler {
  async crawlPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
    const response = await this.tmdbClient.getPopularMovies({ page });
    return this.processMovieList(response.results);
  }
  
  async crawlMoviesByYear(year: number): Promise<TMDBMovie[]> {
    const movies: TMDBMovie[] = [];
    let page = 1;
    let hasMorePages = true;
    
    while (hasMorePages && page <= 50) { // Limit to prevent infinite loops
      const response = await this.tmdbClient.discoverMovies({
        primary_release_year: year,
        page,
        sort_by: 'popularity.desc'
      });
      
      movies.push(...this.processMovieList(response.results));
      
      hasMorePages = page < response.total_pages;
      page++;
      
      await this.delay(100); // Rate limiting
    }
    
    return movies;
  }
  
  async crawlMoviesByGenre(genreId: number): Promise<TMDBMovie[]> {
    const response = await this.tmdbClient.discoverMovies({
      with_genres: genreId,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100 // Minimum vote threshold
    });
    
    return this.processMovieList(response.results);
  }
  
  async enrichMovieData(movieId: number): Promise<TMDBMovieDetails> {
    const [details, credits, videos] = await Promise.all([
      this.tmdbClient.getMovieDetails(movieId),
      this.tmdbClient.getMovieCredits(movieId),
      this.tmdbClient.getMovieVideos(movieId)
    ]);
    
    return this.combineMovieData(details, credits, videos);
  }
}
```

### TV Show Discovery
```typescript
class TMDBTVCrawler {
  async crawlPopularTVShows(): Promise<TMDBTVShow[]> {
    const response = await this.tmdbClient.getPopularTVShows();
    return this.processTVShowList(response.results);
  }
  
  async crawlTVShowsByNetwork(networkId: number): Promise<TMDBTVShow[]> {
    const response = await this.tmdbClient.discoverTVShows({
      with_networks: networkId,
      sort_by: 'popularity.desc'
    });
    
    return this.processTVShowList(response.results);
  }
  
  async crawlTVSeasonDetails(showId: number, seasonNumber: number): Promise<TMDBSeason> {
    const season = await this.tmdbClient.getTVSeasonDetails(showId, seasonNumber);
    return this.processSeasonData(season);
  }
}
```

## Wikipedia Historical Events Crawler

### Event Discovery
```typescript
class WikipediaCrawler {
  async crawlHistoricalEventsByYear(year: number): Promise<WikipediaEvent[]> {
    const pageTitle = `${year}`;
    const page = await this.wikipediaClient.getPage(pageTitle);
    
    return this.extractEventsFromYearPage(page, year);
  }
  
  async crawlEventsByCategory(category: string): Promise<WikipediaEvent[]> {
    const categoryMembers = await this.wikipediaClient.getCategoryMembers(category);
    const events: WikipediaEvent[] = [];
    
    for (const member of categoryMembers) {
      try {
        const event = await this.extractEventFromPage(member.title);
        if (event) {
          events.push(event);
        }
      } catch (error) {
        console.warn(`Failed to process ${member.title}:`, error);
      }
      
      await this.delay(200); // Be respectful to Wikipedia
    }
    
    return events;
  }
  
  private extractEventsFromYearPage(page: any, year: number): WikipediaEvent[] {
    const events: WikipediaEvent[] = [];
    const sections = ['Events', 'Births', 'Deaths'];
    
    for (const section of sections) {
      const sectionContent = this.extractSection(page.content, section);
      if (sectionContent) {
        events.push(...this.parseEventsList(sectionContent, year));
      }
    }
    
    return events;
  }
  
  private parseEventsList(content: string, year: number): WikipediaEvent[] {
    const events: WikipediaEvent[] = [];
    const eventPattern = /^\*\s*(.+?)(?:\s*-\s*(.+?))?$/gm;
    let match;
    
    while ((match = eventPattern.exec(content)) !== null) {
      const [, dateAndEvent, description] = match;
      const event = this.parseEventEntry(dateAndEvent, description, year);
      
      if (event) {
        events.push(event);
      }
    }
    
    return events;
  }
}
```

### Content Validation
```typescript
class WikipediaEventValidator {
  validateEvent(event: WikipediaEvent): ValidationResult {
    const issues: string[] = [];
    
    // Date validation
    if (!this.isValidDate(event.date)) {
      issues.push('Invalid or missing date');
    }
    
    // Description quality
    if (!event.description || event.description.length < 10) {
      issues.push('Description too short or missing');
    }
    
    // Category appropriateness
    if (!this.isAppropriateCategory(event.category)) {
      issues.push('Inappropriate category for timeline puzzle');
    }
    
    // Source reliability
    if (!this.hasReliableSources(event)) {
      issues.push('Lacks reliable sources');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      score: Math.max(0, 100 - (issues.length * 25))
    };
  }
  
  private isAppropriateCategory(category: string): boolean {
    const appropriateCategories = [
      'politics', 'science', 'technology', 'culture',
      'disasters', 'wars', 'discoveries', 'inventions'
    ];
    
    return appropriateCategories.some(cat => 
      category.toLowerCase().includes(cat)
    );
  }
}
```

## Sports Data Crawler

### Multi-League Support
```typescript
class SportsCrawler {
  async crawlNBAGames(season: string): Promise<NBAGame[]> {
    const games = await this.nbaClient.getSeasonGames(season);
    return games.map(game => this.normalizeNBAGame(game));
  }
  
  async crawlNFLGames(season: number): Promise<NFLGame[]> {
    const games = await this.nflClient.getSeasonGames(season);
    return games.map(game => this.normalizeNFLGame(game));
  }
  
  async crawlOlympicEvents(year: number): Promise<OlympicEvent[]> {
    const events = await this.olympicClient.getGamesEvents(year);
    return events.map(event => this.normalizeOlympicEvent(event));
  }
  
  async crawlWorldCupMatches(year: number): Promise<WorldCupMatch[]> {
    const matches = await this.fifaClient.getWorldCupMatches(year);
    return matches.map(match => this.normalizeWorldCupMatch(match));
  }
}
```

## Crawler Scheduling and Management

### Job Scheduling
```typescript
interface CrawlerJob {
  id: string;
  type: 'deezer' | 'tmdb' | 'wikipedia' | 'sports';
  priority: 'high' | 'medium' | 'low';
  parameters: any;
  scheduledAt: Date;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

class CrawlerScheduler {
  private jobQueue: PriorityQueue<CrawlerJob>;
  private runningJobs: Map<string, CrawlerJob>;
  
  scheduleRegularCrawls(): void {
    // Daily music discovery
    this.scheduleRecurring('deezer-daily', {
      type: 'deezer',
      parameters: { strategy: 'charts', countries: ['US', 'UK', 'FR'] }
    }, '0 2 * * *'); // 2 AM daily
    
    // Weekly movie updates
    this.scheduleRecurring('tmdb-weekly', {
      type: 'tmdb',
      parameters: { strategy: 'popular', pages: 5 }
    }, '0 1 * * 0'); // 1 AM Sunday
    
    // Monthly historical events
    this.scheduleRecurring('wikipedia-monthly', {
      type: 'wikipedia',
      parameters: { categories: ['Current events', 'Recent deaths'] }
    }, '0 3 1 * *'); // 3 AM first of month
  }
  
  async executeJob(job: CrawlerJob): Promise<CrawlerResult> {
    this.runningJobs.set(job.id, job);
    
    try {
      const crawler = this.getCrawler(job.type);
      const result = await crawler.execute(job.parameters);
      
      job.status = 'completed';
      return result;
    } catch (error) {
      job.status = 'failed';
      job.retryCount++;
      
      if (job.retryCount < job.maxRetries) {
        // Reschedule with exponential backoff
        const delay = Math.pow(2, job.retryCount) * 60000; // minutes
        job.scheduledAt = new Date(Date.now() + delay);
        job.status = 'pending';
        this.jobQueue.enqueue(job);
      }
      
      throw error;
    } finally {
      this.runningJobs.delete(job.id);
    }
  }
}
```

### Rate Limiting and Throttling
```typescript
class RateLimiter {
  private buckets: Map<string, TokenBucket>;
  
  constructor() {
    this.buckets = new Map();
    
    // Configure rate limits for each service
    this.buckets.set('deezer', new TokenBucket(10, 1)); // 10 requests/second
    this.buckets.set('tmdb', new TokenBucket(4, 0.25)); // 4 requests/second
    this.buckets.set('wikipedia', new TokenBucket(1, 0.1)); // 1 request/10 seconds
    this.buckets.set('nba', new TokenBucket(5, 0.5)); // 5 requests/2 seconds
  }
  
  async acquireToken(service: string): Promise<void> {
    const bucket = this.buckets.get(service);
    if (!bucket) {
      throw new Error(`Unknown service: ${service}`);
    }
    
    return bucket.acquire();
  }
}

class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  
  constructor(
    private capacity: number,
    private refillRate: number // tokens per second
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  
  async acquire(): Promise<void> {
    this.refill();
    
    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }
    
    // Wait until token is available
    const waitTime = (1 - this.tokens) / this.refillRate * 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    await this.acquire(); // Recursive call after waiting
  }
  
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}
```

## Deduplication and Quality Control

### Content Deduplication
```typescript
class ContentDeduplicator {
  async findDuplicates(newContent: any[], existingContent: any[]): Promise<DuplicationReport> {
    const duplicates: any[] = [];
    const unique: any[] = [];
    
    for (const item of newContent) {
      const isDuplicate = await this.isDuplicate(item, existingContent);
      
      if (isDuplicate) {
        duplicates.push(item);
      } else {
        unique.push(item);
        existingContent.push(item); // Add to comparison set
      }
    }
    
    return {
      duplicates,
      unique,
      totalProcessed: newContent.length,
      duplicateRate: duplicates.length / newContent.length
    };
  }
  
  private async isDuplicate(item: any, existingItems: any[]): Promise<boolean> {
    for (const existing of existingItems) {
      if (await this.calculateSimilarity(item, existing) > 0.9) {
        return true;
      }
    }
    return false;
  }
  
  private async calculateSimilarity(item1: any, item2: any): Promise<number> {
    // Title similarity
    const titleSimilarity = this.stringSimilarity(
      this.normalizeTitle(item1.title),
      this.normalizeTitle(item2.title)
    );
    
    // Date similarity
    const dateSimilarity = this.dateSimilarity(item1.date, item2.date);
    
    // Weighted average
    return (titleSimilarity * 0.7) + (dateSimilarity * 0.3);
  }
}
```

### Quality Assurance Pipeline
```typescript
class QualityAssurancePipeline {
  async processContent(content: any[]): Promise<QAResult> {
    const results: QAResult = {
      passed: [],
      failed: [],
      warnings: []
    };
    
    for (const item of content) {
      const validation = await this.validateItem(item);
      
      if (validation.isValid) {
        results.passed.push(item);
      } else if (validation.isCritical) {
        results.failed.push({ item, issues: validation.issues });
      } else {
        results.warnings.push({ item, issues: validation.issues });
        results.passed.push(item); // Include with warnings
      }
    }
    
    return results;
  }
  
  private async validateItem(item: any): Promise<ValidationResult> {
    const validators = [
      this.validateRequiredFields,
      this.validateDataTypes,
      this.validateDateRanges,
      this.validateContentQuality,
      this.validateSourceReliability
    ];
    
    const issues: string[] = [];
    let isCritical = false;
    
    for (const validator of validators) {
      const result = await validator(item);
      if (!result.isValid) {
        issues.push(...result.issues);
        if (result.isCritical) {
          isCritical = true;
        }
      }
    }
    
    return {
      isValid: issues.length === 0,
      isCritical,
      issues
    };
  }
}
```

## Monitoring and Analytics

### Performance Metrics
```typescript
class CrawlerMonitor {
  trackCrawlerPerformance(crawlerType: string, metrics: CrawlerMetrics): void {
    this.metricsCollector.record(`crawler.${crawlerType}.items_discovered`, metrics.itemsDiscovered);
    this.metricsCollector.record(`crawler.${crawlerType}.success_rate`, metrics.successRate);
    this.metricsCollector.record(`crawler.${crawlerType}.processing_time`, metrics.processingTime);
    this.metricsCollector.record(`crawler.${crawlerType}.error_count`, metrics.errorCount);
  }
  
  generateDailyReport(): CrawlerReport {
    const report: CrawlerReport = {
      date: new Date().toISOString().split('T')[0],
      crawlers: {},
      summary: {
        totalItemsProcessed: 0,
        totalItemsAdded: 0,
        overallSuccessRate: 0,
        totalErrors: 0
      }
    };
    
    const crawlerTypes = ['deezer', 'tmdb', 'wikipedia', 'sports'];
    
    for (const type of crawlerTypes) {
      const metrics = this.getMetricsForCrawler(type);
      report.crawlers[type] = metrics;
      
      report.summary.totalItemsProcessed += metrics.itemsProcessed;
      report.summary.totalItemsAdded += metrics.itemsAdded;
      report.summary.totalErrors += metrics.errorCount;
    }
    
    report.summary.overallSuccessRate = 
      report.summary.totalItemsAdded / report.summary.totalItemsProcessed;
    
    return report;
  }
}
```

### Health Checks
```typescript
class CrawlerHealthChecker {
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDeezerAPI(),
      this.checkTMDBAPI(),
      this.checkWikipediaAPI(),
      this.checkDatabaseConnection(),
      this.checkQueueHealth()
    ]);
    
    const healthStatus: HealthStatus = {
      overall: 'healthy',
      services: {},
      timestamp: new Date().toISOString()
    };
    
    checks.forEach((check, index) => {
      const serviceName = ['deezer', 'tmdb', 'wikipedia', 'database', 'queue'][index];
      
      if (check.status === 'fulfilled') {
        healthStatus.services[serviceName] = 'healthy';
      } else {
        healthStatus.services[serviceName] = 'unhealthy';
        healthStatus.overall = 'degraded';
      }
    });
    
    return healthStatus;
  }
  
  private async checkDeezerAPI(): Promise<void> {
    const response = await fetch('https://api.deezer.com/chart', {
      method: 'HEAD',
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`Deezer API unhealthy: ${response.status}`);
    }
  }
}
```

This comprehensive crawler system ensures continuous content discovery and maintenance while respecting API limits and maintaining high content quality standards. 