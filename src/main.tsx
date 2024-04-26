import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import './index.css';
import { AppProvider } from './providers/app';
import { AppRoutes } from './routes';
import Home from './routes/home';
import Contact from './routes/contacts';
import ErrorPage from './error-page';

import NavBar from './components/nav/NavBar';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import { UserContextProvider } from './context/UserProvider';

// App routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavBar />
        <Home />
      </>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/contacts",
    element: (
      <>
        <NavBar />
        <Contact />
      </>
    ),
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  </React.StrictMode>,
)

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <ChakraProvider>
//       <AuthProvider>
//         <UserContextProvider>
//           <RouterProvider router={router}>
//           <AppRoutes />
//           </RouterProvider>
//         </UserContextProvider>
//       </AuthProvider>
//     </ChakraProvider>
//   </React.StrictMode>,
// )
