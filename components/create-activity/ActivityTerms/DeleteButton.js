import React from "react";
import styles from "./styles.module.css";

const DeleteButton = ({ clickHandler, label }) => {
  return (
    <button
      className={styles.delete_button}
      onClick={(e) => {
        e.preventDefault();
        clickHandler();
      }}
    >
      {label}
    </button>
  );
};

export default DeleteButton;
