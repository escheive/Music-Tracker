import supabase from "./supabase";

const simplifySongData = (songs) => {
  return songs.slice(0, 10).map(song => ({
    id: song.id,
    name: song.name,
    artist: song.artists[0].name,
    imageUrl: song.album.images[0].url,
    spotifyUrl: song.external_urls.spotify,
  }));
};

const simplifyTopItems = (topItems) => {
  const simplifiedArtists = topItems.artists.items.slice(0, 5).map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images[0]?.url,
    spotifyUrl: artist.external_urls.spotify,
  }))
  const simplifiedTracks = topItems.tracks.items.slice(0, 5).map((track) => ({
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

export const createPost = async (post) => {
  let { user_id, type, content, metadata } = post;

  if (type === 'recentlyPlayed') {
    metadata = simplifySongData(metadata);
  } else if (type === 'topItems') {
    metadata = simplifyTopItems(metadata);
  }

  const { data, error } = await supabase
  .from('Posts')
  .insert([
    { 
      user_id,
      type,
      content,
      metadata,
    },
  ])
  .select()
}

          