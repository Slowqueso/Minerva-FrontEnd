import TextBox from "../../components/form/textBox";
import RadioConfirmation from "../../components/form/radioConfirmation";
import TextWithHyperlink from "../../components/form/TextWithHyperlink";
import SubmitButton from "../../components/form/SubmitButton";
import React, { useState, useEffect } from "react";
import FormError from "../../components/form/formError";
import axios from "axios";
import SideBanner from "../../components/form/sideBanner";
import { useRouter } from "next/router";
import { ConnectButton } from "web3uikit";
import { useMoralis } from "react-moralis";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { useNotification } from "web3uikit";
import { Loading } from "web3uikit";
import { DeleteUser } from "../../utils/api/DeleteUser";
import ENV from "../../static_files/hostURL";

const Register = () => {
  const router = useRouter();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [termsApproval, setTermsApproval] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isWalletRegistered, setIsWalletRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const dispatch = useNotification();

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get("http://localhost:3001/user/authenticate", {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        })
        .then((response) => {
          if (!response.data.authenticated) {
            localStorage.removeItem("_USID");
            router.replace("/login");
          } else {
            router.push("/R/2");
          }
        })
        .catch((err) => {
          localStorage.removeItem("_USID");
          router.replace("/login");
        });
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (termsApproval) {
      if (password === repassword && !isWalletRegistered) {
        axios
          .post(`${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/user/register`, {
            username,
            password,
            email,
            contact,
            fname,
            lname,
          })
          .then(async (response) => {
            handleSuccess(response);
          })
          .catch((err) => {
            console.log(err);
            if (err.response.data) {
              setErrorMessage(err.response.data.msg);
            }
          });
        setIsLoading(false);
      } else {
        setErrorMessage("Error:" + " Passwords don't match!");
        setIsLoading(false);
      }
    } else {
      setErrorMessage(
        "Error: You can't register without agreeing to Terms and Conditions!"
      );
      setIsLoading(false);
    }
  };

  const handleSuccess = async (response) => {
    dispatch({
      type: "success",
      message: "Welcome to Minerva!",
      title: "Tx Notification",
      position: "bottomR",
    });
    localStorage.setItem("_USID", response.data.token);
    router.push("/register/2");
  };
  return (
    <section className="centralise form-only">
      <SideBanner
        title={"Now's the time to join Minerva"}
        fileName={"pattern-dummy.svg"}
      ></SideBanner>
      <div className="divider flex-column">
        <div className="form-container">
          <form className="register-form">
            <div className="space-between">
              <TextBox
                label="First Name"
                name="fname"
                inputUpdate={setFname}
              ></TextBox>
              <TextBox
                label="Last Name"
                name="lname"
                inputUpdate={setLname}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label="Username"
                name="username"
                inputUpdate={setUsername}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label="Email"
                name="email"
                inputUpdate={setEmail}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label="Contact No."
                name="contact"
                inputUpdate={setContact}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label="Password"
                name="password"
                isPassword={true}
                inputUpdate={setPassword}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label="Retype Password"
                name="repassword"
                isPassword={true}
                inputUpdate={setRepassword}
              ></TextBox>
            </div>
            {/* <div
              className="space-between"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <ConnectButton />
            </div> */}
            <div className="space-between">
              <RadioConfirmation
                label="Agree with"
                name="terms"
                href="/terms-conditions"
                hyperlink="Terms and Conditions"
                isChecked={termsApproval}
                changeHandler={setTermsApproval}
              ></RadioConfirmation>
            </div>
            {errorMessage ? (
              <FormError errorMessage={errorMessage}></FormError>
            ) : null}
            {isLoading ? (
              <Loading></Loading>
            ) : (
              <div className="flex-end">
                <SubmitButton
                  label="Register"
                  submitHandler={handleSubmit}
                ></SubmitButton>
              </div>
            )}
          </form>
        </div>
        <div className="space-between">
          <div className="flex-end">
            <TextWithHyperlink
              text="Already have an account? "
              href="/login"
              hyperlink="Login here"
            ></TextWithHyperlink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
