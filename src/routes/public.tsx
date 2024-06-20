import { lazyImport } from '@/utils/lazyImport';

const { AuthRoutes } = lazyImport(() => import('@/features/auth'), 'AuthRoutes');
const { Mood } = lazyImport(() => import('@/features/profile'), 'Mood');

export const publicRoutes = [
  {
    path: '/auth/*',
    element: <AuthRoutes />,
  },
];