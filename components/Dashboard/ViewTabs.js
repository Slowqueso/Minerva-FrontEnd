import React from "react";
import { useRouter } from "next/router";
import Home from "./Tabs/Home/Home";
import Donations from "./Tabs/Donations/Donations";
import Tasks from "./Tabs/Tasks/Tasks";
import AddTask from "./Tabs/Add-Task/AddTask";

const ViewTabs = () => {
  const router = useRouter();
  const { tab } = router.query;
  switch (tab) {
    case "home":
      return (
        <section className="parent-section">
          <Home />
        </section>
      );
    case "roles":
      return <div>Roles</div>;
    case "content-overview":
      return <div>Content Overview</div>;
    case "template":
      return <div>Templates</div>;
    case "status":
      return <div>Status</div>;
    case "donation":
      return (
        <section className="parent-section">
          <Donations />
        </section>
      );
    case "tasks":
      return <Tasks />;
    case "add-task":
      return <AddTask />;
    case "connections":
      return <div>Connections</div>;
    case "integrations":
      return <div>Integrations</div>;
    case "members":
      return <div>Members</div>;
    case "terms-screening":
      return <div>Terms Screening</div>;
    case "audit-log":
      return <div>Audit Log</div>;
    case "bans":
      return <div>Bans</div>;
    case "chat":
      return <div>Member Chat</div>;
    default:
      return <div>Home</div>;
  }
};

export default ViewTabs;
