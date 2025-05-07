// lib/gameData.ts

import nbaEvents from "./nbaEvents.json";
import brazilSoccer from "./brazilSoccer.json";
import horrorFilms from "./horrorFilms.json";
//import inventions from "./inventions.json";
import economicEvents from "./economicEvents.json";
import videoGameMechanics from "./videoGameMechanics.json";
import videoGameReleases from "./videoGameReleases.json";
import paintings from "./paintings.json";
import hitSongs from "./hitSongs.json";

export type EventCard = {
  /** Unique identifier for the card */
  id: string;
  /** Label to display on the card */
  label: string;
  //next 2 are for image puzzles
  title?: string;
  artist?: string;
  /** Numerical year of the event */
  date: number;

  image?: string; // URL for the painting
};

export type Puzzle = {
  /** URL-safe key or slug */
  slug: string;
  /** Subtitle shown under the main title */
  topic: string;
  category: "History" | "Arts" | "Entertainment" | "Sports" | "Current Events";
  /** Full list of candidate cards for this puzzle */
  cards: EventCard[];
  hideDates?: boolean; 
};

export const puzzles: Puzzle[] = [
  {
    slug: "pop-culture",
    topic: "Modern Pop Culture",
    category: "History",
    hideDates: false,
    cards: [
      {
        id: "1900-vogue-first-issue",
        label: "First Vogue fashion issue",
        date: 1900,
      },
      {
        id: "1902-trip-to-coontown",
        label: "Broadway musical 'A Trip to Coontown'",
        date: 1902,
      },
      {
        id: "1903-great-train-robbery",
        label: "The Great Train Robbery (film)",
        date: 1903,
      },
      {
        id: "1905-first-radio-broadcast",
        label: "First experimental public radio broadcast",
        date: 1905,
      },
      {
        id: "1907-les-demoiselles",
        label: "Picasso paints ‘Les Demoiselles d’Avignon’",
        date: 1907,
      },
      {
        id: "1909-jazz-term",
        label: "The term ‘jazz’ first appears in print",
        date: 1909,
      },
      {
        id: "1913-rite-of-spring",
        label: "Stravinsky’s 'Rite of Spring' premiere",
        date: 1913,
      },
      {
        id: "1914-bringing-up-father",
        label: "'Bringing Up Father' comic strip debuts",
        date: 1914,
      },
      {
        id: "1915-chaplin-film-debut",
        label: "Charlie Chaplin’s film debut",
        date: 1915,
      },
      {
        id: "1917-hollywood-shakespeare",
        label: "Hollywood’s first Shakespeare adaptation",
        date: 1917,
      },
      {
        id: "1919-harlem-renaissance",
        label: "Harlem Renaissance begins",
        date: 1919,
      },
      {
        id: "1920-valentino-idol",
        label: "Rudolph Valentino becomes silent film idol",
        date: 1920,
      },
      {
        id: "1922-ulysses-published",
        label: "James Joyce publishes Ulysses",
        date: 1922,
      },
      {
        id: "1923-bbc-radio",
        label: "BBC begins regular radio broadcasts",
        date: 1923,
      },
      {
        id: "1925-gatsby-published",
        label: "Publication of F. Scott Fitzgerald’s The Great Gatsby",
        date: 1925,
      },
      {
        id: "1926-first-tv-demo",
        label: "John Logie Baird’s first TV demonstration",
        date: 1926,
      },
      {
        id: "1927-the-jazz-singer",
        label: "The Jazz Singer: first ‘talkie’ film",
        date: 1927,
      },
      {
        id: "1928-steamboat-willie",
        label: "Steamboat Willie (Mickey Mouse debut)",
        date: 1928,
      },
      {
        id: "1929-crash-great-depression",
        label: "Stock Market Crash, start of Great Depression",
        date: 1929,
      },
      {
        id: "1930-earl-carroll-vanities",
        label: "Broadway revue 'The Earl Carroll Vanities' debuts",
        date: 1930,
      },
      {
        id: "1933-king-kong-premiere",
        label: "King Kong premieres",
        date: 1933,
      },
      {
        id: "1935-dick-tracy-debut",
        label: "Dick Tracy comic strip debuts",
        date: 1935,
      },
      {
        id: "1937-snow-white-premiere",
        label: "Disney’s Snow White and the Seven Dwarfs premieres",
        date: 1937,
      },
      {
        id: "1938-war-of-worlds",
        label: "Orson Welles’ 'War of the Worlds' radio broadcast",
        date: 1938,
      },
      {
        id: "1939-wizard-of-oz",
        label: "The Wizard of Oz premieres",
        date: 1939,
      },
      {
        id: "1940-batman-comics",
        label: "Batman first appears in comics",
        date: 1940,
      },
      {
        id: "1941-looney-tunes",
        label: "Bugs Bunny debuts in 'A Wild Hare'",
        date: 1941,
      },
      {
        id: "1945-gi-bill",
        label: "GI Bill fuels postwar pop culture boom",
        date: 1945,
      },
      {
        id: "1947-red-river",
        label: "Howard Hawks’ 'Red River' defines western genre",
        date: 1947,
      },
      {
        id: "1949-tv-licensing",
        label: "US begins TV licensing—mass audience era begins",
        date: 1949,
      },
      {
        id: "1950-rock-n-roll-term",
        label: "Alan Freed coins term ‘Rock ’n’ Roll’",
        date: 1950,
      },
      { id: "1951-i-love-lucy", label: "I Love Lucy premieres", date: 1951 },
      {
        id: "1953-televised-wrestling",
        label: "Professional wrestling hits television",
        date: 1953,
      },
      {
        id: "1955-honeymooners-debut",
        label: "The Honeymooners sketches debut",
        date: 1955,
      },
      {
        id: "1956-heartbreak-hotel",
        label: "Elvis Presley records 'Heartbreak Hotel'",
        date: 1956,
      },
      {
        id: "1957-sputnik-launch",
        label: "Sputnik launch sparks sci-fi craze",
        date: 1957,
      },
      {
        id: "1958-children-programming",
        label: "Educational children’s programming begins",
        date: 1958,
      },
      {
        id: "1960-james-bond-novel",
        label: "First James Bond novel released",
        date: 1960,
      },
      {
        id: "1962-warhol-soup-cans",
        label: "Andy Warhol’s Campbell’s Soup Cans exhibit",
        date: 1962,
      },
      {
        id: "1964-beatles-sullivan",
        label: "The Beatles on The Ed Sullivan Show",
        date: 1964,
      },
      {
        id: "1966-star-trek-tos",
        label: "Star Trek: The Original Series premieres",
        date: 1966,
      },
      { id: "1969-woodstock", label: "Woodstock Music Festival", date: 1969 },
      {
        id: "1970-mary-tyler-moore",
        label: "The Mary Tyler Moore Show premieres",
        date: 1970,
      },
      {
        id: "1971-all-in-the-family",
        label: "All in the Family premieres",
        date: 1971,
      },
      { id: "1972-mash-premiere", label: "M*A*S*H premieres", date: 1972 },
      {
        id: "1974-punk-rock-emerges",
        label: "Punk Rock emerges in London",
        date: 1974,
      },
      {
        id: "1977-star-wars",
        label: "Star Wars: A New Hope premieres",
        date: 1977,
      },
      { id: "1978-grease-premiere", label: "Grease film release", date: 1978 },
      { id: "1979-snl-debut", label: "Saturday Night Live debuts", date: 1975 },
      {
        id: "1980-empire-strikes",
        label: "The Empire Strikes Back premieres",
        date: 1980,
      },
      { id: "1981-mtv-launch", label: "MTV launches", date: 1981 },
      { id: "1982-cheers-debut", label: "Cheers premieres", date: 1982 },
      {
        id: "1984-ghostbusters",
        label: "Ghostbusters film release",
        date: 1984,
      },
      {
        id: "1987-simpsons-ullman",
        label: "The Simpsons shorts debut on Tracey Ullman",
        date: 1987,
      },
      {
        id: "1989-indiana-jones-3",
        label: "Indiana Jones and the Last Crusade premieres",
        date: 1989,
      },
      { id: "1989-seinfeld", label: "Seinfeld premieres", date: 1989 },
      {
        id: "1990-new-jack-city",
        label: "New Jack City film release",
        date: 1991,
      },
      {
        id: "1991-nevermind",
        label: "Nirvana releases 'Nevermind'",
        date: 1991,
      },
      { id: "1993-ufc-1", label: "UFC 1: The Beginning", date: 1993 },
      { id: "1994-friends-premiere", label: "Friends premieres", date: 1994 },
      { id: "1995-toy-story", label: "Toy Story releases", date: 1995 },
      { id: "1996-spice-girls-form", label: "Spice Girls form", date: 1996 },
      {
        id: "1997-hp1-book",
        label: "Harry Potter and the Philosopher’s Stone (book)",
        date: 1997,
      },
      { id: "1997-titanic-film", label: "Titanic film release", date: 1997 },
      { id: "1999-matrix", label: "The Matrix premieres", date: 1999 },
      {
        id: "2000-survivor-debut",
        label: "Survivor reality show debuts",
        date: 2000,
      },
      {
        id: "2001-lotr-fellowship",
        label: "The Lord of the Rings: The Fellowship premieres",
        date: 2001,
      },
      { id: "2003-facebook-founded", label: "Facebook founded", date: 2004 },
      { id: "2005-youtube-launch", label: "YouTube launches", date: 2005 },
      { id: "2006-nintendo-wii", label: "Nintendo Wii releases", date: 2006 },
      {
        id: "2007-iphone-unveiled",
        label: "Apple unveils the iPhone",
        date: 2007,
      },
      {
        id: "2008-dark-knight",
        label: "The Dark Knight premieres",
        date: 2008,
      },
      { id: "2009-avatar-premiere", label: "Avatar film release", date: 2009 },
      { id: "2010-ipad-launch", label: "iPad launches", date: 2010 },
      {
        id: "2011-got-premiere",
        label: "Game of Thrones premieres",
        date: 2011,
      },
      { id: "2012-avengers", label: "The Avengers premieres", date: 2012 },
      { id: "2013-frozen", label: "Frozen film release", date: 2013 },
      {
        id: "2014-ice-bucket-challenge",
        label: "ALS Ice Bucket Challenge goes viral",
        date: 2014,
      },
      {
        id: "2015-force-awakens",
        label: "Star Wars: The Force Awakens premieres",
        date: 2015,
      },
      { id: "2016-pokemon-go", label: "Pokémon Go launches", date: 2016 },
      {
        id: "2017-wonder-woman",
        label: "Wonder Woman film release",
        date: 2017,
      },
      {
        id: "2018-black-panther",
        label: "Black Panther premieres",
        date: 2018,
      },
      {
        id: "2019-avengers-endgame",
        label: "Avengers: Endgame premieres",
        date: 2019,
      },
      {
        id: "2020-squid-game",
        label: "Netflix releases Squid Game",
        date: 2021,
      },
      { id: "2021-wandavision", label: "WandaVision premieres", date: 2021 },
      // …continue adding up to 150 total entries…
    ],
  },
  // NBA puzzle added here:
  {
    slug: "nba-history",
    topic: "NBA",
    category: "Sports",
    hideDates: false,
    cards: nbaEvents,
  },
  {
    slug: "hit-songs",
    topic: "Hit Songs (1920s–2020s)",
    category: "Entertainment",
    hideDates: false,
    cards: hitSongs,
  },
  {
    slug: "Brazilian-Football",
    topic: "Brazil Football",
    hideDates: false,
    category: "Sports",
    cards: brazilSoccer,
  },
  {
    slug: "horror-films",
    topic: "Horror Films",
    category: "Entertainment",
    hideDates: false,
    cards: horrorFilms,
  },
  {
    slug: "paintings",
    topic: "Paintings",
    category: "Arts",
    hideDates: false,
    cards: paintings, // must be EventCard[]
  },
  {
    slug: "lotr-movies",
    topic: "Lord of the Rings",
    category: "Entertainment",
    hideDates: true,
    cards: [
      {
        id: "bilbo-farewell",
        label: "Bilbo departs the Shire after his 111th birthday",
        date: 1,
      },
      {
        id: "fellowship-departs",
        label: "Fellowship leaves Rivendell",
        date: 2,
      },
      {
        id: "gandalf-falls",
        label: "Gandalf falls in the Mines of Moria",
        date: 3,
      },
      {
        id: "lorien-arrival",
        label: "Fellowship arrives in Lothlórien",
        date: 4,
      },
      { id: "helms-deep", label: "Defense of Helm’s Deep", date: 5 },
      { id: "ents-attack", label: "Ents march on and flood Isengard", date: 6 },
      {
        id: "gollum-betrayal",
        label: "Gollum leads Frodo & Sam toward Shelob’s lair",
        date: 7,
      },
      {
        id: "ring-destroyed",
        label: "One Ring is destroyed in Mount Doom",
        date: 8,
      },
      {
        id: "great-eagles-rescue",
        label: "The Great Eagles rescue Frodo and Sam",
        date: 9,
      },
      {
        id: "aragorn-coronation",
        label: "Aragorn crowned King at Minas Tirith",
        date: 10,
      },
    ],
  },
  {
    slug: "gilmore-girls",
    topic: " Gilmore Girls",
    category: "Entertainment",
    hideDates: true, // don’t show the index numbers for these fictional events
    cards: [
      {
        id: "lorelai-inn-job",
        label: "Lorelai starts working at the Independence Inn",
        date: 1,
      },
      {
        id: "lorelai-runs-away",
        label: "Lorelai runs away to Stars Hollow",
        date: 2,
      },
      {
        id: "first-friday-dinner",
        label: "First Friday night dinner at Luke’s Diner",
        date: 3,
      },
      { id: "rory-meets-dean", label: "Rory meets Dean Forester", date: 4 },
      {
        id: "rory-starts-chilton",
        label: "Rory begins classes at Chilton Academy",
        date: 5,
      },
      {
        id: "jess-comes-to-town",
        label: "Jess Mariano arrives in Stars Hollow",
        date: 6,
      },
      {
        id: "rory-kisses-jess",
        label: "Rory shares her first kiss with Jess Mariano",
        date: 7,
      },
      {
        id: "luke-lorelai-first-kiss",
        label: "Lorelai and Luke share their first on-screen kiss",
        date: 8,
      },
      {
        id: "rory-valedictorian",
        label: "Rory is named valedictorian of Chilton Academy",
        date: 9,
      },
      {
        id: "dragonfly-inn-opens",
        label: "Lorelai and Sookie open the Dragonfly Inn",
        date: 10,
      },
    ],
  },
  {
    slug: "kingkiller-chronicles",
    topic: "The Kingkiller Chronicles",
    category: "Entertainment",
    hideDates: true,
    cards: [
      {
        id: "meets-abenthy",
        label: "Kvothe meets Abenthy and learns Sympathy",
        date: 1,
      },
      {
        id: "wedding-chandrian",
        label: "Kvothe witnesses the Chandrian at his troupe’s wedding",
        date: 2,
      },
      {
        id: "university-arrival",
        label: "Kvothe arrives at the University",
        date: 3,
      },
      {
        id: "first-sympathy",
        label: "Kvothe masters his first Sympathy lesson",
        date: 4,
      },
      {
        id: "eolian-silver",
        label: "Kvothe wins his first silver at the Eolian",
        date: 5,
      },
      {
        id: "eolian-pipes",
        label: "Kvothe earns a pair of silver talent pipes at the Eolian",
        date: 6,
      },
      {
        id: "ambrose-duel",
        label: "Kvothe duels Ambrose and is suspended",
        date: 7,
      },
      {
        id: "draccus-fight",
        label: "Kvothe battles the drugged draccus in Trebon",
        date: 8,
      },
      {
        id: "meets-felurian",
        label: "Kvothe meets Felurian and enters the Fae realm",
        date: 9,
      },
      {
        id: "calls-name",
        label: "Kvothe calls the true name of the wind",
        date: 10,
      },
    ],
  },
  {
    slug: "back-to-the-future",
    topic: " Back to the Future",
    category: "Entertainment",
    hideDates: true,
    cards: [
      {
        id: "flux-capacitor",
        label: "Doc invents the Flux Capacitor",
        date: 1,
      },
      {
        id: "einstein-test",
        label: "Doc tests time travel by sending Einstein one minute ahead",
        date: 2,
      },
      {
        id: "marty-time-jump",
        label: "Doc gets shot by the Libyan Terrorists",
        date: 3,
      },
      {
        id: "marty-time-jump",
        label: "Marty accidentally travels to 1955",
        date: 4,
      },
      {
        id: "meets-young-parents",
        label: "Marty meets young George McFly and young Lorraine",
        date: 5,
      },
      {
        id: "enchantment-dance",
        label: "Marty performs at the ‘Enchantment Under the Sea’ dance",
        date: 6,
      },
      {
        id: "returns-1985",
        label: "Marty returns to 1985 just as the clock tower strikes",
        date: 7,
      },
      {
        id: "doc-2015-visit",
        label: "Doc appears in a flying DeLorean from 2015",
        date: 8,
      },
      {
        id: "journey-1885",
        label: "Marty and Doc journey to 1885 to rescue Doc Brown",
        date: 9,
      },
      {
        id: "final-return-1985",
        label: "Marty returns to a restored 1985 in the repaired DeLorean",
        date: 10,
      },
    ],
  },
  {
    slug: "lively-baldoni",
    topic: "Lively vs Baldoni",
    category: "Current Events",
    hideDates: false,
    cards: [
      {
        id: "casting-announced",
        label: "Blake Lively & Justin Baldoni cast in It Ends With Us",
        date: 1,
      },
      {
        id: "filming-pauses",
        label: "Production halts amid the writers’ strike",
        date: 2,
      },
      {
        id: "cryptic-post",
        label: "Lively shares a cryptic Instagram post on respect & consent",
        date: 3,
      },
      {
        id: "baldoni-denies",
        label: "Baldoni publicly denies all allegations",
        date: 4,
      },
      {
        id: "filming-resumes",
        label: "Filming quietly resumes under new protocols",
        date: 5,
      },
      {
        id: "lively-complaint",
        label: "Lively files a formal harassment complaint",
        date: 6,
      },
      {
        id: "agency-drops",
        label: "Baldoni is dropped by his longtime talent agency",
        date: 7,
      },
      {
        id: "baldoni-sues-nyt",
        label: "Baldoni sues The New York Times for defamation",
        date: 8,
      },
      {
        id: "settlement-rumors",
        label: "Rumors surface of confidential settlement talks",
        date: 9,
      },
      {
        id: "judge-ruling",
        label: "Judge grants partial dismissal reshaping the case",
        date: 10,
      },
    ],
  },
  {
    slug: "harry‐potter‐timeline",
    topic: "Harry Potter",
    category: "Entertainment",
    hideDates: true,
    cards: [
      { id: "hp1-harry-born", label: "Harry’s birth", date: 1 },
      {
        id: "hp2-voldemort-downfall",
        label: "Voldemort’s first downfall",
        date: 2,
      },
      { id: "hp3-letter-arrives", label: "Hogwarts letter arrives", date: 3 },
      { id: "hp4-meeting-hagrid", label: "Harry meets Hagrid", date: 4 },
      { id: "hp5-diagon-alley", label: "First Diagon Alley visit", date: 5 },
      { id: "hp6-sorting-ceremony", label: "Sorting Hat ceremony", date: 6 },
      { id: "hp7-first-potions", label: "First Potions class", date: 7 },
      {
        id: "hp8-first-quidditch",
        label: "First Quidditch match win",
        date: 8,
      },
      {
        id: "hp9-mirror-of-erised",
        label: "Mirror of Erised discovered",
        date: 9,
      },
      {
        id: "hp10-philosophers-stone-chamber",
        label: "Philosopher’s Stone chamber",
        date: 10,
      },
      { id: "hp11-dobby-appears", label: "Dobby’s first appearance", date: 11 },
      {
        id: "hp12-norris-petrified",
        label: "Mrs. Norris is petrified",
        date: 12,
      },
      {
        id: "hp13-basilisk-defeated",
        label: "The Basilisk is defeated",
        date: 13,
      },
      {
        id: "hp14-dementor-attack",
        label: "Dementor attack by the lake",
        date: 14,
      },
      {
        id: "hp15-patronus-charm",
        label: "Harry casts the Patronus charm to defeat Dementors",
        date: 15,
      },
      {
        id: "hp16-sirius-revealed",
        label: "Sirius Black is revealed",
        date: 16,
      },
      {
        id: "hp17-time-turner-rescue",
        label: "Time-Turner rescue at Hogwarts",
        date: 17,
      },
      {
        id: "hp18-triwizard-tournament",
        label: "Triwizard Tournament begins",
        date: 18,
      },
      {
        id: "hp19-first-task",
        label: "Triwizard First task: facing the dragon",
        date: 19,
      },
      {
        id: "hp20-second-task",
        label: "Triwizard Second task: rescuing under the lake",
        date: 20,
      },
      {
        id: "hp21-third-task",
        label: "Triwizard Third task: navigating the maze",
        date: 21,
      },
      { id: "hp22-cedric-death", label: "Cedric Diggory’s death", date: 22 },
      {
        id: "hp23-umbridge-arrives",
        label: "Dolores Umbridge takes over Hogwarts",
        date: 23,
      },
      {
        id: "hp24-dumbledores-army",
        label: "Formation of Dumbledore’s Army",
        date: 24,
      },
      {
        id: "hp25-ministry-battle",
        label: "Battle at the Ministry of Magic",
        date: 25,
      },
      {
        id: "hp26-hbp-book-found",
        label: "Half-Blood Prince’s potion book discovered",
        date: 26,
      },
      {
        id: "hp27-slughorn-horcrux-memory",
        label: "Slughorn’s Horcrux memory obtained",
        date: 27,
      },
      {
        id: "hp28-dumbledore-death",
        label: "Death of Albus Dumbledore",
        date: 28,
      },
      {
        id: "hp29-horcrux-hunt",
        label: "Harry’s Horcrux hunt begins",
        date: 29,
      },
      {
        id: "hp30-godrics-hollow",
        label: "Return to Godric’s Hollow",
        date: 30,
      },
      {
        id: "hp31-gringotts-break-in",
        label: "Gringotts vault break-in",
        date: 31,
      },
      {
        id: "hp32-flight-seven-potters",
        label: "Flight of the Seven Potters",
        date: 32,
      },
      {
        id: "hp33-infiltration-hogwarts",
        label: "Death Eater infiltration at Hogwarts",
        date: 33,
      },
      {
        id: "hp34-snape-memories",
        label: "Reveal of Snape’s memories",
        date: 34,
      },
      { id: "hp35-battle-of-hogwarts", label: "Battle of Hogwarts", date: 35 },
      {
        id: "hp36-voldemort-defeated",
        label: "The final defeat of Voldemort",
        date: 36,
      },
      {
        id: "hp37-hogwarts-rebuilt",
        label: "Rebuilding of Hogwarts begins",
        date: 37,
      },
      {
        id: "hp38-epilogue-king-s-cross",
        label: "Epilogue at King’s Cross",
        date: 38,
      },
      {
        id: "hp39-next-generation",
        label: "Next generation boards the train",
        date: 39,
      },
      {
        id: "hp40-wizarding-world-restored",
        label: "Peace returns to the wizarding world",
        date: 40,
      },
    ],
  },

  {
    slug: "true-crime",
    topic: "True Crime",
    category: "History",
    cards: [
      {
        id: "1888-jack-the-ripper",
        label: "Jack the Ripper murders",
        date: 1888,
      },
      {
        id: "1929-valentines-massacre",
        label: "St. Valentine’s Day Massacre",
        date: 1929,
      },
      {
        id: "1932-lindbergh-kidnapping",
        label: "Lindbergh baby kidnapping",
        date: 1932,
      },
      {
        id: "1934-bonnie-and-clyde",
        label: "Death of Bonnie and Clyde",
        date: 1934,
      },
      { id: "1947-black-dahlia", label: "Black Dahlia murder", date: 1947 },
      { id: "1955-emmett-till", label: "Lynching of Emmett Till", date: 1955 },
      {
        id: "1963-jfk-assassination",
        label: "Assassination of President Kennedy",
        date: 1963,
      },
      {
        id: "1969-zodiac-begins",
        label: "Zodiac killer’s first confirmed murder",
        date: 1969,
      },
      {
        id: "1976-son-of-sam-begins",
        label: "Son of Sam murders begin",
        date: 1976,
      },
      {
        id: "1978-son-of-sam-arrest",
        label: "David Berkowitz (‘Son of Sam’) arrested",
        date: 1978,
      },
      {
        id: "1978-jonestown-massacre",
        label: "Jonestown mass suicide–murder",
        date: 1978,
      },
      {
        id: "1982-tylenol-murders",
        label: "Chicago Tylenol poisonings",
        date: 1982,
      },
      {
        id: "1989-central-park-jogger",
        label: "Central Park jogger assault",
        date: 1989,
      },
      {
        id: "1991-jeffrey-dahmer",
        label: "Jeffrey Dahmer arrested",
        date: 1991,
      },
      {
        id: "1994-menendez-brothers",
        label: "Menendez brothers murder parents",
        date: 1994,
      },
      {
        id: "1995-oj-simpson-trial",
        label: "O. J. Simpson murder trial begins",
        date: 1995,
      },
      {
        id: "1996-unabomber-arrest",
        label: "Ted Kaczynski (‘Unabomber’) arrested",
        date: 1996,
      },
      {
        id: "1996-olympic-park-bombing",
        label: "Atlanta Olympic Park bombing",
        date: 1996,
      },
      {
        id: "1997-heavens-gate",
        label: "Heaven’s Gate cult mass suicide",
        date: 1997,
      },
      {
        id: "1999-columbine-massacre",
        label: "Columbine High School massacre",
        date: 1999,
      },
      {
        id: "2001-911-attacks",
        label: "September 11 terrorist attacks",
        date: 2001,
      },
      {
        id: "2001-anthrax-attacks",
        label: "U.S. anthrax letter attacks",
        date: 2001,
      },
      {
        id: "2002-elizabeth-smart-kidnapping",
        label: "Elizabeth Smart kidnapped",
        date: 2002,
      },
      { id: "2002-2003-dc-sniper", label: "DC sniper shootings", date: 2002 },
      {
        id: "2003-dc-sniper-arrest",
        label: "DC sniper suspects arrested",
        date: 2003,
      },
      {
        id: "2004-scott-peterson",
        label: "Scott Peterson convicted",
        date: 2004,
      },
      {
        id: "2005-andrea-yates",
        label: "Andrea Yates drowns her children",
        date: 2005,
      },
      {
        id: "2006-btk-arrested",
        label: "Dennis Rader (‘BTK Killer’) arrested",
        date: 2006,
      },
      {
        id: "2008-casey-anthony-arrest",
        label: "Casey Anthony arrested",
        date: 2008,
      },
      {
        id: "2009-ariarc-kidnappings-found",
        label: "Cleveland captives rescued (Ariel Castro kidnappings)",
        date: 2009,
      },
      {
        id: "2011-casey-anthony-trial",
        label: "Casey Anthony murder trial",
        date: 2011,
      },
      {
        id: "2012-aurora-shooting",
        label: "Aurora movie theater shooting",
        date: 2012,
      },
      {
        id: "2013-castro-charged",
        label: "Ariel Castro indicted for kidnappings",
        date: 2013,
      },
      {
        id: "2013-boston-bombing",
        label: "Boston Marathon bombing",
        date: 2013,
      },
      {
        id: "2015-dylann-roof",
        label: "Charleston church shooting by Dylann Roof",
        date: 2015,
      },
      {
        id: "2016-el-chapo-recaptured",
        label: "‘El Chapo’ Guzmán recaptured by Mexican authorities",
        date: 2016,
      },
      {
        id: "2016-pulse-nightclub",
        label: "Orlando Pulse nightclub massacre",
        date: 2016,
      },
      {
        id: "2017-las-vegas-shooting",
        label: "Las Vegas Strip mass shooting",
        date: 2017,
      },
      {
        id: "2018-epstein-arrested",
        label: "Jeffrey Epstein arrested on sex‐trafficking charges",
        date: 2018,
      },
      {
        id: "2018-jayme-closs",
        label: "Jayme Closs escapes her kidnapper",
        date: 2018,
      },
      {
        id: "2019-weinstein-convicted",
        label: "Harvey Weinstein convicted of sexual assault",
        date: 2019,
      },
      { id: "2020-george-floyd", label: "Murder of George Floyd", date: 2020 },
      {
        id: "2021-gabby-petito",
        label: "Gabby Petito’s disappearance and murder",
        date: 2021,
      },
      {
        id: "2021-capitol-attack",
        label: "U.S. Capitol riot on Jan 6",
        date: 2021,
      },
      {
        id: "2022-chicago-torture-video",
        label: "Viral Chicago torture video",
        date: 2022,
      },
      {
        id: "2023-tyre-nichols",
        label: "Death of Tyre Nichols in Memphis",
        date: 2023,
      },
    ],
  },
  {
    slug: "cold-war",
    topic: "Cold War",
    category: "History",
    cards: [
      {
        id: "1947-truman-doctrine",
        label: "Truman Doctrine declares global containment",
        date: 1947,
      },
      {
        id: "1947-cominform-formed",
        label: "Cominform established to coordinate communist states",
        date: 1947,
      },
      {
        id: "1948-marshall-plan",
        label: "Marshall Plan rolls out massive European aid",
        date: 1948,
      },
      {
        id: "1948-berlin-blockade",
        label: "Soviets blockade West Berlin, Allies launch airlift",
        date: 1948,
      },
      {
        id: "1949-nato-formed",
        label: "NATO founded as Western military alliance",
        date: 1949,
      },
      {
        id: "1949-communist-china",
        label: "People’s Republic established after civil war",
        date: 1949,
      },
      {
        id: "1950-korean-war-begins",
        label: "North Korea invades South—Korean War erupts",
        date: 1950,
      },
      {
        id: "1953-stalin-dies",
        label: "Death of Stalin sparks brief thaw in tensions",
        date: 1953,
      },
      {
        id: "1955-warsaw-pact",
        label: "Warsaw Pact formed in response to NATO",
        date: 1955,
      },
      {
        id: "1956-hungarian-uprising",
        label: "Hungary’s revolt crushed by Soviet tanks",
        date: 1956,
      },
      {
        id: "1957-sputnik-launch",
        label: "USSR launches Sputnik—space race ignites",
        date: 1957,
      },
      {
        id: "1960-u2-incident",
        label: "U-2 spy plane shot down, Summit collapses",
        date: 1960,
      },
      {
        id: "1961-berlin-wall-erected",
        label: "East Germans build Berlin Wall overnight",
        date: 1961,
      },
      {
        id: "1961-bay-of-pigs",
        label: "CIA-backed Bay of Pigs invasion ends in failure",
        date: 1961,
      },
      {
        id: "1962-cuban-missile-crisis",
        label: "13-day Cuban Missile Crisis brings superpowers to brink",
        date: 1962,
      },
      {
        id: "1963-hotline-established",
        label: "Moscow–Washington hotline set up after JFK assassination",
        date: 1963,
      },
      {
        id: "1964-gulf-of-tonkin",
        label: "Gulf of Tonkin incident escalates Vietnam conflict",
        date: 1964,
      },
      {
        id: "1965-vietnam-escalation",
        label: "U.S. combat troops deploy—Vietnam War intensifies",
        date: 1965,
      },
      {
        id: "1968-prague-spring",
        label: "Prague Spring ends under Soviet invasion",
        date: 1968,
      },
      {
        id: "1972-salt-i-signed",
        label: "SALT I limits nuclear arms—historic détente step",
        date: 1972,
      },
      {
        id: "1972-nixon-visits-china",
        label: "Nixon’s China visit reorders Cold War alliances",
        date: 1972,
      },
      {
        id: "1973-vietnam-peace-accords",
        label: "Paris Accords provide U.S. troop withdrawal plan",
        date: 1973,
      },
      {
        id: "1975-helsinki-accords",
        label: "Helsinki Accords bind East and West on human rights",
        date: 1975,
      },
      {
        id: "1979-soviet-afghanistan",
        label: "Soviets invade Afghanistan—new Cold War front opens",
        date: 1979,
      },
      {
        id: "1980-solidarity-poland",
        label: "Solidarity movement challenges Soviet regime in Poland",
        date: 1980,
      },
      {
        id: "1983-reagan-evil-empire",
        label: "Reagan labels USSR the 'Evil Empire'",
        date: 1983,
      },
      {
        id: "1985-gorbachev-rise",
        label: "Gorbachev becomes leader, launches glasnost & perestroika",
        date: 1985,
      },
      {
        id: "1987-inf-treaty",
        label: "INF Treaty eliminates an entire class of missiles",
        date: 1987,
      },
      {
        id: "1989-berlin-wall-falls",
        label: "Berlin Wall falls—symbolic end to Iron Curtain",
        date: 1989,
      },
      {
        id: "1991-ussr-dissolution",
        label: "Soviet Union dissolves, Cold War officially ends",
        date: 1991,
      },
    ],
  },
  {
    slug: "test-simple-dates",
    topic: "Simple Test",
    category: "Current Events",
    hideDates: false,
    cards: [
      { id: "a", label: "First event", date: 1 },
      { id: "b", label: "Second event", date: 2 },
      { id: "c", label: "Third event", date: 3 },
      { id: "d", label: "Fourth event", date: 4 },
      { id: "e", label: "Fifth event", date: 5 },
    ],
  },
  {
    slug: "test-simple-dates-2",
    topic: "Simple Test 2",
    category: "Current Events",
    hideDates: false,
    cards: [
      { id: "a", label: "First event", date: 1 },
      { id: "b", label: "Second event", date: 2 },
      { id: "c", label: "Third event", date: 3 },
      { id: "d", label: "Fourth event", date: 4 },
      { id: "e", label: "Fifth event", date: 5 },
    ],
  },
  { 
  "slug": "inventions",
  "topic": "Major Inventions (Past 2000 Years)",
  "category": "History",
  "hideDates": false,
  cards: [
    { "id": "0105-paper-making",            "label": "Papermaking in China",                                   "date": 105 },
    { "id": "0750-block-printing",          "label": "Woodblock printing invented",                            "date": 750 },
    { "id": "1040-magnetic-compass",        "label": "Magnetic compass for navigation",                        "date": 1040 },
    { "id": "1286-eyeglasses",              "label": "First wearable eyeglasses",                              "date": 1286 },
    { "id": "1340-gunpowder-weapons",       "label": "Gunpowder used in firearm development",                   "date": 1340 },
    { "id": "1440-printing-press",         "label": "Gutenberg’s movable-type printing press",                 "date": 1440 },
    { "id": "1590-compound-microscope",     "label": "Compound microscope invented",                           "date": 1590 },
    { "id": "1593-mercury-thermometer",     "label": "Mercury thermometer developed",                          "date": 1593 },
    { "id": "1642-mechanical-calculator",   "label": "Pascal’s mechanical calculator",                         "date": 1642 },
    { "id": "1643-mercury-barometer",       "label": "Torricelli’s mercury barometer",                         "date": 1643 },
    { "id": "1675-refracting-telescope",    "label": "Huygens’s improved refracting telescope",                 "date": 1675 },
    { "id": "1698-steam-engine",            "label": "Newcomen steam engine prototype",                        "date": 1698 },
    { "id": "1748-refrigeration",           "label": "First artificial refrigeration system",                  "date": 1748 },
    { "id": "1764-spinning-jenny",          "label": "Hargreaves’s Spinning Jenny revolutionizes textiles",     "date": 1764 },
    { "id": "1781-steam-locomotive",        "label": "First full-scale steam locomotive",                      "date": 1804 },
    { "id": "1800-voltaic-battery",         "label": "Volta’s voltaic pile (first battery)",                   "date": 1800 },
    { "id": "1807-steamboat",               "label": "Fulton’s commercial steamboat",                          "date": 1807 },
    { "id": "1825-railway",                 "label": "First steam-powered passenger railway",                  "date": 1825 },
    { "id": "1836-revolver",                "label": "Colt’s mass-produced revolver",                          "date": 1836 },
    { "id": "1837-telegraph",               "label": "Morse’s electric telegraph system",                      "date": 1837 },
    { "id": "1876-telephone",               "label": "Bell’s telephone transmission",                          "date": 1876 },
    { "id": "1879-incandescent-lightbulb",  "label": "Edison’s practical incandescent lightbulb",               "date": 1879 },
    { "id": "1886-automobile",              "label": "Benz’s first gasoline-powered automobile",                "date": 1886 },
    { "id": "1895-wireless-telegraphy",     "label": "Marconi’s wireless radio signal",                         "date": 1895 },
    { "id": "1903-airplane",                "label": "Wright brothers’ first powered flight",                  "date": 1903 },
    { "id": "1908-model-t",                 "label": "Ford Model T makes cars accessible",                     "date": 1908 },
    { "id": "1913-assembly-line",           "label": "Ford’s moving assembly line",                            "date": 1913 },
    { "id": "1928-penicillin",              "label": "Fleming discovers penicillin antibiotic",                 "date": 1928 },
    { "id": "1935-radar",                   "label": "Radar technology for detection",                         "date": 1935 },
    { "id": "1937-helicopter",              "label": "First successful helicopter flight",                     "date": 1939 },
    { "id": "1938-photocopier",             "label": "First xerographic photocopier",                          "date": 1938 },
    { "id": "1942-nuclear-reactor",         "label": "First controlled nuclear chain reaction",                "date": 1942 },
    { "id": "1947-microwave-oven",          "label": "First commercial microwave oven",                        "date": 1947 },
    { "id": "1947-transistor",              "label": "Invention of the transistor",                            "date": 1947 },
    { "id": "1954-solar-cell",              "label": "First practical silicon solar cell",                     "date": 1954 },
    { "id": "1958-integrated-circuit",      "label": "Kilby & Noyce’s integrated circuit",                     "date": 1958 },
    { "id": "1960-laser",                   "label": "First working laser demonstration",                      "date": 1960 },
    { "id": "1965-communications-satellite", "label": "Launch of first commercial communications satellite",     "date": 1965 },
    { "id": "1969-arpanet",                 "label": "ARPANET sends its first message—Internet precursor",       "date": 1969 },
    { "id": "1971-microprocessor",          "label": "Intel’s 4004 microprocessor debuts",                     "date": 1971 },
    { "id": "1973-mobile-phone",            "label": "Motorola’s first handheld mobile phone",                 "date": 1973 },
    { "id": "1975-personal-computer",       "label": "Altair 8800 ignites personal computer revolution",        "date": 1975 },
    { "id": "1978-gps-satellite",           "label": "First operational GPS satellite launched",               "date": 1978 },
    { "id": "1983-pcr",                     "label": "PCR amplifies DNA, transforming biology",                 "date": 1983 },
    { "id": "1983-3d-printing",             "label": "Chuck Hull’s stereolithography (3D printing)",           "date": 1983 },
    { "id": "1982-compact-disk",            "label": "CD format standardizes digital audio",                   "date": 1982 },
    { "id": "1985-x86-architecture",        "label": "Intel’s x86 microarchitecture launches PC boom",         "date": 1985 },
    { "id": "1989-world-wide-web",          "label": "Tim Berners-Lee unveils the World Wide Web",             "date": 1989 },
    { "id": "1991-gps-civilians",           "label": "GPS opened for civilian use",                            "date": 1995 },
    { "id": "1994-smartphone-prototype",    "label": "IBM Simon combines phone and PDA",                       "date": 1994 },
    { "id": "1995-e-commerce",              "label": "Amazon launches, kicking off e-commerce era",            "date": 1995 },
    { "id": "1995-voip",                    "label": "First VoIP call demonstrates internet telephony",        "date": 1995 },
    { "id": "1997-dvd",                     "label": "DVD format replaces VHS for home video",                 "date": 1997 },
    { "id": "1999-wifi-80211b",             "label": "802.11b Wi-Fi standard released",                        "date": 1999 },
    { "id": "2001-iphone-announcement",     "label": "First iPhone announced, redefining smartphones",         "date": 2007 },
    { "id": "2004-facebook",                "label": "Launch of Facebook—social media goes mainstream",        "date": 2004 },
    { "id": "2005-youtube",                 "label": "YouTube launches—democratizing video sharing",           "date": 2005 },
    { "id": "2007-android-os",              "label": "Android mobile OS unveiled",                             "date": 2007 },
    { "id": "2008-blockchain",              "label": "Bitcoin whitepaper introduces blockchain idea",          "date": 2008 },
    { "id": "2010-ipad",                    "label": "iPad popularizes the modern tablet",                     "date": 2010 },
    { "id": "2012-crispr",                  "label": "CRISPR-Cas9 gene-editing revolution begins",             "date": 2012 },
    { "id": "2014-pokemon-go",              "label": "Pokémon GO brings AR to the masses",                     "date": 2016 },
    { "id": "2014-self-driving-car",        "label": "Autonomous vehicle prototypes hit public roads",         "date": 2014 },
    { "id": "2015-voice-assistants",        "label": "Amazon Alexa launches AI-powered voice assistant",        "date": 2015 },
    { "id": "2016-ai-alpha-go",             "label": "AlphaGo’s victory showcases AI’s new frontier",          "date": 2016 },
    { "id": "2018-5g-rollout",              "label": "5G networks begin global deployment",                   "date": 2019 },
    { "id": "2019-quantum-supremacy",       "label": "Google claims quantum supremacy milestone",              "date": 2019 },
    { "id": "2020-covid-mrna-vaccine",      "label": "First mRNA COVID-19 vaccines authorized",               "date": 2020 },
    { "id": "2020-gpt3",                    "label": "GPT-3 demonstrates human-like language AI",              "date": 2020 },
    { "id": "2021-private-spaceflight",     "label": "Crewed private spacecraft reach orbit",                 "date": 2021 },
    { "id": "2021-foldable-phones",         "label": "Foldable smartphones hit consumer markets",             "date": 2023 },
    { "id": "2022-ai-image-generation",     "label": "AI art tools like DALL·E 2 redefine digital creativity",  "date": 2022 },
    { "id": "2023-quantum-internet-demo",   "label": "First prototype quantum internet transmission",          "date": 2023 },
    { "id": "2024-ambient-computing",       "label": "Smart environments begin ambient computing rollout",     "date": 2024 }
  ]},
  {
    slug: "diddy-life-career",
    topic: "Diddy: Life, Career & Controversy",
    category: "Entertainment",
    hideDates: false,
    cards: [
      {
        id: "uptown-intern",
        label: "Interns at Uptown Records under Andre Harrell",
        date: 1990,
      },
      {
        id: "fired-uptown",
        label: "Fired from Uptown Records, founds Bad Boy Entertainment",
        date: 1993,
      },
      {
        id: "biggie-signed",
        label: "Signs The Notorious B.I.G. to Bad Boy",
        date: 1993,
      },
      {
        id: "crazy-remix-era",
        label: "Dominates airwaves with Bad Boy remix hits",
        date: 1995,
      },
      {
        id: "biggie-death",
        label: "Biggie is killed in Los Angeles; Diddy releases tribute",
        date: 1997,
      },
      {
        id: "ill-be-missing",
        label: 'Releases "I\'ll Be Missing You" – a No. 1 global hit',
        date: 1997,
      },
      {
        id: "grammy-win",
        label: "Wins Grammy for Best Rap Album for *No Way Out*",
        date: 1998,
      },
      {
        id: "jlo-nightclub",
        label: "Arrested after nightclub shooting with Jennifer Lopez",
        date: 1999,
      },
      {
        id: "not-guilty",
        label: "Found not guilty on all charges in weapons trial",
        date: 2001,
      },
      {
        id: "mtv-making-band",
        label: "Launches *Making the Band* reality show on MTV",
        date: 2002,
      },
      {
        id: "votes-or-die",
        label: "Creates 'Vote or Die!' campaign for youth voting",
        date: 2004,
      },
      {
        id: "name-diddy",
        label: "Officially changes name to Diddy",
        date: 2005,
      },
      {
        id: "ciroc-deal",
        label: "Partners with Cîroc Vodka, eventually owns half the brand",
        date: 2007,
      },
      {
        id: "beats-rivalry",
        label: "Competes with Beats by Dre with his brand 'Diddybeats'",
        date: 2009,
      },
      {
        id: "forbes-top",
        label: "Tops Forbes' list of highest-paid entertainers",
        date: 2017,
      },
      {
        id: "cassie-lawsuit",
        label: "Singer Cassie files explosive civil lawsuit against Diddy",
        date: 2023,
      },
      {
        id: "lawsuit-settled",
        label: "Cassie lawsuit settled within 24 hours",
        date: 2023,
      },
      {
        id: "feds-raid",
        label: "Federal agents raid Diddy’s homes in LA and Miami",
        date: 2024,
      },
      {
        id: "lawsuits-pile",
        label: "Multiple sexual assault lawsuits filed against Diddy",
        date: 2024,
      },
      {
        id: "silence-public",
        label: "Diddy remains largely silent in public amid growing scandal",
        date: 2024,
      },
    ],
  },

  //inventions,
  economicEvents,
  videoGameMechanics,
  videoGameReleases,
];
