import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { faFlag } from "@fortawesome/free-regular-svg-icons";
import { faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import React, { useContext } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";

import { createFontAwesomeIcon } from "@/models/roadrunner/AwesomeIcon";
import type { Ride } from "@/models/roadrunner/Ride";

import { RideContext } from "../utils/contextproviders/RideContext";
import RideHistoryContext from "../utils/contextproviders/RideHistoryContext";

const RideFeed = () => {
  const { ride, setRide } = useContext(RideContext)!;
  const { rideHistory } = useContext(RideHistoryContext)!;

  const setNewRide = (rideinput: Ride) => {
    console.log(rideinput);
    if (ride?.getUserPublicKey() === rideinput.getUserPublicKey()) {
      setRide(null);
    } else {
      setRide(rideinput);
    }
  };

  // marcadores para el mapa, bandera vacia para incio con cuadros para final
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
      <div className="fixed top-24 flex items-center justify-center z-10">
        <div className="flex flex-col items-center justify-center rounded-lg opacity-90">
          <div className="flex w-72 flex-col justify-center rounded-xl bg-light border border-2 border-white text-white shadow-md">
            <div className="p-2">
              <h2 className="mb-2 block font-semibold leading-snug tracking-normal text-white text-base antialiased">
                Nearby Rides
              </h2>
              <p className="block font-nexa text-sm font-light leading-relaxed text-inherit antialiased">
                Offer a ride using a LN invoice!
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0">
        <MapContainer
          center={[13.699111631482895, -89.19175862340873]}
          zoom={8}
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ width: "100%", height: "100%" }}
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
