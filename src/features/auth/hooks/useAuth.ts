import { useState } from 'react';
import { createUser } from '../api/authApi';

const useAuth = () => {
  const [user, setUser] = useState(null);

  const register = async (email: string, password: string, username: string) => {
    const newUser = await createUser(email, password, username);
    setUser(newUser);
  };

  // const login = async (email, password) => {
  //   const loggedInUser = await signInUser(email, password);
  //   setUser(loggedInUser);
  // };

  return { user, register };
};

export default useAuth;
