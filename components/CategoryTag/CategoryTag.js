import React from "react";
import styles from "./styles.module.css";

const CategoryTag = ({ tagText, fontSize, title, key_index }) => {
  return (
    <div className={styles.tag_container} title={title} key={key_index}>
      <h3
        className={styles.content_text}
        style={{ fontSize: fontSize ? fontSize : "10px" }}
      >
        {tagText}
      </h3>
    </div>
  );
};

export default CategoryTag;
