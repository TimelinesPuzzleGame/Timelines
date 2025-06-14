import type { Puzzle } from "./types"; // assuming you defined Puzzle and EventCard types in a separate file
import inventions from "./puzzles/inventions.json" assert { type: "json" };
//import economicEvents from "./puzzles/economicEvents.json" assert { type: "json" };
import videoGameMechanics from "./puzzles/videoGameMechanics.json" assert { type: "json" };
import videoGameReleases from "./puzzles/videoGameReleases.json" assert { type: "json" };
import paintings from "./puzzles/paintings.json" assert { type: "json" };
import hitSongs from "./puzzles/hitSongs.json" assert { type: "json" };
import nbaEvents from "./puzzles/nbaEvents.json" assert { type: "json" };
import brazilSoccer from "./puzzles/brazilSoccer.json" assert { type: "json" };
import horrorFilms from "./puzzles/horrorFilms.json" assert { type: "json" };
import popCulture from "./puzzles/popCulture.json" assert { type: "json" };
import backToTheFuture from "./puzzles/backToTheFuture.json" assert { type: "json" };
import harryPotter from "./puzzles/harryPotter.json" assert { type: "json" };
import lotrMovies from "./puzzles/lotrMovies.json" assert { type: "json" };
import kingkillerChronicles from "./puzzles/kingkillerChronicles.json" assert { type: "json" };
import livelyBaldoni from "./puzzles/livelyBaldoni.json" assert { type: "json" };
import trueCrime from "./puzzles/trueCrime.json" assert { type: "json" };
import coldWar from "./puzzles/coldWar.json" assert { type: "json" };
import diddyLifeCareer from "./puzzles/diddyLifeCareer.json" assert { type: "json" };
import celebrityApologies from "./puzzles/celebrityApologies.json" assert { type: "json" };
import moralPanics from "./puzzles/moral-panics.json";
import rapDissTracks from "./puzzles/rapDissTracks.json" assert { type: "json" };
import hitSongsWithDeezerPreviews from "./puzzles/hitSongsWithDeezerPreviews.json" assert { type: "json" }; 
import hipHopHistory from "./puzzles/hipHopHistory.json" assert { type: "json" };
import la_lakers_1747163720729 from './puzzles/la-lakers-1747163720729.json';
import iconic_moments_in_film_and_television_history_1747173454581 from './puzzles/iconic-moments-in-film-and-television-history-1747173454581.json';
import sit_coms_1747175975965 from './puzzles/sit-coms-1747175975965.json';
import literary_milestones_1747176555096 from './puzzles/literary-milestones-1747176555096.json';
import landmark_events_in_video_game_history_1747177297269 from './puzzles/landmark-events-in-video-game-history-1747177297269.json';
import the_evolution_of_nintendo_1747177830047 from './puzzles/the-evolution-of-nintendo-1747177830047.json';
import super_mario_odyssey_a_journey_through_time_1747180405626 from './puzzles/super-mario-odyssey-a-journey-through-time-1747180405626.json';
import the_legend_of_zelda_a_hero_s_journey_1747181567527 from './puzzles/the-legend-of-zelda-a-hero-s-journey-1747181567527.json';
import god_of_war_chronology_of_chaos_1747182342002 from './puzzles/god-of-war-chronology-of-chaos-1747182342002.json';
import the_evolution_of_james_bond_1747182740526 from './puzzles/the-evolution-of-james-bond-1747182740526.json';
import the_magic_of_miyazaki_1747183048977 from './puzzles/the-magic-of-miyazaki-1747183048977.json';
import the_marvelous_life_of_stan_lee_1747186212259 from './puzzles/the-marvelous-life-of-stan-lee-1747186212259.json';
import airborne_legends_1747201906090 from './puzzles/airborne-legends-1747201906090.json';
import spurs_silver_age_1747202917359 from './puzzles/spurs-silver-age-1747202917359.json';
import pixar_s_playbook_1747205818789 from './puzzles/pixar-s-playbook-1747205818789.json';
import celtics_chronicles_1747240777235 from './puzzles/celtics-chronicles-1747240777235.json';
import songs_aerosmith_1747273075637 from './puzzles/songs-aerosmith-1747273075637.json';
import nba_draft_classes_1747280660045 from './puzzles/nba-draft-classes-1747280660045.json';
import songs_rap_diss_tracks_1747282327137 from './puzzles/songs-rap-diss-tracks-1747282327137.json';
import rising_suns_1747329855335 from './puzzles/rising-suns-1747329855335.json';
//import history_of_switzerland_1747330039109 from './puzzles/history-of-switzerland-1747330039109.json';
import danceTrendsByDecade from './puzzles/danceTrendsByDecade.json' assert { type: "json" }; 
import iconicMovieDanceScenes from './puzzles/iconicMovieDanceScenes.json' assert { type: "json" };
import powerfulSpeeches from './puzzles/powerfulSpeeches.json' assert { type: "json" }; 
import ufcSubmissions from './puzzles/ufcSubmissions.json' assert { type: "json" };
//import nbaFights from './puzzles/nbaFights.json' assert { type: "json" }; 
import dessertThroughTheAges from './puzzles/dessertThroughTheAges.json' assert { type: "json" };
import songs_beastie_boys_beck_tribe_called_quest_1747533192903 from './puzzles/songs-beastie-boys-beck-tribe-called-quest-1747533192903.json';
import trends_in_popular_music_1900_2025_1747533832648 from './puzzles/trends-in-popular-music-1900-2025-1747533832648.json';
import songs_grunge_pop_punk_and_alt_rock_1747608156736 from './puzzles/songs-grunge-pop-punk-and-alt-rock-1747608156736.json';
import songs_blink_182_1747608216887 from './puzzles/songs-blink-182-1747608216887.json';
//import songs_pearl_jam_sound_garden_pixies_1747608242329 from './puzzles/songs-pearl-jam-sound-garden-pixies-1747608242329.json';
import songs_the_strokes_modest_mouse_fugazi_1747608318121 from './puzzles/songs-the-strokes-modest-mouse-fugazi-1747608318121.json';
import rockAndHipHop from './puzzles/rockAndHipHop.json' assert { type: "json" };
import spectacularKnockouts from './puzzles/spectacularKnockouts.json' assert { type: "json" };
import historic_firsts_1747802706500 from './puzzles/historic-firsts-1747802706500.json';
import ink_and_pages_literary_landmarks_1747803120409 from './puzzles/ink-and-pages-literary-landmarks-1747803120409.json';
import knockouts_and_tapouts_1747803563412 from './puzzles/knockouts-and-tapouts-1747803563412.json';
import evolution_of_life_on_earth_1747807796434 from './puzzles/evolution-of-life-on-earth-1747807796434.json';
import humanHistoryPrehistoryTo1499 from './puzzles/humanHistoryPrehistoryTo1499.json' assert { type: "json" };
import unforgettableGoalsFootball from './puzzles/unforgettableGoalsFootball.json' assert { type: "json" };
import nbaGreatestPlays from './puzzles/nbaGreatestPlays.json' assert { type: "json" };
import summerSongs from './puzzles/summerSongs.json' assert { type: "json" };
import loveSongs from './puzzles/loveSongs.json' assert { type: "json" };
import breakUpSongs from './puzzles/breakUpSongs.json' assert { type: "json" };
import bestMovieSongs from './puzzles/bestMovieSongs.json' assert {type: "json"};
import greatestMovieScenes from './puzzles/greatestMovieScenes.json' assert { type: "json" };
import lob_city_chronicles_1748319625787 from './puzzles/lob-city-chronicles-1748319625787.json';
import hitSongsMusic from './puzzles/hitSongsMusic.json';
import pop_rnb_love_2010s2020s_music_1748677519967 from './puzzles/pop-rnb-love-2010s2020s-music-1748677519967.json';
import _modern_pop_hits_2010s2020s_1748677746247 from './puzzles/-modern-pop-hits-2010s2020s-1748677746247.json';
import _hiphop_classics_90s2000s_1748677766533 from './puzzles/-hiphop-classics-90s2000s-1748677766533.json';
import _80s_classics_1748677890087 from './puzzles/-80s-classics-1748677890087.json';
import _summer_vibes_all_time_1748677920035 from './puzzles/-summer-vibes-all-time-1748677920035.json';
import fashionThroughTheAges from './puzzles/fashionThroughTheAges.json' assert { type: "json" };
import famousMugshots from './puzzles/famousMugshots.json' assert { type: "json" };
import bollywoodMovieClips from './puzzles/bollywood-movie-clips.json' assert { type: "json" };
import bestMovieScenes from './puzzles/best-movie-scenes.json' assert { type: "json" };
import classicMovies from './puzzles/classic-movies.json' assert { type: "json" };
import familyMovies from './puzzles/family-movies.json' assert { type: "json" };
import romance from './puzzles/romance.json' assert { type: "json" };
import slang from './puzzles/slang.json' assert {type: "json"};
import cults from './puzzles/cults.json' assert { type: "json" };
import imdbTop10GreatestFilms from './puzzles/imdb-top10-greatest-films.json' assert { type: "json" };
// ENHANCED TEST PUZZLES 1-8 - NEW from 192-movie crawl with EXPANDED QUERY SYSTEM
// Using enhanced retry logic and progressively creative searches
import gibboanxTest1 from './puzzles/gibboanx-test-1.json' assert { type: "json" };
import gibboanxTest2 from './puzzles/gibboanx-test-2.json' assert { type: "json" };
import gibboanxTest3 from './puzzles/gibboanx-test-3.json' assert { type: "json" };
import gibboanxTest4 from './puzzles/gibboanx-test-4.json' assert { type: "json" };
import gibboanxTest5 from './puzzles/gibboanx-test-5.json' assert { type: "json" };
import gibboanxTest6 from './puzzles/gibboanx-test-6.json' assert { type: "json" };
import gibboanxTest7 from './puzzles/gibboanx-test-7.json' assert { type: "json" };
import gibboanxTest8 from './puzzles/gibboanx-test-8.json' assert { type: "json" };
import gibboanxTest9 from './puzzles/gibboanx-test-9.json' assert { type: "json" };
// ENHANCED TEST PUZZLES 10-40 - From previous massive mega crawl session
import gibboanxTest10 from './puzzles/gibboanx-test-10.json' assert { type: "json" };
// COMMENTED OUT - Content merged into Best Movie Scenes
// import gibboanxTest11 from './puzzles/gibboanx-test-11.json' assert { type: "json" };
// import gibboanxTest12 from './puzzles/gibboanx-test-12.json' assert { type: "json" };
// import gibboanxTest13 from './puzzles/gibboanx-test-13.json' assert { type: "json" };
// import gibboanxTest14 from './puzzles/gibboanx-test-14.json' assert { type: "json" };
// import gibboanxTest15 from './puzzles/gibboanx-test-15.json' assert { type: "json" };
// import gibboanxTest16 from './puzzles/gibboanx-test-16.json' assert { type: "json" };
// import gibboanxTest17 from './puzzles/gibboanx-test-17.json' assert { type: "json" };
// import gibboanxTest18 from './puzzles/gibboanx-test-18.json' assert { type: "json" };
// import gibboanxTest19 from './puzzles/gibboanx-test-19.json' assert { type: "json" };
// COMMENTED OUT - Content merged into Best Movie Scenes
// import gibboanxTest20 from './puzzles/gibboanx-test-20.json' assert { type: "json" };
// import gibboanxTest21 from './puzzles/gibboanx-test-21.json' assert { type: "json" };
// import gibboanxTest22 from './puzzles/gibboanx-test-22.json' assert { type: "json" };
// import gibboanxTest23 from './puzzles/gibboanx-test-23.json' assert { type: "json" };
// import gibboanxTest24 from './puzzles/gibboanx-test-24.json' assert { type: "json" };
// import gibboanxTest25 from './puzzles/gibboanx-test-25.json' assert { type: "json" };
// import gibboanxTest26 from './puzzles/gibboanx-test-26.json' assert { type: "json" };
// import gibboanxTest27 from './puzzles/gibboanx-test-27.json' assert { type: "json" };
// import gibboanxTest28 from './puzzles/gibboanx-test-28.json' assert { type: "json" };
// import gibboanxTest29 from './puzzles/gibboanx-test-29.json' assert { type: "json" };
// import gibboanxTest30 from './puzzles/gibboanx-test-30.json' assert { type: "json" };
// import gibboanxTest31 from './puzzles/gibboanx-test-31.json' assert { type: "json" };
// import gibboanxTest32 from './puzzles/gibboanx-test-32.json' assert { type: "json" };
import gibboanxTest33 from './puzzles/gibboanx-test-33.json' assert { type: "json" };
import gibboanxTest34 from './puzzles/gibboanx-test-34.json' assert { type: "json" };
import gibboanxTest35 from './puzzles/gibboanx-test-35.json' assert { type: "json" };
import gibboanxTest36 from './puzzles/gibboanx-test-36.json' assert { type: "json" };
import gibboanxTest37 from './puzzles/gibboanx-test-37.json' assert { type: "json" };
import gibboanxTest38 from './puzzles/gibboanx-test-38.json' assert { type: "json" };
import gibboanxTest39 from './puzzles/gibboanx-test-39.json' assert { type: "json" };
import gibboanxTest40 from './puzzles/gibboanx-test-40.json' assert { type: "json" };
// COMMENTED OUT - Content already merged into Best Movie Scenes
// import gibboanxVerification2 from './puzzles/gibboanx-verification-2.json' assert { type: "json" };
// import gibboanxVerification3 from './puzzles/gibboanx-verification-3.json' assert { type: "json" };
// import imdbBurnDown1 from './puzzles/imdb-burn-down-1.json' assert { type: "json" };
import songs_synth_pop_1749353282288 from './puzzles/songs-synth-pop-1749353282288.json';
import dateSpoilerReplacementsTest from './puzzles/date-spoiler-replacements-test.json' assert { type: "json" };
import greatestMusicVideosAllTime from './puzzles/greatest-music-videos-all-time-expanded.json' assert { type: "json" };
import bestMusicVideosRandomized from './puzzles/best-music-videos-randomized.json' assert { type: "json" };
// MUSIC VIDEO TEST PUZZLES - CONTENT MERGED INTO greatest-music-videos-all-time-expanded.json
// import musicVideoTest1 from './puzzles/music-video-test-1.json' assert { type: "json" };
// import musicVideoTest2 from './puzzles/music-video-test-2.json' assert { type: "json" };
// import musicVideoTest3 from './puzzles/music-video-test-3.json' assert { type: "json" };
// import musicVideoTest4 from './puzzles/music-video-test-4.json' assert { type: "json" };
// import musicVideoTest5 from './puzzles/music-video-test-5.json' assert { type: "json" };
// import musicVideoTest6 from './puzzles/music-video-test-6.json' assert { type: "json" };
// MUSIC PLAYLIST TEST PUZZLES - CONTENT MERGED INTO greatest-music-videos-all-time-expanded.json
// import musicPlaylistTest1 from './puzzles/music-playlist-test-1.json' assert { type: "json" };
// import musicPlaylistTest2 from './puzzles/music-playlist-test-2.json' assert { type: "json" };
// import musicPlaylistTest3 from './puzzles/music-playlist-test-3.json' assert { type: "json" };
// import musicPlaylistTest4 from './puzzles/music-playlist-test-4.json' assert { type: "json" };
// import musicPlaylistTest5 from './puzzles/music-playlist-test-5.json' assert { type: "json" };
// import musicPlaylistTest6 from './puzzles/music-playlist-test-6.json' assert { type: "json" };
// import musicPlaylistTest7 from './puzzles/music-playlist-test-7.json' assert { type: "json" };
// import musicPlaylistTest8 from './puzzles/music-playlist-test-8.json' assert { type: "json" };
// import musicPlaylistTest9 from './puzzles/music-playlist-test-9.json' assert { type: "json" };
// import musicPlaylistTest10 from './puzzles/music-playlist-test-10.json' assert { type: "json" };
// import musicPlaylistTest11 from './puzzles/music-playlist-test-11.json' assert { type: "json" };
// import musicPlaylistTest12 from './puzzles/music-playlist-test-12.json' assert { type: "json" };
// import musicPlaylistTest13 from './puzzles/music-playlist-test-13.json' assert { type: "json" };
// import musicPlaylistTest14 from './puzzles/music-playlist-test-14.json' assert { type: "json" };
// import musicPlaylistTest15 from './puzzles/music-playlist-test-15.json' assert { type: "json" };
// import musicPlaylistTest16 from './puzzles/music-playlist-test-16.json' assert { type: "json" };
// import musicPlaylistTest17 from './puzzles/music-playlist-test-17.json' assert { type: "json" };
// import musicPlaylistTest18 from './puzzles/music-playlist-test-18.json' assert { type: "json" };
// import musicPlaylistTest19 from './puzzles/music-playlist-test-19.json' assert { type: "json" };
// import musicPlaylistTest20 from './puzzles/music-playlist-test-20.json' assert { type: "json" };
import songs_dancehall_1749588410353 from './puzzles/songs-dancehall-1749588410353.json';
import tvShowIntros from './puzzles/tv-show-intros.json' assert { type: "json" };
import christmasMovies from './puzzles/christmasMovies.json' assert { type: "json" };
import westernMovies from './puzzles/westernMovies.json' assert { type: "json" };
import vampires from './puzzles/vampires.json' assert { type: "json" };
// END IMPORTS

export const puzzles: Puzzle[] = [
  tvShowIntros as unknown as Puzzle,
  christmasMovies as unknown as Puzzle,
  westernMovies as unknown as Puzzle,
  vampires as unknown as Puzzle,
  popCulture as Puzzle,
  nbaEvents as Puzzle,
  hitSongs as Puzzle,
  brazilSoccer as Puzzle,
  coldWar as Puzzle,    
  horrorFilms as Puzzle,
  inventions as Puzzle,
  paintings as Puzzle,
  //economicEvents as Puzzle,
  lotrMovies as Puzzle,
  videoGameMechanics as Puzzle, 
  kingkillerChronicles as Puzzle,
  videoGameReleases as Puzzle,
  backToTheFuture as Puzzle,    
  livelyBaldoni as Puzzle,
  trueCrime as Puzzle,
  harryPotter as Puzzle,
  diddyLifeCareer as Puzzle,
  celebrityApologies as Puzzle,
  moralPanics as Puzzle,
  rapDissTracks as Puzzle,
  hitSongsWithDeezerPreviews as unknown as Puzzle,
  hipHopHistory as unknown as Puzzle,
    la_lakers_1747163720729 as Puzzle,
    iconic_moments_in_film_and_television_history_1747173454581 as Puzzle,
    sit_coms_1747175975965 as Puzzle,
    literary_milestones_1747176555096 as Puzzle,
    landmark_events_in_video_game_history_1747177297269 as Puzzle,
    the_evolution_of_nintendo_1747177830047 as Puzzle,
    super_mario_odyssey_a_journey_through_time_1747180405626 as Puzzle,
    the_legend_of_zelda_a_hero_s_journey_1747181567527 as Puzzle,
    god_of_war_chronology_of_chaos_1747182342002 as Puzzle,
    the_evolution_of_james_bond_1747182740526 as Puzzle,
    the_magic_of_miyazaki_1747183048977 as Puzzle,
    the_marvelous_life_of_stan_lee_1747186212259 as Puzzle,
    airborne_legends_1747201906090 as Puzzle,
    spurs_silver_age_1747202917359 as Puzzle,
    pixar_s_playbook_1747205818789 as Puzzle,
    celtics_chronicles_1747240777235 as Puzzle,
    songs_aerosmith_1747273075637 as unknown as Puzzle,
    nba_draft_classes_1747280660045 as Puzzle,
    songs_rap_diss_tracks_1747282327137 as unknown as Puzzle,
    rising_suns_1747329855335 as Puzzle,
    //history_of_switzerland_1747330039109 as Puzzle,
    danceTrendsByDecade as Puzzle,
    iconicMovieDanceScenes as Puzzle,
    powerfulSpeeches as Puzzle,
    ufcSubmissions as Puzzle,
    songs_beastie_boys_beck_tribe_called_quest_1747533192903 as unknown as Puzzle,
    trends_in_popular_music_1900_2025_1747533832648 as unknown as Puzzle,
    //nbaFights as Puzzle,
    songs_grunge_pop_punk_and_alt_rock_1747608156736 as unknown as Puzzle,
    songs_blink_182_1747608216887 as unknown as Puzzle,
    songs_the_strokes_modest_mouse_fugazi_1747608318121 as unknown as Puzzle,
    rockAndHipHop as unknown as Puzzle,
    spectacularKnockouts as Puzzle,
    historic_firsts_1747802706500 as unknown as Puzzle,
    ink_and_pages_literary_landmarks_1747803120409 as Puzzle,
    knockouts_and_tapouts_1747803563412 as Puzzle,
    evolution_of_life_on_earth_1747807796434 as Puzzle,
    dessertThroughTheAges as Puzzle,
    humanHistoryPrehistoryTo1499 as Puzzle,
    unforgettableGoalsFootball as Puzzle,
    nbaGreatestPlays as Puzzle,
    summerSongs as unknown as Puzzle,
    loveSongs as unknown as Puzzle,
    breakUpSongs as unknown as Puzzle,
   bestMovieSongs as unknown as Puzzle,
    greatestMovieScenes as unknown as Puzzle,
    lob_city_chronicles_1748319625787 as Puzzle,
    hitSongsMusic as Puzzle,
    pop_rnb_love_2010s2020s_music_1748677519967 as Puzzle,
    _modern_pop_hits_2010s2020s_1748677746247 as unknown as Puzzle,
    _hiphop_classics_90s2000s_1748677766533 as unknown as Puzzle,
    _80s_classics_1748677890087 as unknown as Puzzle,
    _summer_vibes_all_time_1748677920035 as unknown as Puzzle,
    fashionThroughTheAges as Puzzle,
    famousMugshots as Puzzle,
    bollywoodMovieClips as unknown as Puzzle,
    bestMovieScenes as unknown as Puzzle,
classicMovies as Puzzle,
      familyMovies as unknown as Puzzle,
  romance as unknown as Puzzle,
      slang as Puzzle, 
      cults as unknown as Puzzle,
      imdbTop10GreatestFilms as unknown as Puzzle,
      // ENHANCED TEST PUZZLES 1-8 - NEW 192-MOVIE CRAWL with EXPANDED QUERY SYSTEM
      gibboanxTest1 as unknown as Puzzle,
      gibboanxTest2 as unknown as Puzzle,
      gibboanxTest3 as unknown as Puzzle,
      gibboanxTest4 as unknown as Puzzle,
      gibboanxTest5 as unknown as Puzzle,
      gibboanxTest6 as unknown as Puzzle,
      gibboanxTest7 as unknown as Puzzle,
      gibboanxTest8 as unknown as Puzzle,
      // gibboanxTest9 as unknown as Puzzle,
      // gibboanxTest10 as unknown as Puzzle,
      // ENHANCED TEST PUZZLES 11-40 - From massive mega crawl session
        // COMMENTED OUT - Content merged into Best Movie Scenes
  // gibboanxTest11 as unknown as Puzzle,
  // gibboanxTest12 as unknown as Puzzle,
  // gibboanxTest13 as unknown as Puzzle,
  // gibboanxTest14 as unknown as Puzzle,
  // gibboanxTest15 as unknown as Puzzle,
  // gibboanxTest16 as unknown as Puzzle,
  // gibboanxTest17 as unknown as Puzzle,
  // gibboanxTest18 as unknown as Puzzle,
  // gibboanxTest19 as unknown as Puzzle,
        // COMMENTED OUT - Content merged into Best Movie Scenes
  // gibboanxTest20 as unknown as Puzzle,
  // gibboanxTest21 as unknown as Puzzle,
  // gibboanxTest22 as unknown as Puzzle,
  // gibboanxTest23 as unknown as Puzzle,
  // gibboanxTest24 as unknown as Puzzle,
  // gibboanxTest25 as unknown as Puzzle,
  // gibboanxTest26 as unknown as Puzzle,
  // gibboanxTest27 as unknown as Puzzle,
  // gibboanxTest28 as unknown as Puzzle,
  // gibboanxTest29 as unknown as Puzzle,
  // gibboanxTest30 as unknown as Puzzle,
  // gibboanxTest31 as unknown as Puzzle,
  // gibboanxTest32 as unknown as Puzzle,
      gibboanxTest33 as unknown as Puzzle,
      gibboanxTest34 as unknown as Puzzle,
      gibboanxTest35 as unknown as Puzzle,
      gibboanxTest36 as unknown as Puzzle,
      gibboanxTest37 as unknown as Puzzle,
      gibboanxTest38 as unknown as Puzzle,
      gibboanxTest39 as unknown as Puzzle,
      gibboanxTest40 as unknown as Puzzle,
      dateSpoilerReplacementsTest as unknown as Puzzle,
      greatestMusicVideosAllTime as unknown as Puzzle,
      bestMusicVideosRandomized as unknown as Puzzle,
      // Music Video Test Puzzles (Web Scraped - Real YouTube Titles)
      // musicVideoTest1 as unknown as Puzzle,
      // musicVideoTest2 as unknown as Puzzle,
      // musicVideoTest3 as unknown as Puzzle,
      // musicVideoTest4 as unknown as Puzzle,
      // musicVideoTest5 as unknown as Puzzle,
      // musicVideoTest6 as unknown as Puzzle,
      // MUSIC PLAYLIST TEST PUZZLES - CONTENT MERGED INTO greatest-music-videos-all-time-expanded.json
      // musicPlaylistTest1 as unknown as Puzzle,
      // musicPlaylistTest2 as unknown as Puzzle,
      // musicPlaylistTest3 as unknown as Puzzle,
      // musicPlaylistTest4 as unknown as Puzzle,
      // musicPlaylistTest5 as unknown as Puzzle,
      // musicPlaylistTest6 as unknown as Puzzle,
      // musicPlaylistTest7 as unknown as Puzzle,
      // musicPlaylistTest8 as unknown as Puzzle,
      // musicPlaylistTest9 as unknown as Puzzle,
      // musicPlaylistTest10 as unknown as Puzzle,
      // musicPlaylistTest11 as unknown as Puzzle,
      // musicPlaylistTest12 as unknown as Puzzle,
      // musicPlaylistTest13 as unknown as Puzzle,
      // musicPlaylistTest14 as unknown as Puzzle,
      // musicPlaylistTest15 as unknown as Puzzle,
      // musicPlaylistTest16 as unknown as Puzzle,
      // musicPlaylistTest17 as unknown as Puzzle,
      // musicPlaylistTest18 as unknown as Puzzle,
      // musicPlaylistTest19 as unknown as Puzzle,
      // musicPlaylistTest20 as unknown as Puzzle,
];
