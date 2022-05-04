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
import PopupRingingToEveryone from "./components/PopupRingingToEveryone";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [ringToEveryoneSeenBy, setRingToEveryoneSeenBy] = useState([]);
  const [errorLoginIn, setErrorLoginIn] = useState("");
  const [isLoginInAutomatically, setIsLoginInAutomatically] = useState(true);
  const [isLoginInManually, setIsLoginInManually] = useState(false);

  // To access to current user data in child components
  const [currentUserData, setCurrentUserData] = useState({});
  const [hasProblemsConnectingToServer, setHasProblemsConnectingToServer] =
    useState(false);
  // it store the username which he will try to use to log in
  const [user, setUser] = useState("");
  // For popup to show when someone is calling you
  const [isRinging, setIsRinging] = useState(false);
  const [ringSender, setRingSender] = useState("");
  const [ringPriority, setRingPriority] = useState(0);
  // used in Dashboard to know which users we are ringing to
  const [ringReceivers, setRingReceivers] = useState([]);
  const [isRingingToEveryone, setIsRingingToEveryone] = useState(false);

  // If the server/socket has some changes we check them with .on
  // as long as "socket state" is not null
  useEffect(() => {
    // To avoid have multiple socket connnections on same tab of browser
    if (!socket) {
      // I use this url instead of localhost because doing it this way I can access from any device on same network
      setSocket(io("http://192.168.100.150:1010"));
      // const socket = io("http://localhost:1010");
      console.log("a new socket connection is created");
    }

    socket?.on("loggedOutFromAllSessions", () => {
      // Clear username stored in localStorage
      localStorage.removeItem("username");
      socket.disconnect();
    });

    // If server restarts or something similar
    socket?.on("disconnect", () => {
      // Clear user state, so that when login component is mounted
      // it doesn't tries to use user to log in
      setUser("");
      // To redirect to login and if needed login automatically
      // bc maybe user is logged out, or for example maybe the server was restarted or closed
      setIsLoggedIn(false);
      // Maybe was it was disconnect bc of a server restart so,
      // we start the loading animation for the login process, but this animation covers the whole page
      setIsLoginInAutomatically(true);
      console.log("Disconnected from server");

      // Try to reset socket manually
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
        console.log("assigning username to localStorage");
        setCurrentUserData(userData);
        localStorage.setItem("username", userData.username);
        // I do not need a loading animation because the process is so quick
        // but I wanted implement it
        setTimeout(() => {
          // With this delay it stays in the login, showing in whole page loading animation
          setIsLoggedIn(loginStatus);
          setIsLoginInAutomatically(false);
          setIsLoginInManually(false);
        }, 1000);
      } else {
        setIsLoginInAutomatically(false);
        setIsLoginInManually(false);
        setErrorLoginIn("*Usuario no encontrado");
      }
    });

    socket?.on("updateOnlineUsers", (onlineUsersData) => {
      setOnlineUsers(onlineUsersData);
      console.log("onlineUsers data: " + JSON.stringify(onlineUsersData));
    });

    socket?.on("updateRingToEveryoneSeenBy", (ringToEveryoneSeenBy) => {
      setRingToEveryoneSeenBy(ringToEveryoneSeenBy);
      console.log(
        "----Users who have seen the ring to everyone: " +
          JSON.stringify(ringToEveryoneSeenBy)
      );
    });

    // when it connects to the server
    socket?.on("connect", () => {
      console.log("Client - connected");
      // If isn't null it means there was a user logged in
      if (localStorage.getItem("username") !== null) {
        // we get username and pass it to the state, so that the useEffect automatically tries to log in the user again
        setUser(localStorage.getItem("username"));

        // To redirect to login and if needed login automatically
        setIsLoggedIn(false);
        // Maybe there was a hot refresh so,
        // we start the loading animation for the login process while it tries to automatically login the user, (this animation covers the whole page)
        setIsLoginInAutomatically(true);
      } else {
        setIsLoginInAutomatically(false);
      }
    });
  }, [socket]);

  useEffect(() => {
    // To avoid run on first render
    if (isRingingToEveryone) {
      // If all the users to whom the ring was sent saw it
      if (ringToEveryoneSeenBy.length === onlineUsers.length - 1) {
        // Hide the individual rings popup in all receivers
        alert(ringToEveryoneSeenBy.length);
        setIsRinging(false);
      }
    }
  }, [ringToEveryoneSeenBy]);

  useEffect(() => {
    // When you are ringing to someone from another session
    socket?.on("sendingRinging", ({ ringingTo }) => {
      // We update the receivers, so that in dashboard we show the
      // sending ring animation where it correspond
      ringingTo.map((eachUserToRing) => {
        setRingReceivers([...ringReceivers, eachUserToRing]);
      });
      console.log("ringTo: " + ringingTo);
      console.log("ringReceivers: " + ringReceivers);
    });

    socket?.on("ringSeen", (receiver) => {
      // Hide the individual ring popup in receiver
      setIsRinging(false);
      // in case was a ring to everyone
      // but maybe we should hide it once all the receivers have seen the ring and not just one
      // setIsRingingToEveryone(false);
      // Remove ringReceiver from array, loop and save receiver that are not the current receiver
      // So that the sender is not longer showing the sending ring animation
      console.log("receiver: " + receiver);
      setRingReceivers(
        ringReceivers.filter(
          (eachRingReceiver) => eachRingReceiver !== receiver
        )
      );
    });

    socket?.on("ringCanceled", (receiver) => {
      // Hide the ring popup in receiver
      setIsRinging(false);
      // If we have canceled a ring that is not to everyone
      // Remove ringReceiver from array, loop and save receivers that are not the current receiver
      // So that the sender is not longer showing the sending ring animation
      setRingReceivers(
        ringReceivers.filter(
          (eachRingReceiver) => eachRingReceiver !== receiver
        )
      );

      // Hide popup in sender
      setIsRingingToEveryone(false);

      // Reset value
      setRingToEveryoneSeenBy([]);
    });

    return () => {
      socket?.off("sendingRinging");
      socket?.off("ringSeen");
      socket?.off("ringCanceled");
    };
  }, [ringReceivers, isRinging]);

  useEffect(() => {
    // Reset value
    setRingToEveryoneSeenBy([]);
    console.log("****first");
  }, []);

  useEffect(() => {
    socket?.on("ringReceived", ({ sender, priority }) => {
      // Only show receiving ringing popup to receivers
      if (sender !== currentUserData.username) {
        setRingSender(sender ?? null);
        setRingPriority(priority);
        setIsRinging(true);
        console.log("Ring received from : " + sender);
      } else {
        // and if the sender has multiple sessions opened
        setIsRingingToEveryone(true);
      }
    });

    return () => {
      socket?.off("ringReceived");
    };
  }, [currentUserData]);

  useEffect(() => {
    if (isRingingToEveryone) {
      // Clear ringReceiver array, in case it was sending individual rings
      setRingReceivers([]);
    }
  }, [isRingingToEveryone]);

  return (
    <div>
      <MainContext.Provider
        value={{
          socket,
          errorLoginIn,
          setErrorLoginIn,
          currentUserData,
          setUser,
          ringReceivers,
          setRingReceivers,
          setIsRingingToEveryone,
          onlineUsers,
        }}
      >
        {
          // Notifications from other online user calling to you
          isRinging && (
            <PopupRing
              ringSender={ringSender}
              ringPriority={ringPriority}
              setIsRinging={setIsRinging}
              ringToEveryoneSeenBy={ringToEveryoneSeenBy}
            />
          )
        }

        {
          // If we are the sender and we're ringing to all online users
          isRingingToEveryone && (
            <PopupRingingToEveryone
              ringToEveryoneSeenBy={ringToEveryoneSeenBy}
            />
          )
        }
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="px-4 flex justify-center items-center mt-4 mb-8">
          {hasProblemsConnectingToServer ? (
            <div className="flex flex-col justify-center items-center h-[75vh]">
              <p>Imposible conectarse al servidor.</p>{" "}
              <p>Sigue intentando o intenta más tarde</p>{" "}
            </div>
          ) : !isLoggedIn ? (
            <Login
              user={user}
              isLoginInAutomatically={isLoginInAutomatically}
              isLoginInManually={isLoginInManually}
              setIsLoginInManually={setIsLoginInManually}
            />
          ) : (
            <Dashboard onlineUsers={onlineUsers} />
          )}
        </div>
      </MainContext.Provider>
    </div>
  );
}

export default App;
