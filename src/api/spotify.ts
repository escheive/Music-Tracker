import axios from "axios";

const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com/v1/',
  heaaders: {
    Authorization: `Bearer ${process.env.REACT_APP_SPOTIFY_ACCESS_TOKEN}`,
  },
});

export default spotifyAPI;