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
        const signedEmptyRide: NostrEvent = await currentUser!.signEvent(emptyRide);
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

    const handleRideUpdate = useCallback(() => {

        const rideSubscription = new Subscription({
            kinds: [4200],
            '#e': [ride?.getRideId()],
        });

        const relayConnection = new WebSocket(RELAY_URL);

        if (!relayConnection) return;

        relayConnection.onmessage = async (msg) => {
            console.log(msg);
            const [type, , nostrEvent] = JSON.parse(msg.data);

            if (type === 'EVENT') {
                const { content, tags, kind, id } = nostrEvent;

                if (kind === 4200) {
                    const { htlc, invoice, status } = JSON.parse(content);

                    if (status === 'settled') {
                        updateFinishedRide();
                        return;
                    }

                    if (status === 'canceled') {
                        updateCanceledRide();
                        return;
                    }

                    if (status === 'offered') {
                        const rideOffer = { invoice, driver: tags[0][1], contractId: id, htlc };
                        updateOfferHistory(rideOffer);
                    }

                    if (status === 'accepted') {
                        updateRideContract(htlc, invoice, tags[0][1], id);
                    }
                }
            } else {
                console.log('Relay says', msg.data);
            }
        };
        relayConnection.onopen = async () => {
            relayConnection.send(rideSubscription.getNostrEvent());
        };

        relayConnection.onclose = () => {
            console.log('Connection closed');
        };

        return () => {
            relayConnection.close();
        };
    }, [currentUser, ride]);

    useEffect(() => {
        handleRideUpdate();
    }, []);

    return <></>;
};

export default ContractListener;
