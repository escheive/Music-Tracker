import axios from 'axios';
import { useAuthContext } from '@/providers/AuthProvider';
import { useState } from 'react';

const MAX_RETRIES = 3;
let retryCount = 0;


const useSpotifyAPI = () => {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();

  const apiUrl = 'https://api.spotify.com/v1';

  const getProfile = async (newAccessToken = null) => {
    const options = {
      method: 'get',
      url: `${apiUrl}/me`,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      handleError(error, getProfile)
    }
  };

  const getUsersRecentlyPlayed = async () => {
    const recentlyPlayedUrl = `${apiUrl}/me/player/recently-played?limit=50`;
    const options = {
      method: 'get',
      url: recentlyPlayedUrl,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }

    try {
      const usersRecentlyPlayed = await axios(options);
      return usersRecentlyPlayed.data;
    } catch (error) {
      handleError(error, getUsersRecentlyPlayed)
    }
  }

  const getUsersTopItems = async () => {
    const topArtistsUrl = `${apiUrl}/me/top/artists`;
    const topTracksUrl = `${apiUrl}/me/top/tracks`;

    const options = {
      method: 'get',
      url: topArtistsUrl,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }

    try {
      const usersTopItems = {artists: null, tracks: null};
      const topArtistsResponse = await axios(options);
      options.url = topTracksUrl;
      const topTracksResponse = await axios(options);
      usersTopItems.artists = topArtistsResponse.data;
      usersTopItems.tracks = topTracksResponse.data;

      return usersTopItems;
    } catch (error) {
      handleError(error, getUsersTopItems)
    }
  };

  const fetchMoreTopItems = async () => {
    const topArtistsUrl = `${apiUrl}/me/top/artists?limit=30&offset=20`;
    const topTracksUrl = `${apiUrl}/me/top/tracks?limit=30&offset=20`;

    const options = {
      method: 'get',
      url: topArtistsUrl,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }

    try {
      const moreTopItems = {artists: null, tracks: null};
      const topArtistsResponse = await axios(options);
      options.url = topTracksUrl;
      const topTracksResponse = await axios(options);
      moreTopItems.artists = topArtistsResponse.data;
      moreTopItems.tracks = topTracksResponse.data;

      return moreTopItems;
    } catch (error) {
      handleError(error, fetchMoreTopItems)
    }
  };

  const fetchAudioFeatures = async (trackIds) => {
    // Map the track IDs to form a comma-separated string
    const trackIdsString = trackIds.join(',');

    const audioFeaturesUrl = `${apiUrl}/audio-features?ids=${trackIdsString}`;

    const options = {
      method: 'get',
      url: audioFeaturesUrl,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }

    try {
      const audioFeaturesResponse = await axios(options);
      return audioFeaturesResponse.data;
    } catch (error) {
      handleError(error, fetchMoreTopItems)
    }
  }

  const handleError = async (error, callback) => {
    if (error.response && error.response.status === 401) {
      await handleExpiredToken()
      retryCount = 0;
      // callback()
    } else {
      console.error('Error fetching data from spotify api: ,', error.response);
    }
  }

  const handleExpiredToken = async () => {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying to refresh access token, attempt: ${retryCount}`);
      // Refresh auth token
      try {
        console.error('401 error');
        // Hit backend route for refreshing access token
        const refreshTokenResponse = await axios.get('http://localhost:3001/refresh_token', {
          params: {
            refresh_token: refreshToken,
            cache: "no-cache"
          },
        });
        console.log('new access token', refreshTokenResponse.data.access_token)
        // Grab new access token from response
        const newAccessToken = refreshTokenResponse.data.access_token;
        storeAccessToken(newAccessToken);
        return newAccessToken;
      } catch (error) {
        console.error('Error refreshing access token: ', error)
      }
    } else {
      console.error('Max retry attempts reached to refresh access token.');
    }
  }

  return { getProfile, getUsersTopItems, fetchMoreTopItems, getUsersRecentlyPlayed, fetchAudioFeatures };
};

export default useSpotifyAPI;