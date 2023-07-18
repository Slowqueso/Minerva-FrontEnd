import "../styles/global.css";
import "../styles/register/styles.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { useEffect, useState, createContext } from "react";
import axios from "axios";
import ENV from "../static_files/hostURL";
export const UserContext = createContext();
function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [updateUser, setUpdateUser] = useState(false);
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
    }
  }, [updateUser]);
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <UserContext.Provider
          value={{ user: user, setUser: setUser, setUpdateUser: setUpdateUser }}
        >
          <Component {...pageProps} />
        </UserContext.Provider>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
