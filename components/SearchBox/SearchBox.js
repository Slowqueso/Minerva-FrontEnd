import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox = ({ placeholder }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="search">
        <FontAwesomeIcon icon={faSearch} color={"#939393"}></FontAwesomeIcon>
      </label>
      <input type="text" id="search" placeholder={placeholder} />
    </div>
  );
};

export default SearchBox;
