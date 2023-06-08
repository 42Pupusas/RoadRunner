import { faBoltLightning, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import QRCode from 'qrcode.react';
import { useContext, useState } from 'react';

import { stopPrepay } from '@/models/nostr/Htlc';
import { findProfileByPublicKey } from '@/models/relays/RideFinder';
import type { Profile } from '@/models/roadrunner/Profile';

import { DriverProfileCard } from '../users/ProfileCard';
import { getinvoiceAmount } from '../utils/Bolt11';
import OfferHistoryContext from '../utils/contextproviders/OfferHistoryContext';
import { UserContext } from '../utils/contextproviders/UserContext';
import { RELAY_URL } from '../utils/Utils';
import { NostrEvent } from '@/models/nostr/Event';

const OfferFeed = () => {
  // El contexto de ofertas es un array de objetos, haremos un map de los objetos para crear ofertas
  const { offerHistory } = useContext(OfferHistoryContext)!;
  const currentUser = useContext(UserContext)?.user;
  const [currentOffer, setOffer] = useState<{
    invoice: string;
    driver: string;
    contractId: string;
    htlc: string;
  } | null>(null);
  const [currentDriver, setDriver] = useState<Profile | null>(null);
  // Mostramos el recibo del servidor y generamos un QR
  // Tambien notificamos al servidor para que empieze a escuchar el contrato
  const prepayDriverUI = (offer: {
    invoice: string;
    driver: string;
    contractId: string;
    htlc: string;
  }) => {
    findProfileByPublicKey(offer.driver).then((profile) => {
      setDriver(profile);
    });
    setOffer(offer);

    const newPrepayReq = new NostrEvent(
      offer.contractId,
      20020,
      currentUser!.getPublicKey(),
      []
    );
    const signedRequest = currentUser!.signEvent(newPrepayReq);
    const relayConnection = new WebSocket(RELAY_URL);
    relayConnection.onopen = async () => {
      relayConnection.send(signedRequest.getNostrEvent());
    };
  };

  // const findProfile = (driver: string) => () => {};

  return (
    <>
      {offerHistory.length > 0 ? (
        <div className="fixed bottom-0 z-[1000000] my-4  rounded-lg bg-light p-2 opacity-90">
          <h2 className="text-white">Driver Offers</h2>
          <table className="table max-h-48 border-separate space-y-6 divide-y-2 divide-x-2 overflow-scroll text-sm text-white">
            <thead className="text-left font-nexab text-black">
              <tr className="p-1">
                <th>Driver</th>
                <th>Offer (sats)</th>
              </tr>
            </thead>
            <tbody className=" p-2 text-center font-nexab">
              {offerHistory.map((offer, idx) => (
                <tr className="" key={idx}>
                  <td className="uppercase">{offer.driver.substring(0, 8)}</td>

                  <td> {getinvoiceAmount(offer.htlc)}</td>

                  <td>
                    <FontAwesomeIcon
                      icon={faBoltLightning}
                      onClick={() => prepayDriverUI(offer)}
                      className="inline-block h-4 w-4 cursor-pointer rounded-full bg-white p-1 text-light hover:bg-dark"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {currentOffer ? (
        <>
          <div className="fixed inset-0 z-[1000000] bg-dark opacity-80"></div>
          <div className="fixed top-1/4 z-[1000001] sm:top-1/3">
            <div className="flex flex-row space-x-4">
              {currentDriver ? (
                <DriverProfileCard className="m-1" profile={currentDriver} />
              ) : null}
              <QRCode
                className="m-1 min-h-fit w-fit rounded-lg bg-light p-2"
                value={currentOffer.htlc!}
                size={128}
              />
            </div>

            <div className="flex w-2/3 flex-row space-x-4 sm:w-1/6">
              <div className="m-1 min-w-fit rounded-lg bg-light p-2">
                <h3>Driver Offer</h3>
                <span> {getinvoiceAmount(currentOffer.htlc)} sats</span>
              </div>
              <div className="m-1 rounded-lg bg-light p-2">
                <h3>Invoice</h3>
                <span className="inline-block max-h-6 select-all overflow-scroll break-all text-xs">
                  {currentOffer.htlc!}
                </span>
              </div>
              <FontAwesomeIcon
                icon={faXmark}
                className="float-right m-1 h-5 w-5 cursor-pointer rounded-full bg-red-700 p-2 font-bold text-white hover:bg-red-800"
                onClick={() => {
                  stopPrepay(currentOffer.htlc!, currentUser!);
                  setOffer(null);
                }}
              />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default OfferFeed;
