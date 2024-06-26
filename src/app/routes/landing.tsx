import { useNavigate } from 'react-router';
import { Box, Heading, Button, Text } from '@chakra-ui/react';

import { beginLogin } from '@/features/auth/api/spotify';
import { useSpotifyUser } from '@/api/spotify';


export const LandingRoute = () => {
  const navigate = useNavigate();
  const { user } = useSpotifyUser();

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

  return (
    <Box display='flex' flexDirection='column' alignItems='center' marginBlock='5%' >
      <Heading>Music Tracker</Heading>
      <Text m={2} textAlign='center'>Track your spotify account and connect with friends, all in one place using the Spotify API. No need to register an account, simply link your spotify account and see a breakdown of your entire account. To connect with others, register an account and start searching for your friends.</Text>
      <Box display='flex' justifyContent='center'>
        {!user ? (
          <Button onClick={handleLinkSpotify} colorScheme='whatsapp' m={2}>Link Spotify</Button>
        ) : null}
        <Button onClick={handleLogin} colorScheme='blue' m={2}>Login</Button>
      </Box>
    </Box>
  );
};