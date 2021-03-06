import { useState, useEffect, useContext } from "react";
// Spinner
import SyncLoader from "react-spinners/SyncLoader";
// Components
import BellIcon from "../components/BellIcon";
import RingEachUser from "../components/RingEachUser";
// Context
import { MainContext } from "../contexts/MainContext";

const Dashboard = ({ onlineUsers }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOtherContent, setIsLoadingOtherContent] = useState(true);

  // Context values
  const { socket, currentUserData, setIsRingingToEveryone } =
    useContext(MainContext);

  useEffect(() => {
    if (onlineUsers) {
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

  const handleRingAllUsers = () => {
    // Show sending ring to everyone animation
    setIsRingingToEveryone(true);
    socket?.emit("ringAllUsers", {
      sender: currentUserData.username,
      priority: 0,
    });
  };

  return isLoading && isLoadingOtherContent ? (
    // While all we prepare all the information to show in dashboard we show a loading animation
    <div className="flex justify-center items-center h-[65vh]">
      <SyncLoader loading={isLoading} size={12} color={"#8357ff"} />
    </div>
  ) : onlineUsers.length === 1 ? (
    // If the current user that is logged in, is the only user online
    <div>
      <img
        className={`${isLoadingOtherContent ? "hidden" : "visible"} `}
        onLoad={() => setIsLoadingOtherContent(false)}
        src={getNoUserOnlineImagePath}
        alt="Eres el unico usuario en linea"
      />
      <p className={`${isLoadingOtherContent ? "hidden" : "visible"} `}>
        No hay nadie a quien timbrarle
      </p>
    </div>
  ) : (
    <div className="flex flex-col items-center w-full">
      <p className="mb-2 font-regular text-lg text-header text-center">
        Usuarios en linea (
        <span className="text-paragraph">{onlineUsers.length - 1}</span>)
      </p>
      <div
        className="cursor-pointer relative w-full max-w-sm bg-white flex items-center justify-center border border-header rounded-md py-1.5 px-3 before:absolute before:top-2 before:left-2 before:w-full before:h-full before:border before:border-primary before:rounded-md before:-z-10"
        onClick={handleRingAllUsers}
      >
        <p className="mr-2 text-2xl font-semibold">Timbrarle a todos</p>
        <BellIcon primaryColor={"#8357ff"} secondaryColor={"#DACDFF"} />
      </div>

      {
        // Render one component per user but me (the current user)
        onlineUsers.map(
          (eachUserData, index) =>
            eachUserData.username !== currentUserData.username && (
              <RingEachUser key={index} eachUserData={eachUserData} />
            )
        )
      }
    </div>
  );
};

export default Dashboard;
