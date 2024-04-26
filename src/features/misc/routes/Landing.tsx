import { useNavigate } from 'react-router';
import { Heading } from '@chakra-ui/react';


export const Landing = () => {
  const navigate = useNavigate();

  return (
    <>
      <Heading>Landing Page</Heading>
    </>
  );
};