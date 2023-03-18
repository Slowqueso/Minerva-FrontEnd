import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import Logo from "../../Logo/Logo";
import Link from "next/link";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import SubmitButton from "../../form/SubmitButton";
import Image from "next/image";
import { Modalv2 } from "../../profileModal/Modal";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profileModalVisibility, setProfileModalVisibility] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push("/create-activity");
    } else {
      router.push("/login");
    }
  };
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
          } else {
            setUser(null);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.wrapper}>
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
            <SubmitButton
              label={"Create Activity"}
              submitHandler={handleClick}
            ></SubmitButton>
            {user ? (
              <>
                <div
                  className={styles.link_profile}
                  onClick={() => {
                    setProfileModalVisibility(!profileModalVisibility);
                  }}
                  // onMouseOver={() => {
                  //   setProfileModalVisibility({ display: "flex" });
                  // }}
                  // onMouseLeave={() => {
                  //   setProfileModalVisibility({ display: "none" });
                  // }}
                >
                  {/* <FontAwesomeIcon icon={faUser} color="white"></FontAwesomeIcon> */}
                  <div
                    style={{
                      borderRadius: "50%",
                      overflow: "hidden",
                      height: "40px",
                      width: "40px",
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
                      height={40}
                      width={40}
                    ></Image>
                  </div>
                </div>
                <div className={styles.profile_modal}>
                  {profileModalVisibility ? (
                    <Modalv2
                      modalVisibility={profileModalVisibility}
                      setModalVisibility={setProfileModalVisibility}
                      user={user}
                    ></Modalv2>
                  ) : null}
                </div>
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
                ) : // <Link href={"login"}>
                //   <h3 className={styles.link_text}>Login</h3>
                // </Link>
                null}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
