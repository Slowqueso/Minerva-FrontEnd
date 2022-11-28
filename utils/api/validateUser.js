import axios from "axios";
import ENV from "../../static_files/hostURL";

const isUserLogged = async () => {
  const flag = false;
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("_USID");
  } else {
    token = null;
  }
  if (token) {
    try {
      const response = await axios.get(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/token",
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data.authenticated) {
        flag = true;
      }
    } catch (error) {
      flag = false;
    }
  }
  return flag;
};

export { isUserLogged };
