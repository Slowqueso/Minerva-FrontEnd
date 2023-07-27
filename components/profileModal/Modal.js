import styles from "./styles.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Loading } from "web3uikit";
import Image from "next/image";
import { faXmark, faUser, faBell, faGear, faFileCircleQuestion, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMoralis } from "react-moralis";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants";

const Modal = ({ modalVisibility, setModalVisibility, user }) => {
  return (
    <div
      style={modalVisibility}
      onMouseOver={() => {
        setModalVisibility({ display: "flex" });
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setModalVisibility({ display: "none" });
        }, 800);
      }}
      className={styles.profile_modal}
      id="exception"
    >
      {user ? (
        <div className={styles.flex}>
          <div className={`${styles.user_profile_pic}`}>
            <img
              src={
                user.profile_pic
                  ? user.profile_pic
                  : "/assets/default_profile.svg"
              }
            />
            <Link href={"/my-profile"}>
              <div className={`${styles.profile_cover} f-12`}>
                <h3>Change Profile</h3>
              </div>
            </Link>
          </div>
          <div>
            <h3 className={styles.profile_username}>
              {user ? user.username : null}
            </h3>
            <h3 className={styles.credit_score} title={"Credit Score"}>
              {user ? user.credit_score : null}
              <span>credits</span>
            </h3>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export const Modalv2 = ({ modalVisibility, setModalVisibility, user }) => {
  const [userCredits, setUserCredits] = useState(0);
  const { account, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const { runContractFunction: getUserCredits } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getUserCredits",
    params: {
      userAddress: account,
    },
  });

  const loadUserCredits = async () => {
    const response = await getUserCredits({
      onSuccess: (res) => {
        setUserCredits(parseInt(res));
      },
      onError: (err) => {
        console.log("Error: ", err);
      },
    });
  };
  useEffect(() => {
    if (account) {
      loadUserCredits();
    }
  }, [account]);
  return (
    <div className={styles.modalv2_modal} id="exception">
      <div
        className={styles.close_button}
        onClick={(e) => {
          setModalVisibility(false);
        }}
      >
        <FontAwesomeIcon
          icon={faXmark}
          color={"lightgrey"}
          size={"lg"}
        ></FontAwesomeIcon>
      </div>
      <div className={styles.modal_header}>
        <Link href={"/my-profile"}>
          <div className={styles.profile_pic_container}>
            <div className={styles.profile_pic}>
              <Image
                src={
                  user.profile_pic
                    ? user.profile_pic
                    : "/assets/default_profile.svg"
                }
                height={115}
                width={115}
              ></Image>
            </div>
            <h3>My Profiles</h3>
          </div>
        </Link>
      </div>
      <div className={styles.modal_body}>
        <div className={styles.user_info}>
          <h1 className={styles.header_text}>{user.username}</h1>
          <h3>{user.email}</h3>
        </div>
        <div className={styles.user_tag_info}>
          <div className={styles.tag}>
            <h1>{userCredits}</h1>
            <h3>Credits</h3>
          </div>
          <div className={styles.tag}>
            <h1>8</h1>
            <h3>Followers</h3>
          </div>
        </div>
        <div className={styles.wrapper}>
          <Link href={"/my-profile"}>
            <div className={styles.inner_container}>
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: "#9da2a8", }}
                size={"m"}
              ></FontAwesomeIcon>
              <span className={styles.button}>My Profile</span>
            </div>
          </Link>
          <Link href={"/notifications"}>
            <div className={styles.inner_container}>
              <FontAwesomeIcon
                icon={faBell}
                style={{ color: "#9da2a8", }}
                size={"m"}
              ></FontAwesomeIcon>
              <span className={styles.button}>Notifications</span>
            </div>
          </Link>
          {/* <Link href={"/my-profile"}>
              <div className={styles.inner_container}>
                <FontAwesomeIcon
                  icon={faGear}
                  style={{ color: "#9da2a8", }}
                  size={"m"}
                ></FontAwesomeIcon>
                <span className={styles.button}>User Settings</span>
              </div>
            </Link>
            <Link href={"/my-profile"}>
              <div className={styles.inner_container}>
                <FontAwesomeIcon
                  icon={faFileCircleQuestion}
                  style={{ color: "#9da2a8", }}
                  size={"m"}
                ></FontAwesomeIcon>
                <span className={styles.button}>Help Center</span>
              </div>
            </Link> */}
          <Link href={"/"}>
            <div className={styles.inner_container}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                style={{ color: "#9da2a8", }}
                size={"m"}
              ></FontAwesomeIcon>
              <span className={styles.button}>Log out</span>
            </div>
          </Link>
        </div>
      </div>
      <div className={styles.background}>
        <div className={styles.tiles}>
          <div className={`${styles.tile} ${styles.tile_1}`}></div>
          <div className={`${styles.tile} ${styles.tile_2}`}></div>
          <div className={`${styles.tile} ${styles.tile_3}`}></div>
          <div className={`${styles.tile} ${styles.tile_4}`}></div>

          <div className={`${styles.tile} ${styles.tile_5}`}></div>
          <div className={`${styles.tile} ${styles.tile_6}`}></div>
          <div className={`${styles.tile} ${styles.tile_7}`}></div>
          <div className={`${styles.tile} ${styles.tile_8}`}></div>
        </div>

        <div className={`${styles.line} ${styles.line_1}`}></div>
        <div className={`${styles.line} ${styles.line_2}`}></div>
        <div className={`${styles.line} ${styles.line_3}`}></div>

      </div>
      <div className={styles.glow1}></div>
      <div className={styles.glow2}></div>
    </div>
  );
};

export default Modal;
