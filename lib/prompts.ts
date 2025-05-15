export const SURPRISE_PROMPTS: Record<string, { prompt: string; category: string }> = {
  "Music": {
    category: "Entertainment",
    prompt: `
Generate a list of 20 popular songs that span different decades, genres.  Important: Prioritize variety and randomness. Avoid overly popular or cliché choices. Mix in lesser-known hits and deeper cuts to keep the puzzles surprising and diverse each time. Try not to repeat songs frequently used in common playlists or typical 'greatest hits' compilations.s.
Each entry should be a single song with its official release year — no events, albums, or artist bios.
Respond with only the JSON array of objects like:
[{ "label": "Bohemian Rhapsody – Queen", "date": 1975 }, ...]
Do not include commentary, backstory, or non-song events.
Only use songs that are likely to have Deezer preview clips.
`,

  },
  "Movies/TV": {
    category: "Entertainment",
    prompt: `Choose a specific and compelling topic within the world of Televison or Film — such as a particular genre, franchise, series, major director, major writer, major actors, intellectual property, trends, or historical era.
    One great approach is to pick a single popular show or movie and create a timeline of the key events in the story (If you do this, set \"hideDates\": true).
    Once you've chosen the topic, generate a 10-card Timelines puzzle based on it.`
  },
  "Video Games": {
    category: "Entertainment",
    prompt: `Choose a specific and compelling topic within the world of video games — such as a particular genre, franchise, major developer or publisher, console generation, business model, platform, design trend, intellectual property, or historical era.
    One great approach is to pick a single popular game and create a timeline of the key events in its story or progression. If you do this, set \"hideDates\": true. Be careful to randomize the selection of games, consoles, and studios so we don't get too repetitve (we don't want to keep creating Nintendo puzzles over and over again for example) - We want very high variety in topics
    Once you've chosen the topic, generate a 10-card Timelines puzzle based on it.`,
  },
  "Basketball": {
    category: "Sports",
    prompt:`
    - Choose a compelling topic within the world of Basketball - such as the history of a franchise, championships, 
    stats, or player milestones, very iconic plays (but they have to be truly unique to qualify. "Derrick Rose's Game-Winning Bank", 
    "Curry shakes Steven Adams", "Kyrie's clutch shot over..." are not specific enough for a player to place them). 
    -History of a given franchise or star player is a good one. 
    - Some examples of compelling puzzles: Slam Dunk contest winners, NBA MVPs, Defensive player of the year, Statistical milestones or achievements of star players. Be careful to randomize the selection of players and teams so we don't get too repetitve (we don't want to keep creating Lakers puzzles for example) - We want very high variety in topics. 
    - Be creative with the topics - make unexpected connections and find angles that are surprising and delightful.  
    - Once you've chosen the topic, generate a 10-card Timelines puzzle based on it.`,
  },
  "NFL": {
    category: "Sports",
    prompt: `Choose a compelling topic within the world of the NFL - such as the history of a franchise, championships, 
    stats, or player milestones, very iconic plays (have to be truly unique to qualify. "Aaron Rodgers Hail Mary", 
    "Joe Montana throws game winning TD", etc are not specific enough for a player to place them). History of a given franchise or star 
    player is a good one. Some examples of obviously compelling puzzles: MVPs, record-breakers, Super Bowl winners, statistical milestones 
    or achievements of star players. Be creative with the topics though make surprising connections and find angles that are surprising and compelling. 
    Be careful to randomize the selection of players and teams so we don't get too repetitve (we don't want to keep creating Lakers puzzles for example) - We want very high variety in topics. 
    Once you've chosen the topic, generate a 10-card Timelines puzzle based on it.`,
  },
  "Soccer": {
    category: "Sports",
    prompt: `
    - Choose a compelling topic within the world of the football (soccer) - such as the history of a franchise, championships, 
    stats, World cup, various international leagues, or player milestones, very iconic plays (have to be truly unique to qualify. "Ronaldo's game-winning goal",
    "Messi's dribble", etc are not specific enough for a player to place them). 
    - History of a given franchise or star player is a good one. Some examples of obviously compelling puzzles: record-breakers, Super Bowl winners, statistical milestones 
    or achievements of star players. 
    - Be creative with the topics though make surprising connections and find angles that are surprising and compelling. 
    - Be careful to randomize the selection of players and teams so we don't get too repetitve (we don't want to keep creating Messi, or Liverpool puzzles over and over for example) - We want very high variety in topics. 
    - Once you've chosen the topic, generate a 10-card Timelines puzzle based on it.`,
  },
  "MMA": {
    category: "Sports",
    prompt: `Create 10 cards representing key fights and milestones in MMA history.`,
  },
    "Books": {
    category: "Entertainment",
    prompt: `Create 10 cards representing Books.`,
  }
};
