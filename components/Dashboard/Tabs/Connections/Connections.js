import React, { useEffect, useState } from "react";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { Loading } from "web3uikit";

const Connections = () => {
  const router = useRouter();
  const { activityId } = router.query;
  const [app, setApp] = useState();
  useEffect(() => {
    if (activityId) {
      axios
        .get(
          `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/get-connections/${activityId}`
        )
        .then((res) => {
          console.log(res.data.connections[0]);
          setApp(res.data.connections[0]);
        });
    }
  }, [activityId]);
  return (
    <>
      {app ? (
        <div>
          <h3 className={styles.header}>Discord</h3>
          <iframe
            src={`https://discord.com/widget?id=${app.link}&theme=dark`}
            width="350"
            height="500"
            allowtransparency="true"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          ></iframe>
        </div>
      ) : (
        <div className="centralise">
          <Loading />
        </div>
      )}
    </>
  );
};

export default Connections;
