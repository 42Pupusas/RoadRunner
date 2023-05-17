import { faBoltLightning, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';

import { cancelPayment, payDriver } from '@/models/nostr/Htlc';

import { getinvoiceAmount } from '../utils/Bolt11';
import { ContractContext } from '../utils/contextproviders/ContractContext';
import { UserContext } from '../utils/contextproviders/UserContext';

// Mostramos los detalles del contrato
export const ContractStatus = () => {
  const { contract } = useContext(ContractContext)!;
  const currentUser = useContext(UserContext)?.user!;

  return (
    <>
      <div className="fixed bottom-12 z-[1000001] m-2">
        <div className="rounded-lg bg-light p-2">
          <h3>Accepted Ride</h3>
          <span>Your driver should be on his way!</span>
        </div>
        <div className="flex flex-row">
          <div className="my-2 rounded-lg bg-light p-2">
            <h3>Driver Offer</h3>
            <span> {getinvoiceAmount(contract?.getHTLC()!)} sats</span>
          </div>
          <FontAwesomeIcon
            icon={faBoltLightning}
            className="m-2 h-11 w-11 rounded-full bg-light p-3 text-white  hover:bg-dark"
            onClick={() => payDriver(contract?.getInvoice()!, currentUser)}
          />
          <FontAwesomeIcon
            icon={faXmark}
            className="m-2 h-11 w-11 cursor-pointer rounded-full bg-red-700 p-3 text-white hover:bg-red-800"
            onClick={() => cancelPayment(contract?.getInvoice()!, currentUser)}
          />
        </div>
      </div>
    </>
  );
};
