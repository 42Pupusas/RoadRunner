import { faBoltLightning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decode } from 'bolt11';
import { useContext, useRef, useState } from 'react';

import { RideContext } from '@/components/utils/contextproviders/RideContext';
import { UserContext } from '@/components/utils/contextproviders/UserContext';
import { RELAY_URL } from '@/components/utils/Utils';
import { NostrEvent } from '@/models/nostr/Event';

const RideOffer = () => {
  const { ride } = useContext(RideContext)!;
  const currentUser = useContext(UserContext)?.user;
  const invoice = useRef<HTMLInputElement | null>(null);
  const [lnError, setLnError] = useState<boolean>(false);
  const [userError, setUserError] = useState<boolean>(false);
  const [sentOffer, setSentOffer] = useState<boolean>(false);

  function offerRide() {
    // Validamos que el usuario este logueado
    if (!currentUser) {
      setUserError(true);
      setTimeout(() => {
        setUserError(false);
      }, 2000);
      return;
    }
    try {
      // Validamos el ercibo de LN que ingreso el usaurio
      decode(invoice.current?.value!);
    } catch {
      setLnError(true);
      setTimeout(() => {
        setLnError(false);
      }, 2000);
      return;
    }
    const newOffer = JSON.stringify({
      invoice: invoice!.current!.value,
      passenger: ride?.getUserPublicKey(),
    });
    // Creamos un evento para enviar al servidor y crear un contrato
    // El tag [e] es el id de el viaje que queremos ofrecer
    const newRideOffer = new NostrEvent(newOffer, 20010, currentUser.getPublicKey(), [
      ['e', ride?.getRideId()!],
    ]);

    const signedRideOffer = currentUser.signEvent(newRideOffer);

    // Enviamos el evento al relay de Nostr
    const relayConnection = new WebSocket(RELAY_URL);
    relayConnection.onopen = async () => {
      relayConnection.send(signedRideOffer.getNostrEvent());
      relayConnection.close();
      setSentOffer(true);
      setTimeout(() => {
        setSentOffer(false);
      }, 2000);
    };
  }

  // Mostramos un input para ingresar un recibo LN
  return (
    <>
      <div
        className={`fixed bottom-0 z-[100000] my-8 rounded-lg bg-light p-2 transition-all duration-200 ${
          ride ? 'opacity-90' : 'opacity-0'
        }`}
      >
        <h2 className="text-white">Offer Ride</h2>
        <div className="flex flex-row">
          <div className="mr-12">
            <h3>Distance</h3>
            <span>{ride?.getDistanceInKm().toFixed(2)} kms.</span>
          </div>

          <div>
            <h3>Offer</h3>
            <span>{ride?.getPrice()} sats</span>
          </div>
        </div>
        <input
          className="mr-4 inline-block w-3/4"
          id="offer"
          type="text"
          placeholder="LN invoice"
          ref={invoice}
        />

        <FontAwesomeIcon
          icon={faBoltLightning}
          onClick={offerRide}
          className="inline-block h-4 w-4 cursor-pointer rounded-full bg-white p-1 text-light hover:bg-dark"
        />
      </div>
      <>
        <div
          className={`fixed top-1/2 right-0 z-[1000000] m-4 border-l-4 border-dark bg-light p-1 transition-all duration-200 ${
            sentOffer ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h3 className="text-base text-white">Offer Sent!</h3>
        </div>
        <div
          className={`fixed top-1/2 right-0 z-[1000000] m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
            lnError ? 'opacity-100' : 'opacity-0'
          }`}
          role="alert"
        >
          <h3 className="text-base">Ln Error</h3>
          <p className="text-sm">Not a valid invoice!</p>
        </div>
        <div
          className={`fixed top-1/2 right-0 z-[1000000] m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
            userError ? 'opacity-100' : 'opacity-0'
          }`}
          role="alert"
        >
          <h3 className="text-base">User Error</h3>
          <p className="text-sm">Please log in first!</p>
        </div>
      </>
    </>
  );
};

export default RideOffer;
