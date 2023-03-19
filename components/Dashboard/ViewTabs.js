import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Home from "./Tabs/Home/Home";
import Donations from "./Tabs/Donations/Donations";
import Tasks from "./Tabs/Tasks/Tasks";
import AddTask from "./Tabs/Add-Task/AddTask";
import Members from "./Tabs/Members/Members";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import Connections from "./Tabs/Connections/Connections";
import Integrations from "./Tabs/Integrations/Integrations";

const ViewTabs = ({ role }) => {
  const router = useRouter();
  const { activityId, tab } = router.query;

  useEffect(() => {}, [activityId]);
  switch (tab) {
    case "home":
      return (
        <section className="parent-section">
          <Home />
        </section>
      );
    case "roles":
      if (role === 1) {
        return <div>Roles</div>;
      } else {
        return <div className="centralise">Not Authorized</div>;
      }
    case "content-overview":
      return <div>Content Overview</div>;
    case "template":
      if (role === 1) {
        return <div>Templates</div>;
      } else {
        return <div className="centralise">Not Authorized</div>;
      }
    case "status":
      if (role === 1) {
        return <div>Status</div>;
      } else {
        return <div className="centralise">Not Authorized</div>;
      }
    case "donation":
      return (
        <section className="parent-section">
          <Donations />
        </section>
      );
    case "tasks":
      return <Tasks />;
    case "tasks/[taskId":
      return <div>TaskVYEs</div>;
    case "add-task":
      if (role === 1) {
        return <AddTask />;
      } else {
        return <div className="centralise">Not Authorized</div>;
      }

    case "connections":
      return (
        <section className="parent-section">
          <Connections>Connections</Connections>
        </section>
      );
    case "integrations":
      if (role === 1) {
        return (
          <section className="parent-section">
            <Integrations></Integrations>
          </section>
        );
      } else {
        return <div className="centralise">Not Authorized</div>;
      }
    case "members":
      return <Members />;

    case "terms-screening":
      return <div>Terms Screening</div>;
    case "audit-log":
      if (role === 1) {
        return <div>Audit Log</div>;
      } else {
        return <div className="centralise">Not Authorized</div>;
      }
    case "bans":
      if (role === 1) {
        return <div>Bans</div>;
      } else {
        return <div className="centralise">Not Authorized</div>;
      }
    case "chat":
      return <div>Member Chat</div>;
  }
};

export default ViewTabs;
