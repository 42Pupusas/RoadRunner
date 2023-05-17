import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';
import React from 'react';

const Sidebar = dynamic(() => import('./Sidebar'), {
  ssr: false,
});

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};
export default Layout;
