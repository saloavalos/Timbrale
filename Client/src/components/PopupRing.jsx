import { useEffect, useState, useContext } from "react";
import BellIcon from "./BellIcon";
import { ButtonRinging } from "./Button";
// Palette of colors
import colors from "../style/colors.json";
// Context
import { MainContext } from "../contexts/MainContext";

const PopupRing = ({ ringSender, ringPriority, setIsRinging }) => {
  const [ringIconSize, setRingIconSize] = useState("140");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  // Context values
  const { socket } = useContext(MainContext);

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

  const handleRingSeen = () => {
    socket?.emit("ringSeen", { sender: ringSender });
    setIsRinging(false);
  };

  return (
    <div className="bg-header/[.60] w-full h-screen fixed p-8 z-40 flex items-center">
      <div className="bg-white rounded-md px-6 pt-8 pb-10 text-center h-fit w-full">
        <div className="mb-8">
          <p className="font-semibold text-3xl mb-2">Timbrando</p>
          <span className="text-2xl text-paragraph">{ringSender}</span>
        </div>
        <div className="min-h-[10rem] flex justify-center mb-6">
          <BellIcon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            size={ringIconSize}
          />
        </div>
        <ButtonRinging
          text={"Entendido"}
          onClick={handleRingSeen}
          primaryColor={primaryColor}
        />
        <p className="mt-4 underline">Mandar respuesta personalizada</p>
      </div>
    </div>
  );
};

export default PopupRing;
