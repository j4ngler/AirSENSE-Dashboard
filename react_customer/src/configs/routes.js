import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/Main/MainLayout";
import NotFoundPage from "../pages/Error/NotFound";
import LoginPage from "../pages/Auth/login";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import DataSensor from "../pages/DataSensors"

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "account", element: <Account /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <Navigate to="/customer/404" /> },
      { path: "station/data_station", element: <DataSensor /> },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
];

export default routes;
