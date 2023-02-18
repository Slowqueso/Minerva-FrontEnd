import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const NavItem = () => {};

const DashboardNav = () => {
  const router = useRouter();
  const { activityId, tab } = router.query;
  useEffect(() => {
    console.log("activityId: ", activityId);
  });
  useEffect(() => {}, [activityId]);
  return (
    <>
      <h2 className={styles.nav_map}>{tab ? tab : "Home"}</h2>
      <nav>
        <ul className={styles.nav_list}>
          <li className={styles.nav_item}></li>
        </ul>
      </nav>
    </>
  );
};

export default DashboardNav;
