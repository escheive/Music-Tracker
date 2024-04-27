import { useAuthContext } from "@/context/AuthProvider";
import { useUserContext } from "@/context/UserProvider";
import { useEffect } from "react";
import useSpotifyAPI from "@/api/spotify";
import { generateRandomString } from "@/utils/helpers";

import { Box, Button, Heading, Text } from "@chakra-ui/react";

const clientId: string = import.meta.env.VITE_CLIENT_ID;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI;

export const Profile = () => {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();
  const { profileData, storeProfileData, topItems, storeTopItems } = useUserContext();
  const spotify = useSpotifyAPI(accessToken, refreshToken);

  // Checks for tokens and stores them if not stored yet
  useEffect(() => {
    if (!accessToken) {
      const params = new URLSearchParams(window.location.search);
      const accessTokenFromParams = params.get('access_token');
      const refreshTokenFromParams = params.get('refresh_token');

      if (accessTokenFromParams) {
        storeAccessToken(accessTokenFromParams)
      }
      if (refreshTokenFromParams) {
        storeRefreshToken(refreshTokenFromParams);
      }
    } else {
      if (!profileData) {
        const fetchProfileData = async () => {
          try {
            const profile = await spotify.getProfile();
            storeProfileData(profile);
            const topItems = await spotify.getUsersTopItems();
            storeTopItems(topItems);
          } catch (error) {
            console.error('Error fetching profile data: ', error);
          }    
        };
  
        fetchProfileData();
      }
    }
    
  }, [spotify, accessToken]);

  
  const handleLogin = async () => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email playlist-read-private user-follow-read user-top-read user-read-recently-played user-library-read user-read-currently-playing user-read-playback-state user-read-playback-position';

    try {
      const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&response_type=code&scope=${scope}`;
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Error initiating login', error);
    }
  }

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Heading>Music Tracker</Heading>
        <Text>Track your spotify account and connect with friends, all in one place using the Spotify API. No need to register an account, simply link your spotify account and see a breakdown of your entire account. To connect with others, register an account and start searching for your friends.</Text>
        {!accessToken ? (
          <Button
            colorScheme='whatsapp'
            size='md'
            onClick={handleLogin}
          >
            Link Spotify
          </Button>
        ) : (
          null
        )}
        {profileData ? (
          <>
            <Heading>{profileData.display_name}</Heading>
            <p>Email: {profileData.email}</p>
            <p>Country: {profileData.country}</p>
            <p>Product: {profileData.product}</p>
            <p>Type: {profileData.type}</p>
            <p>Followers: {profileData.followers.total}</p>
            <a href={profileData.external_urls.spotify} target="blank">Open on Spotify</a>
          </>
        ) : null}
        {topItems ? (
          <>
          {topItems.artists.items.map((artist) => (
            <p>{artist.name}</p>
          ))}
          {topItems.tracks.items.map((track) => (
            <p>{track.name}</p>
          ))}
          </>
        ) : null}
        
      </Box>
    </>
  );
};