import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setLoginModal, setUser } from "../redux/reducers/userSlice";
import axiosInstance from "../api/axios";
// import { useUser } from "../../contexts/UserContext";
export const BASE_URL = "http://localhost:5001/api";


export   const getUser = async () => {
  try {
    const { data } = await axiosInstance.get("/users/me");
    return data
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


const linkClassName = `
block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-bold
`;

const activeClassName = `${linkClassName} md:bg-transparent text-white md:text-blue-700 bg-blue-500 md:dark:text-blue-400`;

const userLinks = `block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white`;
const activeuserLinks = `block px-4 py-2 text-sm bg-gray-100  hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white text-blue-700 dark:bg-blue-500 dark:text-white `;

const Navbar = () => {
  const [mobileView, setMobileView] = useState(false);
  const [scrolledNav, setScrollednav] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const { user } = useSelector((state) => state.user);

  const [theme, setTheme] = useState("light");

  const dispatch = useDispatch();

  useEffect(() => {
    const getMe = async () => {
      try {
        const { data } = await axiosInstance.get("/users/me");
        dispatch(setUser(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getMe();
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = axiosInstance.post("/users/logout");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const toggleButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrollednav(true);
      } else {
        setScrollednav(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // add event listener to document object when component mounts
    document.addEventListener("click", handleClickOutside);

    // remove event listener from document object when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    // check if target element of click is inside dropdown element or toggle button element
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    // if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return () => {};
  }, [theme]);

  const ToggleTheme = (e) => {
    setTheme(theme === "dark" ? "light" : "dark");
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
  };

  // if (!user) {
  //   return;
  // }

  return (
    <nav
      className={`shadow-sm   fixed top-0 z-40 w-full left-0 ${
        scrolledNav ? "backdrop-blur " : ""
      }`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink to="/" className="flex items-center">
          <img
            src="https://portfolio-image-store.s3.ap-south-1.amazonaws.com/1696689325439-reclaim-low-resolution-logo-black-on-transparent-background.png"
            className={`dark:invert h-10 mr-3`}
            alt="ReClaim Logo"
          />
          {/* <span
            style={{ fontFamily: "Kalam" }}
            className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >
            ReClaim
          </span> */}
        </NavLink>

        <div className="flex items-center md:order-2">
          {/* {theme === "dark" ? (
            <LightButton ToggleTheme={ToggleTheme} />
          ) : (
            <DarkButton ToggleTheme={ToggleTheme} />
          )} */}
          <ThemeSwitcher ToggleTheme={ToggleTheme} />

          <button
            ref={toggleButtonRef}
            onClick={() => setShowDropDown((prev) => !prev)}
            type="button"
            className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src={
                "https://imgs.search.brave.com/UC52XQQ8PpdwaG3USbN-1BSgK1TCJX9HFoJ0gncJXMI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pY29u/LWxpYnJhcnkuY29t/L2ltYWdlcy9uby11/c2VyLWltYWdlLWlj/b24vbm8tdXNlci1p/bWFnZS1pY29uLTI1/LmpwZw"
              }
              alt="user photo"
            />
          </button>
          {/* Dropdown menu */}

          <div
            ref={dropdownRef}
            className={`z-40 ${
              showDropDown ? "" : "hidden"
            } my-4  w-60 text-base p-3 absolute md:right-20 right-5 top-10 list-none  divide-y divide-gray-100 rounded-lg shadow bg-slate-50 dark:bg-gray-700 dark:divide-gray-600 `}
            id="user-dropdown"
          >
            {user && (
              <div className="flex justify-center items-center">
                <img
                  className="w-10 overflow-hidden h-10 mr-2 rounded-full"
                  src={
                    "https://imgs.search.brave.com/UC52XQQ8PpdwaG3USbN-1BSgK1TCJX9HFoJ0gncJXMI/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pY29u/LWxpYnJhcnkuY29t/L2ltYWdlcy9uby11/c2VyLWltYWdlLWlj/b24vbm8tdXNlci1p/bWFnZS1pY29uLTI1/LmpwZw"
                  }
                  alt="user photo"
                />

                <div className="pr-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {user?.username}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    {user?.email}
                  </span>
                </div>
              </div>
            )}

            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <NavLink
                  to="/"
                  // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  className={({ isActive }) =>
                    isActive ? activeuserLinks : userLinks
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/found"
                  className={({ isActive }) =>
                    isActive ? activeuserLinks : userLinks
                  }
                >
                  Found
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/lost"
                  className={({ isActive }) =>
                    isActive ? activeuserLinks : userLinks
                  }
                >
                  Lost
                </NavLink>
              </li>
            </ul>

            {user ? (
              <li onClick={handleLogout}>
                <button className="block w-full bg-gray-100  px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:text-white">
                  Logout
                </button>
              </li>
            ) : (
              <li
                onClick={() => {
                  dispatch(setLoginModal(true));
                }}
              >
                <button className="block w-full bg-gray-100  px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:text-white">
                  Login/Signup
                </button>
              </li>
            )}
          </div>

          {/* <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              onClick={() => setMobileView((prev) => !prev)}
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
        </div>

        {/* below part is for the navicon */}
        <div
          className={`items-center justify-between ${
            !mobileView ? "hidden" : ""
          } w-full md:flex md:w-auto md:order-1`}
          id="mobile-menu-2"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0    dark:border-gray-700 md:bg-none dark:bg-none">
            <li>
              <NavLink
                to="/"
                // md:text-blue-700
                // className={(isActive) =>
                //   `block py-2 pl-3 pr-4 text-white rounded md:bg-transparent  md:p-0 md:dark:text-blue-500
                //     ` + (!isActive ? " text-gray-900 " : "text-blue-500")
                // }
                className={({ isActive }) =>
                  isActive ? activeClassName : linkClassName
                }
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/lost"
                className={({ isActive }) =>
                  isActive ? activeClassName : linkClassName
                }
              >
                Lost
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/found"
                className={({ isActive }) =>
                  isActive ? activeClassName : linkClassName
                }
              >
                Found
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/lost-registration"
                className={({ isActive }) =>
                  isActive ? activeClassName : linkClassName
                }
              >
                Report
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// NavbarThree.displayName = "NavbarThree";

const ThemeSwitcher = ({ ToggleTheme }) => {
  return (
    <>
      <button
        onClick={ToggleTheme}
        className=" md:mr-5 mr-3"
        type="button"
        id="headlessui-listbox-button-4"
        aria-haspopup="true"
        aria-expanded="false"
        data-headlessui-state=""
        aria-labelledby="headlessui-listbox-label-3 headlessui-listbox-button-4"
      >
        <span className="dark:hidden">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              className="fill-sky-400/20 stroke-sky-500"
            ></path>
            <path
              d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
              className="stroke-sky-500"
            ></path>
          </svg>
        </span>
        <span className="hidden dark:inline">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
              className="fill-sky-400/20"
            ></path>
            <path
              d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
              className="fill-sky-500"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
              className="fill-sky-500"
            ></path>
          </svg>
        </span>
      </button>
    </>
  );
};

export default Navbar;
