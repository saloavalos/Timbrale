import { useState, useEffect } from "react";
// Socket.io
import { io } from "socket.io-client";
// Components
import Navbar from "./components/Navbar";
// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// Context
import { MainContext } from "./contexts/MainContext";
import PopupRing from "./components/PopupRing";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [errorLoginIn, setErrorLoginIn] = useState("");
  const [isLoginIn, setIsLoginIn] = useState(true);
  // To use access to current user data in child compnents
  const [currentUserData, setCurrentUserData] = useState({});
  const [hasProblemsConnectingToServer, setHasProblemsConnectingToServer] =
    useState(false);
  const [isRingRequest, setIsRingRequest] = useState(false);
  // it store the username which he will try to use to log in
  const [user, setUser] = useState("");

  // If the server/socket has some changes we check them with .on
  // as long as "socket state" is not null
  useEffect(() => {
    // To avoid have multiple socket connnections on same tab of browser
    if (!socket) {
      // I use this url instead of localhost because doing it this way I can access from any device on same network
      setSocket(io("http://192.168.100.150:1010"));
      // const socket = io("http://localhost:1010");
      console.log("Se crea una nueva conexion socket");
    }

    // If server restarts or something similar
    socket?.on("disconnect", () => {
      // To redirect to login and if needed login automatically
      // bc maybe user is logged out, or for example maybe the server was restarted or closed
      setIsLoggedIn(false);
      // Maybe was it was disconnect bc of a server restart so,
      // we start the loading animation for the login process, but this animation covers the whole page
      setIsLoginIn(true);
      console.log("Disconnected from server");

      // Try to reset socket manully
      setSocket(null);
    });

    // If there was an error trying to connect to server
    socket?.on("connect_error", (error) => {
      console.log("There was an error: " + error);
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
          setIsLoginIn(false);
        }, 1000);
      } else {
        setIsLoginIn(false);
        setErrorLoginIn("*Usuario no encontrado");
      }
    });

    socket?.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });

    socket?.on("ringRequest", ({ sender, priority }) => {
      //
      setIsRingRequest(true);
    });

    // when it connects to the server
    socket?.on("connect", () => {
      console.log("Client - connected");
      // If isn't null it means there was a user logged in
      if (localStorage.getItem("username") !== null) {
        // we get username and pass it to the state, so that the useEffect automatically tries to log in the user again
        setUser(localStorage.getItem("username"));

        console.log("en logon activa animation");
        // To redirect to login and if needed login automatically
        setIsLoggedIn(false);
        // Maybe there was a hot refresh so,
        // we start the loading animation for the login process, but this animation covers the whole page
        setIsLoginIn(true);
      } else {
        setIsLoginIn(false);
      }
    });

    socket?.on("reconnect", () => {
      console.log("reconnecting");
    });
  }, [socket]);

  return (
    <div>
      {
        // Notifications from other online user calling to you
        isRingRequest && <PopupRing sender={"rrg"} />
      }
      <MainContext.Provider
        value={{
          socket,
          isLoginIn,
          setIsLoginIn,
          errorLoginIn,
          setErrorLoginIn,
          currentUserData,
          setUser,
        }}
      >
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="px-4 flex justify-center mt-6">
          {hasProblemsConnectingToServer ? (
            <div className="flex flex-col justify-center items-center h-[75vh]">
              <p>Imposible conectarse al servidor.</p>{" "}
              <p>Sigue intentando o intenta más tarde</p>{" "}
            </div>
          ) : !isLoggedIn ? (
            <Login user={user} />
          ) : (
            <Dashboard onlineUsers={onlineUsers} />
          )}
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default App;
