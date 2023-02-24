import styles from "./styles.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faHome,
  faRectangleList,
  faBell,
  faFlag,
  faRightFromBracket,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import React, { useState, useEffect } from "react";
import MyActivity from "./MyActivity";

const SideNav = () => {
  const [user, setUser] = useState();
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // console.log(localStorage.getItem("myActivityPreference"));
    if (localStorage.getItem("myActivityPreference") === "true") {
      setIsActive(localStorage.getItem("myActivityPreference"));
      document.getElementById("rotate-90").style.transform = "rotate(90deg)";
    }
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get("http://localhost:3001/user/info", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (response.data.authenticated) {
            setUser(response.data.user);
          } else {
            setUser(false);
          }
        })
        .catch((err) => {
          setUser(false);
          console.log(err);
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
  return (
    <div className={styles.side_nav}>
      <ul className={styles.nav_list}>
        <li>
          <FontAwesomeIcon
            icon={faHome}
            size="lg"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/explore"}>
            <h3>Activites</h3>
          </Link>
        </li>
        <li style={{ display: "block" }} className="unselectable">
          <div style={{ display: "flex", alignItems: "center" }}>
            <FontAwesomeIcon
              icon={faRectangleList}
              size="lg"
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
        <li>
          <FontAwesomeIcon
            icon={faSquarePlus}
            size="lg"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/create-activity"}>
            <h3>Create Activity</h3>
          </Link>
        </li>
      </ul>
      <ul className={styles.nav_list}>
        <li>
          <FontAwesomeIcon
            icon={faBell}
            size="lg"
            color="white"
          ></FontAwesomeIcon>
          <Link href={"/notifications/:id"}>
            <h3>Notifications</h3>
          </Link>
        </li>
        <li>
          <FontAwesomeIcon
            icon={faFlag}
            size="lg"
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
              size="lg"
              color="red"
            ></FontAwesomeIcon>
            <h3
              onClick={() => {
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
    </div>
  );
};

export default React.memo(SideNav);
