import { useEffect, useState } from "react";
import LineChart from "@/components/chart/LineChart";

import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Heading, Grid, GridItem, Link, Flex, Image, Text, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser, useUsersTopItems } from "@api/spotify/spotify";
import { useAuthContext } from "@context/AuthProvider";
import { useSupabaseProfile } from "@api/supabase/fetch";
import spotifyCMYKLogo from '@assets/spotify/logos/Spotify_Logo_CMYK_Green.png';
import { ExternalLinkIcon } from "@chakra-ui/icons";
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';


export const SettingsRoute = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { session } = useAuthContext();
  const { data: profile, error: profileError } = useSupabaseProfile(session?.user.id)
  const [currentProfileTheme, setCurrentProfileTheme] = useState(profile?.theme);

  const handleChange = (e) => {
    setCurrentProfileTheme(event?.target.value)
  }

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'));
    }
  }, [loggedOut, userMutate]);

  if (!user) {
    return (
      <Heading>Please connect your Spotify to see your profile</Heading>
    )
  }

  console.log(user)

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
        <Text>Color Scheme</Text>
        <Select 
          placeholder='Select a color scheme for the site' 
          bg={currentProfileTheme ? `${currentProfileTheme}.100` : 'alternatePurple.100'}
          value={currentProfileTheme}
          onChange={handleChange}
        >
          <option value='gray'>Gray</option>
          <option value='red'>Red</option>
          <option value='orange'>Orange</option>
          <option value='yellow'>Yellow</option>
          <option value='green'>Green</option>
          <option value='teal'>Teal</option>
          <option value='blue'>Blue</option>
          <option value='cyan'>Cyan</option>
          <option value='purple'>Purple</option>
          <option value='pink'>Pink</option>
          <option value='alternatePurple'>Alternate Purple</option>
        </Select>
      </Box>
    </>
  );
};