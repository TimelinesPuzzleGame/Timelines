
const fetch = (...args) =>
    import('node-fetch').then(({
      default: fetch
    }) => fetch(...args));
  
  const CLIENT_ID = "5a04190243534e81876f43faa64426e7";
  const CLIENT_SECRET = "02f0e70b788245bea86171c37bb8f28f";
  
  const songs = [
    ["My Blue Heaven – Gene Austin", 1927],
    ["Over the Rainbow – Judy Garland", 1939],
    ["Chattanooga Choo Choo – Glenn Miller", 1941],
    ["Rock Around the Clock – Bill Haley", 1954],
    ["Hound Dog – Elvis Presley", 1956],
    ["What'd I Say – Ray Charles", 1959],
    ["Be My Baby – The Ronettes", 1963],
    ["Like a Rolling Stone – Bob Dylan", 1965],
    ["Good Vibrations – The Beach Boys", 1966],
    ["A Day in the Life – The Beatles", 1967],
    ["I Heard It Through the Grapevine – Marvin Gaye", 1969],
    ["Imagine – John Lennon", 1971],
    ["Superstition – Stevie Wonder", 1973],
    ["Bohemian Rhapsody – Queen", 1975],
    ["Stayin’ Alive – Bee Gees", 1977],
    ["Don’t Stop 'Til You Get Enough – Michael Jackson", 1979],
    ["Bette Davis Eyes – Kim Carnes", 1981],
    ["Billie Jean – Michael Jackson", 1983],
    ["Like a Virgin – Madonna", 1984],
    ["Livin’ on a Prayer – Bon Jovi", 1987],
    ["Vogue – Madonna", 1989],
    ["Smells Like Teen Spirit – Nirvana", 1991],
    ["I Will Always Love You – Whitney Houston", 1993],
    ["Wonderwall – Oasis", 1995],
    ["MMMBop – Hanson", 1997],
    ["...Baby One More Time – Britney Spears", 1999],
    ["Music – Madonna", 2000],
    ["Crazy in Love – Beyoncé ft. Jay-Z", 2003],
    ["Yeah! – Usher ft. Lil Jon & Ludacris", 2004],
    ["Crazy – Gnarls Barkley", 2006],
    ["Single Ladies – Beyoncé", 2008],
    ["Rolling in the Deep – Adele", 2011],
    ["Gangnam Style – PSY", 2012],
    ["Get Lucky – Daft Punk ft. Pharrell", 2013],
    ["Shake It Off – Taylor Swift", 2014],
    ["Uptown Funk – Mark Ronson ft. Bruno Mars", 2015],
    ["Closer – The Chainsmokers ft. Halsey", 2016],
    ["Blinding Lights – The Weeknd", 2017],
    ["Shallow – Lady Gaga & Bradley Cooper", 2018],
    ["Old Town Road – Lil Nas X ft. Billy Ray Cyrus", 2019],
    ["Watermelon Sugar – Harry Styles", 2020],
    ["good 4 u – Olivia Rodrigo", 2021],
    ["As It Was – Harry Styles", 2022],
    ["Anti-Hero – Taylor Swift", 2023],
    ["Mack the Knife – Louis Armstrong", 1928],
    ["White Christmas – Bing Crosby", 1944],
    ["Your Cheatin' Heart – Hank Williams", 1952],
    ["Only the Lonely – Roy Orbison", 1960],
    ["My Girl – The Temptations", 1964],
    ["(Sittin’ On) The Dock of the Bay – Otis Redding", 1968],
    ["Let It Be – The Beatles", 1970],
    ["Lean on Me – Bill Withers", 1972],
    ["I Will Always Love You – Dolly Parton", 1974],
    ["Dancing Queen – ABBA", 1976],
    ["We Are the Champions – Queen", 1978],
    ["Call Me – Blondie", 1980],
    ["Eye of the Tiger – Survivor", 1982],
    ["Take On Me – a-ha", 1985],
    ["Walk Like an Egyptian – The Bangles", 1986],
    ["Fast Car – Tracy Chapman", 1988],
    ["Vision of Love – Mariah Carey", 1990],
    ["End of the Road – Boyz II Men", 1992],
    ["Macarena – Los Del Rio", 1994],
    ["Pony – Ginuwine", 1996],
    ["My Heart Will Go On – Celine Dion", 1998],
    ["Fallin’ – Alicia Keys", 2001],
    ["Complicated – Avril Lavigne", 2002],
    ["Gold Digger – Kanye West ft. Jamie Foxx", 2005],
    ["Umbrella – Rihanna ft. Jay-Z", 2007],
    ["Poker Face – Lady Gaga", 2009],
    ["TiK ToK – Kesha", 2010],
    ["Despacito – Luis Fonsi & Daddy Yankee ft. Justin Bieber", 2017],
    ["Savage Love – Jawsh 685 & Jason Derulo", 2020],
    ["Flowers – Miley Cyrus", 2023],
  ];
  
  async function getAccessToken() {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });
  
    const data = await res.json();
    return data.access_token;
  }
  
  async function enrichSongs() {
    const token = await getAccessToken();
  
    for (const [label, date] of songs) {
      const query = encodeURIComponent(label);
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await res.json();
      const item = data.tracks?.items?.[0];
  
      if (!item) {
        console.log(`❌ No result for ${label}`);
        continue;
      }
  
      const puzzleCard = {
        id: `${date}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        label,
        date,
        spotify: {
          trackId: item.id,
          preview: item.preview_url,
          url: item.external_urls.spotify,
        },
      };
  
      console.log(JSON.stringify(puzzleCard, null, 2) + ",");
    }
  }
  
  enrichSongs();
  