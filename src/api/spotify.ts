import axios from 'axios';

const useSpotifyAPI = (accessToken) => {
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
    const options = {
      method: 'get',
      url: `${apiUrl}/me/top/artists`,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    }
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.error('Error fetching top items:', error);
      throw error;
    }
  };

  return { getProfile, getUsersTopItems };
};

export default useSpotifyAPI;