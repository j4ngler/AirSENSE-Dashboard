import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/Main/MainLayout";
import NotFoundPage from "../pages/Error/NotFound";
import LoginPage from "../pages/Auth/login";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import DataSensor from "../pages/DataSensors";
import News from "../pages/News";
import GGMap from "../components/Map/ggmap";
import LeafletMap from "../components/Map/leafletmap";

const routes = [
  {
    path: "customer",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "newspaper", element: <News /> },
      { path: "account", element: <Account /> },
      { path: "station/user", element: <DataSensor /> },
      { path: "station/data_station", element: <DataSensor /> },
      { path: "station/list_station", element: <LeafletMap />},
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
