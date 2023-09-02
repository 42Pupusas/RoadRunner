import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";

import { cancelPayment } from "@/models/nostr/Htlc";
import { findProfileByPublicKey } from "@/models/relays/RideFinder";
import type { Profile } from "@/models/roadrunner/Profile";

import { PassengerProfileCard } from "../users/ProfileCard";
import { getinvoiceAmount } from "../utils/Bolt11";
import { ContractContext } from "../utils/contextproviders/ContractContext";
import { RideContext } from "../utils/contextproviders/RideContext";
import { UserContext } from "../utils/contextproviders/UserContext";

export const AcceptedRideDetails = () => {
    const { contract } = useContext(ContractContext)!;
    const currentUser = useContext(UserContext)?.user!;
    const { ride } = useContext(RideContext)!;
    // Mostramos los detalles del viaje activo y del contrato activo
    // El boton permite cancelar el contrato y el viaje activo y limpia el contexto
    const [profile, setProfile] = useState<Profile | null>(null);

    // I need a useEffect to load the user profile as soon as the component is mounted
    useEffect(() => {
        findProfileByPublicKey(ride?.getUserPublicKey()!).then((newprofile) => {
            setProfile(newprofile);
        });
    }, []);

    return (
        <>
            <div className="fixed flex items-center justify-center z-10">
                <div className="flex flex-col items-center justify-center rounded-lg opacity-90">
                    <div className="flex w-72 flex-col justify-center rounded-xl bg-light border-2 border-white text-white shadow-md">
                        <div className="p-2">
                            <h2 className="mb-2 block font-semibold leading-snug tracking-normal text-white text-base antialiased">
                                Accepted Ride
                            </h2>
                            <p className="block font-nexa text-sm font-light leading-relaxed text-inherit antialiased">
                                Go pick up your passenger!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 flex items-center justify-center z-10">
                <div className="flex flex-col items-center justify-center rounded-lg opacity-90">
                    <div className="flex w-72 flex-col justify-center rounded-xl bg-light border-2 border-white text-white shadow-md">
                        <div className="p-2">
                            <div className="mr-8 inline-block">
                                <h3 className="">Distance</h3>
                                <span>
                                    {ride?.getDistanceInKm().toFixed(2)} kms
                                </span>
                            </div>
                            <div className="inline-block">
                                <h3>Your Payment</h3>
                                <span>
                                    {" "}
                                    {getinvoiceAmount(
                                        contract?.getInvoice()!
                                    )}{" "}
                                    sats
                                </span>
                            </div>
                            <div className="justify-start">
                                <h3>Passenger</h3>
                                <h4 className="uppercase">
                                    {ride?.getUserPublicKey().substring(0, 12)}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FontAwesomeIcon
                icon={faXmark}
                className="fixed top-0 right-0 z-[1000000] m-4 h-8 w-8 cursor-pointer rounded-full border-2 border-white bg-red-600 p-1 font-bold text-white hover:bg-red-800"
                onClick={() =>
                    cancelPayment(contract?.getContractId()!, currentUser)
                }
            />
            {profile ? (
                <PassengerProfileCard
                    className="fixed bottom-36 z-[1000001]"
                    profile={profile}
                />
            ) : null}
        </>
    );
};
