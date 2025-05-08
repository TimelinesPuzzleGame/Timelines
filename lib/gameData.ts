import type { Puzzle } from "./types"; // assuming you defined Puzzle and EventCard types in a separate file
import inventions from "./inventions.json" assert { type: "json" };
import economicEvents from "./economicEvents.json" assert { type: "json" };
import videoGameMechanics from "./videoGameMechanics.json" assert { type: "json" };
import videoGameReleases from "./videoGameReleases.json" assert { type: "json" };
import paintings from "./paintings.json" assert { type: "json" };
import hitSongs from "./hitSongs.json" assert { type: "json" };
import nbaEvents from "./nbaEvents.json" assert { type: "json" };
import brazilSoccer from "./brazilSoccer.json" assert { type: "json" };
import horrorFilms from "./horrorFilms.json" assert { type: "json" };
import popCulture from "./popCulture.json" assert { type: "json" };
import backToTheFuture from "./backToTheFuture.json" assert { type: "json" };
import harryPotter from "./harryPotter.json" assert { type: "json" };
import lotrMovies from "./lotrMovies.json" assert { type: "json" };
import kingkillerChronicles from "./kingkillerChronicles.json" assert { type: "json" };
import livelyBaldoni from "./livelyBaldoni.json" assert { type: "json" };
import trueCrime from "./trueCrime.json" assert { type: "json" };
import coldWar from "./coldWar.json" assert { type: "json" };
import diddyLifeCareer from "./diddyLifeCareer.json" assert { type: "json" };


export const puzzles: Puzzle[] = [
  popCulture,
  nbaEvents,
  hitSongs,
  brazilSoccer,
  horrorFilms,
  paintings,
  lotrMovies,
  kingkillerChronicles,
  backToTheFuture,
  livelyBaldoni,
  harryPotter,
  trueCrime,
  coldWar,
  inventions,
  economicEvents,
  videoGameMechanics,
  videoGameReleases,
  diddyLifeCareer,
];
