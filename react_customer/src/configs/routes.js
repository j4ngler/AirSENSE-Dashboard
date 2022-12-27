import { Navigate } from "react-router-dom";
import MainLayout from "../layouts/Main/MainLayout";
import NotFoundPage from "../pages/Error/NotFound";
import LoginPage from "../pages/Auth/login";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import MyNewSpaper from "../pages/Newspaper/MyNewspaper";
import RegisterNewspaper from "../pages/Newspaper/RegisterNewspaper";
import ManageUser from "../pages/ManageStation/ManageUser";
import StationData from "../pages/ManageStation/StationData";
import Courses from "../pages/Course/Courses";
import CreateCourse from "../pages/Course/CreateCourse";
import Exercises from "../pages/Course/Exercises";
import CreateExercises from "../pages/Course/CreateExercises";
import StationInformation from "../pages/Invoice/StationInformation";
import Support from "../pages/Support";
import Settings from "../pages/Settings";
import ListStation from "../pages/ManageStation/ListStation";
import Register from "../pages/Register";
import EnterEmail from "../pages/ForgotPassword/EnterEmail";
import EnterNewPassword from "../pages/ForgotPassword/EnterNewPassword";
import CreateInvoice from "../pages/Invoice/CreateInvoice";

const routes = [
  {
    path: "customer",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "station/user", element: <ManageUser /> },
      { path: "station/station_data", element: <StationData /> },
      { path: "station/list_station", element: <ListStation /> },
      { path: "my_newspaper", element: <MyNewSpaper /> },
      { path: "register_newspaper", element: <RegisterNewspaper /> },
      { path: "courses", element: <Courses /> },
      { path: "courses/create_course", element: <CreateCourse /> },
      { path: "courses/exercises", element: <Exercises /> },
      { path: "courses/create_exercises", element: <CreateExercises /> },
      { path: "invoice/station_information", element: <StationInformation /> },
      { path: "invoice/create_invoice", element: <CreateInvoice /> },
      { path: "account", element: <Account /> },
      { path: "support", element: <Support /> },
      { path: "settings", element: <Settings /> },
      { path: "404", element: <NotFoundPage /> },
      { path: "*", element: <Navigate to="/customer/404" /> },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  { path: "register", element: <Register /> },
  {
    path: "auth/reset_password",
    element: <EnterEmail />,
  },
  {
    path: "api/auth/reset_password/:user_id",
    element: <EnterNewPassword />,
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [
      { path: "*", element: <NotFoundPage />
      } 
    ]
  },
];

export default routes;
