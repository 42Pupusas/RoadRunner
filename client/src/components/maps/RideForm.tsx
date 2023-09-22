import "leaflet/dist/leaflet.css";

import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { useContext, useRef, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { createFontAwesomeIcon } from "@/models/roadrunner/AwesomeIcon";
import { Ride } from "@/models/roadrunner/Ride";

import { RideContext } from "../utils/contextproviders/RideContext";
import { UserContext } from "../utils/contextproviders/UserContext";
import AddressMarker from "./AddressMarker";
import { LatLng } from "leaflet";
import AddressInputComponent from "../rides/AddressInput";
import { ReactSVG } from "react-svg";

function RideForm() {
    const currentUser = useContext(UserContext)!.user;
    const { setRide } = useContext(RideContext)!;
    const [rideError, setRideError] = useState<boolean>(false);
    const [userError, setUserError] = useState<boolean>(false);
    const rideFrom = useRef<LatLng | null>(null);
    const rideTo = useRef<LatLng | null>(null);
    const ridePrice = useRef<HTMLInputElement | null>(null);

    const [mapCenter, setMapCenter] = useState<LatLng>(
        new LatLng(13.698886, -89.191086)
    );
    const [fromAddress, setFromAddress] = useState<string>("");
    const [toAddress, setToAddress] = useState<string>("");

    const handleFromMarkerDragEnd = (position: any) => {
        rideFrom.current = position;
        setMapCenter(position as LatLng);
    };

    const handleToMarkerDragEnd = (position: any) => {
        rideTo.current = position;
    };

    async function sendRideToRelay() {
        // Validamos los puntos geograficos
        if (!rideFrom.current || !rideTo.current) {
            setRideError(true);
            setTimeout(() => {
                setRideError(false);
            }, 2000); // display error message for 3 second
            return;
        }
        // Validamos el precio
        if (!ridePrice.current) return;
        // validamos que el usuario este logueado
        if (!currentUser) {
            setUserError(true);
            setTimeout(() => {
                setUserError(false);
            }, 2000); // display error message for 3 second
            return;
        }
        const rideOffer = Number(ridePrice.current.value);
        if (!rideOffer) {
            setRideError(true);
            setTimeout(() => {
                setRideError(false);
            }, 2000); // display error message for 3 seconds
            return;
        }
        // Creamos un nuevo objeto de viaje
        const newRide = new Ride(
            currentUser.getPublicKey(),
            rideFrom.current,
            rideTo.current,
            rideOffer
        );
        // Enviamos el viaje al relay de Nostr
        newRide.sendRideRequest(currentUser).then((rideId) => {
            console.log("Ride ID: ", rideId);
            newRide.setRideID(rideId);
            setRide(newRide);
        });
    }

    // marcadores para el mapa, verde para inicio rojo para el final
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
                <div className="fixed inset-0">
                    <MapContainer
                        className="fixed z-[-1]"
                        center={mapCenter}
                        zoom={8}
                        zoomControl={false}
                        style={{
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <TileLayer
                            className="fixed z-[-1]"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <ZoomControl position="bottomright" />

                        {fromAddress && (
                            <AddressMarker
                                icon={startFlag}
                                position={new LatLng(13.698886, -89.191086)}
                                address={fromAddress}
                                onMarkerDragEnd={handleFromMarkerDragEnd}
                            />
                        )}

                        {toAddress && (
                            <AddressMarker
                                icon={endFlag}
                                position={new LatLng(13.698886, -89.191086)}
                                address={toAddress}
                                onMarkerDragEnd={handleToMarkerDragEnd}
                            />
                        )}
                    </MapContainer>
                </div>

                <div
                    className="fixed w-fit top-24 left-8 flex items-center 
                                opacity-90 z-10 rounded-xl bg-dark border 
                                border-2 border-l-0 border-white text-white 
                                shadow-xl"
                >
                    <div className="p-4 flex-col space-y-2">
                        <h2
                            className="block font-semibold leading-snug tracking-normal 
                                        text-white text-base antialiased"
                        >
                            Ride Request
                        </h2>
                        {!fromAddress ? (
                            <>
                                <p className="font-nexa text-xs sm:text-base font-light leading-relaxed text-inherit antialiased">
                                    Use the address search to set your ride
                                    details.
                                </p>
                                <p className="font-nexa text-xs sm:text-base font-light leading-relaxed text-inherit antialiased">
                                    Choose your price in sats and send your ride
                                    request.
                                </p>
                                <p className="font-nexa text-xs sm:text-base font-light leading-relaxed text-inherit antialiased">
                                    Once a driver accepts your request, you will
                                    be notified.
                                </p>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-8 left-8 z-10 flex space-x-4 items-center">
                    <div
                        className="w-fit rounded-xl 
                                p-4 bg-dark border border-2 border-white 
                                border-l-0 text-white shadow flex-col space-y-8"
                    >
                        <AddressInputComponent
                            onTextChange={(from) => {
                                setFromAddress(from);
                            }}
                            title="From"
                        />
                        {fromAddress ? (
                            <AddressInputComponent
                                onTextChange={(to) => setToAddress(to)}
                                title="To"
                            />
                        ) : (
                            <></>
                        )}
                        {fromAddress && toAddress ? (
                            <input
                                type="text"
                                inputMode="numeric"
                                ref={ridePrice}
                                placeholder="Sats"
                                className="peer font-nexa h-full w-full  
                                        border border-white border-t-transparent border-l-transparent border-r-transparent 
                                        bg-transparent text-sm text-white outline outline-0 
                                        px-1 placeholder:text-white"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                    {fromAddress && toAddress ? (
                        <ReactSVG
                            src="/buttons/simple/lightning.svg"
                            onClick={sendRideToRelay}
                            className="h-24 w-24 cursor-pointer rounded-full
                                border-2 border-white p-4 bg-dark hover:bg-light"
                        />
                    ) : (
                        <></>
                    )}
                </div>
            </>

            <div
                className={`fixed top-1/2 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
                    rideError ? "opacity-100" : "opacity-0"
                }`}
                role="alert"
            >
                <h3 className="text-base">Ride Error</h3>
                <p className="text-sm">Check your ride details!</p>
            </div>
            <div
                className={`fixed top-1/2 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 
                            transition-all duration-200 ${
                                userError ? "opacity-100" : "opacity-0"
                            }`}
                role="alert"
            >
                <h3 className="text-base">User Error</h3>
                <p className="text-sm">Please log in first!</p>
            </div>
        </>
    );
}

export default RideForm;
