// src/features/auth/components/RegisterForm.js
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Box, Button, Input, FormControl, FormLabel, Heading } from '@chakra-ui/react';

const RegisterForm = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password, username);
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
