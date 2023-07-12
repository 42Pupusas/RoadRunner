import "leaflet/dist/leaflet.css";

// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import 'leaflet-defaulticon-compatibility';
import { faFlag } from "@fortawesome/free-regular-svg-icons";
import {
  faBoltLightning,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
} from "react-leaflet";

import { createFontAwesomeIcon } from "@/models/roadrunner/AwesomeIcon";
import { Ride } from "@/models/roadrunner/Ride";

import { RideContext } from "../utils/contextproviders/RideContext";
import { UserContext } from "../utils/contextproviders/UserContext";
import AddressMarker from "./AddressMarker";
import { LatLng } from "leaflet";
import AddressInputComponent from "../rides/AddressInput";

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
        <div className="fixed z-[100000] mr-12 select-none rounded-lg bg-light p-2 opacity-90">
          <h2 className="text-white">Ride Request</h2>
          <span className="font-nexab text-sm">
            Pick your points on the map and choose a fair price!
          </span>
        </div>
      </>
      <div className="fixed inset-0">
        <MapContainer
          center={mapCenter}
          zoom={13}
          zoomControl={false}
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <TileLayer
            className="z-[-110]"
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
      <>
        <div className="fixed bottom-12 my-8 rounded-lg bg-light p-2 opacity-90">
          <AddressInputComponent
            onTextChange={(from) => {
              setFromAddress(from);
            }}
            title="From"
          />
          <AddressInputComponent
            onTextChange={(to) => setToAddress(to)}
            title="To"
          />
        </div>
      </>
      <>
        <div className="fixed bottom-0 my-8 rounded-lg bg-light p-2 opacity-90">
          <h3 className="text-black">Price (sats)</h3>

          <input
            className="inline-block font-nexab placeholder:text-white"
            type="text"
            inputMode="numeric"
            ref={ridePrice}
          />

          <FontAwesomeIcon
            icon={faBoltLightning}
            onClick={sendRideToRelay}
            className="inline-block h-4 w-4 cursor-pointer rounded-full bg-white p-1 text-light hover:bg-dark"
          />
        </div>
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
          className={`fixed top-1/2 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
            userError ? "opacity-100" : "opacity-0"
          }`}
          role="alert"
        >
          <h3 className="text-base">User Error</h3>
          <p className="text-sm">Please log in first!</p>
        </div>
      </>
    </>
  );
}

export default RideForm;
