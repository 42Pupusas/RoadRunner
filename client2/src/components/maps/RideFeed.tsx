import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import React, { useContext } from 'react';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';

import { createFontAwesomeIcon } from '@/models/roadrunner/AwesomeIcon';
import type { Ride } from '@/models/roadrunner/Ride';

import { RideContext } from '../utils/contextproviders/RideContext';
import RideHistoryContext from '../utils/contextproviders/RideHistoryContext';

const RideFeed = () => {
  const { ride, setRide } = useContext(RideContext)!;
  const { rideHistory } = useContext(RideHistoryContext)!;

  const setNewRide = (rideinput: Ride) => {
    if (ride?.getUserPublicKey() === rideinput.getUserPublicKey()) {
      setRide(null);
    } else {
      setRide(rideinput);
    }
  };

  // marcadores para el mapa, bandera vacia para incio con cuadros para final
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
      <div className="fixed z-[100000] w-2/3 rounded-lg  bg-light p-2 opacity-90 sm:w-fit">
        <h2 className="text-white">Nearby Rides</h2>
        <span className="text-sm ">Offer a ride using a LN invoice!</span>
      </div>
      <div className="fixed inset-0">
        <MapContainer
          center={[13.699111631482895, -89.19175862340873]}
          zoom={10}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
          maxZoom={13}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoomControl position="bottomright" />

          {/* Render the markers */}
          {!ride ? (
            <>
              {rideHistory.map((rides, idx) => (
                <div key={idx}>
                  <Marker
                    position={rides.getRideFrom()}
                    icon={startFlag}
                    eventHandlers={{ click: () => setNewRide(rides) }}
                  />
                </div>
              ))}
            </>
          ) : null}
          {ride ? (
            <>
              <Marker
                position={ride.getRideFrom()}
                icon={startFlag}
                eventHandlers={{ click: () => setRide(null) }}
              />
              <Marker position={ride.getRideTo()} icon={endFlag} />
            </>
          ) : null}
        </MapContainer>
      </div>
    </>
  );
};
export default RideFeed;
