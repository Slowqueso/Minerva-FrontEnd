import React, { useState, useEffect } from "react";
import Navbar from "../../components/Layout/Navbar/Navbar";
import styles from "./styles.module.css";
import TextBox from "../../components/form/textBox";
import SubmitButton from "../../components/form/SubmitButton";
import { useRouter } from "next/router";
import { isUserLogged } from "../../utils/api/validateUser";
import axios from "axios";
import ENV from "../../static_files/hostURL";

const ForgotPassword = () => {
  const flag = isUserLogged();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const handleSubmit = () => {
    axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/two-factor/generate-otp", {
        email: email,
      })
      .then((res) => {
        router.push(`/forgot-password/otp-auth/${res.data.otpToken}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    flag.then((res) => {
      if (res) {
        router.back();
      }
    });
  });
  return (
    <>
      <Navbar></Navbar>
      <section className={`centralise form-only`} style={{ height: "93vh" }}>
        <div className={styles.form_container} style={{ width: "25%" }}>
          <h3 className={styles.form_header}>Enter your Email</h3>
          <form>
            <div className="space-between">
              <TextBox
                label="Email"
                name="email"
                inputUpdate={setEmail}
              ></TextBox>
            </div>
            <SubmitButton
              label={"Change Password"}
              submitHandler={handleSubmit}
            ></SubmitButton>
          </form>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
