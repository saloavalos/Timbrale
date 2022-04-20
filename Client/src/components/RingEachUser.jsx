import { useState, useContext, useEffect } from "react";
import BellIcon from "./BellIcon";
import expandIcon from "../assets/expand-icon.svg";
// Spinner
import MoonLoader from "react-spinners/MoonLoader";
// Context
import { MainContext } from "../contexts/MainContext";
import Button from "./Button";

const RingEachUser = ({ eachUserData }) => {
  const [ringIconSize, setringIconSize] = useState("55");
  // Context values
  const { socket, user, ringReceivers, setRingReceivers } =
    useContext(MainContext);

  const handleRingToAnotherUser = (priority) => {
    socket?.emit("ringToUser", {
      sender: user,
      receiver: eachUserData.username,
      priority: priority,
    });
    // Add new ringReceiver to array
    setRingReceivers([...ringReceivers, eachUserData.username]);
  };

  const handleCancelRinging = () => {
    socket?.emit("cancelRinging", {
      sender: user,
      receiver: eachUserData.username,
    });
  };

  // Fix for MoonLoader spinner
  const override = `
    display: flex;
  `;

  useEffect(() => {
    console.log(ringReceivers);
  }, [ringReceivers]);

  return (
    <div className="mt-8 border rounded-md p-4">
      {!ringReceivers.find(
        (eachRingReceiver) => eachRingReceiver === eachUserData.username
      ) ? (
        <>
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

          <div className="flex justify-center space-x-6 mt-4 children:">
            <div
              className="flex items-center flex-col hover:cursor-pointer"
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
              className="flex items-center flex-col hover:cursor-pointer"
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
        </>
      ) : (
        // show loading animation when we are sending a ring
        <div className="text-center">
          <span className=" text-xl">Timbrando a </span>
          <span className="text-paragraph text-xl font-semibold">
            {eachUserData.username}
          </span>
          <div className="mt-3 flex justify-center">
            <MoonLoader
              loading={ringReceivers.find(
                (eachRingReceiver) => eachRingReceiver === eachUserData.username
              )}
              size={38}
              color={"#8357ff"}
              speedMultiplier={0.75}
              css={override}
            />
          </div>
          <div className="mt-4 px-10">
            <Button text={"Cancelar"} onClick={handleCancelRinging} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RingEachUser;
