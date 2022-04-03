import { useState, useEffect } from "react";
// Spinner
import SyncLoader from "react-spinners/SyncLoader";
// Components
import BellIcon from "../components/BellIcon";
import RingEachUser from "../components/RingEachUser";
// import { getNoUserOnlineImagePath } from "../components/randomNoUsersOnlineImage";

const Dashboard = ({ onlineUsers }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsersToShow, setOnlineUsersToShow] = useState(0);

  useEffect(() => {
    if (onlineUsers !== 0) {
      setOnlineUsersToShow(onlineUsers);
      setIsLoading(false);
    }
  }, [onlineUsers]);

  // Image paths available to use when there is no users online
  const noUserImagePaths = [
    "/src/assets/no-users-online/img-1.svg",
    "/src/assets/no-users-online/img-2.svg",
    "/src/assets/no-users-online/img-3.svg",
  ];

  // To get randomly an image path
  const getNoUserOnlineImagePath =
    noUserImagePaths[Math.floor(Math.random() * noUserImagePaths.length)];

  return (
    <>
      {isLoading ? (
        // While all we prepare all the information to show in dashboard we show a loading animation
        <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
          <SyncLoader loading={isLoading} size={12} color={"#8357ff"} />
        </div>
      ) : onlineUsersToShow === 1 ? (
        // If the current user that is logged in, is the only user online
        <div>
          <img
            src={getNoUserOnlineImagePath}
            alt="Eres el unico usuario en linea"
          />
          <span>No hay nadie a quien timbrarle</span>
        </div>
      ) : (
        <div>
          <p className="mb-2 font-regular text-lg text-header text-center">
            Usuarios en linea (
            <span className="text-paragraph">{onlineUsersToShow}</span>)
          </p>
          <div className="cursor-pointer relative bg-white flex items-center justify-center border border-header rounded-md py-1.5 px-3 before:absolute before:top-2 before:left-2 before:w-full before:h-full before:border before:border-primary before:rounded-md before:-z-10">
            <p className="mr-2 text-2xl font-semibold">Timbrarle a todos</p>
            <BellIcon primaryColor={"#8357ff"} secondaryColor={"#DACDFF"} />
          </div>
          <RingEachUser />
        </div>
      )}
    </>
  );
};

export default Dashboard;
