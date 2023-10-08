/* eslint-disable react/react-in-jsx-scope */

import { useNotificationContext } from "../../contexts/NotificationContext";

const CustomNotification = () => {
  const { hideNotification, notification } = useNotificationContext();

  // console.log(notification);

  return (
    <div
      // className={`notification notification-${notification?.type} notification-${notification?.position}`}
      className={` ${
        notification ? "top-14" : "-top-60"
      } fixed  z-50 right-1/2 px-6  transition-all translate-x-2/4 w-1/2 p-4 mb-4 text-sm 
       ${notification?.type === "success" && "bg-green-400 text-green-900  "}
        ${notification?.type === "error" && "bg-red-500  text-white "}
        ${notification?.type === "info" && "bg-sky-400  text-sky-900  "}
      rounded-lg 
      text-center min-w-max `}
    >
      <span className="font-medium mr-5">
        {notification?.custom ? notification?.custom : notification?.message}
      </span>
      <button
        className="absolute right-4 translate-y-[-50%] rotate-45 top-1/2  font-bold text-lg"
        onClick={hideNotification}
      >
        +
      </button>
    </div>
  );
};

export default CustomNotification;
