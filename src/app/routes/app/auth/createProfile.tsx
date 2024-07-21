import { useState } from 'react';
import { Box, Button, Input, FormControl, FormLabel, Flex, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@context/AuthProvider';
import { useSupabaseProfile } from '@api/supabase/profile';

const colorOptions = [
  'gray', 'red', 'orange', 'yellow', 'green', 'teal', 
  'blue', 'cyan', 'purple', 'pink', 'alternatePurple'
];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800];

export const CreateProfileRoute = () => {
  const navigate = useNavigate();
  const { session } = useAuthContext();
  const { createProfile } = useSupabaseProfile(session?.user.id);
  const [profile, setProfile] = useState({
    username: '',
    theme: 'alternatePurple'
  })
  console.log(session)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (session?.user) {
      e.preventDefault();
      await createProfile(session?.user.id, profile);
      navigate('/')
    } else {
      console.error('Error creating profile')
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            name='username'
            type='text'
            value={profile.username}
            onChange={(e) => handleChange(e)}
          />
        </FormControl>
        <FormControl id="theme" isRequired>
          <FormLabel>Theme</FormLabel>
          <Select 
          name='theme'
          placeholder='Select a color scheme for the site' 
          bg={`${profile.theme}.300`}
          value={profile.theme}
          onChange={(e) => handleChange(e)}
        >
          {colorOptions.map(color => (
            <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
          ))}
        </Select>

        <Flex mt={4} wrap='wrap'>
          {shades.map(shade => (
            <Box 
              key={shade} 
              bg={`${profile?.theme}.${shade}`} 
              width='40px' 
              height='40px' 
              m={2} 
              borderRadius='md' 
            />
          ))}
        </Flex>
        </FormControl>
        <Button 
          mt={4} 
          type='submit'
          variant='solid'
          bg={`${profile?.theme}.300`}
        >
          Create
        </Button>
      </form>
      
    </Box>
  );
};
