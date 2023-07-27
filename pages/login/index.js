import styles from "./login.module.css";
import TextBoxProfile from "../../components/form/TextBoxProfile";
import SubmitButton from "../../components/form/SubmitButton";
import React, { useState, useEffect } from "react";
import FormError from "../../components/form/formError";
import { useRouter } from "next/router";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import Navbar from "../../components/Layout/Navbar/Navbar";
import TextWithHyperlink from "../../components/form/TextWithHyperlink";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { account, chainId: chainIdHex, l } = useMoralis()

  useEffect(() => {
    if (account) {
      console.log(account);
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/walletLogin", {
          headers: {
            "x-wallet-address": account,
          },
        })
        .then((res) => {
          if (res.data.status === "ok") {
            localStorage.setItem("_USID", res.data.user);
            router.push("/explore");
          } else {
            console.log(res.data);
          }
        });
    }
  }, [account]);

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
        } else if (
          response.data.status === "ok" &&
          response.data.email_auth === true
        ) {
          axios
            .post(
              ENV.PROTOCOL +
              ENV.HOST +
              ENV.PORT +
              "/two-factor/generate-otp-login",
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
      <section className={styles.login_section} style={{ height: "93vh" }}>
        <div className={styles.background}>
          <img src={"/assets/planetrm.png"} />
        </div>
        <div className={styles.form_container} style={{ width: "25%" }}>
          <h3 className={styles.form_header}>Login</h3>
          <div className={styles.signup_container}>
            <TextWithHyperlink
              text={"Don’t have an account yet?"}
              href={"/register"}
              hyperlink={"Signup"}
            ></TextWithHyperlink>
          </div>
          <form className={styles.login_form}>
            <div className="space-between">
              <TextBoxProfile
                label="Email"
                name="email"
                inputUpdate={setEmail}
              ></TextBoxProfile>
            </div>
            <div className="space-between">
              <TextBoxProfile
                isPassword={true}
                label="Password"
                name="Password"
                inputUpdate={setPassword}
              ></TextBoxProfile>
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
          <ConnectButton/>

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

// const EnableWeb3 = () => {
//   const { web3, enableWeb3, isWeb3Enabled, isWeb3EnableLoading, web3EnableError } = useMoralis()

//   if(isWeb3Enabled){
//     return null
//   }

//   return <div>
//     {web3EnableError && <FormError errorMessage={web3EnableError} />}
//     <button onClick={() => enableWeb3()} disabled={isWeb3EnableLoading}>Enable web3</button>
//   </div>
// }
export default Login;
