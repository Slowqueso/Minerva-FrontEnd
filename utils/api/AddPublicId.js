import axios from "axios";
import ENV from "../../static_files/hostURL";

export const AddPublicId = async (activityId, publicId, setErrorMessage) => {
  try {
    const response = await axios.put(
      `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/add-activity-public-id/${activityId}`,
      {
        publicId: publicId,
      },
      {
        headers: {
          "x-access-token": localStorage.getItem("_USID"),
        },
      }
    );
  } catch (error) {
    console.log(error);
    setErrorMessage(error.response.data.msg);
  }
};
