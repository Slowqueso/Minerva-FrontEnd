import Link from "next/link";
import { React, useState, useEffect } from "react";
import FullLayout from "../../../components/Layout/FullLayout";
import styles from "../styles.module.css";
import MyProfileNavbar from "../../../components/my-profile/navbar/MyProfileNavbar";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import occupations from "../../../static_files/occupations";
import { Loading } from "web3uikit";
import {Router,useRouter} from "next/router";
import ViewTabs from "../../../components/my-profile/tabs/ViewTabs";

const AccountOverview = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [dob, setDob] = useState();
  const [country, setCountry] = useState();
  const [occupation, setOccupation] = useState();
  const [description, setDescription] = useState();
  const [profilePic, setProfilePic] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (response.data.authenticated) {
            setIsLoading(false);
            setUsername(response.data.user.username);
            setEmail(response.data.user.email);
            // setDob(response.data.user.dob);
            setCountry(response.data.user.address.country);
            setProfilePic(response.data.user.profile_pic);
            var occtemp = occupations.find(
              (item) => item.value == response.data.user.occupation
            );
            setOccupation(occtemp.label);
            // setDescription(response.data.user.description);
            console.log(occupation);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <FullLayout>
        <div className={styles.my_profile}>
          <MyProfileNavbar profilePic={profilePic} />
          {isLoading ? (
            <div className="centralise" style={{ height: "40vh" }}>
              <Loading></Loading>
            </div>
          ) : (
            <ViewTabs/>
           
          )}
        </div>
      </FullLayout>
    </>
  );
};

export default AccountOverview;
