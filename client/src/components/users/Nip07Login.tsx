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
    <button onClick={fetchNostr}>
      Log in with NIP-07 Extension
    </button>
  );
};

export default NostrLoginButton;
