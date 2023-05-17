import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';
import React, { useContext } from 'react';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';

import { createFontAwesomeIcon } from '@/models/roadrunner/AwesomeIcon';

import { RideContext } from '../utils/contextproviders/RideContext';
// Mapa para conductores que carga cuando hay un viaje activo
// Muestra los puntos estaticos del viaje activo
const AcceptedRide = () => {
  // const currentUser = useContext(UserContext);
  const { ride } = useContext(RideContext)!;
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
      <div className="fixed inset-0">
        <MapContainer
          center={ride?.getRideFrom()}
          zoom={12}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoomControl position="bottomright" />

          <Marker position={ride?.getRideFrom()!} icon={startFlag}></Marker>
          <Marker position={ride?.getRideTo()!} icon={endFlag}></Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default AcceptedRide;
