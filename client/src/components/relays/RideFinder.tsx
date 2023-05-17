import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useEffect, useState } from 'react';

import { RideContext } from '@/components/utils/contextproviders/RideContext';
import { UserContext } from '@/components/utils/contextproviders/UserContext';
import { findMyRide } from '@/models/relays/RideFinder';

// Este componente recupera el ultimo viaje del usuario y lo pasa al contexto
// CAMBIAR EL BOTON DE ACTUALIZAR PARA QUE SEA MAS VISIBLE
const MyRideFinder = () => {
  const currentUser = useContext(UserContext)?.user;
  const { ride, setRide } = useContext(RideContext)!;
  const [refresh, setRefresh] = useState<boolean>(false);

  const updateMyRide = useCallback(() => {
    if (!currentUser) return;
    findMyRide(currentUser).then((newride) => {
      setRide(newride);
    });
  }, [findMyRide]);

  useEffect(() => {
    if (!refresh) return () => {};
    if (!currentUser) return () => {};
    updateMyRide();

    return () => {};
  }, [refresh]);

  return (
    <>
      {ride ? null : (
        <FontAwesomeIcon
          icon={faArrowsRotate}
          className="fixed top-0 right-0 z-[1000000] m-2 h-5 w-5 cursor-pointer rounded-full bg-light p-2 text-white hover:bg-dark"
          onClick={() => {
            setRefresh(true);
          }}
        />
      )}
    </>
  );
};

export default MyRideFinder;
