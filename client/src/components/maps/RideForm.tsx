import 'leaflet/dist/leaflet.css';

// import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import 'leaflet-defaulticon-compatibility';
import { faFlag } from '@fortawesome/free-regular-svg-icons';
import {
  faBoltLightning,
  faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type L from 'leaflet';
import { useContext, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';

import { createFontAwesomeIcon } from '@/models/roadrunner/AwesomeIcon';
import { Ride } from '@/models/roadrunner/Ride';

import { RideContext } from '../utils/contextproviders/RideContext';
import { UserContext } from '../utils/contextproviders/UserContext';

function RideForm() {
  const currentUser = useContext(UserContext)!.user;
  const { setRide } = useContext(RideContext)!;
  const [rideError, setRideError] = useState<boolean>(false);
  const [userError, setUserError] = useState<boolean>(false);
  const rideFrom = useRef<L.Marker | null>(null);
  const rideTo = useRef<L.Marker | null>(null);
  const ridePrice = useRef<HTMLInputElement | null>(null);

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
      rideFrom.current.getLatLng(),
      rideTo.current.getLatLng(),
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
    style: { color: '#2C9464' },
  });
  const endFlag = createFontAwesomeIcon({
    icon: faFlagCheckered,
    style: { color: '#1E4531' },
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
          center={[13.699111631482895, -89.19175862340873]}
          zoom={13}
          zoomControl={false}
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <TileLayer
            className="z-[-110]"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          <Marker
            position={
              rideFrom.current
                ? rideFrom.current.getLatLng()
                : [13.698886, -89.191086]
            }
            ref={rideFrom}
            draggable
            autoPan
            icon={startFlag}
          ></Marker>
          <Marker
            position={
              rideTo.current
                ? rideTo.current.getLatLng()
                : [13.702036, -89.208986]
            }
            ref={rideTo}
            draggable
            autoPan
            icon={endFlag}
          />
        </MapContainer>
      </div>
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
            rideError ? 'opacity-100' : 'opacity-0'
          }`}
          role="alert"
        >
          <h3 className="text-base">Ride Error</h3>
          <p className="text-sm">Check your ride details!</p>
        </div>
        <div
          className={`fixed top-1/2 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-200 ${
            userError ? 'opacity-100' : 'opacity-0'
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
