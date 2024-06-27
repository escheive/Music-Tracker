// src/features/auth/components/RegisterForm.js
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Box, Button, Input, FormControl, FormLabel, Heading } from '@chakra-ui/react';
import { useSpotifyUser } from '@api/spotify';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { user } = useSpotifyUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    if (user) {
      e.preventDefault();
      await register(email, password, username);
      navigate('/auth/login')
    } else {
      console.error('Link spotify first')
    }
  };

  return (
    <Box p={4}>
      <Heading>Register</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">Register</Button>
      </form>
    </Box>
  );
};

export default RegisterForm;
