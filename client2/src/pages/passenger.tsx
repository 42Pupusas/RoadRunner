import dynamic from 'next/dynamic';
import { useState } from 'react';

import ContractListener from '@/components/relays/ContractListener';
import RideFinder from '@/components/relays/RideFinder';
import OfferFeed from '@/components/rides/OfferFeed';
import { ContractStatus } from '@/components/rides/rideStatus';
import { ContractContext } from '@/components/utils/contextproviders/ContractContext';
import OfferHistoryContext from '@/components/utils/contextproviders/OfferHistoryContext';
import { RideContext } from '@/components/utils/contextproviders/RideContext';
import type { Contract } from '@/models/roadrunner/Contract';
import type { Ride } from '@/models/roadrunner/Ride';

const RideForm = dynamic(() => import('../components/maps/RideForm'), {
  ssr: false,
});
const CurrentRideMap = dynamic(
  () => import('../components/maps/CurrentRideMap'),
  {
    ssr: false,
  }
);

const PassengersPage = () => {
  // Pasamos contextos del viaje, contrato, e historial de ofertas a la pagina
  const [ride, setRide] = useState<Ride | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [offerHistory, setOfferHistory] = useState<
    { invoice: string; driver: string; contractId: string; htlc: string }[]
  >([]);

  const content = () => {
    // Si no hemos creado un viaje, mostrar el mapa para crear
    // Mostramos tambien el boton para volver a encontrar un viaje activo
    if (!ride) {
      return (
        <>
          <RideForm />
          <RideFinder />
        </>
      );
    }

    // Si ya prepagamos un contrato, mostramos pantallas esperando al conductor
    if (contract) {
      return (
        <>
          <ContractListener />
          <CurrentRideMap />
          <ContractStatus />
        </>
      );
    }

    // Si ya hay viaje, y no hay contrato, mostremos las ofertas al viaje
    return (
      <>
        <ContractListener />
        <CurrentRideMap />
        <OfferFeed />
      </>
    );
  };

  return (
    <OfferHistoryContext.Provider value={{ offerHistory, setOfferHistory }}>
      <RideContext.Provider value={{ ride, setRide }}>
        <ContractContext.Provider value={{ contract, setContract }}>
          <div>
            <title>Passenger - RoadRunner</title>
          </div>
          {content()}
        </ContractContext.Provider>
      </RideContext.Provider>
    </OfferHistoryContext.Provider>
  );
};

export default PassengersPage;
