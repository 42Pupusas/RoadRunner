import { useCallback, useContext, useEffect } from 'react';

import { RELAY_URL } from '@/components/utils/Utils';
import { Subscription } from '@/models/nostr/Subscription';
import { Contract } from '@/models/roadrunner/Contract';

import { ContractContext } from '../utils/contextproviders/ContractContext';
import OfferHistoryContext from '../utils/contextproviders/OfferHistoryContext';
import { RideContext } from '../utils/contextproviders/RideContext';
import { UserContext } from '../utils/contextproviders/UserContext';
import { NostrEvent } from '@/models/nostr/Event';

// Conexion del pasajero al relay de Nostr para recuperar contratos
// Este componente se carga cuando agregamos un viaje al contexto
const ContractListener = () => {
  const currentUser = useContext(UserContext)?.user;
  const { ride, setRide } = useContext(RideContext)!;
  const { setContract } = useContext(ContractContext)!;
  const { setOfferHistory } = useContext(OfferHistoryContext)!;

  const updateOfferHistory = useCallback(
    (newOffer: {
      invoice: string;
      driver: string;
      contractId: string;
      htlc: string;
    }) => {
      setOfferHistory((prevOfferHistory) => {
        // Filtramos contratos y quitamos el ultimo de cada de conductor
        const updatedOfferHistory = prevOfferHistory.filter(
          (offer) => offer.driver !== newOffer.driver
        );

        // Agregamos la oferta al contexto
        updatedOfferHistory.push(newOffer);

        return updatedOfferHistory;
      });
    },
    [setOfferHistory]
  );

  const updateRideContract = useCallback(
    (htlc: string, invoice: string, driver: string, id: string) => {
      // creamos un nuevo objeto de contrato y lo pasamos al contexto
      const acceptedContract = new Contract(
        driver,
        currentUser?.getPublicKey()!,
        invoice,
        htlc,
        id
      );
      setContract(acceptedContract);
    },
    [setContract]
  );

  const updateFinishedRide = useCallback(async () => {
    // Si el contrato esta pagado o cancelado limpiamos el contexto
    setRide(null);
    setContract(null);
    setOfferHistory([]);

    // Enviamos un viaje vacio para borrar el completo
    const emptyRide = new NostrEvent('', 10420, currentUser!.getPublicKey(), []);
    const signedEmptyRide = currentUser!.signEvent(emptyRide);
    const relayConnection = new WebSocket(RELAY_URL);
    relayConnection.onopen = () => {
      relayConnection.send(signedEmptyRide.getNostrEvent());
      relayConnection.close();
    };
  }, [setRide]);
  const updateCanceledRide = useCallback(async () => {
    // Si el contrato esta pagado o cancelado limpiamos el contexto
    setContract(null);
  }, [setContract]);

  useEffect(() => {
    if (!currentUser) return () => {};
    if (!ride) return () => {};
    // Filtramos por tipos de contrato (4200) y tipo de latido (20012)
    // Filtramos ademas el id del viaje para solo recuperar contratos asociados
    const rideSubscription = new Subscription({
      kinds: [4200, 20012],
      '#e': [ride?.getRideId()],
    });
    // Abrimos conexion al relay de Nostr
    const relayConnection = new WebSocket(RELAY_URL);
    if (!relayConnection) return () => {};
    let intervalId: NodeJS.Timer;
    relayConnection.onopen = () => {
      // Enviamos nuestra subscripcion
      relayConnection?.send(rideSubscription.getNostrEvent());
      // Inciamos un intervalo de latidos cada 30 segundos
      const beat = new NostrEvent('thud', 20012, currentUser.getPublicKey(), [
        ['e', ride?.getRideId()],
      ]);
      const signedBeat = currentUser.signEvent(beat);
      intervalId = setInterval(async () => {
        relayConnection.send(signedBeat.getNostrEvent());
      }, 30000);
    };
    relayConnection.onmessage = async (msg) => {
      const [type, , nostrEvent] = JSON.parse(msg.data);
      // Filtramos eventos de servicio 'OPEN' y 'EOSE'
      if (type !== 'EVENT') return;
      const { content, tags, kind, id } = nostrEvent;
      // Ignoramos eventos de latido
      if (kind === 20012) {
        return;
      }
      if (kind !== 4200) return;
      // Deconstruimos el contenido para recuperar el estado del contrato
      const { htlc, invoice, status } = JSON.parse(content);

      // Si el contrato esta pagado o cancelado limpiamos contextos
      if (status === 'settled') {
        updateFinishedRide();
        return;
      }

      if (status === 'canceled') {
        updateCanceledRide();
        return;
      }
      // Si el contrato esta ofertado lo enviamos al contexto de ofertas
      if (status === 'offered') {
        const rideOffer = { invoice, driver: tags[0][1], contractId: id, htlc };
        updateOfferHistory(rideOffer);
      }
      // Si esta aceptado lo enviamos al contexto de contrato
      if (status === 'accepted') {
        updateRideContract(htlc, invoice, tags[0][1], id);
      }
    };
    relayConnection.onclose = () => {};
    return () => {
      // Limpiamos el intervalo y cerramos la conexion al desmontar
      relayConnection.close();
      clearInterval(intervalId);
    };
  }, []);

  return <></>;
};

export default ContractListener;
