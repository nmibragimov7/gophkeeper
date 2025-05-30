import {createBrowserRouter} from "react-router-dom";

import Layout from "@/widget/Layout/Layout.jsx";
import Login from "@/pages/auth/Login/Login.jsx";
import Register from "@/pages/auth/Register/Register.jsx";
import Profile from "@/pages/cabinet/Profile/Profile.jsx";
import Create from "@/pages/cabinet/Create/Create.jsx";
import Edit from "@/pages/cabinet/Edit/Edit.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        name: "Login",
        element: <Login/>
      },
      {
        path: "/register",
        name: "Register",
        element: <Register/>
      },
    ]
  },
  {
    path: "/cabinet",
    element: <Layout/>,
    children: [
      {
        index: true,
        name: "Profile",
        element: <Profile/>
      },
      {
        path: "/cabinet/create",
        name: "Create",
        element: <Create/>
      },
      {
        path: "/cabinet/edit/:id",
        name: "Edit",
        element: <Edit/>
      }
    ]
  }
]);
