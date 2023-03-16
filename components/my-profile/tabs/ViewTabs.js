import React from "react";
import { useRouter } from "next/router";
import Security from "./security";
import AddProfile from "./addProfile";
import AccountOverview from "./info";
const ViewTabs = () => {
  const router = useRouter();
  const { tab } = router.query;
  switch (tab) {
    case "security":
      return (
        <section className="parent-section">
          <Security />
        </section>
      );
    
    case "add-profile":
        return (
            <section className="parent-section">
                <AddProfile />
            </section>
        );
    default:
        return (
            <section className="parent-section">
                <AccountOverview />
            </section>
        )

  }
};

export default ViewTabs;