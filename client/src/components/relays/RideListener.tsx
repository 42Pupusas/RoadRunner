import { useCallback, useContext, useEffect } from 'react';

import RideHistoryContext from '@/components/utils/contextproviders/RideHistoryContext';
import { UserContext } from '@/components/utils/contextproviders/UserContext';
import { RELAY_URL } from '@/components/utils/Utils';
import { Subscription } from '@/models/nostr/Subscription';
import { findMyContract, findRideById } from '@/models/relays/RideFinder';
import { Ride } from '@/models/roadrunner/Ride';

import { ContractContext } from '../utils/contextproviders/ContractContext';
import { RideContext } from '../utils/contextproviders/RideContext';
import { NostrEvent } from '@/models/nostr/Event';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';

// Conexion principal para conductores, recupera eventos de viajes siendo publicados en tiempo real
// La conexion se mantiene viva usando eventos de latidos

const RideListener = () => {
    const currentUser = useContext(UserContext)?.user;
    const { setRideHistory } = useContext(RideHistoryContext)!;
    const { setContract } = useContext(ContractContext)!;
    const { setRide } = useContext(RideContext)!;

    const updateRideHistory = useCallback(
        (newRide: Ride) => {
            setRideHistory((prevRideHistory) => {
                // Reemplazamos el evento anterior del mismo pasajero
                const updatedRideHistory = prevRideHistory.filter(
                    (ride) => ride.getUserPublicKey() !== newRide.getUserPublicKey()
                );

                // Empujamos el objeto de viaje al contexto
                updatedRideHistory.push(newRide);

                return updatedRideHistory;
            });
        },
        [setRideHistory]
    );

    useEffect(() => {
        if (!currentUser) return () => { };
        const timestamp = Math.floor(Date.now() / 1000) - 600;
        // El filtro incluye los tipos viaje (10420) y eventos de latido (20421)
        // Ademas incluimos una marca de tiempo UNIX para recuperrar eventos de hace 10 minutos
        const rideSubscription = new Subscription({
            kinds: [10420, 20421],
            since: timestamp,
        });
        // Nos conectamos al relay Nostr
        const relayConnection = new WebSocket(RELAY_URL);
        if (!relayConnection) return () => { };
        let intervalId: NodeJS.Timer;
        relayConnection.onopen = async () => {
            // Enviamos nuestra subscripcion
            relayConnection?.send(rideSubscription.getNostrEvent());
            // Inciamos un intervalo que enviara latidos cada 30 segundos
            const beat = new NostrEvent('thud', 20012, currentUser.getPublicKey(), [
                ['p', currentUser.getPublicKey()],
            ]);
            const signedBeat = await currentUser.signEvent(beat);
            intervalId = setInterval(async () => {
                relayConnection.send(signedBeat.getNostrEvent());
            }, 30000);
        };
        relayConnection.onmessage = (msg) => {
            console.log(msg);
            const [type, , nostrEvent] = JSON.parse(msg.data);
            // Filtramos eventos de mantenimiento "OPEN", "EOSE"
            console.log(nostrEvent);
            if (type !== 'EVENT') return;
            const { content, kind, id } = nostrEvent;
            // Los latidos los ignoramos
            if (kind === 20421) {
                return;
            }
            // Si el contenido es vacio ignoramos
            if (content === '') return;
            // Desconstruimos el contenido y creamos un objeto de viaje
            const { passenger, from, to, price } = JSON.parse(content);
            const myCurrentRide = new Ride(passenger, from, to, price);
            // Agregamos el id del viaje
            myCurrentRide.setRideID(id);
            // Enviamos al contexto
            updateRideHistory(myCurrentRide);
        };
        return () => {
            // Cerramos la conexion y limpiamos el intervalo al desmontar
            relayConnection.close();
            clearInterval(intervalId);
        };
    }, []);

    // El boton encuentra el ultimo contrato activo y el viaje asociado
    const findAcceptedRide = async () => {
        const acceptedContract = await findMyContract(currentUser!);
        if (!acceptedContract) return;

        findRideById(acceptedContract.getRideId()).then((ride) => {
            setRide(ride);
            setContract(acceptedContract);
        });
    };

    return (
        <>
            <div className="fixed top-4 z-[1000000]">
                <div className="flex flex-row items-center justify-center">
                    <Link href="/">
                        <ReactSVG
                            src="/buttons/simple/home-white.svg"
                            className="m-2 h-12 w-12 cursor-pointer rounded-full bg-light p-2 border border-white text-white hover:bg-dark"
                        />
                    </Link>
                    <ReactSVG
                        src="/buttons/simple/refresh-2-white.svg"
                        className=" m-4 h-12 w-12 cursor-pointer rounded-full bg-light p-2 border border-white text-white hover:bg-dark"
                        onClick={() => {
                            findAcceptedRide();
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default RideListener;
