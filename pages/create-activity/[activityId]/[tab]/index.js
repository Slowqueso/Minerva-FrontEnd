import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Loading } from "web3uikit";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import FullLayout from "../../../../components/Layout/FullLayout";
import ViewTabs from "../../../../components/create-activity/ViewTabs/ViewTabs";

const CreateActivityTab = () => {
  const router = useRouter();
  const { activityId, tab } = router.query;
  return (
    <FullLayout>
      <ViewTabs></ViewTabs>
    </FullLayout>
  );
};

export default CreateActivityTab;
