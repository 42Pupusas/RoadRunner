import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';

import { cancelPayment } from '@/models/nostr/Htlc';
import { findProfileByPublicKey } from '@/models/relays/RideFinder';
import type { Profile } from '@/models/roadrunner/Profile';

import { PassengerProfileCard } from '../users/ProfileCard';
import { getinvoiceAmount } from '../utils/Bolt11';
import { ContractContext } from '../utils/contextproviders/ContractContext';
import { RideContext } from '../utils/contextproviders/RideContext';
import { UserContext } from '../utils/contextproviders/UserContext';

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
      <div className="fixed top-0 z-[1000000] my-8 rounded-lg bg-light p-2">
        <h2 className="text-white">Accepted Ride</h2>
        <span className="text-base">Go pick up your passenger!</span>
      </div>
      <div className="fixed bottom-16 z-[1000001] m-2 rounded bg-light p-2">
        <div className="mr-8 inline-block">
          <h3 className="">Distance</h3>
          <span>{ride?.getDistanceInKm().toFixed(2)} kms</span>
        </div>
        <div className="inline-block">
          <h3>Your Payment</h3>
          <span> {getinvoiceAmount(contract?.getInvoice()!)} sats</span>
        </div>
        <div className="justify-start">
          <h3>Passenger</h3>
          <h4 className="uppercase">
            {ride?.getUserPublicKey().substring(0, 12)}
          </h4>
        </div>
      </div>
      <FontAwesomeIcon
        icon={faXmark}
        className="fixed top-0 right-0 m-2 h-5 w-5 rounded-full bg-red-700 p-2 text-white hover:cursor-pointer"
        onClick={() => cancelPayment(contract?.getInvoice()!, currentUser)}
      />
      {profile ? (
        <PassengerProfileCard
          className="fixed top-48 z-[1000001] m-2"
          profile={profile}
        />
      ) : null}
    </>
  );
};
