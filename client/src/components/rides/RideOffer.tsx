import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { decode } from "bolt11";
import { useContext, useRef, useState } from "react";

import { RideContext } from "@/components/utils/contextproviders/RideContext";
import { UserContext } from "@/components/utils/contextproviders/UserContext";
import { RELAY_URL } from "@/components/utils/Utils";
import { NostrEvent } from "@/models/nostr/Event";

const RideOffer = () => {
  const { ride } = useContext(RideContext)!;
  const currentUser = useContext(UserContext)?.user;
  const invoice = useRef<HTMLInputElement | null>(null);
  const [lnError, setLnError] = useState<boolean>(false);
  const [userError, setUserError] = useState<boolean>(false);
  const [sentOffer, setSentOffer] = useState<boolean>(false);

  async function offerRide() {
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
    const newRideOffer = new NostrEvent(
      newOffer,
      20010,
      currentUser.getPublicKey(),
      [["e", ride?.getRideId()!]]
    );

    const signedRideOffer = await currentUser.signEvent(newRideOffer);

    // Enviamos el evento al relay de Nostr
    const relayConnection = new WebSocket(RELAY_URL);
    relayConnection.onopen = async () => {
      console.log("Sending offer", signedRideOffer.getNostrEvent());
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
        className={`fixed bottom-0 m-8 flex items-center justify-center z-10 transition-all duration-200 ${
          ride ? "opacity-90" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center justify-center rounded-lg opacity-90 space-y-4">
          <div className="flex w-72 flex-col justify-center rounded-xl bg-light bg-clip-border text-white shadow-md">
            <div className="p-3 space-y-2">
              <h2 className="mb-2 block font-semibold leading-snug tracking-normal text-white text-base antialiased">
                Offer Ride
              </h2>

              <div className="flex flex-row">
                <div className="mr-12">
                  <h3 className="text-xs">Distance</h3>
                  <span>{ride?.getDistanceInKm().toFixed(2)} kms.</span>
                </div>

                <div>
                  <h3 className="text-xs">Offer</h3>
                  <span>{ride?.getPrice()} sats</span>
                </div>
              </div>
              <div className="flex flex-row space-x-4 items-center">
                <div className="relative">
                  <input
                    id="offer"
                    type="text"
                    ref={invoice}
                    className="peer font-nexa h-full w-full rounded-md border border-white border-t-transparent bg-transparent px-3 py-3 text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white focus:border-2 focus:border-dark focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-white"
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-white transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-white before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-white after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-dark peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-dark peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-dark peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-dark">
                    LN Invoice
                  </label>
                </div>
                <FontAwesomeIcon
                  icon={faBoltLightning}
                  onClick={offerRide}
                  className="inline-block h-6 w-6 cursor-pointer rounded-full bg-white p-1 text-yellow-400 hover:bg-dark hover:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <div
          className={`fixed top-1/2 right-0 z-[1000000] m-4 border-l-4 border-dark bg-light p-1 transition-all duration-200 ${
            sentOffer ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-base text-white">Offer Sent!</h3>
        </div>
        <div
          className={`fixed top-1/2 right-0 z-[1000000] m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
            lnError ? "opacity-100" : "opacity-0"
          }`}
          role="alert"
        >
          <h3 className="text-base">Ln Error</h3>
          <p className="text-sm">Not a valid invoice!</p>
        </div>
        <div
          className={`fixed top-1/2 right-0 z-[1000000] m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
            userError ? "opacity-100" : "opacity-0"
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
