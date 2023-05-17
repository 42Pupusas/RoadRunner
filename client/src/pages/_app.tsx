import '../styles/global.css';

import type { AppProps } from 'next/app';
import { useState } from 'react';

import Layout from '@/components/layouts/Layout';
import { UserContext } from '@/components/utils/contextproviders/UserContext';
import { User } from '@/models/roadrunner/User';

function MyApp({ Component, pageProps }: AppProps) {
  // Toda la aplicacion va contenida en un contexto de usuario
  const [user, setUser] = useState<User | null>(null);
  const login = async (privatekey: string) => {
    setUser(new User(privatekey));
  };

  const logout = async () => {
    setUser(null);
  };

  const userContextValue = {
    user,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}
export default MyApp;
