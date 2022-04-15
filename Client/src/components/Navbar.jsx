import { useState, useEffect, useContext } from "react";
import userProfilePhoto from "/src/assets/user-profile.png";
// Context
import { MainContext } from "../contexts/MainContext";

const Navbar = ({ isLoggedIn, setIsLoggedIn, onlineUsers }) => {
  const [isProfileMenuActive, setIsProfileMenuActive] = useState(false);
  const [currentUserActiveSessions, setCurrentUserActiveSessions] = useState(0);

  // Context values
  const { socket, currentUserData, setIsLoginIn, setUser } =
    useContext(MainContext);

  const handleLogout = () => {
    // Clear username stored in localStorage
    localStorage.removeItem("username");
    setIsProfileMenuActive(false);
    // It notifies all online user that this user left
    socket.disconnect();
  };

  const handleLogoutAllSessions = () => {
    setIsProfileMenuActive(false);
    socket?.emit("logoutAllSessions", { username: currentUserData.username });
  };

  useEffect(() => {
    if (onlineUsers) {
      onlineUsers.map((eachUser) => {
        if (eachUser.username === currentUserData.username) {
          console.log("llegaaaaa aqui");
          setCurrentUserActiveSessions(eachUser.socketID.length);
        }
      });
    }
    console.log("currentUserActiveSessions: " + currentUserActiveSessions);
  }, [onlineUsers]);

  useEffect(() => {
    // When the user closes all opened sessions and "profile menu" is visible
    // in any opened session it should be hide automatically
    if (!socket) {
      setIsProfileMenuActive(false);
    }
  }, [socket]);

  return (
    <nav className="sticky top-0 z-30 bg-white">
      {
        // dim effect
        isProfileMenuActive && (
          <div className="bg-header w-full h-screen absolute opacity-60 z-10"></div>
        )
      }
      <div className="flex justify-between items-center py-2 px-3">
        <div className="w-3/5">
          <img src="timbrale-logo.png" alt="Logo" />
        </div>
        <div className=" md:items-center relative z-20">
          <div
            className={`w-14 md:mr-2 cursor-pointer ${
              !isLoggedIn ? "invisible" : ""
            }`}
            onClick={() => setIsProfileMenuActive(!isProfileMenuActive)}
          >
            <img src={userProfilePhoto} alt="Foto perfil" />
          </div>

          {/* Profile menu */}
          <ul
            className={`${
              isProfileMenuActive ? "visible" : "hidden"
            } absolute w-max mt-2 shadow-md rounded-md right-0 pt-4 pb-[1.1rem] px-6 text-left bg-white space-y-3 `}
          >
            <li className="text-primary font-semibold text-xl cursor-pointer">
              {currentUserData.username}
            </li>
            <li className="font-regular text-lg cursor-pointer">
              Editar perfil
            </li>
            <li
              className="font-regular text-lg cursor-pointer"
              onClick={handleLogout}
            >
              Cerrar sesión
            </li>
            {currentUserActiveSessions > 1 && (
              <li
                className="font-regular text-lg cursor-pointer"
                onClick={handleLogoutAllSessions}
              >
                Cerrar todas las sesiones
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
