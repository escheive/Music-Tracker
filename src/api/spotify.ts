import axios from "axios";

const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  headers: {
    Authorization: `Bearer ${import.meta.env.REACT_APP_SPOTIFY_ACCESS_TOKEN}`,
  },
});

export default spotifyAPI;

export const getToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const clientId = import.meta.env.MUSIC_TRACKER_SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.MUSIC_TRACKER_SPOTIFY_CLIENT_SECRET;

  // Prepare data in urlencoded format
  const data = querystring.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await axios.post(tokenUrl, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching access token', error);
    return null;
  }
};

export const searchForTracks = async (query) => {
  try {
    const response = await spotifyAPI.get('search', {
      params: {
        q: query,
        type: 'track',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching tracks', error);
    return null;
  }
};