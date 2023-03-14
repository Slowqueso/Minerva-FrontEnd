import React, { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import { useRouter } from "next/router";
import DashboardNav from "../../../components/Layout/Dashboard/Navbar/DashboardNav.js";
import Navbar from "../../../components/Layout/Navbar/Navbar.js";
import styles from "../styles.module.css";
import ViewTabs from "../../../components/Dashboard/ViewTabs.js";
import { Loading } from "web3uikit";
import { getActivityById } from "../../../utils/api/GetActivity.js";
import axios from "axios";
import ENV from "../../../static_files/hostURL";

export const ActivityContext = createContext();

const ActivityProvider = ({ children, activity }) => {
  const [activityData, setActivityData] = useState(activity);

  return (
    <ActivityContext.Provider value={activityData}>
      {children}
    </ActivityContext.Provider>
  );
};

const DashboardTabs = () => {
  const router = useRouter();
  const { activityId, tab } = router.query;
  const [currentTab, setCurrentTab] = useState(null);

  const [activity, setActivity] = useState();
  const NavList = {
    Activity: [
      { labelText: "Home", href: "home" },
      { labelText: "Roles", href: "roles" },
      { labelText: "Content Overview", href: "content-overview" },
      { labelText: "Templates", href: "template" },
      { labelText: "Status", href: "status" },
      { labelText: "Donations", href: "donation" },
    ],
    Tasks: [
      { labelText: "Tasks", href: "tasks" },
      { labelText: "Add Task", href: "add-task" },
    ],
    Apps: [
      { labelText: "Connections", href: "connections" },
      { labelText: "Integrations", href: "integrations" },
    ],
    User_management: [{ labelText: "Members", href: "members" }],
    Moderation: [
      { labelText: "Terms Screening", href: "terms-screening" },
      { labelText: "Audit Log", href: "audit-log" },
      { labelText: "Bans", href: "bans" },
    ],
    Discussions: [{ labelText: "Member Chat", href: "chat" }],
  };

  useEffect(() => {
    if (tab) {
      Object.entries(NavList).map((key) => {
        if (key[1].find((item) => item.href === tab)) {
          setCurrentTab(key[1].find((item) => item.href === tab));
        }
        // return key[1].find((item) => item.href === tab);
      });
    }
  }, [tab]);

  const FetchActivity = async () => {
    axios
      .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
        headers: {
          "x-activity-id": activityId,
        },
      })
      .then((response) => {
        setActivity(response.data.activity);
      })
      .catch((err) => {
        console.log(err);
      });
    // setActivity(activity);
  };

  useEffect(() => {
    if (activityId) {
      FetchActivity();
    }
  }, [activityId]);

  return (
    <>
      <Navbar></Navbar>
      <section className={styles.section}>
        {currentTab ? (
          <h1 className={styles.nav_map}>{currentTab.labelText}</h1>
        ) : null}
        <div className="flex">
          <DashboardNav NavList={NavList}></DashboardNav>
          {activity && currentTab ? (
            <ActivityProvider activity={activity}>
              <ViewTabs />
            </ActivityProvider>
          ) : (
            <div className={styles.center_loader}>
              <Loading></Loading>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export function useActivity() {
  return useContext(ActivityContext);
}

export default DashboardTabs;
