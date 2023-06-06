import React, { useState } from "react";
import {  createContext, useEffect } from "react";
import SideNav from "./SideNav/SideNav";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Workspace from "./Workspace/Workspace";
import ENV from "../../static_files/hostURL";

export const UserContext = createContext();

const FullLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (response.data.authenticated) {
            setUser(response.data.user);
            
          }
        })
        .catch((err) => {
          console.log(err);
        });
        console.log(user)
    }
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      <div>
        <Navbar></Navbar>
        <div className="flex">
          <SideNav></SideNav>
          <Workspace>{children}</Workspace>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default React.memo(FullLayout);
