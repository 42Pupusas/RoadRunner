import React, { useContext } from 'react';
import { UserContext } from '@/components/utils/contextproviders/UserContext';

const NostrLoginButton = () => {
    const { login } = useContext(UserContext)!;

    const fetchNostr = async () => {
      const nostr = (window as any).nostr;
      if (nostr) {
        await login(nostr);
      } else {
      }
    };

  return (
    <button 
    className="block w-full select-none rounded-lg bg-gradient-to-tr  py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-dark shadow-md shadow--500/20 transition-all hover:shadow-lg hover:shadow-dark active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    onClick={fetchNostr}>
      Sign in with NIP-07 Extension
    </button>
  );
};

export default NostrLoginButton;
