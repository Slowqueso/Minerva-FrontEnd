import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Loading } from "web3uikit";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import FullLayout from "../../../components/Layout/FullLayout";

const CreateActivityId = () => {
  const router = useRouter();
  const { activityId } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (activityId && token) {
      axios
        .get(
          `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/drafts/get-activity/${activityId}`,
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          const activity = res.data.activity;
          switch (activity._status) {
            case 1:
              return router.replace(
                `/create-activity/${activityId}/deployment`
              );
            case 2:
              return router.replace(
                `/create-activity/${activityId}/terms-and-conditions`
              );
            case 3:
              return router.replace(`/create-activity/${activityId}/overview`);
            default:
              return router.replace(`/create-activity`);
          }
        })
        .catch((err) => {
          router.push("/create-activity");
        });
    }
  }, [activityId]);

  return (
    <FullLayout>
      <div>{loading ? <Loading /> : null}</div>
    </FullLayout>
  );
};

export default CreateActivityId;
