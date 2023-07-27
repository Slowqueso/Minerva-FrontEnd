import React, { useState, useEffect, useContext } from "react";
import styles from "../../../forgot-password/styles.module.css";
import Navbar from "../../../../components/Layout/Navbar/Navbar";
import TextBox from "../../../../components/form/textBox";
import SubmitButton from "../../../../components/form/SubmitButton";
import FormError from "../../../../components/form/formError";
import { isUserLogged } from "../../../../utils/api/validateUser";
import { useRouter } from "next/router";
import TextWithHyperlink from "../../../../components/form/TextWithHyperlink";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { Loading } from "web3uikit";
import { UserContext } from "../../../_app";

const OtpAuth = () => {
  const [otp, setOtp] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUpdateUser } = useContext(UserContext);
  const { userId } = router.query;
  const flag = isUserLogged();
  const resendOtp = () => {};
  const handleSubmit = () => {
    axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/two-factor/check-otp", {
        otp: otp,
        userId: userId,
      })
      .then((res) => {
        if (res.data.authenticated) {
          localStorage.setItem("_USID", res.data.user);
          setUpdateUser(true);
          router.push(`/explore`);
        } else {
          setErrorMessage(res.data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response.data.msg);
      });
  };
  useEffect(() => {
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
    } else {
      router.back();
    }
  }, [userId]);

  return (
    <>
      <Navbar></Navbar>
      {!loading ? (
        <section className={`centralise form-only`} style={{ height: "93vh" }}>
          <div className={styles.form_container} style={{ width: "25%" }}>
            <h3 className={styles.form_header}>Enter OTP</h3>
            <form>
              <div className="space-between">
                <TextBox
                  label="OTP code"
                  name="otp"
                  inputUpdate={setOtp}
                  isPassword={true}
                ></TextBox>
              </div>
              <SubmitButton
                // isTransparent={true}
                label={"Submit"}
                submitHandler={handleSubmit}
              ></SubmitButton>
              {errorMessage ? (
                <FormError errorMessage={errorMessage}></FormError>
              ) : null}
              <div className={styles.space_between}>
                <TextWithHyperlink
                  onClick={resendOtp}
                  hyperlink={"Resend Otp"}
                  text={"Didn't receive OTP yet?"}
                ></TextWithHyperlink>
              </div>
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

export default OtpAuth;
