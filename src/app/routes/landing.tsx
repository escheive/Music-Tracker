import { useNavigate } from 'react-router';
import { Box, Heading, Button, Text } from '@chakra-ui/react';

import { beginLogin } from '@/api/spotify/auth';
import { useSpotifyUser } from '@api/spotify/spotify';
import { useAuthContext } from '@context/AuthProvider';


export const LandingRoute = () => {
  const navigate = useNavigate();
  const { user } = useSpotifyUser();
  const { session } = useAuthContext();

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
      <Heading>Music Tracker for Spotify</Heading>
      <Box padding={8} bg='gray.200' rounded={16}>
        <Text m={2} textAlign='center'>Please link your spotify account to get started!</Text>
        <Text>By linking your spotify account, you agree to our privacy policy</Text>
        <Box display='flex' justifyContent='center'>
          {!user ? (
            <Button onClick={handleLinkSpotify} colorScheme='whatsapp' m={2}>Link Spotify</Button>
          ) : null}
          {!session ? (
            <Button onClick={handleLogin} colorScheme='blue' m={2}>Login to Music Tracker</Button>
          ) : null}
        </Box>
      </Box>
      <Box flexDirection='column' width='60%'>
        <Box alignSelf='flex-start'>
          <Text>View your top tracks and artists</Text>
        </Box>
        <Box alignSelf='right'>
          <Text textAlign='right'>Stay on top of your most recently played tracks</Text>
        </Box>
        <Box alignSelf='flex-start'>
          <Text>Interact with your playlists</Text>
        </Box>
        <Box alignSelf='flex-end'>
          <Text textAlign='right'>Find new music</Text>
        </Box>
        <Box>
          <Text>Track you mood based on your music</Text>
        </Box>
      </Box>
    </Box>
  );
};