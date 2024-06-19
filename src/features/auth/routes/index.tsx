import { Route, Routes } from 'react-router-dom';

import { Login } from './Login';
import { Register } from './Register';
import { SpotifyCallback } from './SpotifyCallback';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="spotifycallback" element={<SpotifyCallback />} />
    </Routes>
  );
};