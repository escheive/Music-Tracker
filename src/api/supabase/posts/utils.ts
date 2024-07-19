
// Functions for simplifying song data before storing in db
export const simplifySongData = (songs: any[]) => {
  console.log(songs)
  // Reduce number of songs allowed to be stored, keep only few values
  return songs.slice(0, 10).map((song) => ({
    id: song.id,
    name: song.name,
    artist: song.artists[0].name,
    imageUrl: song.album.images[0].url,
    spotifyUrl: song.external_urls.spotify,
  }));
};

// Function for simplifying top items before storing in db
export const simplifyTopItems = (topItems: { artists: { items: [] }, tracks: { items: []}}) => {
  // Reduce top artists to 5, keep only few values
  const simplifiedArtists = topItems.artists.items.slice(0, 5).map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images[0]?.url,
    spotifyUrl: artist.external_urls.spotify,
  }))

  // Reduce top tracks to 5, keep only few values
  const simplifiedTracks = topItems.tracks.items.slice(0, 5).map((track: any) => ({
    id: track.id,
    name: track.name,
    imageUrl: track.album.images[0]?.url,
    spotifyUrl: track.external_urls.spotify,
  }))

  return {
    artists: simplifiedArtists,
    tracks: simplifiedTracks
  };
};