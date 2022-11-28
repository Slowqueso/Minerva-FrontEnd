import React, { useState, useEffect } from "react";
import Navbar from "../../../../components/Layout/Navbar/Navbar";
import styles from "../../styles.module.css";
import TextBox from "../../../../components/form/textBox";
import SubmitButton from "../../../../components/form/SubmitButton";
import TextWithHyperlink from "../../../../components/form/TextWithHyperlink";
import { isUserLogged } from "../../../../utils/api/validateUser";
import { useRouter } from "next/router";
import { Loading } from "web3uikit";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { useNotification } from "web3uikit";

const PasswordReset = () => {
  const flag = isUserLogged();
  const router = useRouter();
  const { userId } = router.query;
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useNotification();

  const handleSubmit = () => {
    console.log("yes");
    axios
      .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/update-password", {
        userId: userId,
        password: password,
        rePassword: rePassword,
      })
      .then((res) => {
        console.log("updated");
        dispatch({
          type: "info",
          message: "Password Changed Successfully!",
          title: "Password Alert",
          position: "bottomR",
        });
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    flag.then((res) => {
      // setLoading(true);
      console.log(userId);
      if (!res) {
        if (userId) {
          axios
            .get(
              ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/two-factor/validate-token",
              {
                headers: {
                  "x-otp-token": userId,
                },
              }
            )
            .then((res) => {
              setLoading(false);
              console.log(res.data.msg);
            })
            .catch((err) => {
              console.log(err);
              router.push("/login");
            });
        }
      } else {
        console.log("no");
        router.back();
      }
    });
  }, [userId]);
  return (
    <>
      <Navbar></Navbar>
      {!loading ? (
        <section className={`centralise form-only`} style={{ height: "93vh" }}>
          <div className={styles.form_container} style={{ width: "25%" }}>
            <h3 className={styles.form_header}>Password Reset</h3>
            <form>
              <div className="space-between">
                <TextBox
                  isPassword={true}
                  label="New Password"
                  name="password"
                  inputUpdate={setPassword}
                ></TextBox>
              </div>
              <div className="space-between">
                <TextBox
                  isPassword={true}
                  label="Confirm New Password"
                  name="repassword"
                  inputUpdate={setRePassword}
                ></TextBox>
              </div>
              <SubmitButton
                label={"Submit"}
                submitHandler={handleSubmit}
              ></SubmitButton>
            </form>
          </div>
        </section>
      ) : (
        <section className="centralise form-only" style={{ height: "93vh" }}>
          <Loading></Loading>
        </section>
      )}
    </>
  );
};

export default PasswordReset;
