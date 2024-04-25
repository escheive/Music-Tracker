import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import './index.css';
import Root from './routes/root';
import Contact from './routes/contacts';
import ErrorPage from './error-page';

import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import { UserContextProvider } from './context/UserProvider';

// App routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "/contacts",
    element: <Contact />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <UserContextProvider>
          <RouterProvider router={router} />
        </UserContextProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
