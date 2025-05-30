import React from 'react';
import {Outlet} from "react-router-dom";

import Header from "./Header/Header.jsx";

const Layout = () => {
  return (
    <>
      <div className={"min-h-screen flex flex-col"}>
        <Header />
        <div className={"grow flex flex-col container mx-auto bg-white p-6 mt-20 mb-8"}>
          <Outlet/>
        </div>
      </div>
    </>
  );
};

export default Layout;