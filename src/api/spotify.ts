import axios from 'axios';

const useSpotifyAPI = (accessToken, refreshToken) => {
  const apiUrl = 'https://api.spotify.com/v1';

  const getProfile = async () => {
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
      console.error('Error fetching profile:', error);
      throw error;
    }
  };

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
      if (error.response && error.response.status === 401) {
        // Refresh auth token
        try {
          console.log('401 error')
          // Hit backend route for refreshing access token
          const refreshTokenResponse = await axios.get('http://localhost:3001/refresh_token', {
            params: {
              refresh_token: refreshToken
            }
          });
          console.log(refreshTokenResponse)
          // Grab new access token from response
          const newAccessToken = refreshTokenResponse.data.access_token;
          // Update header with new access token
          options.headers.Authorization = 'Bearer ' + newAccessToken;

          // Retry the function with refreshed token
          const newResponse = await axios.get(`${apiUrl}/me/top/artists`);

          console.log(newResponse.data)

        } catch (error) {
          console.error('Error refreshing access token: ', error)
        }
      } else {
        console.error('Error fetching top items:', error.response.status);
        throw error;
      }
    }
  };

  return { getProfile, getUsersTopItems };
};

export default useSpotifyAPI;

const refreshSpotifyAuthenticationToken = (callback) => {
  const refreshBody = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
  });

  
}