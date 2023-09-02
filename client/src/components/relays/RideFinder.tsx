import { useCallback, useContext, useEffect, useState } from 'react';

import { RideContext } from '@/components/utils/contextproviders/RideContext';
import { UserContext } from '@/components/utils/contextproviders/UserContext';
import { findMyRide } from '@/models/relays/RideFinder';
import { ReactSVG } from 'react-svg';
import Link from 'next/link';

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
        if (!refresh) return () => { };
        if (!currentUser) return () => { };
        updateMyRide();

        return () => { };
    }, [refresh]);

    return (
        <>
            {ride ? null : (
                <div className="fixed top-4 z-[1000000]">
                    <div className="flex flex-row items-center justify-center">
                        <Link href="/">
                            <ReactSVG
                                src="/buttons/simple/home-white.svg"
                                className="m-2 h-12 w-12 cursor-pointer rounded-full bg-light p-2 border border-white text-white hover:bg-dark"
                            />
                        </Link>
                        <ReactSVG
                            src="/buttons/simple/refresh-2-white.svg"
                            className="m-2 h-12 w-12 cursor-pointer rounded-full bg-light p-2 border border-white text-white hover:bg-dark"
                            onClick={() => {
                                setRefresh(true);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default MyRideFinder;
