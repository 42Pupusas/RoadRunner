import { UserMinusIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import React, { useContext, useRef, useState } from 'react';

import { UserContext } from '../utils/contextproviders/UserContext';

const UserLogin = () => {
  const privateKey = useRef<HTMLInputElement | null>(null);
  const [loginError, setLoginError] = useState(false);
  const { user, login, logout } = useContext(UserContext)!;
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
      <h3 className="block">Login</h3>
      <div className="flex w-2/3 flex-row rounded-lg bg-light p-2">
        <input
          id="privateKey"
          type="password"
          placeholder="Private key"
          ref={privateKey}
          className="m-2 w-2/3 text-white placeholder:text-white"
        />
        {!user ? (
          <UserPlusIcon
            onClick={loginWithKey}
            className="m-1 h-6 w-6 cursor-pointer text-white hover:text-dark"
          />
        ) : (
          <UserMinusIcon
            onClick={() => logout()}
            className="m-1 h-6 w-6 cursor-pointer text-white hover:text-red-600"
          />
        )}
      </div>
      <div>
        {user ? (
          <div>
            <h3 className="block text-xs font-bold uppercase ">
              Logged In As:
            </h3>
            <span className="text-sm uppercase text-black">
              {user.getPublicKey().substring(0, 12)}...
            </span>
          </div>
        ) : null}
      </div>

      <div
        className={`fixed top-0 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
          loginError ? 'opacity-100' : 'opacity-0'
        }`}
        role="alert"
      >
        <h3 className="text-sm">Key Error</h3>
        <p className="text-xs">Check your key!</p>
      </div>
    </>
  );
};

export default UserLogin;
