import axios from 'axios';

const useSpotifyAPI = (accessToken) => {
  const apiUrl = 'https://api.spotify.com/v1';

  const getProfile = async () => {
    const options = {
      method: 'get',
      url: 'https://api.spotify.com/v1/me',
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

  return { getProfile };
};

export default useSpotifyAPI;