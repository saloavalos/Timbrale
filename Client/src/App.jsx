import { useState, useEffect } from "react";
// Socket.io
import { io } from "socket.io-client";
// nanoid
import { nanoid } from "nanoid";
// Components
import Navbar from "./components/Navbar";
// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// Context
import { MainContext } from "./contexts/MainContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [errorLoginIn, setErrorLoginIn] = useState("");
  const [isLoginIn, setIsLoginIn] = useState(false);
  // To use access to current user data in child compnents
  const [currentUserData, setCurrentUserData] = useState({});
  const [hasProblemsConnectingToServer, setHasProblemsConnectingToServer] =
    useState(false);

  // If the server/socket has some changes we check them with .on
  // as long as "socket state" is not null
  useEffect(() => {
    if (!socket) {
      // I use this url instead of localhost because doing it this way I can access from any device on same network
      setSocket(io("http://192.168.100.150:1010"));
      // const socket = io("http://localhost:1010");

      // random id of length 4
      // console.log("nanoid: " + nanoid(4));
    }

    // If server restarts or something similar
    socket?.on("disconnect", () => {
      setHasProblemsConnectingToServer(true);
    });

    // If there was an error trying to connect to server
    socket?.on("connect_error", () => {
      // Stops trying to reconnect/establish the connection
      socket.disconnect();
      setHasProblemsConnectingToServer(true);
    });

    socket?.on("loginResponse", ({ loginStatus, userData }) => {
      if (loginStatus) {
        console.log("asignando username a localStorage");
        setCurrentUserData(userData);
        localStorage.setItem("username", userData.username);
        // I do not need a loading animation because the process is so quick
        // but I wanted implement it
        setTimeout(() => {
          // With this delay it stays in the login, showing in whole page loading animation
          setIsLoggedIn(loginStatus);
        }, 1000);
      } else {
        setIsLoginIn(false);
        setErrorLoginIn("*Usuario no encontrado");

        // if (localStorage.getItem("username") !== null) {
        //   // Clear username stored in localStorage
        //   localStorage.removeItem("username");
        // }
      }
    });

    socket?.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });

    if (!socket) {
      setIsLoggedIn(false);
    }
  }, [socket]);

  return (
    <div>
      <MainContext.Provider
        value={{
          socket,
          isLoginIn,
          setIsLoginIn,
          errorLoginIn,
          setErrorLoginIn,
          currentUserData,
        }}
      >
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setSocket={setSocket}
        />
        <div className="px-4 flex justify-center mt-6">
          {hasProblemsConnectingToServer ? (
            <div className="flex flex-col justify-center items-center h-[75vh]">
              <p>Imposible conectarse al servidor.</p>{" "}
              <p>Sigue intentando o intenta más tarde</p>{" "}
            </div>
          ) : !isLoggedIn ? (
            <Login />
          ) : (
            <Dashboard onlineUsers={onlineUsers} />
          )}
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default App;
