import { Landing } from '@/features/misc';
import { lazyImport } from '@/utils/lazyImport';
const { Profile } = lazyImport(() => import('@/features/users'), 'Profile');

export const commonRoutes = [
  { 
    path: '/', 
    element: <Landing /> 
  },
  {
    path:'/profile',
    element: <Profile />
  }
];