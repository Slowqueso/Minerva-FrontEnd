import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Error = ({ statusCode, title }) => {
  return (
    <div className={styles.wrapper}>
      <div style={{ margin: "auto", width: "fit-content" }}>
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className={styles.error_icon}
        ></FontAwesomeIcon>
      </div>
      <h3>
        Error {statusCode}: {title}
      </h3>
      <p>
        If this problem persists, report the problem at our{" "}
        <Link href={"/contact-us"}>Contact Us</Link>
      </p>
    </div>
  );
};

export default Error;
