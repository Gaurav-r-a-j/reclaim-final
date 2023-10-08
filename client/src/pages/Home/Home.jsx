import { useState } from "react";
import Cards from "../../components/Cards";
import Reviews from "../../components/Reviews";
import GetStarted from "../../components/GetStarted";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="  ">
      <div className="py-5 md:px-10 px-3 relative isolate ">
        {/* landing page */}
        <div className="relative isolate  " id="home">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
          </div>
          <div>
            <div className="relative pt-36 ml-auto pb-28 ">
              <div className="lg:w-2/3 text-center mx-auto">
                <h1
                  style={{ fontFamily: "Kalam" }}
                  className="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl mb-3"
                >
                  ReClaim
                  {/* <span className="text-primary dark:text-white">
                    Get your Lost Found !
                  </span> */}
                </h1>
                <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Get your Lost Found !
                  </span>
                </button>

                <div className="mt-8 text-gray-700 dark:text-gray-300 md:text-2xl text-sm">
                  Lost and Found Hub for College Students
                </div>

                <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6 md:mx-0 mx-5">
                  <Link
                    to="/found"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-white">
                      Found Item
                    </span>
                  </Link>

                  <Link
                    to="/lost"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-primary dark:text-white">
                      Lost Item
                    </span>
                  </Link>
                </div>
                {/* <div className="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
                  <div className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                      The Best Place
                    </h6>
                    <p className="mt-2 text-gray-500">Some text here</p>
                  </div>
                  <div className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                      to find
                    </h6>
                    <p className="mt-2 text-gray-500">Some text here</p>
                  </div>
                  <div className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                      your lost Item
                    </h6>
                    <p className="mt-2 text-gray-500">Some text here</p>
                  </div>
                </div> */}
              </div>
            </div>
            <Light2 />
          </div>

          <Light1 />
        </div>

        <Cards />
        {/* <GetStarted /> */}
        <Reviews />
      </div>
    </div>
  );
};

export const Light1 = () => {
  return (
    <div
      className="absolute inset-x-0 -top-80 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
};

export const Light2 = () => {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-50rem)]"
      aria-hidden="true"
    >
      <div
        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
};

export default Home;
