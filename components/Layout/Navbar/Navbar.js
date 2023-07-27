import styles from "./styles.module.css";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import ProfileModal, { Modalv2 } from "../../profileModal/Modal";
import axios from "axios";
import { ConnectButton } from "web3uikit";
import ENV from "../../../static_files/hostURL";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import { UserContext } from "../../../pages/_app";

const Navbar = () => {
  const router = useRouter();
  const [profileModalVisibility, setProfileModalVisibility] = useState(false);
  const { user, setUser } = useContext(UserContext);
  return (
    <nav className={styles.navbar}>
      {/* <Logo></Logo> */}
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
        {user ? (
          // <div style={{ scale: "0.8" }}>
          <ConnectButton
            chainId={80001}
            // className={styles.connect_button}
          ></ConnectButton>
        ) : // </div>
        null}
        {user ? (
          <>
            <div
              className={styles.link_profile}
              onClick={() => {
                setProfileModalVisibility(!profileModalVisibility);
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #c9c9c96e",
                }}
              >
                <Image
                  src={
                    user.profile_pic
                      ? user.profile_pic
                      : "/assets/default_profile.svg"
                  }
                  height={32}
                  width={32}
                ></Image>
              </div>
            </div>
            {profileModalVisibility ? (
              <Modalv2
                modalVisibility={profileModalVisibility}
                setModalVisibility={setProfileModalVisibility}
                user={user}
              ></Modalv2>
            ) : null}
          </>
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
            ) : null}
          </>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
