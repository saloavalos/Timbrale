import { useState, useEffect, useContext } from "react";
import Button from "../components/Button";
// Spinner
import SyncLoader from "react-spinners/SyncLoader";
// Context
import { MainContext } from "../contexts/MainContext";

const login = ({ user }) => {
  const [username, setUsername] = useState("");
  // Context values
  const {
    socket,
    isLoginIn,
    setIsLoginIn,
    errorLoginIn,
    setErrorLoginIn,
    setUser,
  } = useContext(MainContext);

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
      socket?.emit("logIn", user);
    }

    // Cleanup
    return () => {};
  }, [user]);

  // To detect Enter not only click
  const handleEnterLogIn = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    // If there is a username stored in locaStoarge we have to try to login automatically,
    // so we show a loading animation while the login process is done
    // isLoginIn && localStorage.getItem("username") !== null ? (
    isLoginIn ? (
      <div className="flex justify-center items-center h-[65vh]">
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
    )
  );
};

export default login;
