import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/Main/MainLayout";
import NotFoundPage from "../pages/Error/NotFound";
import LoginPage from "../pages/Auth/login";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import DataSensor from "../pages/DataSensors";
import News from "../pages/News";
const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "account", element: <Account /> },
      { path: "station/data_station", element: <DataSensor /> },
      {
        path: "/station/user",
        element: <News />,
      },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <Navigate to="/customer/404" /> },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
];

export default routes;
