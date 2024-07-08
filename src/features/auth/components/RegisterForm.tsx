// // src/features/auth/components/RegisterForm.js
// import { useState } from 'react';
// import useAuth from '../hooks/useAuth';
// import { Box, Button, Input, FormControl, FormLabel, Text, Flex, Link as ChakraLink } from '@chakra-ui/react';
// import { useSpotifyUser } from '@api/spotify/spotify';
// import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';

// const RegisterForm = () => {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const { user } = useSpotifyUser();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [username, setUsername] = useState('');

//   const handleSubmit = async (e) => {
//     if (user) {
//       e.preventDefault();
//       await register(email, password, username);
//       navigate('/auth/login')
//     } else {
//       console.error('Link spotify first')
//     }
//   };

//   return (
//     <Box p={4}>
//       <form onSubmit={handleSubmit}>
//         <FormControl id="username" isRequired>
//           <FormLabel>Username</FormLabel>
//           <Input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </FormControl>
//         <FormControl id="email" isRequired>
//           <FormLabel>Email</FormLabel>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </FormControl>
//         <FormControl id="password" isRequired>
//           <FormLabel>Password</FormLabel>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </FormControl>
//         <Button mt={4} colorScheme="teal" type="submit">Register</Button>
//       </form>
//       <Flex paddingBlock='1'>
//         <Text>Already have an account?</Text>
//         <ChakraLink 
//           as={ReactRouterLink} 
//           to="/auth/login" 
//           color='alternatePurple.400' paddingInline='1' _hover={{ color: 'alternatePurple.100' }}
//         >
//           Log in
//         </ChakraLink>
//       </Flex>
      
//     </Box>
//   );
// };

// export default RegisterForm;
