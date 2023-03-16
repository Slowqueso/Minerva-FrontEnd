import Link from "next/link";
import { React, useState, useEffect } from "react";
import FullLayout from "../../../components/Layout/FullLayout";
import styles from "./styles.module.css";
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
      Router.push("/login");
    }
  }, []);

  return (
    <>
      
          {isLoading ? (
            <div className="centralise" style={{ height: "40vh" }}>
              <Loading></Loading>
            </div>
          ) : (
            <div className={styles.account_overview}>
              <h1>Account Overview</h1>
              <h3>Profile</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Username</th>
                    <td>{username}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>
                      <a href="mailto:">{email}</a>
                    </td>
                  </tr>
                  <tr>
                    <th>Date of Birth</th>
                    <td>{dob}</td>
                  </tr>
                  <tr>
                    <th>Country</th>
                    <td>{country}</td>
                  </tr>
                  <tr>
                    <th>Occupation</th>
                    <td>{occupation}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        
    </>
  );
};

export default AccountOverview;
