import { useCallback, useContext, useEffect } from 'react';

import { RELAY_URL } from '@/components/utils/Utils';
import { Subscription } from '@/models/nostr/Subscription';
import { findRideById } from '@/models/relays/RideFinder';
import { Contract } from '@/models/roadrunner/Contract';

import { ContractContext } from '../utils/contextproviders/ContractContext';
import { RideContext } from '../utils/contextproviders/RideContext';
import RideHistoryContext from '../utils/contextproviders/RideHistoryContext';
import { UserContext } from '../utils/contextproviders/UserContext';
import { NostrEvent } from '@/models/nostr/Event';

// Conexion secundaria para conductores
// Escucha contratos activos, si un contrato entra con estado "accepted", busca el viaje asociado y pasa ambos al contexto
const DriverContractListener = () => {
  const currentUser = useContext(UserContext)?.user;
  const { setContract } = useContext(ContractContext)!;
  const { setRide } = useContext(RideContext)!;
  const { setRideHistory } = useContext(RideHistoryContext)!;

  const updateRideContract = useCallback(
    async (
      htlc: string,
      invoice: string,
      driver: string,
      id: string,
      ride: string
    ) => {
      // Encuentra un viaje por su id
      const acceptedRide = await findRideById(ride);
      // Crea el objeto de contrato
      const acceptedContract = new Contract(
        driver,
        currentUser?.getPublicKey()!,
        invoice,
        htlc,
        id
      );
      // Pasa ambos al contexto
      setRide(acceptedRide);
      setContract(acceptedContract);
    },
    [setContract]
  );

  const updateFinishedRide = useCallback(() => {
    // Limpiamos los contextos si el viaje se temrina o se cancela
    setRide(null);
    setContract(null);
    setRideHistory([]);
  }, [setRide, setContract]);

  useEffect(() => {
    if (!currentUser) return () => {};
    // Escuchamos eventos tipo contrato (4200) y tipo latido (20012)
    // Filtramos tambien con la llave publica del usuario
    // Escuchamos contratos solo desde que iniciamos la subscripcion
    const timestamp = Math.floor(Date.now() / 1000);
    const rideSubscription = new Subscription({
      kinds: [4200, 20012],
      '#p': [currentUser.getPublicKey()],
      since: timestamp,
    });
    // Conectamos al relay Nostr
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) return () => {};
    let intervalId: NodeJS.Timer;
    relayConnection.onopen = () => {
      // Enviamos nuestra subscripcion
      relayConnection?.send(rideSubscription.getNostrEvent());
      // Inciamos el intervalo de latidos cada 30 segundos
      const beat = new NostrEvent('thud', 20012, currentUser.getPublicKey(), [
        ['p', currentUser.getPublicKey()],
      ]);
      const signedBeat = currentUser.signEvent(beat);
      intervalId = setInterval(async () => {
        relayConnection.send(signedBeat.getNostrEvent());
      }, 30000);
    };
    relayConnection.onmessage = async (msg) => {
      const [type, , nostrEvent] = JSON.parse(msg.data);
      // Filtramos evenos de servicio 'OPEN' y 'EOSE'
      if (type !== 'EVENT') return;
      const { content, kind, id, tags } = nostrEvent;
      // Ignoramos los latidos
      if (kind === 20012) {
        return;
      }
      if (kind !== 4200) return;
      const { htlc, invoice, status } = JSON.parse(content);

      // Si el contrato esta pagado o cancelado limpiamos contexto
      if (status === 'settled' || status === 'canceled') {
        updateFinishedRide();
        return;
      }
      // Si el contrato esta aceptado pasamos el contrato al contexto
      if (status !== 'accepted') return;
      updateRideContract(
        htlc,
        invoice,
        currentUser.getPublicKey(),
        id,
        tags[2][1]
      );
    };
    relayConnection.onclose = () => {};
    return () => {
      // Cerramos la conexion y quitamos el intervalo al desmontar
      relayConnection.close();
      clearInterval(intervalId);
    };
  }, []);

  return <></>;
};

export default DriverContractListener;
