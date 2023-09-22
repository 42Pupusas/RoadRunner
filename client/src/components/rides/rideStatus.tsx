import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';

import { cancelPayment, payDriver } from '@/models/nostr/Htlc';

import { getinvoiceAmount } from '../utils/Bolt11';
import { ContractContext } from '../utils/contextproviders/ContractContext';
import { UserContext } from '../utils/contextproviders/UserContext';
import { ReactSVG } from 'react-svg';

// Mostramos los detalles del contrato
export const ContractStatus = () => {
  const { contract } = useContext(ContractContext)!;
  const currentUser = useContext(UserContext)?.user!;

  return (
    <>
      <div className="fixed bottom-4 z-[1000001]">
        <div className="rounded-lg bg-light border-2 border-white p-2">
          <h3>Accepted Ride</h3>
          <span>Your driver should be on his way!</span>
        </div>
        <div className="flex flex-row">
          <div className="my-2 rounded-lg bg-light border-2 border-white p-2">
            <h3>Driver Offer</h3>
            <span> {getinvoiceAmount(contract?.getHTLC()!)} sats</span>
          </div>
          <ReactSVG
            src='/buttons/simple/lightning.svg'
            className="m-2 h-16 w-16 rounded-full p-2 bg-light border-2 border-white hover:bg-dark"
            onClick={() => payDriver(contract?.getContractId()!, currentUser)}
          />
          <FontAwesomeIcon
            icon={faXmark}
            className="m-2 h-10 w-10 cursor-pointer rounded-full bg-red-700 border-2 border-white p-2 text-white hover:bg-red-800"
            onClick={() => cancelPayment(contract?.getContractId()!, currentUser)}
          />
        </div>
      </div>
    </>
  );
};
