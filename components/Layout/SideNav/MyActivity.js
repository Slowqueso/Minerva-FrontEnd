import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import { Loading } from "web3uikit";
import Image from "next/image";
import Link from "next/link";

const MyActivity = () => {
  const [activities, setActivities] = useState();

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(
          `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/get-user-activities`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((response) => {
          setActivities(response.data.activities);
          console.log(activities);
        })
        .catch((err) => {
          setActivities(false);
          console.log(err);
        });
    }
  }, []);
  return (
    <>
      {activities ? (
        <ul className={styles.activities_list}>
          <h3 className={styles.role_header}>creations</h3>
          {activities.map((activity, index) => {
            if (activity.role === 1 && activity.status >= 4) {
              return (
                <Link href={`/dashboard/${activity.public_ID}`} key={index}>
                  <li className={styles.activity_container}>
                    <span className={styles.activity_logo}>
                      <Image
                        src={`${activity.activity_logo}`}
                        height={30}
                        width={30}
                        alt={"image Text"}
                      ></Image>
                    </span>
                    <p className={styles.activity_title}>{activity.title}</p>
                  </li>
                </Link>
              );
            }
          })}
          <br />
          <h3 className={styles.role_header}>participated in</h3>
          {activities.map((activity, index) => {
            if (activity.role === 2) {
              return (
                <Link href={`/dashboard/${activity.public_ID}`} key={index}>
                  <li className={styles.activity_container}>
                    <span className={styles.activity_logo}>
                      <Image
                        src={`${activity.activity_logo}`}
                        height={30}
                        width={30}
                        alt={"image Text"}
                      ></Image>
                    </span>
                    <p className={styles.activity_title}>{activity.title}</p>
                  </li>
                </Link>
              );
            }
          })}
          <br />
          <h3 className={styles.role_header}>applied to</h3>
          {activities.map((activity, index) => {
            if (activity.role === 4) {
              return (
                <Link
                  href={`/explore/${activity.public_ID}/overview`}
                  key={index}
                >
                  <li className={styles.activity_container}>
                    <span className={styles.activity_logo}>
                      <Image
                        src={`${activity.activity_logo}`}
                        height={30}
                        width={30}
                        alt={"image Text"}
                      ></Image>
                    </span>
                    <p className={styles.activity_title}>{activity.title}</p>
                  </li>
                </Link>
              );
            }
          })}
          <br />
          <h3 className={styles.role_header}>draft</h3>
          {activities.map((activity, index) => {
            if (activity.status < 4) {
              return (
                <Link href={`/create-activity/${activity.id}`} key={index}>
                  <li className={styles.activity_container}>
                    <span className={styles.activity_logo}>
                      <Image
                        src={`${activity.activity_logo}`}
                        height={30}
                        width={30}
                        alt={"image Text"}
                      ></Image>
                    </span>
                    <p className={styles.activity_title}>{activity.title}</p>
                  </li>
                </Link>
              );
            }
          })}
        </ul>
      ) : // <Loading />
      null}
    </>
  );
};

export default MyActivity;
