import { Link as ReactRouterLink } from 'react-router-dom';
import * as z from 'zod';

import { Button, Text, Input, Link as ChakraLink, Flex, Box, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import supabase from '@/api/supabase';

const schema = z.object({
  email: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

type LoginValues = {
  email: string;
  password: string;
};


export const LoginForm = () => {
  const toast = useToast();
  const [values, setValues] = useState<LoginValues>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signIn({ email, password });

    if (error) {
      toast({
        title: 'Error logging in',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Logged in successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }

    try {
      // Validate form data using Zod schema
      schema.parse(values);

      // Call supabase API to register the user
      const { data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (!data.session) {
        console.log('Invalid email or password')
      }

      if (data.session) {

      }
    } catch (error: any) {
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name='email'
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            name='password'
            type="password"
            value={values.password}
            onChange={handleChange}
          />
        </FormControl>
        <Button mt={4} colorScheme="teal" type="submit">Register</Button>
      </form>
      <Flex paddingBlock='1'>
        <Text>Don't have an account?</Text>
        <ChakraLink 
          as={ReactRouterLink} 
          to="/auth/register" 
          color='alternatePurple.400' paddingInline='1' _hover={{ color: 'alternatePurple.100' }}
        >
          Register
        </ChakraLink>
      </Flex>
    </Box>
  );
};