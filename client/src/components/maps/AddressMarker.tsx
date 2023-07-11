import { findGeocodeFromAddress } from "@/models/relays/RideFinder";
import { LatLng } from "leaflet";
import React, { useEffect, useState, useCallback } from "react";
import { Marker, useMap } from "react-leaflet";

interface AddressMarkerProps {
  icon: L.Icon<L.IconOptions>;
  address: string;
  position: LatLng;

  onMarkerDragEnd: (position: LatLng) => void;
}

const AddressMarker: React.FC<AddressMarkerProps> = ({
  icon,
  address,
  position,
  onMarkerDragEnd,
}) => {
  const [markerPosition, setMarkerPosition] =
    useState<LatLng>(position);
  const [error, setError] = useState<boolean>(false);
  const map = useMap();

  const memoizedOnMarkerDragEnd = useCallback(onMarkerDragEnd, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (address) {
      const geocodeAddress = async () => {
        try {
          const { latitude, longitude } = await findGeocodeFromAddress(address);
          const newMarkerPosition: LatLng = new LatLng(latitude, longitude);
          setMarkerPosition(newMarkerPosition);
          map.flyTo(newMarkerPosition, 13);
          memoizedOnMarkerDragEnd(newMarkerPosition);
          setError(false);
        } catch (error: any) {
          setError(true);
          timeout = setTimeout(() => {
            setError(false);
          }, 3000); // Set timeout to fade out the error message after 3 seconds
        }
      };

      geocodeAddress();
    }

    return () => {
      clearTimeout(timeout); // Clear the timeout when the component unmounts or when address changes
    };
  }, [address, map, memoizedOnMarkerDragEnd]);

  const handleMarkerDragEnd = (event: {
    target: { getLatLng: () => LatLng };
  }) => {
    const latlng = event.target.getLatLng();
    const newMarkerPosition: LatLng = latlng;
    setMarkerPosition(newMarkerPosition);
    memoizedOnMarkerDragEnd(newMarkerPosition);
    setError(false);
  };

  return (
    <>
      <div
        className={`fixed z-[10000001] top-1/2 right-0 m-4 border-l-4 border-orange-500 bg-orange-100 p-1 transition-all duration-100 ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        <h3 className="text-base">Error Finding Address</h3>
        <p className="text-sm">Please check your address and try again.</p>
      </div>

      {!error && (
        <Marker
          position={markerPosition}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd,
          }}
          icon={icon}
        />
      )}
    </>
  );
};

export default AddressMarker;
