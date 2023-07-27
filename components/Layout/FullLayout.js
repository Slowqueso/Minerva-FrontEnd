import React, { useState, useEffect } from "react";
import SideNav from "./SideNav/SideNav";
import axios from "axios";
import Navbar from "./Navbar/Navbar";
import Workspace from "./Workspace/Workspace";
import { useMoralis } from "react-moralis";
import { UserContext } from "../../pages/_app";
import ENV from "../../static_files/hostURL";

// export const UserContext = createContext();

const FullLayout = ({ children }) => {
  const { account } = useMoralis();
  const { setUser } = React.useContext(UserContext);
  // const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token && account) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
          headers: {
            "x-access-token": token,
            "wallet-address": account,
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
    }
  }, [account]);

  return (
    <>
      <div className="flex">
        <SideNav></SideNav>
        <div style={{ width: "100%" }}>
          <Navbar></Navbar>
          <Workspace>{children}</Workspace>
        </div>
      </div>
    </>
  );
};

export default React.memo(FullLayout);
