import axios from "axios";
import ENV from "../../static_files/hostURL";
export const getActivityById = async (activityId) => {
  axios
    .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
      headers: {
        "x-activity-id": activityId,
      },
    })
    .then((response) => {
      // console.log(response.data.activity);
      return response.data.activity;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getActivityPublicId = async (activityId) => {
  try {
    return await axios.get(
      ENV.PROTOCOL +
        ENV.HOST +
        ENV.PORT +
        `/activity/get-public-id/${activityId}`
    );
  } catch (error) {
    throw error;
  }
};
