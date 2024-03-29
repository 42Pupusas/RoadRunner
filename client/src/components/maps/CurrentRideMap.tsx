import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { faFlagCheckered, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";

import { createFontAwesomeIcon } from "@/models/roadrunner/AwesomeIcon";

import { ContractContext } from "../utils/contextproviders/ContractContext";
import OfferHistoryContext from "../utils/contextproviders/OfferHistoryContext";
import { RideContext } from "../utils/contextproviders/RideContext";
import { NostrEvent } from "@/models/nostr/Event";
import { UserContext } from "../utils/contextproviders/UserContext";
import { RELAY_URL } from "../utils/Utils";

// Mapa que muestra los puntos estaticos de un viaje activo
// El boton permite cancelar el viaje y limpiar contextos
const CurrentRideMap = () => {
    const { ride, setRide } = useContext(RideContext)!;
    const { setContract } = useContext(ContractContext)!;
    const { setOfferHistory } = useContext(OfferHistoryContext)!;

    const currentUser = useContext(UserContext)?.user;
    const startFlag = createFontAwesomeIcon({
        icon: faFlag,
        style: { color: "#2C9464" },
    });
    const endFlag = createFontAwesomeIcon({
        icon: faFlagCheckered,
        style: { color: "#1E4531" },
    });
    return (
        <>
            <>
                <FontAwesomeIcon
                    icon={faXmark}
                    className="fixed top-0 right-0 z-[1000000] m-4 h-8 w-8 cursor-pointer rounded-full border-2 border-white bg-red-600 p-1 font-bold text-white hover:bg-red-800"
                    onClick={async () => {
                        // Enviamos un viaje vacio para borrar el completo
                        const emptyRide = new NostrEvent(
                            "",
                            10420,
                            currentUser!.getPublicKey(),
                            []
                        );
                        const signedEmptyRide: NostrEvent =
                            await currentUser!.signEvent(emptyRide);
                        const relayConnection = new WebSocket(RELAY_URL);
                        relayConnection.onopen = () => {
                            relayConnection.send(
                                signedEmptyRide.getNostrEvent()
                            );
                            relayConnection.close();
                        };

                        setRide(null);
                        setOfferHistory([]);
                        setContract(null);
                    }}
                />
            </>

            <div className="fixed flex items-center justify-center z-10">
                <div className="flex flex-col items-center justify-center rounded-lg opacity-90">
                    <div className="flex w-72 flex-col justify-center rounded-xl bg-light border border-2 border-white text-white shadow-2xl">
                        <div className="p-2">
                            <h2 className="mb-2 block font-semibold leading-snug tracking-normal text-white text-base antialiased">
                                Current Ride
                            </h2>
                            <p className="block font-nexa text-sm font-light leading-relaxed text-inherit antialiased">
                                Ride offers will appear below.
                            </p>
                            <div className="">
                                <div className="mr-12 inline-block">
                                    <h3 className="">Distance</h3>
                                    <h4>
                                        {ride?.getDistanceInKm().toFixed(2)} kms
                                    </h4>
                                </div>

                                <div className="inline-block">
                                    <h3>My Offer</h3>
                                    <h4>{ride?.getPrice()} sats</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0">
                <MapContainer
                    center={ride?.getRideFrom()}
                    zoom={12}
                    zoomControl={false}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <ZoomControl position="bottomright" />

                    <Marker
                        position={ride?.getRideFrom()!}
                        icon={startFlag}
                    ></Marker>
                    <Marker
                        position={ride?.getRideTo()!}
                        icon={endFlag}
                    ></Marker>
                </MapContainer>
            </div>
        </>
    );
};

export default CurrentRideMap;
