const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

const songs = [
  ["Rapper's Delight – The Sugarhill Gang", 1979],
  ["The Breaks – Kurtis Blow", 1980],
  ["Planet Rock – Afrika Bambaataa", 1982],
  ["It's Like That – Run-D.M.C.", 1983],
  ["Rock Box – Run-D.M.C.", 1984],
  ["La Di Da Di – Slick Rick & Doug E. Fresh", 1985],
  ["Eric B. Is President – Eric B. & Rakim", 1986],
  ["Paul Revere – Beastie Boys", 1986],
  ["Push It – Salt-N-Pepa", 1987],
  ["My Philosophy – Boogie Down Productions", 1988],
  ["Fight The Power – Public Enemy", 1990],
  ["Check the Rhime – A Tribe Called Quest", 1991],
  ["Nuthin' But a 'G' Thang – Dr. Dre", 1992],
  ["C.R.E.A.M. – Wu-Tang Clan", 1993],
  ["Juicy – The Notorious B.I.G.", 1994],
  ["Shook Ones Pt. II – Mobb Deep", 1995],
  ["California Love – 2Pac & Dr. Dre", 1995],
  ["Put It On – Big L", 1995],
  ["The Rain (Supa Dupa Fly) – Missy Elliott", 1997],
  ["Hard Knock Life – Jay-Z", 1998],
  ["My Name Is – Eminem", 1999],
  ["Ms. Jackson – Outkast", 2000],
  ["Forgot About Dre – Dr. Dre ft. Eminem", 2000],
  ["Stan – Eminem", 2000],
  ["Hot in Herre – Nelly", 2002],
  ["Grindin' – Clipse", 2002],
  ["Through the Wire – Kanye West", 2003],
  ["Drop It Like It's Hot – Snoop Dogg", 2004],
  ["Hate It or Love It – The Game", 2005],
  ["Gold Digger – Kanye West", 2005],
  ["Hustlin' – Rick Ross", 2006],
  ["Crank That – Soulja Boy", 2007],
  ["A Milli – Lil Wayne", 2008],
  ["Day 'n' Nite – Kid Cudi", 2008],
  ["Power – Kanye West", 2010],
  ["Black and Yellow – Wiz Khalifa", 2010],
  ["The Motto – Drake ft. Lil Wayne", 2011],
  ["Mercy – G.O.O.D. Music", 2012],
  ["Swimming Pools – Kendrick Lamar", 2012],
  ["U.N.I.T.Y. – Queen Latifah", 2012],
  ["Alright – Kendrick Lamar", 2015],
  ["Panda – Desiigner", 2016],
  ["Bad and Boujee – Migos", 2016],
  ["Bodak Yellow – Cardi B", 2017],
  ["The Box – Roddy Ricch", 2020],
  ["What's Poppin – Jack Harlow", 2020],
  ["WAP – Cardi B ft. Megan Thee Stallion", 2020],
  ["Industry Baby – Lil Nas X & Jack Harlow", 2021],
  ["First Class – Jack Harlow", 2022]
];

async function searchDeezerTrack(label, date) {
  const query = encodeURIComponent(label);
  const res = await fetch(`https://api.deezer.com/search?q=${query}`);
  const data = await res.json();
  const track = data?.data?.[0];
  if (!track || !track.preview) {
    console.log(`❌ Skipping ${label} (no preview)`);
    return null;
  }
  return {
    id: `${date}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label,
    date,
    deezer: {
      trackId: track.id,
      preview: track.preview,
      url: track.link
    }
  };
}

async function enrichSongs() {
  const results = [];
  for (const [label, date] of songs) {
    const enriched = await searchDeezerTrack(label, date);
    if (enriched) results.push(enriched);
  }

  const output = {
    slug: "hip-hop-history",
    topic: "Hip-Hop History in 50 Songs",
    category: "Entertainment",
    showTooltips: false,
    cards: results
  };

  fs.writeFileSync("hipHopHistory.json", JSON.stringify(output, null, 2));
  console.log("✅ File saved as hipHopHistory.json");
}

enrichSongs();
