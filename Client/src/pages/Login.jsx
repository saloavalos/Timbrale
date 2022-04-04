import { useState, useEffect, useContext } from "react";
import Button from "../components/Button";
// Spinner
import SyncLoader from "react-spinners/SyncLoader";
// Context
import { MainContext } from "../contexts/MainContext";

const login = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");
  const [hasProblemsConnectingToServer, setHasProblemsConnectingToServer] =
    useState(false);
  // Context values
  const { socket, isLoginIn, setIsLoginIn, errorLoginIn, setErrorLoginIn } =
    useContext(MainContext);

  useEffect(() => {
    // If isn't null it means there was a user logged in
    if (localStorage.getItem("username") !== null) {
      // we get username and pass it to the state, so that the useEffect automatically tries to log in the user again
      setUser(localStorage.getItem("username"));
      // Start loading animation for the login process, but this animation covers the whole page
      setIsLoginIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (!username) {
      setErrorLoginIn("*El nombre está vacio");
      return;
    } else if (username.length > 8) {
      setErrorLoginIn("*El nombre supera 8 caracteres");
      return;
    }

    // clean any error ocured in client validation
    setErrorLoginIn("");
    // Start loading animation for the login process
    setIsLoginIn(true);

    // I do not need a loading animation because the login is so quick
    // but I wanted implement it
    setTimeout(() => {
      setUser(username);
    }, 2000);
  };

  // when these is trigger it means we click login button and it was a valid username so we can try to log in
  useEffect(() => {
    // So that it does not run in the first render of the page when its value it's empty
    if (user) {
      console.log("Mandando a server username:", user);
      socket?.timeout(5000).emit("LogIn", user, (err) => {
        if (err) {
          // the server did not acknowledge the event in the given delay
          console.log("Error: " + err);
          setHasProblemsConnectingToServer(true);
        } else {
          setHasProblemsConnectingToServer(false);
        }
      });
    }
  }, [user]);

  // To detect Enter not only click
  const handleEnterLogIn = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return hasProblemsConnectingToServer ? (
    <div className="text-center">
      Imposible conectarse al servidor. <p>Intenta más tarde</p>{" "}
    </div>
  ) : // If there is a username stored in locaStoarge we have to try to login automatically,
  // so we show a loading animation while the login process is done
  isLoginIn && localStorage.getItem("username") !== null ? (
    <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
      <SyncLoader loading={isLoginIn} size={12} color={"#8357ff"} />
    </div>
  ) : (
    // If there is no username stored in localStorage or
    // There was a problem trying to log in the user using the username stored in localStorage
    <div className="relative w-11/12 bg-white border border-header rounded-md pt-4 pb-8 px-4 before:absolute before:top-2 before:left-2 before:w-full before:h-full before:border before:border-primary before:rounded-md before:-z-10">
      <p className="text-center mb-2 font-semibold text-2xl">Inicia sesión</p>
      <div className="space-y-2 mb-8">
        <p>Nombre</p>
        <input
          type="text"
          placeholder="Fulanito"
          className={`w-full border  rounded-md py-2 px-3 text-xl ${
            errorLoginIn
              ? "focus:outline-redPrimary border-redPrimary animate-input-shake-animation"
              : "focus:outline-primary border-header"
          }`}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleEnterLogIn}
        />
        {errorLoginIn && <p className="text-redPrimary">{errorLoginIn}</p>}
      </div>
      <Button text={"Iniciar sesión"} onClick={handleLogin} />
      {isLoginIn && (
        <div className="flex justify-center mt-8">
          <SyncLoader loading={isLoginIn} size={12} color={"#8357ff"} />
        </div>
      )}
    </div>
  );
};

export default login;
