import { createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute } from '@/lib/auth';
import { AppRoot } from './app/root';
import NavbarWrapper from '@/components/nav/NavbarWrapper';
import { useAuthContext } from '@context/AuthProvider';

export const createRouter = () => {
  const { session } = useAuthContext();

  return createBrowserRouter([
    {
      path: '/',
      element: <NavbarWrapper />,
      children: [
        {
          path: '/',
          lazy: async () => {
            if (session) {
              const { DashboardRoute } = await import('./dashboard');
              return { Component: DashboardRoute };
            } else {
              const { LandingRoute } = await import('./landing');
              return { Component: LandingRoute };
            }
          },
        },
        {
          path: '/auth/login',
          lazy: async () => {
            const { LoginRoute } = await import('./app/auth/login');
            return { Component: LoginRoute };
          },
        },
        {
          path: '/auth/spotify',
          lazy: async () => {
            const { SpotifyAuthRoute } = await import('./app/auth/spotify');
            return { Component: SpotifyAuthRoute };
          },
        },
        {
          path: '/*',
          element: (
            <ProtectedRoute>
              <AppRoot />
            </ProtectedRoute>
          ),
          children: [
            {
              path: 'profile',
              lazy: async () => {
                const { ProfileRoute } = await import('./app/profile');
                return { Component: ProfileRoute };
              },
            },
            {
              path: 'profile/mood',
              lazy: async () => {
                const { ProfileMoodRoute } = await import('./app/profile/mood');
                return { Component: ProfileMoodRoute };
              },
            },
            {
              path: 'profile/music',
              lazy: async () => {
                const { ProfileMusicRoute } = await import('./app/profile/music');
                return { Component: ProfileMusicRoute };
              },
            },
          ]
        },
      ]
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);
}