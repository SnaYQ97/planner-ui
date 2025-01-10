import {createRoot} from 'react-dom/client'
import {Provider} from "react-redux";
import {StrictMode} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {store} from "@store/index.store.ts";
import {Dashboard} from "@pages";
import Signin from "@pages/Register/components/Signin/Signin.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { UserSettings } from '@pages/UserSettings';
import { ProtectedRoute } from '@components/ProtectedRoute';
import "./styles/globals.css";

export enum Path {
  HOME = '/',
  SIGNIN = '/signin',
  SETTINGS = '/settings'
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: Path.HOME,
    element: <Dashboard/>,
    children: [
      {
        path: Path.HOME,
        element: <div>Home</div>
      },
    ],
  },
  {
    path: Path.SIGNIN,
    element: <Signin/>,
  },
  {
    path: Path.SETTINGS,
    element: <ProtectedRoute><UserSettings /></ProtectedRoute>,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
