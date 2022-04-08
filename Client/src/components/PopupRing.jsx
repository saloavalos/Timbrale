import { useEffect, useState } from "react";
import BellIcon from "./BellIcon";
import Button from "./Button";

const PopupRing = ({ sender, priority }) => {
  const [ringIconSize, setringIconSize] = useState("140");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  useEffect(() => {
    // Normal priority
    if (!priority) {
      setPrimaryColor("#FFE357");
      setSecondaryColor("#FFF7CD");
    } else if (priority === 2) {
      // Urgent
    } else {
      // Other
    }
  }, [priority]);

  return (
    <div className="bg-header/[.60] w-full h-screen fixed p-8 z-40 flex items-center">
      <div className="bg-white rounded-md px-6 pt-8 pb-10 text-center h-fit w-full">
        <div className="mb-8">
          <p className="font-semibold text-3xl mb-2">Timbrando</p>
          <span className="text-2xl text-paragraph">{sender}</span>
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
