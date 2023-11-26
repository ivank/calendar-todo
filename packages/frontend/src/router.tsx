import { createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";
import { Login } from "./pages/Login";
import { App } from "./pages/App";
import { Register } from "./pages/Register";
import { Authenticated } from "./components/Authenticated";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <Authenticated>
            <App />
          </Authenticated>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);
