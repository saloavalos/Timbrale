import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
// Socket.io
import { io } from "socket.io-client";
// nanoid
import { nanoid } from "nanoid";

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
    <div className="App">
      <p>fefe</p>
      <p>fefe</p>
    </div>
  );
}

export default App;
