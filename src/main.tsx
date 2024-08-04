import { createRoot } from 'react-dom/client'
import {Provider} from "react-redux";
import { StrictMode } from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { store } from "@store/index.store.ts";
import { Dashboard } from "@pages";
import Login from "./pages/register/components/LoginForm/Login.tsx";
import Register from "./pages/register/components/RegisterForm/Register.tsx";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {ThemeProvider} from "@mui/material";
import {defaultTheme} from "./theme/default.theme.ts";
import {CssBaseline} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Logout from "./pages/register/components/LoginForm/Logout.tsx";

export enum Path {
  HOME = '/',
  LOGIN = '/login',
  logout = '/logout',
  REGISTER = '/register',
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: Path.HOME,
    element: <Dashboard />,
    children: [
      {
        path: Path.HOME,
        element: <div>Home</div>
      },
    ],
  },
  {
    path: Path.LOGIN,
    element: <Login />,
  },
  {
    path: Path.logout,
    element: <Logout/>
  },
  {
    path: Path.REGISTER,
    element: <Register/>,
  },
])

export const muiCache = createCache({ key: 'mui', prepend: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline enableColorScheme={true}/>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <RouterProvider router={router}/>
          </Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
)
