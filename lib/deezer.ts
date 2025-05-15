export async function searchDeezerTrack(label: string, year?: number): Promise<{ trackId: number; preview: string } | null> {
  const query = encodeURIComponent(label);
  const res = await fetch(`https://api.deezer.com/search?q=${query}`);
  const data = await res.json();

  const tracks = data?.data || [];
  for (const track of tracks) {
    if (track.preview && (!year || Math.abs(parseInt(track.release_date?.slice(0, 4)) - year) <= 1)) {
      return {
        trackId: track.id,
        preview: track.preview,
      };
    }
  }

  // Fallback: return first with preview even if year doesn't match
  const fallback = tracks.find((t: any) => t.preview);
  return fallback ? { trackId: fallback.id, preview: fallback.preview } : null;
}
