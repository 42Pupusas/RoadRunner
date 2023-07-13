import '../styles/global.css';

import type { AppProps } from 'next/app';
import { useState } from 'react';

import Layout from '@/components/layouts/Layout';
import { UserContext } from '@/components/utils/contextproviders/UserContext';
import { User } from '@/models/roadrunner/User';

function MyApp({ Component, pageProps }: AppProps) {
  // Toda la aplicacion va contenida en un contexto de usuario
  const [user, setUser] = useState<User | null>(null);

  const login = async (privatekeyOrNostr: string | any) => {
    let user;
    if (typeof privatekeyOrNostr === 'string') {
      // If a private key string is passed
      user = await User.create(privatekeyOrNostr, null);
    } else {
      // If a nostr object is passed
      user = await User.create(null, privatekeyOrNostr);
    }
    setUser(user);
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
