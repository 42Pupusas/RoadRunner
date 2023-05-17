import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useContext } from 'react';
import { ReadyState } from 'react-use-websocket';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

import { RELAY_URL } from '@/components/utils/Utils';

import { UserContext } from '../utils/contextproviders/UserContext';

function ConnectionStatus() {
  const currentUser = useContext(UserContext)?.user;
  const { readyState } = useWebSocket(RELAY_URL, {
    shouldReconnect: () => true,
  });

  return (
    <div className="fixed bottom-0 m-4 ">
      <div className="flex flex-row p-2">
        <CheckCircleIcon
          className={`m-1 h-4 w-4 ${
            readyState === ReadyState.OPEN ? 'text-green-600' : 'text-red-600'
          }`}
        />
        <h4 className="m-1 uppercase">Logged in as:</h4>
      </div>
      <h4 className="mx-10 text-xs uppercase">
        {currentUser?.getPublicKey().substring(0, 12)}
      </h4>
    </div>
  );
}

export default ConnectionStatus;
