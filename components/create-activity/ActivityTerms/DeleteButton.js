import React from "react";
import styles from "./styles.module.css";

const DeleteButton = ({ clickHandler }) => {
  return (
    <button
      className={styles.delete_button}
      onClick={(e) => {
        e.preventDefault();
        clickHandler();
      }}
    >
      Delete Term
    </button>
  );
};

export default DeleteButton;
