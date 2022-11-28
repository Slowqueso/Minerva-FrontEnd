import Logo from "../../Logo/Logo";
import styles from "./styles.module.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import ProfileModal from "../../profileModal/Modal";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ConnectButton } from "web3uikit";
import ENV from "../../../static_files/hostURL";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [profileModalVisibility, setProfileModalVisibility] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    const token = localStorage.getItem("_USID");
    setProfileModalVisibility({ display: "none" });
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
  }, []);
  return (
    <div className={styles.navbar}>
      <Logo></Logo>
      <div className={styles.nav_links}>
        <Link href={"/explore"}>
          <h3 className={styles.link_text}>Explore</h3>
        </Link>
        <Link href={"/about-us"}>
          <h3 className={styles.link_text}>About Us</h3>
        </Link>
        <Link href={"/contact-us"}>
          <h3 className={styles.link_text}>Contact Us</h3>
        </Link>
        {user ? <ConnectButton></ConnectButton> : null}
        {user ? (
          <div
            className={styles.link_profile}
            onMouseOver={() => {
              setProfileModalVisibility({ display: "flex" });
            }}
            // onMouseLeave={() => {
            //   setProfileModalVisibility({ display: "none" });
            // }}
          >
            <FontAwesomeIcon icon={faUser} color="white"></FontAwesomeIcon>
            <ProfileModal
              modalVisibility={profileModalVisibility}
              setModalVisibility={setProfileModalVisibility}
              user={user}
            ></ProfileModal>
          </div>
        ) : (
          <>
            {router ? (
              <Link
                href={router.pathname === "/login" ? "/register" : "/login"}
              >
                <h3 className={styles.link_text}>
                  {router.pathname === "/login" ? "Sign Up" : "Login"}
                </h3>
              </Link>
            ) : // <Link href={"login"}>
            //   <h3 className={styles.link_text}>Login</h3>
            // </Link>
            null}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
