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

export const DashboardTabs = ({ children }) => {
  const router = useRouter();
  const { activityId, tab, taskId } = router.query;
  const [currentTab, setCurrentTab] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [activity, setActivity] = useState();
  const [role, setRole] = useState(0);
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
  const NavList2 = {
    Activity: [
      { labelText: "Home", href: "home" },

      { labelText: "Content Overview", href: "content-overview" },

      { labelText: "Donations", href: "donation" },
    ],
    Tasks: [{ labelText: "Tasks", href: "tasks" }],
    Apps: [{ labelText: "Connections", href: "connections" }],
    User_management: [{ labelText: "Members", href: "members" }],
    Moderation: [{ labelText: "Terms Screening", href: "terms-screening" }],
    Discussions: [{ labelText: "Member Chat", href: "chat" }],
  };

  useEffect(() => {
    if (taskId >= 0) {
      return setCurrentTab({
        labelText: `Task > ${parseInt(taskId + 1)}`,
        href: "task",
      });
    }
    if (tab) {
      Object.entries(NavList).map((key) => {
        if (key[1].find((item) => item.href === tab)) {
          setCurrentTab(key[1].find((item) => item.href === tab));
        }
        // return key[1].find((item) => item.href === tab);
      });
    }
  }, [tab, taskId]);

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
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/get-role",
          {
            activityId: activityId,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((response) => {
          if (response) {
            setRole(response.data.role);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activityId]);
  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (activity && token) {
      const members = activity.members;
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/user/info/_id`, {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (response) {
            console.log(response.data);
            if (!members.some((member) => member.id == response.data._id)) {
              router.replace("/explore");
            } else {
              setIsMember(
                members.some((member) => member.id == response.data._id)
              );
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activity]);

  return (
    <>
      <Navbar></Navbar>
      {isMember ? (
        <section className={styles.section}>
          {currentTab ? (
            <h1 className={styles.nav_map}>{currentTab.labelText}</h1>
          ) : null}
          <div className="flex">
            <DashboardNav
              NavList={role == 1 ? NavList : NavList2}
            ></DashboardNav>
            {activity && currentTab ? (
              <ActivityProvider activity={activity}>
                {!children ? <ViewTabs role={role} /> : null}
                {children}
              </ActivityProvider>
            ) : (
              <div className={styles.center_loader}>
                <Loading></Loading>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
};

export function useActivity() {
  return useContext(ActivityContext);
}

export default DashboardTabs;
