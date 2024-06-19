import { completeLogin } from '../api/spotify';
import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router';

export const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    completeLogin()
      .then(() => {
        navigate('/profile')
      })
      .catch((error) => {
        console.error(error)
        navigate('/')
      })
  }, []);

  return (
    <Box>
      <main className="p-2 flex flex-col max-w-xs mx-auto my-4 text-center space-y-4">
        <h1 className="text-4xl text-gray-600 animate-pulse">
          Logging you in...
        </h1>
      </main>
    </Box>
  )
}