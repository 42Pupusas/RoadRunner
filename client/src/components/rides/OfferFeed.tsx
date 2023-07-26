import { faBoltLightning, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import QRCode from "qrcode.react";
import { useContext, useEffect, useState } from "react";

import { stopPrepay } from "@/models/nostr/Htlc";
import { findProfileByPublicKey } from "@/models/relays/RideFinder";
import type { Profile } from "@/models/roadrunner/Profile";

import { DriverProfileCard } from "../users/ProfileCard";
import { getinvoiceAmount } from "../utils/Bolt11";
import OfferHistoryContext from "../utils/contextproviders/OfferHistoryContext";
import { UserContext } from "../utils/contextproviders/UserContext";
import { RELAY_URL } from "../utils/Utils";
import { NostrEvent } from "@/models/nostr/Event";
import PaymentScreen from "../relays/PaymentScreen";

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
    const prepayDriverUI = async (offer: {
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
        const signedRequest = await currentUser!.signEvent(newPrepayReq);
        const relayConnection = new WebSocket(RELAY_URL);
        relayConnection.onopen = async () => {
            relayConnection.send(signedRequest.getNostrEvent());
        };
    };

    useEffect(() => {
        if (!currentOffer) { };
        const timer = setTimeout(() => {
            setOffer(null);
        }, 120000); // 10 seconds in milliseconds

        return () => clearTimeout(timer);
    }, [currentOffer]);

    // const findProfile = (driver: string) => () => {};

    return (
        <>
            {offerHistory.length > 0 ? (
                <div className="fixed bottom-0 left-0 m-8 flex items-center justify-center z-10">
                    <div className=" flex flex-col items-center justify-center  rounded-lg opacity-90 space-y-4">
                        <div className="flex w-72 flex-col justify-center rounded-xl bg-light border border-2 border-white text-white shadow-md">
                            <div className="p-2 space-y-2">
                                <h2 className="mb-2 block font-semibold leading-snug tracking-normal text-white text-base antialiased">
                                    Driver Offers
                                </h2>
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
                                                <td className="uppercase">
                                                    {offer.driver.substring(0, 8)}
                                                </td>

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
                        </div>
                    </div>
                </div>
            ) : null}
            {currentOffer ? (
                <div className={`fixed inset-0 bg-white bg-opacity-80
                    transition-all duration-400 ${currentOffer ? "z-[1000000]": "z-[-10]"}`}>
                    <PaymentScreen invoice={currentOffer.htlc} amount={getinvoiceAmount(currentOffer.htlc)}/>
                </div>
            ) : null}
        </>
    );
};

export default OfferFeed;
