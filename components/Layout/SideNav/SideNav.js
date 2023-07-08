import styles from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Logo from "../../Logo/Logo";
import Image from "next/image";
import {
  faHome,
  faRectangleList,
  faBell,
  faFlag,
  faRightFromBracket,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import React, { useState, useEffect, useContext } from "react";
import MyActivity from "./MyActivity";
import ENV from "../../../static_files/hostURL";
import { UserContext } from "../FullLayout";
import { useMoralis } from "react-moralis";
const SideNav = () => {
  const { deactivateWeb3 ,logout,isInitialized} = useMoralis();
  const { user } = useContext(UserContext);
  // const [user, setUser] = useState();
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();
  const [no_notifications, setNoNotifications] = useState(0);
  const logo_size = 16;
  useEffect(() => {
    handleActive();
    // console.log(localStorage.getItem("myActivityPreference"));
    if (localStorage.getItem("myActivityPreference") === "true") {
      setIsActive(localStorage.getItem("myActivityPreference"));
      document.getElementById("rotate-90").style.transform = "rotate(90deg)";
    }
    const token = localStorage.getItem("_USID");
    if (token) {
      // axios
      //   .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT +"/user/info", {
      //     headers: {
      //       "x-access-token": token,
      //     },
      //   })
      //   .then((response) => {
      //     if (response.data.authenticated) {
      //       setUser(response.data.user);
      //     } else {
      //       setUser(false);
      //     }
      //   })
      //   .catch((err) => {
      //     setUser(false);
      //     console.log(err);
      //   });
    }
      axios
        .get(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/get-no-of-notifications",
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
      axios
        .get(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/get-no-of-notifications",
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((response) => {
          console.log(response);
          console.log(response);
          setNoNotifications(response.data.count);
        })
        })
        .catch((err) => {
          console.log(err);
        });
        });
    }
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("myActivityPreference", isActive);
  // }, [isActive]);

  const rotate90deg = () => {
    if (isActive) {
      document.getElementById("rotate-90").style.transform = "rotate(0deg)";
      localStorage.setItem("myActivityPreference", false);
      setIsActive(false);
    } else {
      document.getElementById("rotate-90").style.transform = "rotate(90deg)";
      localStorage.setItem("myActivityPreference", true);
      setIsActive(true);
    }
  };

  const handleActive = () => {
    const nav_list = document.querySelector(`.${styles.nav_list}`);
    console.log(nav_list);
  };
  return (
    <div className={styles.side_nav}>
      <Logo></Logo>
      <ul className={styles.nav_list}>
        <h3 className={styles.list_text}>menu</h3>
        <li>
          <FontAwesomeIcon
            icon={faHome}
            size="sm"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/explore"}>
            <h3>Activites</h3>
          </Link>
        </li>
        <li style={{ display: "block" }} className="unselectable" key={2}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <FontAwesomeIcon
              icon={faRectangleList}
              size="sm"
              color="white"
            ></FontAwesomeIcon>
            {user ? (
              <h3
                onClick={() => {
                  rotate90deg();
                }}
              >
                My Activities
              </h3>
            ) : (
              <Link href={`/login`}>
                <h3>My Activities</h3>
              </Link>
            )}
            <span
              id={"rotate-90"}
              onClick={() => {
                rotate90deg();
              }}
            >
              <FontAwesomeIcon
                icon={faCaretRight}
                size="xs"
                color="white"
              ></FontAwesomeIcon>
            </span>
          </div>
          {isActive ? <MyActivity></MyActivity> : null}
        </li>
        <li key={3}>
          <FontAwesomeIcon
            icon={faSquarePlus}
            size="sm"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/create-activity"}>
            <h3>Create Activity</h3>
          </Link>
        </li>
      </ul>
      <ul className={`${styles.nav_list} ${styles.list_two}`}>
        <li key={4}>
          <FontAwesomeIcon
            icon={faBell}
            size="sm"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/notifications"}>
            <div className="flex">
              <h3>Notifications</h3>
              {no_notifications > 0 ? <h4>{no_notifications}</h4> : null}
              {no_notifications > 0 ? <h4>{no_notifications}</h4> : null}
            </div>
          </Link>
        </li>
        <li key={5}>
          <FontAwesomeIcon
            icon={faFlag}
            size="sm"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/my-flags/id"}>
            <h3>Flagged Activities</h3>
          </Link>
        </li>
      </ul>
      {user ? (
        <ul className={styles.nav_list}>
          <li>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size="sm"
              color="red"
            ></FontAwesomeIcon>
            <h3
              onClick={async() => {
                localStorage.removeItem("provider");
                // setWeb3Status("disconnected");
                deactivateWeb3();
                if (isInitialized) logout();
                localStorage.removeItem("_USID");
                router.replace("/login");
              }}
              style={{ color: "red" }}
            >
              Logout
            </h3>
          </li>
        </ul>
      ) : null}

      <div className={`${styles.socials_container} flex`}>
        <Link href="#">
          <div className={styles.socials}>
            <Image
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1024px-Instagram_logo_2016.svg.png"
              }
              height={logo_size}
              width={logo_size}
            ></Image>
          </div>
        </Link>
        <Link href="#">
          <div className={styles.socials}>
            <Image
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png?20220821125553"
              }
              height={logo_size}
              width={logo_size}
            ></Image>
          </div>
        </Link>
        <Link href="#">
          <div className={styles.socials}>
            <Image
              src={
                "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
              }
              height={logo_size}
              width={logo_size}
              style={{ filter: "brightness(10)" }}
            ></Image>
          </div>
        </Link>
        <Link href={"#"}>
          <div className={styles.socials}>
            <Image
              src={
                "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
              }
              height={logo_size}
              width={logo_size + 5}
            ></Image>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(SideNav);
