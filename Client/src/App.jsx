import { useState, useEffect } from "react";
// Socket.io
import { io } from "socket.io-client";
// nanoid
import { nanoid } from "nanoid";
import BellIcon from "./components/BellIcon";
import Navbar from "./components/Navbar";
import RingEachUser from "./components/RingEachUser";
import Button from "./components/Button";
// Spinner
import SyncLoader from "react-spinners/SyncLoader";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // I use this url instead of localhost because doing it this way I can access from any device on same network
    setSocket(io("http://192.168.100.150:1010"));
    // const socket = io("http://localhost:1010");

    // random id of length 4
    console.log("nanoid: " + nanoid(4));
  }, []);

  const handleLogin = () => {
    if (!username) {
      setError("*El nombre está vacio");
      return;
    } else if (username.length > 8) {
      setError("*El nombre supera 8 caracteres");
      return;
    }

    setIsLoading(true);

    // I do not need a loading animation because the login is so quick
    // but I wanted implement it
    setTimeout(() => {
      setUser(username);
      setIsLoading(false);
    }, 2000);
  };

  // when these is trigger it means we click login button and it was a valid username so we can try to log in
  useEffect(() => {
    // So that it does not run in the first render of the page when its value it's empty
    if (user) {
      socket?.emit("LogIn", user);
      console.log("Mandando a server username:", user);
    }
  }, [user]);

  useEffect(() => {
    socket?.on("loginResponse", (data) => {
      console.log(data.loginStatus);
      setIsLoggedIn(data.loginStatus);
    });
  }, [socket]);

  return (
    <div>
      <Navbar user={user} isLoggedIn={isLoggedIn} />
      <div className="px-4 flex justify-center mt-6">
        {isLoggedIn ? (
          /* This would be the main page that the user sees when is logged in */
          <div>
            <p className="mb-2 font-regular text-lg text-header text-center">
              Usuarios en linea (<span className="text-paragraph">2</span>)
            </p>
            <div className="cursor-pointer relative bg-white flex items-center justify-center border border-header rounded-md py-1.5 px-3 before:absolute before:top-2 before:left-2 before:w-full before:h-full before:border before:border-primary before:rounded-md before:-z-10">
              <p className="mr-2 text-2xl font-semibold">Timbrarle a todos</p>
              <BellIcon primaryColor={"#8357ff"} secondaryColor={"#DACDFF"} />
            </div>
            <RingEachUser />
          </div>
        ) : (
          <div className="relative w-11/12 bg-white border border-header rounded-md pt-4 pb-8 px-4 before:absolute before:top-2 before:left-2 before:w-full before:h-full before:border before:border-primary before:rounded-md before:-z-10">
            <p className="text-center mb-2 font-semibold text-2xl">
              Inicia sesión
            </p>
            <div className="space-y-2 mb-8">
              <p>Nombre</p>
              <input
                type="text"
                placeholder="Fulanito"
                className="w-full border border-header rounded-md py-2 px-3 focus:outline-primary text-xl "
                onChange={(e) => setUsername(e.target.value)}
              />
              {error && <p className="text-redPrimary">{error}</p>}
            </div>
            <Button text={"Iniciar sesión"} onClick={handleLogin} />
            {isLoading && (
              <div className="flex justify-center mt-8">
                <SyncLoader loading={isLoading} size={12} color={"#8357ff"} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
