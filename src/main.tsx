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

export enum Path {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
}

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
        <Provider store={store}>
          <RouterProvider router={router}/>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  </StrictMode>,
)
