import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { typesafeBrowserRouter } from 'react-router-typesafe';
import { Home, DBManager, Coach, DeleteMatchSession, AddMatchSession, CreateSquad, ViewStadiums } from './pages/index'
import './index.css'

const { router, href } = typesafeBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/dbmanager",
    Component: DBManager
  },
  {
    path: "/Coach",
    Component: Coach
  },
  {
    path: "/DeleteMatchSession",
    Component: DeleteMatchSession
  },
  {
    path: "/AddMatchSession",
    Component: AddMatchSession
  },
  {
    path: "/CreateSquad",
    Component: CreateSquad
  },
  {
    path: "/ViewStadiums",
    Component: ViewStadiums
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);