import axios from "axios";
import ENV from "../../static_files/hostURL";

const DeleteUser = async (uid) => {
  return await axios.delete(
    `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/user/delete/${uid}`
  );
};

export { DeleteUser };
