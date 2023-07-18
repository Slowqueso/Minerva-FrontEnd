import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const InnerNav = ({ nav_links, activeId }) => {
  return (
    <>
      <ul className={styles.account_navbar}>
        {nav_links.map((link, index) => (
          <div key={index}>
            {activeId === index ? (
              <Link href={link.href} key={index}>
                <h3 className={styles.active}>{link.label}</h3>
              </Link>
            ) : (
              <h3 className={`${styles.disabled} unselectable`} key={index}>
                {link.label}
                {index < activeId ? (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />
                ) : null}
              </h3>
            )}
          </div>
        ))}
      </ul>
    </>
  );
};

export default React.memo(InnerNav);
