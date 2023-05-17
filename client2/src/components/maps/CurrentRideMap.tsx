import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faFlagCheckered, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';

import { createFontAwesomeIcon } from '@/models/roadrunner/AwesomeIcon';

import { ContractContext } from '../utils/contextproviders/ContractContext';
import OfferHistoryContext from '../utils/contextproviders/OfferHistoryContext';
import { RideContext } from '../utils/contextproviders/RideContext';

// Mapa que muestra los puntos estaticos de un viaje activo
// El boton permite cancelar el viaje y limpiar contextos
const CurrentRideMap = () => {
  const { ride, setRide } = useContext(RideContext)!;
  const { setContract } = useContext(ContractContext)!;
  const { setOfferHistory } = useContext(OfferHistoryContext)!;

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
        <FontAwesomeIcon
          icon={faXmark}
          className="fixed top-0 right-0 z-[1000000] m-2 h-5 w-5 cursor-pointer rounded-full bg-red-700 p-2 font-bold text-white hover:bg-red-800"
          onClick={() => {
            setRide(null);
            setOfferHistory([]);
            setContract(null);
          }}
        />
      </>
      <div className="fixed z-[1000000] rounded-lg bg-light p-2">
        <h2 className="text-white">Current Ride</h2>
        <span className="text-sm">Ride offers will appear below.</span>
        <div className="">
          <div className="mr-12 inline-block">
            <h3 className="">Distance</h3>
            <h4>{ride?.getDistanceInKm().toFixed(2)} kms</h4>
          </div>

          <div className="inline-block">
            <h3>My Offer</h3>
            <h4>{ride?.getPrice()} sats</h4>
          </div>
        </div>
      </div>
      <div className="fixed inset-0">
        <MapContainer
          center={ride?.getRideFrom()}
          zoom={12}
          zoomControl={false}
          style={{
            height: '100%',
            width: '100%',
          }}
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

export default CurrentRideMap;
