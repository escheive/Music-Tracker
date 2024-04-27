'use client';
import { Outlet, NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { useAuthContext } from '@/context/AuthProvider';
import { useUserContext } from '@/context/UserProvider';

import { generateRandomString } from '@/utils/helpers';

const clientId: string = import.meta.env.VITE_CLIENT_ID;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI;


interface Props {
  children: React.ReactNode,
  to: any
}


const Links = ['Profile', 'Projects', 'Team']

const NavLink = (props: Props) => {
  const { children, to } = props

  return (
    <Box
      as={RouterLink}
      to={to}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
    >
      {children}
    </Box>
  )
}

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleUserLogout } = useAuthContext();
  const { profileData } = useUserContext();

  // Function to delete access token and redirect to home page
  const handleLogout = () => {
    handleUserLogout(); // Deletes stored access token and refresh token
    window.open('https://www.spotify.com/us/account/apps/', '_blank'); // Spotify link to remove connected apps
    window.location.href='/'; // Redirects to home page
  }

  // Function to login users
  const handleLogin = async () => {
    const state = generateRandomString(16); // Random 16 character string
    const scope = 'user-read-private user-read-email playlist-read-private user-follow-read user-top-read user-read-recently-played user-library-read user-read-currently-playing user-read-playback-state user-read-playback-position'; // Scope of permissions requested from spotify

    try {
      const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&response_type=code&scope=${scope}`; // Spotify auth url
      window.location.href = authorizationUrl; // Navigate users to spotify auth url
    } catch (error) {
      console.error('Error initiating login', error);
    }
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <NavLink to='/'>Logo</NavLink>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link} to={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={profileData ? profileData.images[0].url : null}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                {profileData ? (
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                ) : (
                  <MenuItem onClick={handleLogin}>Login</MenuItem>
                )}
                
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link} to={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

const NavbarWrapper = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default NavbarWrapper;