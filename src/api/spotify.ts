import useSWR from 'swr';
import { fetchWithToken } from '@/features/auth/api/spotify';

const API_URL = 'https://api.spotify.com/v1'


export const useRecentlyPlayedSongs = () => {
  let combinedSongs: Record<string, any>[] = [];

  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading, error: recentlyPlayedSongsError } = useSWR(
    `${API_URL}/me/player/recently-played?limit=50`,
    fetchWithToken
  )

  const trackIds = recentlyPlayedSongs?.items.map((track: Record<string, any>) => track.track.id);
  // Map the track IDs to form a comma-separated string
  const trackIdsString = trackIds?.join(',');

  const { data: audioFeatures, isLoading: audioFeaturesLoading, error: audioFeaturesError } = useSWR(() => trackIdsString ? `${API_URL}/audio-features?ids=$` + trackIdsString : [],
    fetchWithToken
  )

  if (!recentlyPlayedSongsLoading && !audioFeaturesLoading) {
    combinedSongs = recentlyPlayedSongs?.items.map((track: Record<string, any>) => {
      const features = audioFeatures?.audio_features.find((feature: Record<string, any>) => feature?.id === track.track.id);
      return { played_at: track.played_at, ...track.track, ...features };
    });
  }

  return {
    data: combinedSongs,
    isLoading: !recentlyPlayedSongs || !audioFeatures,
    error: recentlyPlayedSongsError || audioFeaturesError,
  }
}

export const useSpotifyUser = () => {
  const { data, mutate, error } = useSWR(
    `${API_URL}/me`,
    fetchWithToken,
  )

  return { 
    user: data, 
    userMutate: mutate, 
    loggedOut: error?.status === 401,
  };
}

export const useSpotifyUsersPlaylists = () => {
  const { data, isLoading, mutate, error } = useSWR(
    `${API_URL}/me/playlists?limit=50`,
    fetchWithToken,
  )

  return { 
    data, 
    isLoading,
    mutate, 
    error
  };
}

export const useSpotifyPlaylistsTracks = (playlistId: string, offset: number = 0) => {
  const { data, isLoading, mutate, error } = useSWR(
    playlistId ? `${API_URL}/playlists/${playlistId}/tracks?offset=${offset}` : null,
    fetchWithToken,
  )

  return { 
    data, 
    isLoading,
    mutate, 
    error
  };
}

export const useUsersTopItems = () => {
  const { data: artists, isLoading: topArtistsLoading, error: topArtistsError } = useSWR(
    `${API_URL}/me/top/artists?limit=50`,
    fetchWithToken
  )
  const { data: tracks, isLoading: topTracksLoading, error: topTracksError } = useSWR(
    `${API_URL}/me/top/tracks?limit=50`,
    fetchWithToken
  )

  return { 
    data: { artists, tracks },
    isLoading: topArtistsLoading || topTracksLoading,
    error: topArtistsError | topTracksError,
  };
}

export const useSpotifyAudioFeatures = (trackIds: string[]) => {
  // Map the track IDs to form a comma-separated string
  const trackIdsString = trackIds.join(',');

  const { data, mutate, isLoading, error } = useSWR(
    trackIds.length ? `${API_URL}/audio-features?ids=${trackIdsString}` : null,
    fetchWithToken,
  )

  return { 
    audioFeatures: data, 
    audioFeaturesMutate: mutate,
    audioFeaturesIsLoading: isLoading,
    audioFeaturesError: error
  };
}