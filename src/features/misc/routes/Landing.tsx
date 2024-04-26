import { useNavigate } from 'react-router';
import { Heading, Button } from '@chakra-ui/react';


export const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/auth/login');
  }

  return (
    <>
      <Heading>Landing Page</Heading>
      <Button onClick={handleStart}>Start</Button>
    </>
  );
};