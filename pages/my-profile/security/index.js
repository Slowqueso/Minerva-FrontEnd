import { React, useState, useEffect } from "react";
import FullLayout from "../../../components/Layout/FullLayout";
import styles from "../styles.module.css";
import MyProfileNavbar from "../../../components/my-profile/navbar/MyProfileNavbar";
import TextBox2 from "../../../components/form/textbox2";
import SubmitButton from "../../../components/form/SubmitButton";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import { useNotification } from "web3uikit";

const Security = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const partialEmail =email.replace(
    /(..)(.{1,2})(?=.*@)/g,
    (_, a, b) => a + '*'.repeat(b.length)
);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const dispatch = useNotification();

  function handleCheckboxChange() {
    axios
      .get(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/toggle_email_auth",

        {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        }
      )
      .then((response) => {
        setIsChecked(!isChecked);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleSubmit() {
    
    const token = localStorage.getItem("_USID");
    
    if (token) {
      console.log(token)
      axios
        .post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/update-password-alt",
          {
            password: password,
            rePassword: rePassword,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          dispatch({
            type: "info",
            message: "Password Changed Successfully!",
            title: "Password Alert",
            position: "bottomR",
          });
          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/if_email_auth", {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        })
        .then((response) => {
          setIsChecked(response.data.email_auth);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info/email", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          setEmail(response.data.email);
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
          <MyProfileNavbar />
          <div className={styles.security}>
            <h1>Security</h1>
            <h3>Change Password</h3>
            <form>
              {/* <TextBox label={"Old Password"} /> */}
              <TextBox2
                label={"New Password"}
                inputUpdate={setPassword}
                isPassword={true}
              />
              <TextBox2
                label={"Confirm New Password"}
                inputUpdate={setRePassword}
                isPassword={true}
              />
              <SubmitButton
                label={"Change Password"}
                submitHandler={handleSubmit}
              />
            </form>
            <h3>Two-Factor Authentication</h3>
            <p>
              An Extra Layer of Account Security <br />
              <br />
              Add an extra layer of protection to your account with 2-Step
              Verification at login, account recovery, and high-value
              transactions. You can only enable one of the following options at
              a time.
            </p>
            <div className={styles.tfa}>
              <div className={styles.tfa_option}>
                <h5>Email Authentication</h5>
                <input
                  type="checkbox"
                  id="switch"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="switch"></label>
              </div>
              <hr />
              <p>Receive Unique Authentication codes at {partialEmail}</p>
            </div>
          </div>
        </div>
      </FullLayout>
    </>
  );
};

export default Security;
