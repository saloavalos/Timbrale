import { useEffect, useState } from "react";
import BellIcon from "./BellIcon";
import Button from "./Button";

const PopupRing = ({ ringSender, ringPriority }) => {
  const [ringIconSize, setringIconSize] = useState("140");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  useEffect(() => {
    // Normal priority
    if (!ringPriority) {
      setPrimaryColor("#FFE357");
      setSecondaryColor("#FFF7CD");
      console.log("Timbre normal");
    } else if (ringPriority === 2) {
      // Urgent
      setPrimaryColor("#FF5757");
      setSecondaryColor("#FFCDCD");
      console.log("Timbre urgente");
    } else {
      // Other
      console.log("Timbre otro");
    }
    // TODO - remove "ringPriority" bc it just needs to render once
    // but for developing is easier to see changes without refreshing
  }, [ringPriority]);

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
        <Button text={"Entendido"} />
      </div>
    </div>
  );
};

export default PopupRing;
