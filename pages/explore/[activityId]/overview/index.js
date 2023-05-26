import styles from "../styles.module.css";
import ActivityProfilePage from "..";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { Loading } from "web3uikit";
import Comments from "../../../../components/Comments/Comments";
import Link from "next/link";

const Overview = () => {
  const router = useRouter();
  const activityId = router.query.activityId;
  const [activity, setActivity] = useState();

  useEffect(() => {
    if (activityId) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
          headers: {
            "x-activity-id": activityId,
          },
        })
        .then((response) => {
          if (response) {
            setActivity(response.data.activity);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activityId]);
  return (
    <ActivityProfilePage>
      <div className={styles.view_tab}>
        <Link href={`/explore/${activityId}/overview`}>
          <div
            className={styles.view_nav}
            style={{ background: `rgba(103, 103, 103, 0.06)` }}
          >
            <h3>Overview</h3>
          </div>
        </Link>
        <Link href={`/explore/${activityId}/terms`}>
          <div className={styles.view_nav}>
            <h3>Terms and Conditions</h3>
          </div>
        </Link>
      </div>
      {activity ? (
        <>
          <section className={styles.content_container}>
            <div>
              <h3>About Activity</h3>
              <p className={styles.desc}>{activity.desc}</p>
            </div>
          </section>
          <section className={styles.content_container}>
            <div>
              <Comments activityId={activityId} />
            </div>
          </section>
          {activity.fields.map((field, index) => {
            return (
              <section className={styles.content_container} key={index}>
                <div>
                  <h3>{field.fieldHeader}</h3>
                  <p>{field.fieldDescription}</p>
                </div>
                {field.imageFile ? (
                  <Link
                    href={`${
                      ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/" + field.imageFile
                    }`}
                  >
                    <a target="_blank">
                      <img
                        src={`${
                          ENV.PROTOCOL +
                          ENV.HOST +
                          ENV.PORT +
                          "/" +
                          field.imageFile
                        }`}
                      ></img>
                    </a>
                  </Link>
                ) : null}
              </section>
            );
          })}
        </>
      ) : (
        <div className={styles.centralise}>
          <Loading />
        </div>
      )}
    </ActivityProfilePage>
  );
};

export default Overview;
