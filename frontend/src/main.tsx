import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { typesafeBrowserRouter } from 'react-router-typesafe';
import { Home, ManagerPage, CreateUser, UpdateStadium } from './pages/index'
import './index.css'

const { router, href } = typesafeBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/ManagerPage",
    Component: ManagerPage
  },
  {
    path: "/CreateUser",
    Component: CreateUser
  },
  {
    path: "/UpdateStadium",
    Component: UpdateStadium
  
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);