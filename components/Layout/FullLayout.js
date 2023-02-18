import React from "react";
import SideNav from "./SideNav/SideNav";

import Navbar from "./Navbar/Navbar";
import Workspace from "./Workspace/Workspace";
const FullLayout = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="flex">
        <SideNav></SideNav>
        <Workspace>{children}</Workspace>
      </div>
    </div>
  );
};

export default React.memo(FullLayout);
