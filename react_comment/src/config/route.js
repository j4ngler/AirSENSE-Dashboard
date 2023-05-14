import { Navigate } from "react-router-dom";
import LoginPage from "../pages/Auth/login";
import Comment from "../pages/Comment/comment";
import NotFoundPage from "../pages/Error/NotFound"

const routes = [
    {
        path: "comment",
        element: <Comment />,
        children: [
            { path: "404", element: <NotFoundPage /> },
            { path: "*", element: <Navigate to="/comment/404" /> },
          ],
    },

    {
        path: "login",
        element: <LoginPage />
    },
    {
        path: "*",
        element: <LoginPage />,
        
      },
]

export default routes
