import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import React from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-row">
      <Link href="/">
        <FontAwesomeIcon
          className="fixed top-0 left-0 z-[1000002] m-4 h-6 w-6 cursor-pointer rounded-full bg-light p-2 text-white hover:bg-dark"
          icon={faHouse}
        />
      </Link>
      <main>{children}</main>
    </div>
  );
};
export default Layout;
