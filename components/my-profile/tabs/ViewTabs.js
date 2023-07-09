import React from "react";
import { useRouter } from "next/router";
import Security from "./security";
import AddProfile from "./addProfile";
import AccountOverview from "./info";
import styles from "./styles.module.css";

const ViewTabs = () => {
  const router = useRouter();
  const { tab } = router.query;
  switch (tab) {
    case "security":
      return (
        <section className={styles.parentSection}>
          <Security />
        </section>
      );
    
    case "add-profile":
        return (
            <section className={styles.parentSection}>
                <AddProfile />
            </section>
        );
    default:
        return (
            <section className={styles.parentSection}>
                <AccountOverview />
            </section>
        )

  }
};

export default ViewTabs;