import styles from "./login.module.css";
import TextBox from "../../components/form/textBox";
import SubmitButton from "../../components/form/SubmitButton";
import React, { useState, useEffect } from "react";
import FormError from "../../components/form/formError";
import { useRouter } from "next/router";
import axios from "axios";
import ENV from "../../static_files/hostURL";

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
        if (response.data.status === "ok") {
          localStorage.setItem("_USID", response.data.user);
          router.push("/explore");
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.msg);
      });
  };
  return (
    <section className={`centralise form-only`}>
      <div className="form-container" style={{ width: "20%" }}>
        <form className="register-form">
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
          <SubmitButton
            label={"Login"}
            submitHandler={handleSubmit}
          ></SubmitButton>
        </form>
      </div>
    </section>
  );
};

export default Login;
