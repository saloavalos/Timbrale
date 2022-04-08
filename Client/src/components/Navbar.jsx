import { useState, useContext } from "react";
import userProfilePhoto from "/src/assets/user-profile.png";
// Context
import { MainContext } from "../contexts/MainContext";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isProfileMenuActive, setIsProfileMenuActive] = useState(false);

  // Context values
  const { socket, currentUserData, setIsLoginIn } = useContext(MainContext);

  const handleLogout = () => {
    // socket.emit("logOut", currentUserData.username);
    // Clear username stored in localStorage
    localStorage.removeItem("username");
    setIsProfileMenuActive(false);
    // It notifies all online user that this user left
    socket.disconnect();
    // This stop the animation on login (animation when you click log in)
    setIsLoginIn(false);
    setIsLoggedIn(false);
  };

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
            } absolute w-max mt-2 shadow-md rounded-md right-0 py-4 px-6 text-left bg-white space-y-3 `}
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
