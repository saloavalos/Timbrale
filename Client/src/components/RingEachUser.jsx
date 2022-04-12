import { useState, useContext } from "react";
import BellIcon from "./BellIcon";
import expandIcon from "../assets/expand-icon.svg";
// Context
import { MainContext } from "../contexts/MainContext";

const RingEachUser = ({ eachUserData }) => {
  const [ringIconSize, setringIconSize] = useState("55");
  // Context values
  const { socket, user } = useContext(MainContext);

  const handleRingToAnotherUser = (priority) => {
    socket?.emit("ringToUser", {
      sender: user,
      receiver: eachUserData.username,
      priority: priority,
    });
  };

  return (
    <div className="mt-8 border rounded-md p-4">
      <div className="flex ">
        <div className="w-14 mr-3">
          <img src="/src/assets/user123-profile.png" alt="Foto perfil" />
        </div>

        <div className="w-full">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">{eachUserData.username}</p>

            {/* TODO - Will be visible when it really expands sth */}
            {/* <div className="cursor-pointer">
              <img src={expandIcon} alt="v" />
            </div> */}
          </div>
          <span className="font-light text-paragraph">
            En clase - termina 12pm
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-4">
        <div
          className="flex items-center flex-col"
          onClick={() => handleRingToAnotherUser(1)}
        >
          <BellIcon
            primaryColor={"#FFE357"}
            secondaryColor={"#FFF7CD"}
            size={ringIconSize}
          />
          <span>Normal</span>
        </div>
        <div
          className="flex items-center flex-col"
          onClick={() => handleRingToAnotherUser(2)}
        >
          <BellIcon
            primaryColor={"#FF5757"}
            secondaryColor={"#FFCDCD"}
            size={ringIconSize}
          />
          <span>Urgente</span>
        </div>
      </div>
    </div>
  );
};

export default RingEachUser;
