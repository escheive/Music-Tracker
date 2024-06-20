// import { MainLayout } from '@/components/Layout';
import { lazyImport } from '@/utils/lazyImport';

// const { Dashboard } = lazyImport(() => import('@/features/misc'), 'Dashboard');
const { Profile } = lazyImport(() => import('@/features/users'), 'Profile');
const { Mood } = lazyImport(() => import('@/features/profile'), 'Mood');
// const { Users } = lazyImport(() => import('@/features/users'), 'Users');

export const protectedRoutes = [

  // { path: '/discussions/*', element: <DiscussionsRoutes /> },
  // { path: '/users', element: <Users /> },
  { 
    path: '/Profile', 
    element: <Profile /> 
  },
  {
    path: '/mood',
    element: <Mood />,
  },
  // { path: '/', element: <Dashboard /> },

];