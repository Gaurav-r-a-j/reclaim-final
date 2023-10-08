import React, { useState, useEffect, useRef } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNotificationContext } from "./contexts/NotificationContext";
import Error from "./pages/Error/Error";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Lost from "./pages/Lost/Lost";
import LostForm from "./pages/LostForm/LostForm";
import Found from "./pages/Found/Found";
import FoundForm from "./pages/FoundForm/FoundForm";

const Layout = () => {
  return (
    <div className=" relative dark:bg-slate-900 min-h-screen w-full text-red">
      {/* <CustomNotification /> */}
      <Login/>
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/lost",
        element: <Lost />,
      },
      {
        path: "/lost-registration",
        element: <LostForm />,
      },
      {
        path: "/found",
        element: <Found />,
      },
      {
        path: "/found-registration",
        element: <FoundForm />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App bg-white text-black dark:bg-black dark:text-white ">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
