import axios from "axios";
import ENV from "../../static_files/hostURL";

const GetUserWithPuid = async (puid) => {
  try {
    const response = await axios.get(
      `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/user/get-profile-by-puid/${puid}`
    );
    return response.data;
  } catch (error) {
    return false;
  }
};

export { GetUserWithPuid };
