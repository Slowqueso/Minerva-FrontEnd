import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import ActivityDetails from "../ActivityDetails/ActivityDetails";
import ActivityPreview from "../ActivityPreview/ActivityPreview";
import ActivityOverview from "../ActivityOverview/ActivityOverview";
import ActivityTerms from "../ActivityTerms/ActivityTerms";
import InnerNav from "../../Layout/Workspace/InnerNav/Navbar";
import CreateActivityNavigation from "../../../static_files/CreateActivityNavigation";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import { UserContext } from "../../../pages/_app";

const ViewTabs = () => {
  const [activity, setActivity] = useState();
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { tab, activityId } = router.query;
  const [nav_links, setNavLinks] = useState(CreateActivityNavigation());
  const [errorType, setErrorType] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("_USID");
    if (activityId && token) {
      axios
        .get(
          `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/drafts/get-activity/${activityId}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          setActivity(res.data.activity);
        })
        .catch((err) => {
          console.log(err);
          // console.log("this is the error: " + err);
          setErrorType(err);
        });
      setNavLinks(CreateActivityNavigation(activityId));
      setLoading(false);
    }
  }, [activityId]);
  switch (tab) {
    default:
      return (
        <section className={styles.parentSection}>
          <InnerNav nav_links={nav_links} activeId={0}></InnerNav>
          <div style={{ width: "80%", marginLeft: "2rem", padding: "1rem" }}>
            {activity ? (
              <ActivityDetails
                activity={activity}
                errorType={errorType}
              ></ActivityDetails>
            ) : (
              <ActivityDetails errorType={errorType}></ActivityDetails>
            )}
          </div>
        </section>
      );

    case "deployment": {
      activity ? (
        <section className={styles.parentSection}>
          <InnerNav nav_links={nav_links} activeId={1}></InnerNav>
          <ActivityPreview
            activity={activity}
            user={user}
            errorType={errorType}
          ></ActivityPreview>
        </section>
      ) : null;
    }

    case "terms-and-conditions":
      return (
        <section className={styles.parentSection}>
          <InnerNav nav_links={nav_links} activeId={2}></InnerNav>
          <ActivityTerms
            activity={activity}
            errorType={errorType}
          ></ActivityTerms>
        </section>
      );

    case "overview":
      return (
        <section className={styles.parentSection}>
          <InnerNav nav_links={nav_links} activeId={3}></InnerNav>
          <ActivityOverview
            activity={activity}
            errorType={errorType}
          ></ActivityOverview>
        </section>
      );
  }
};

export default ViewTabs;
