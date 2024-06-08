import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { store } from "@store/index.store.ts";
import { Dashboard } from "@pages";
import Login from "./pages/register/components/LoginForm/Login.tsx";
import Register from "./pages/register/components/RegisterForm/Register.tsx";

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
            { path: Path.HOME, element: <div>Home</div> },
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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </React.StrictMode>,
)
