import { useState, useEffect } from "react";
// Socket.io
import { io } from "socket.io-client";
// nanoid
import { nanoid } from "nanoid";
import BellIcon from "./components/BellIcon";
import Navbar from "./components/Navbar";
import RingEachUser from "./components/RingEachUser";

function App() {
  // const [count, setCount] = useState(0);

  useEffect(() => {
    // I use this url instead of localhost because doing it this way I can access from any device on same network
    const socket = io("http://192.168.100.150:1010");
    // const socket = io("http://localhost:1010");
    console.log(socket);

    // random id of length 4
    console.log("nanoid: " + nanoid(4));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-4">
        <p className="mb-2 mt-6 font-regular text-lg text-header text-center">
          Usuarios en linea (<span className="text-paragraph">2</span>)
        </p>
        <div className="flex items-center justify-center border-[1.5px] border-header rounded-md py-1.5 px-3 w-fit m-auto">
          <p className="mr-2 text-2xl font-semibold">Timbrarle a todos</p>
          <BellIcon primaryColor={"#8357ff"} secondaryColor={"#DACDFF"} />
        </div>
        <RingEachUser />
      </div>
    </div>
  );
}

export default App;
