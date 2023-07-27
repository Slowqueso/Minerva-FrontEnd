import axios from "axios";
import ENV from "../../static_files/hostURL";

const incrementStatus = (id) => {
  axios
    .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/increment-status", {
      id: id,
    })
    .then((response) => {
      if (response.status === 204) {
        setProgress(progressValue);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export default incrementStatus;
