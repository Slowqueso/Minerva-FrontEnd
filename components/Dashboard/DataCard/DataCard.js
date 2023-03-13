import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./styles.module.css";
import { Loading } from "web3uikit";

const DataCard = ({ icon, data, label, isSubTextNotVisible }) => {
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <div className={styles.card_header_icon}>
          <FontAwesomeIcon icon={icon} size="lg" color="#999999" />
        </div>
        <div className={styles.card_header_text}>
          <h1>{label}</h1>
          {!isSubTextNotVisible ? <h2>In the last 24h</h2> : null}
        </div>
      </div>
      <div className={styles.card_body}>
        {data != null ? <h3>{data}</h3> : <Loading />}
      </div>
    </div>
  );
};

export default DataCard;
