import { createBrowserRouter } from 'react-router-dom';
import { AppRoot } from './app/root';
import NavbarWrapper from '@/components/nav/NavbarWrapper';
import { useAuthContext } from '@context/AuthProvider';
import { Navigate, useLocation } from "react-router-dom";
import { useSpotifyUser } from "@api/spotify/spotify";

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
            {
              path: 'settings',
              lazy: async () => {
                const { SettingsRoute } = await import('./app/settings');
                return { Component: SettingsRoute };
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


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSpotifyUser();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};