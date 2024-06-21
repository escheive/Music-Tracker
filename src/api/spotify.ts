import useSWR from 'swr';
import { fetchWithToken } from '@/features/auth/api/spotify';

const API_URL = 'https://api.spotify.com/v1'


export const useRecentlyPlayedSongs = () => {
  let combinedSongs = [];

  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading, error: recentlyPlayedSongsError } = useSWR(
    `${API_URL}/me/player/recently-played?limit=50`,
    fetchWithToken
  )

  const trackIds = recentlyPlayedSongs?.items.map((track: any) => track.track.id);
  // Map the track IDs to form a comma-separated string
  const trackIdsString = trackIds?.join(',');

  const { data: audioFeatures, error: audioFeaturesError } = useSWR(() => trackIdsString ? `${API_URL}/audio-features?ids=$` + trackIdsString : [],
    fetchWithToken
  )

  if (recentlyPlayedSongsLoading && audioFeatures) {
    combinedSongs = recentlyPlayedSongs?.items.map((track: any) => {
      const features = audioFeatures?.audio_features.find((feature: any) => feature?.id === track.track.id);
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

export const useSpotifyAudioFeatures = (trackIds: any) => {
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