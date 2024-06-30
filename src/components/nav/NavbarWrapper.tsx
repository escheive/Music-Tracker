'use client';
import { Outlet, NavLink as RouterLink, useNavigate } from 'react-router-dom';
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
import { useSpotifyUser } from '@api/spotify/spotify';


interface Props {
  children: React.ReactNode,
  to: any
}

const Links = [
  {
    title: 'Profile',
    route: '/profile'
  }, 
  {
    title: 'Mood',
    route: '/profile/mood'
  }, 
  {
    title: 'Music',
    route: '/profile/music'
  },
]

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
  const { user } = useSpotifyUser();
  const navigate = useNavigate();

  // Function to delete access token and redirect to home page
  const handleLogout = () => {
    localStorage.removeItem('tokenSet');
    window.open('https://www.spotify.com/us/account/apps/', '_blank'); // Spotify link to remove connected apps
    window.location.href='/'; // Redirects to home page
  }

  // Function to navigate to login page
  const handleLogin = async () => {
    navigate('/auth/login');
  }

  return (
    <>
      <Box bg={useColorModeValue('#ffe5fe', 'gray.900')} px={4}>
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
              {user ? 
              Links.map((link) => (
                <NavLink key={link.title} to={link.route}>{link.title}</NavLink>
              )) : null }
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
                  src={user ? user.images[0]?.url : undefined}
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                {user ? (
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
                <NavLink key={link.title} to={link.route}>{link.title}</NavLink>
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