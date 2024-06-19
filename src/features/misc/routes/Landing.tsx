import { useNavigate } from 'react-router';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import { generateRandomString } from '@/utils/helpers';
import { useAuthContext } from '@/providers/AuthProvider';
import { useEffect } from 'react';

import { beginLogin } from '@/features/auth/api/spotify';

const clientId: string = import.meta.env.VITE_CLIENT_ID;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI;


export const Landing = () => {
  const navigate = useNavigate();
  const { accessToken, storeAccessToken, storeRefreshToken } = useAuthContext();

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
    }
    
  }, [accessToken]);

  const handleLogin = () => {
    navigate('/auth/login');
  }

  const handleLinkSpotify = async () => {
    try {
      await beginLogin();
    } catch (error) {
      console.error('Error initiating login', error);
    }
  }

  // const handleLinkSpotify = async () => {

  //   const authUrl = new URL("https://accounts.spotify.com/authorize")

  //   window.localStorage.setItem('code_verifier', codeVerifier);

  //   const scope = 'user-read-private user-read-email playlist-read-private user-follow-read user-top-read user-read-recently-played user-library-read user-read-currently-playing user-read-playback-state user-read-playback-position';

  //   const params =  {
  //     response_type: 'code',
  //     client_id: clientId,
  //     scope,
  //     code_challenge_method: 'S256',
  //     code_challenge: codeChallenge,
  //     redirect_uri: redirectUri,
  //   }

  //   try {
  //     authUrl.search = new URLSearchParams(params).toString();
  //     window.location.href = authUrl.toString();
  //   } catch (error) {
  //     console.error('Error initiating login', error);
  //   }
  // }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' >
      <Heading>Music Tracker</Heading>
      <Text m={2} textAlign='center'>Track your spotify account and connect with friends, all in one place using the Spotify API. No need to register an account, simply link your spotify account and see a breakdown of your entire account. To connect with others, register an account and start searching for your friends.</Text>
      <Box display='flex' justifyContent='center'>
        {!accessToken ? (
          <Button onClick={handleLinkSpotify} colorScheme='whatsapp' m={2}>Link Spotify</Button>
        ) : null}
        <Button onClick={handleLogin} colorScheme='blue' m={2}>Login</Button>
      </Box>
    </Box>
  );
};