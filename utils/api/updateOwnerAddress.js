import axios from "axios";
import ENV from "../../static_files/hostURL";

const updateOwnerAddress = (activityId, account) => {
  axios
    .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/upd-owner-address", {
      activityId,
      account,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default updateOwnerAddress;
