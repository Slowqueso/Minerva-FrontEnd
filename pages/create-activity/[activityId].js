import FullLayout from "../../components/Layout/FullLayout";
import React, { useState, useEffect } from "react";
import ActivityDetails from "../../components/create-activity/ActivityDetails/ActivityDetails";
import ProgressBar from "../../components/ProgressBar";
import styles from "./styles.module.css";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import FormError from "../../components/form/formError";
import ActivityPreview from "../../components/create-activity/ActivityPreview/ActivityPreview";
import ActivityTerms from "../../components/create-activity/ActivityTerms/ActivityTerms";
import ActivityOverview from "../../components/create-activity/ActivityOverview/ActivityOverview";

const TimeLineGraph = ({ progress }) => {
  const colourArray = [
    { background: "#67C2A1" },
    { background: "#656BFF" },
    { background: "#D663FF" },
    { background: "#F0D1FF" },
  ];
  return (
    <ul className={styles.timeline_nodes_list}>
      <li className={styles.node_container}>
        <div className={styles.node} style={colourArray[0]}>
          <h3>1</h3>
        </div>
        <h2>Activity Details</h2>
      </li>
      <li className={styles.node_container}>
        <div
          className={styles.node}
          style={
            !(progress >= 33)
              ? { background: "transparent", border: `1px solid white` }
              : colourArray[1]
          }
        >
          <h3>2</h3>
        </div>
        <h2>Activity Preview and Deployment</h2>
      </li>
      <li className={styles.node_container}>
        <div
          className={styles.node}
          style={
            !(progress >= 66)
              ? { background: "transparent", border: `1px solid white` }
              : colourArray[2]
          }
        >
          <h3>3</h3>
        </div>
        <h2>Adding Terms and Conditions</h2>
      </li>
      <li className={styles.node_container}>
        <div
          className={styles.node}
          style={
            !(progress >= 100)
              ? { background: "transparent", border: `1px solid white` }
              : colourArray[3]
          }
        >
          <h3>4</h3>
        </div>
        <h2>Activity Overview</h2>
      </li>
    </ul>
  );
};

const CreateActivity = () => {
  const [progress, setProgress] = useState(33);
  const [user, setUser] = useState();
  const [activity, setActivity] = useState();
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
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <FullLayout>
      <div className={styles.timeline_container}>
        <TimeLineGraph progress={progress}></TimeLineGraph>
        <div>
          <ProgressBar progress={progress} height={10} />
        </div>
      </div>
      {/* {console.log(activityId)} */}
      {progress < 33 ? (
        user ? (
          user.credit_score >= 100 ? (
            <ActivityDetails
              setProgress={setProgress}
              user={user}
              progress={progress}
              activity={activity}
            ></ActivityDetails>
          ) : (
            <FormError
              errorMessage={
                "You Do Not meet the requirement of 100 credit score to create an activity"
              }
            ></FormError>
          )
        ) : null
      ) : null}

      {progress >= 33 && progress < 66 ? (
        <ActivityPreview
          activity={activity}
          setActivity={setActivity}
          setProgress={setProgress}
          user={user}
        />
      ) : null}
      {progress >= 66 && progress < 100 ? (
        <ActivityTerms setProgress={setProgress}></ActivityTerms>
      ) : null}
      {progress == 100 ? (
        <ActivityOverview
          setActivity={setActivity}
          activity={activity}
          setProgress={setProgress}
        />
      ) : null}
    </FullLayout>
  );
};

export default CreateActivity;
