import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal, setUser } from "../redux/reducers/userSlice";
import { submitButtonClassUsed } from "../ClassNames";
import axiosInstance from "../api/axios";
import { useNotificationContext } from "../contexts/NotificationContext";
import { getUser } from "./Navbar";

const Login = () => {
  const [signupForm, setSingupForm] = useState(false);
  const { loginModal } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(loginModal);

  useEffect(() => {
    if (loginModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [loginModal]);

  if (!loginModal) {
    return;
  }

  return (
    <div
      onClick={() => {
        dispatch(setLoginModal(false));
      }}
      className="fixed pin bg-black/80 z-10 w-screen h-screen flex items-center justify-center"
    >
      <section
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-full md:max-w-lg "
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full relative bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 cursor-pointer absolute right-5 top-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setLoginModal(false));
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {signupForm ? "Signup" : "Sign in"} to your account
              </h1>

              {signupForm ? (
                <SignupForm setSingupForm={setSingupForm} />
              ) : (
                <LoginForm setSingupForm={setSingupForm} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const LoginForm = ({ setSingupForm }) => {
  const { showNotification } = useNotificationContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@cgcjhanjeri\.in$/;

  const dispatch = useDispatch();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!emailPattern.test(e.target.value)) {
      // setError("Email should end with @cgcjhanjeri.in");
      setError(true);
    } else {
      setError(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post("/users/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", data?.token);
      const user = await getUser();
      console.log(user);
      dispatch(setUser(user));
      dispatch(setLoginModal(false));
      // showNotification("success", "OTP Sent!", 2000, "top", "OTP Sent!");
    } catch (error) {
      console.log(error);
    }

    // Clear any previous error message
    setError("");

    // Perform your login logic here
    // ...
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            error ? "border-red-500 focus:border-none" : ""
          }`}
          placeholder="student@cgcjhanjeri.in"
          required=""
        />
        {error && (
          <p className="text-xs mt-1 text-red-500">
            Kindly user your College email id !
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required=""
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-start">{/* Checkbox and label */}</div>
        <a
          href="#"
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Forgot password?
        </a>
      </div>
      <button type="submit" className={submitButtonClassUsed}>
        Sign in
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?{" "}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSingupForm(true);
          }}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

export const SignupForm = ({ setSingupForm }) => {
  const { showNotification } = useNotificationContext();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    otp: "",
  });

  const [error, setError] = useState(false);
  const [optSent, setOtpSent] = useState(false);

  const dispatch = useDispatch();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@cgcjhanjeri\.in$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/users/sendotp", {
        email: formData.email,
      });
      setOtpSent(true);
      showNotification("success", "OTP Sent!", 2000, "top", "OTP Sent!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // if (!emailPattern.test(formData?.email)) {
      //   setError("Email should end with @cgcjhanjeri.in");
      //   return;
      // }

      const { data } = await axiosInstance.post("/users/signup", formData);

      localStorage.setItem("token", data?.token);
      const user = await getUser();
      console.log(user);
      dispatch(setUser(user.user));
      dispatch(setLoginModal(false));
      // showNotification("success", "OTP Sent!", 2000, "top", "OTP Sent!");
    } catch (error) {
      console.log(error);
    }

    // Clear any previous error message
    setError("");

    // Perform your login logic here
    // ...
  };

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      {/* username input */}
      <div>
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Choose a username"
          required=""
          onChange={handleChange}
          value={formData?.username}
        />
      </div>

      {/* password input */}
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required=""
          onChange={handleChange}
          value={formData?.password}
        />
      </div>

      {/* email input */}
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            error ? "border-red-500 focus:border-none" : ""
          }`}
          placeholder="student@cgcjhanjeri.in"
          required=""
          onChange={handleChange}
          value={formData?.email}
        />
      </div>

      {formData?.email !== "" && (
        <button
          type="button"
          onClick={sendOtp}
          className={`${submitButtonClassUsed} w-14`}
        >
          Verify Email
        </button>
      )}
      {/* verify otp */}
      {optSent && (
        <div>
          <label
            htmlFor="otp"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Enter OTP
          </label>
          <input
            type="number"
            name="otp"
            id="otp"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your Otp here"
            required={true}
            onChange={handleChange}
            value={formData?.otp}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              required=""
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="remember"
              className="text-gray-500 dark:text-gray-300"
            >
              Remember me
            </label>
          </div>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Forgot password?
        </a>
      </div>

      <button type="submit" className={submitButtonClassUsed}>
        Sign up
      </button>
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don’t have an account yet?{" "}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSingupForm(false);
          }}
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default Login;
