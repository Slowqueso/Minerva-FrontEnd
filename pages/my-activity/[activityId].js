import React from "react";
import { useRouter } from "next/router";
import DashboardNav from "../../components/Layout/Dashboard/Navbar/DashboardNav";
import Navbar from "../../components/Layout/Navbar/Navbar";
const MyActivity = () => {
  const router = useRouter();
  const { activityId, tab } = router.query;
  return (
    <>
      <Navbar></Navbar>
      <DashboardNav></DashboardNav>
    </>
  );
};

export default MyActivity;
