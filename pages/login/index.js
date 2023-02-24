import styles from "./login.module.css";
import TextBox from "../../components/form/textBox";
import SubmitButton from "../../components/form/SubmitButton";
import React, { useState, useEffect } from "react";
import FormError from "../../components/form/formError";
import { useRouter } from "next/router";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import Navbar from "../../components/Layout/Navbar/Navbar";
import TextWithHyperlink from "../../components/form/TextWithHyperlink";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/token", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if (!response.data.authenticated) {
            localStorage.removeItem("_USID");
          } else {
            router.push("/explore");
          }
        })
        .catch((err) => {
          localStorage.removeItem("_USID");
        });
    }
  });
  const handleSubmit = () => {
    axios
      .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/login", {
        email,
        password,
      })
      .then((response) => {
        if (
          response.data.status === "ok" &&
          response.data.email_auth === false
        ) {
          localStorage.setItem("_USID", response.data.user);
          router.push("/explore");
        } else if (response.data.status === "ok" && response.data.email_auth === true) {
          
          axios
            .post(
              ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/two-factor/generate-otp-login",
              {
                email: email,
              }
            )
            .then((res) => {
              router.push(`/login/email-auth/${res.data.otpToken}`);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.msg);
      });
  };
  return (
    <>
      <Navbar></Navbar>
      <section className={`centralise form-only`} style={{ height: "93vh" }}>
        <div className={styles.form_container} style={{ width: "25%" }}>
          <h3 className={styles.form_header}>Login to Minerva</h3>
          <form className={styles.login_form}>
            <div className="space-between">
              <TextBox
                label="Email"
                name="email"
                inputUpdate={setEmail}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                isPassword={true}
                label="Password"
                name="Password"
                inputUpdate={setPassword}
              ></TextBox>
            </div>
            <div className="space-between">
              {errorMessage ? (
                <FormError errorMessage={errorMessage}></FormError>
              ) : null}
            </div>
            <div className={styles.space_between}>
              <TextWithHyperlink
                text={"Forgot your Password?"}
                href={"/forgot-password"}
                hyperlink={"Reset Password"}
              ></TextWithHyperlink>
            </div>
            <SubmitButton
              label={"Login"}
              submitHandler={handleSubmit}
            ></SubmitButton>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
