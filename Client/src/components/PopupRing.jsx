import { useEffect, useState, useContext } from "react";
import BellIcon from "./BellIcon";
import { ButtonRinging } from "./Button";
// Palette of colors
import colors from "../style/colors.json";
// Context
import { MainContext } from "../contexts/MainContext";

const PopupRing = ({
  ringSender,
  ringPriority,
  setIsRinging,
  ringToEveryoneSeenBy,
}) => {
  const [ringIconSize, setRingIconSize] = useState("140");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  // Context values
  const { socket, currentUserData, onlineUsers } = useContext(MainContext);

  useEffect(() => {
    // Ring to all online users
    if (!ringPriority) {
      setPrimaryColor(colors.primary);
      setSecondaryColor(colors.secondary);
      console.log("Timbre normal");
    } else if (ringPriority === 1) {
      // Normal priority
      setPrimaryColor(colors.yellowPrimary);
      setSecondaryColor(colors.yellowSecondary);
      console.log("Timbre urgente");
    } else if (ringPriority === 2) {
      // Urgent
      setPrimaryColor(colors.redPrimary);
      setSecondaryColor(colors.redSecondary);
      console.log("Timbre urgente");
    } else {
      // Other
      setPrimaryColor(colors.otherPrimary);
      setSecondaryColor(colors.otherSecondary);
      console.log("Timbre otro");
    }
    // TODO - remove "ringPriority" bc it just needs to render once
    // but for developing is easier to see changes without refreshing
  }, [ringPriority]);

  const handleRingingSeen = () => {
    socket?.emit("ringingSeen", {
      sender: ringSender,
      receiver: currentUserData.username, // Who saw the popup
      priority: ringPriority,
    });
    // setIsRinging(false);
    console.log(
      "%chandleRingingSeen: " + currentUserData.username,
      "font-size: 20px; background: blue;"
    );
  };

  {
  }
  return (
    <div className="bg-header/[.60] w-full h-screen fixed z-40">
      <div className="bg-white z-40 fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] rounded-md max-w-[19rem] px-6 pt-8 pb-10 text-center h-fit w-full">
        {/* TODO - Delete this div bc is unnecessary */}
        <div>
          <p className="font-semibold text-3xl mb-2">Timbrando</p>
          <span className="text-2xl text-paragraph">{ringSender}</span>
        </div>
        <div className="min-h-[10rem] flex justify-center mb-4 mt-6">
          <BellIcon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            size={ringIconSize}
          />
        </div>
        {
          // If this user has not seen the ring yet
          // !(currentUserData.username in ringToEveryoneSeenBy) ? (
          !ringToEveryoneSeenBy.find(
            (eachUser) => eachUser.username === currentUserData.username
          ) ? (
            <div>
              <ButtonRinging
                text={"Entendido"}
                onClick={handleRingingSeen}
                primaryColor={primaryColor}
              />
              <p className="mt-4 underline text-base">
                Mandar respuesta personalizada
              </p>
            </div>
          ) : (
            <p>
              Visto por{" "}
              <span className="font-semibold">
                ({ringToEveryoneSeenBy.length}/{onlineUsers.length - 1})
              </span>{" "}
              usuarios
            </p>
          )
        }
      </div>
    </div>
  );
};

export default PopupRing;
