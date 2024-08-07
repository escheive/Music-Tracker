import React, { useEffect, useState } from "react";
import { Box, Heading, Link, Flex, Image, Text, Select, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSpotifyUser } from "@api/spotify/spotify";
import { useAuthContext } from "@context/AuthProvider";
import { useSupabaseProfile } from "@api/supabase/profile";
import spotifyCMYKLogo from '@assets/spotify/logos/Spotify_Logo_CMYK_Green.png';
import { ExternalLinkIcon } from "@chakra-ui/icons";

const colorOptions = [
  'gray', 'red', 'orange', 'yellow', 'green', 'teal', 
  'blue', 'cyan', 'purple', 'pink', 'alternatePurple'
];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800];


export const SettingsRoute = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { session } = useAuthContext();
  const { data: profile, updateProfile } = useSupabaseProfile(session?.user.id)
  const [currentProfileTheme, setCurrentProfileTheme] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentProfileTheme(e.target.value)
  }

  const handleSubmit = async () => {
    const newProfileData = {...profile, theme: currentProfileTheme}
    await updateProfile(newProfileData)
  }

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'));
    }
  }, [loggedOut, userMutate]);

  if (!user) {
    return (
      <>
        <Heading>Please connect your Spotify to see your profile</Heading>
      </>
    )
  }

  if (currentProfileTheme == '' && profile) setCurrentProfileTheme(profile?.theme)

  return (
    <>
      <Box flexDirection='column' alignItems='center' marginBlock='5%'>
        <Box textAlign='center' width='100%' padding={3}>
          <Text fontSize='3xl'>{profile?.username}</Text>
            <Link href={user.external_urls.spotify} target="_blank" isExternal _hover={{ fontStyle: 'normal'}}>
              <Flex justifyContent='center'>
                <Text fontSize={['md', 'lg']}>{user.display_name} on</Text>
                <Image
                  src={spotifyCMYKLogo} 
                  height='22px'
                  mx='2px'
                  fallbackSrc='https://via.placeholder.com/150' 
                />
                <ExternalLinkIcon />
              </Flex>
            </Link>
            <Text>{user.product === 'premium' ? 'Premium' : 'Free'} user</Text>
            <Text>Followers: {user.followers.total}</Text>
        </Box>
        {profile ? (
          <>
            <Text>Color Scheme</Text>
            <Select 
              placeholder='Select a color scheme for the site' 
              bg={currentProfileTheme}
              value={currentProfileTheme}
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
                  bg={`${currentProfileTheme}.${shade}`} 
                  width='40px' 
                  height='40px' 
                  m={2} 
                  borderRadius='md' 
                />
              ))}
            </Flex>
          </>
        ) : null}
        <Button onClick={handleSubmit}>
          Save Changes
        </Button>
      </Box>
    </>
  );
};