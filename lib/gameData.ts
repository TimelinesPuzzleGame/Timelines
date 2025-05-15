import type { Puzzle } from "./types"; // assuming you defined Puzzle and EventCard types in a separate file
import inventions from "./puzzles/inventions.json" assert { type: "json" };
import economicEvents from "./puzzles/economicEvents.json" assert { type: "json" };
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
import history_of_switzerland_1747330039109 from './puzzles/history-of-switzerland-1747330039109.json';
// END IMPORTS

export const puzzles: Puzzle[] = [
  popCulture as Puzzle,
  nbaEvents as Puzzle,
  hitSongs as Puzzle,
  brazilSoccer as Puzzle,
  coldWar as Puzzle,    
  horrorFilms as Puzzle,
  inventions as Puzzle,
  paintings as Puzzle,
  economicEvents as Puzzle,
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
  hitSongsWithDeezerPreviews as Puzzle,
  hipHopHistory as Puzzle,
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
    songs_aerosmith_1747273075637 as Puzzle,
    nba_draft_classes_1747280660045 as Puzzle,
    songs_rap_diss_tracks_1747282327137 as Puzzle,
    rising_suns_1747329855335 as Puzzle,
    history_of_switzerland_1747330039109 as Puzzle,
  // END EXPORTS
];
