import dynamic from 'next/dynamic';
import { useState } from 'react';

import DriverContractListener from '@/components/relays/DriverContractListener';
import RideListener from '@/components/relays/RideListener';
import { AcceptedRideDetails } from '@/components/rides/AcceptedRidesDetails';
import RideOffer from '@/components/rides/RideOffer';
import { ContractContext } from '@/components/utils/contextproviders/ContractContext';
import { RideContext } from '@/components/utils/contextproviders/RideContext';
import RideHistoryContext from '@/components/utils/contextproviders/RideHistoryContext';
import type { Contract } from '@/models/roadrunner/Contract';
import type { Ride } from '@/models/roadrunner/Ride';

// import PrivateFeed from '@/components/PrivateFeed';
const RideFeed = dynamic(() => import('../components/maps/RideFeed'), {
  ssr: false,
});
const AcceptedRide = dynamic(() => import('../components/maps/AcceptedRide'), {
  ssr: false,
});
const DriversPage = () => {
  // Pasamos contextos de historial de viajes, viaje actual y contrato a la pagina
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);
  const [ride, setRide] = useState<Ride | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  const content = () => {
    // Si no hay contratos aceptaods, mostremos el mapa con historial de viajes
    // La herramienta para ofrecer viajes solo se muestra si hay un viaje seleccionado
    // Tambien mostramos un boton para encontrar el ultimo viaje activo (DrivercontractListener)
    if (!contract)
      return (
        <>
          <RideFeed />
          <RideOffer />
          <RideListener />
          <DriverContractListener />
        </>
      );
    // Si ay tenemos un contrato aceptado, mostremos el viaje asociado y las notificaciones de pago
    return (
      <>
        <AcceptedRide />
        <AcceptedRideDetails />
        <DriverContractListener />
      </>
    );
  };

  return (
    <>
      <RideContext.Provider value={{ ride, setRide }}>
        <RideHistoryContext.Provider value={{ rideHistory, setRideHistory }}>
          <ContractContext.Provider value={{ contract, setContract }}>
            <div>
              <title>Driver - RoadRunner</title>
            </div>
            {content()}
          </ContractContext.Provider>
        </RideHistoryContext.Provider>
      </RideContext.Provider>
    </>
  );
};

export default DriversPage;
