import type { PropsWithChildren } from "react";
import React from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
      <div className="flex mt-8 mx-4">
      <main>{children}</main>
    </div>
  );
};
export default Layout;
