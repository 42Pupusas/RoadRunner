import React, { useContext, useRef, useState } from "react";

import { UserContext } from "../utils/contextproviders/UserContext";
import NostrLoginButton from "./Nip07Login";
import CreateKeys from "./CreateKeys";

const UserLogin = () => {
  const privateKey = useRef<HTMLInputElement | null>(null);
  const [loginError, setLoginError] = useState(false);
  const [createKeys, setCreateKeys] = useState(false);
  const { login } = useContext(UserContext)!;
  const loginWithKey = async () => {
    try {
      // Intentamos crear un nuevo par a partir del texto, si fallamos, notificar del fallo
      await login(privateKey.current?.value!);
    } catch (error) {
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 2000); // Mostramos notificacion de error 2 segundos
    }
  };

  // Cambiar icono de login y logut a que solo se vea el necesario
  return (
    <>
      <div
        className={`fixed top-0 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
          loginError ? "opacity-100" : "opacity-0"
        }`}
        role="alert"
      >
        <h3 className="text-sm">Key Error</h3>
        <p className="text-xs">Check your key!</p>
      </div>
      <div className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
        <div className="flex flex-col gap-4 p-6">
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              type="password"
              ref={privateKey}
              className="peer h-full w-full rounded-md border border-light border-t-transparent bg-transparent px-3 py-3  text-sm font-normal text-dark outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-dark focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-light before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-light after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-dark peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-dark peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-dark peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-dark peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-dark">
              Private Key
            </label>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button
            className="block w-full select-none rounded-lg bg-gradient-to-tr  py-3 px-6 text-center align-middle text-xs font-bold uppercase text-dark shadow-md shadow--500/20 transition-all hover:shadow-lg hover:shadow-dark active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-ripple-light="true"
            onClick={loginWithKey}
          >
            Sign In With Hex Key
          </button>
          <NostrLoginButton />
          <p className="mt-6 flex justify-center text-sm font-light text-light leading-normal antialiased">
            Don't have a private key?{" "}
            <span
              onClick={() => {
                setCreateKeys(!createKeys);
              }}
              className="ml-1 block text-sm font-bold leading-normal text-dark hover:underline antialiased cursor-pointer"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
      <br />
      {createKeys ? <CreateKeys /> : null}
    </>
  );
};

export default UserLogin;
