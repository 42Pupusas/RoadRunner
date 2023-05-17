import {
  faBars,
  faBookOpen,
  faCarSide,
  faGear,
  faHouse,
  faPersonWalkingLuggage,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useContext, useState } from 'react';

import { UserContext } from '../utils/contextproviders/UserContext';
// Barra de navegacion con iconos por links
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useContext(UserContext)?.user;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex min-h-screen flex-row">
      {isOpen ? null : (
        // <Bars3Icon
        //   className="fixed top-0 left-0 z-[1000002] m-1 h-6 w-6 text-light hover:cursor-pointer hover:text-dark"
        //   onClick={toggleSidebar}
        // ></Bars3Icon>
        <FontAwesomeIcon
          className="fixed top-0 left-0 z-[1000002] m-2 h-5 w-5 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-dark"
          onClick={toggleSidebar}
          icon={faBars}
        />
      )}

      <div
        className={`bg-dark transition-all duration-500${
          isOpen ? 'fixed z-[1000001] p-2' : 'w-0'
        }`}
      >
        {isOpen ? (
          <div className="my-4 flex flex-col space-y-12">
            <Link href="/">
              <FontAwesomeIcon
                className="h-6 w-6 text-white hover:text-light"
                icon={faHouse}
              />
            </Link>
            {currentUser ? (
              <>
                <Link href="/passenger/">
                  <FontAwesomeIcon
                    className="h-6 w-6 text-white hover:text-light"
                    icon={faPersonWalkingLuggage}
                  />
                </Link>
                <Link href="/drivers/">
                  <FontAwesomeIcon
                    className="h-6 w-6 text-white hover:text-light"
                    icon={faCarSide}
                  />
                </Link>
              </>
            ) : null}
            <Link href="/settings/">
              <FontAwesomeIcon
                className="h-6 w-6 text-white hover:text-light"
                icon={faGear}
              />
            </Link>
            <Link href="/help/">
              <FontAwesomeIcon
                className="h-6 w-6 text-white hover:text-light"
                icon={faQuestion}
              />
            </Link>
            <Link href="/about/">
              <FontAwesomeIcon
                className="h-6 w-6 text-white hover:text-light"
                icon={faBookOpen}
              />
            </Link>
          </div>
        ) : null}
      </div>
      <>
        {isOpen ? (
          <div
            className="absolute left-8  z-[1000000] h-full w-full bg-transparent"
            onClick={toggleSidebar}
          ></div>
        ) : null}
      </>
    </div>
  );
};

export default Sidebar;
