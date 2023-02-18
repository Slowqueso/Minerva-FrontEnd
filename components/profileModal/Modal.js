import styles from "./styles.module.css";
import Link from "next/link";
import React, { useEffect } from "react";
import { Loading } from "web3uikit";
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
            <Link href={"/account/id"}>
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
  return (
    <div
      style={modalVisibility}
      onMouseOver={() => {
        setModalVisibility({ display: "flex" });
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setModalVisibility({ display: "flex" });
        }, 800);
      }}
      className={styles.profile_modal}
      id="exception"
    ></div>
  );
};

export default Modal;
