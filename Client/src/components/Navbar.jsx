import { useState } from "react";
import userProfilePhoto from "/src/assets/user-profile.png";

const Navbar = ({ user, isLoggedIn }) => {
  const [isEditProfileMenuActive, setIsEditProfileMenuActive] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {isEditProfileMenuActive && (
        <div className="bg-header w-full h-screen absolute opacity-60 z-10"></div>
      )}
      <div className="flex justify-between items-center py-2 px-3">
        <div className="w-3/5">
          <img src="timbrale-logo.png" alt="Logo" />
        </div>
        <div className=" md:items-center relative z-20">
          <div
            className={`w-14 md:mr-2 cursor-pointer ${
              !isLoggedIn ? "invisible" : ""
            }`}
            onClick={() => setIsEditProfileMenuActive(!isEditProfileMenuActive)}
          >
            <img src={userProfilePhoto} alt="Foto perfil" />
          </div>
          <ul
            className={`${
              isEditProfileMenuActive ? "visible" : "hidden"
            } absolute w-max mt-2 shadow-md rounded-md right-0 py-4 px-6 text-left bg-white space-y-3 `}
          >
            <li className="text-primary font-semibold text-xl cursor-pointer">
              Max
            </li>
            <li className="font-regular text-lg cursor-pointer">
              Editar perfil
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
