import { useState, useContext } from "react";
// Spinner
import MoonLoader from "react-spinners/MoonLoader";
import { MainContext } from "../contexts/MainContext";
import Button from "./Button";

const PopupRingingToEveryone = ({ ringToEveryoneSeenBy }) => {
  // Context values
  const { socket, setIsRingingToEveryone, onlineUsers } =
    useContext(MainContext);

  // Fix for MoonLoader spinner
  const override = `
    display: flex;
  `;

  const handleCancelRinging = () => {
    // Hide sending ring to everyone animation
    setIsRingingToEveryone(false);
    socket?.emit("cancelRingToEveryone");
  };

  return (
    // show loading animation when we are sending a ring
    <div className="bg-header/[.60] w-full h-screen fixed z-40">
      <div className="bg-white z-40 fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] rounded-md max-w-[19rem] px-6 pt-8 pb-10 text-center h-fit w-full">
        <p className=" text-xl">Timbrando a </p>
        <span className="text-paragraph text-xl font-semibold">
          {onlineUsers.length === 1
            ? onlineUsers.length - 1 + " usuario en linea"
            : onlineUsers.length - 1 + " usuarios en linea"}
        </span>
        <p>
          Visto por{" "}
          <span className="font-semibold">
            ({ringToEveryoneSeenBy.length}/{onlineUsers.length - 1})
          </span>{" "}
          usuarios
        </p>
        <div className="mt-6 flex justify-center">
          <MoonLoader
            // while a user is missing from seeing the ring
            loading={true}
            size={38}
            color={"#8357ff"}
            speedMultiplier={0.75}
            css={override}
          />
        </div>
        <div className="mt-6 px-10">
          <Button text={"Cancelar"} onClick={handleCancelRinging} />
        </div>
      </div>
    </div>
  );
};

export default PopupRingingToEveryone;
