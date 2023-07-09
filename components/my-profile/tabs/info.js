import { React, useState, useEffect , useContext} from "react";
import styles from "./styles.module.css";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import occupations from "../../../static_files/occupations";
import { Loading } from "web3uikit";
import { Router, useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../../constants";
import { useNotification } from "web3uikit";
import { faCheckCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextBoxProfile from "../../../components/form/TextBoxProfile";
import TextArea3 from "../../../components/form/TextArea3";
import SubmitButton from "../../../components/form/SubmitButton";
import SelectMenu from "../../../components/form/SelectMenu";
import { UserContext } from "../../../components/Layout/FullLayout";

const AccountOverview = () => {
  const dispatch = useNotification();
  const { account, chainId: chainIdHex } = useMoralis();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [dob, setDob] = useState();
  const [country, setCountry] = useState();
  const [title, setTitle] = useState();
  const [selectedOccupation, setSelectedOccupation] = useState(1);
  const [description, setDescription] = useState();
  const [profilePic, setProfilePic] = useState();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buttondisabled, setButtondisabled] = useState(false);
  const router = useRouter();
  const chainId = parseInt(chainIdHex);
  const ContractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const { tab } = router.query;
  const { user } = useContext(UserContext);

  const { runContractFunction: registerUser } = useWeb3Contract({
    abi,
    contractAddress: ContractAddress,
    functionName: "registerUser",
  });

  const handleConnectWallet = async () => {
    try {
      const response = await registerUser({
        onSuccess: async (res) => {
          const response = await axios.put(
            `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/user/registerWallet`,
            {
              token: localStorage.getItem("_USID"),
              walletAddress: account,
            }
          );
          console.log(response);
          dispatch({
            type: "success",
            message: "Your Wallet has been registered!",
            position: "bottomR",
          });
          setIsRegistered(true);
        },
        onError: (err) => {
          if (err.message.includes("User already registered")) {
            dispatch({
              type: "error",
              title: "User already registered!",
              message: "Please try again with a different wallet!",
              position: "bottomR",
            });
          } else {
            dispatch({
              type: "error",
              title: "Server Error",
              message:
                "Error registering your wallet! Please try again later. Report issue if problem persists",
              position: "bottomR",
            });
          }
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    setButtondisabled(true);
  };
  useEffect(() => {
    console.log(account);
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
          headers: {
            "wallet-address": account,
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
            setIsRegistered(response.data.user.isUserRegistered);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Router.push("/login");
    }
  }, [account]);

  return (
    <>
      {isLoading ? (
        <div className="centralise" style={{ height: "40vh" }}>
          <Loading></Loading>
        </div>
      ) : (
        <div className={styles.account_overview}>
          <div className={styles.details_container}>
            <div className={styles.inner_div}>
              <div className={styles.profile_pic_container}>
                <img src={profilePic} alt="profile" />
              </div>
              <div className={styles.details}>
                <h4>{user.username}</h4>
                <p>loremipusm Lorem ipsum</p>
                <p>{user.email}</p>
              </div>
            </div>
            <div className={styles.edit_profile}>
              Edit
              <Link href="/account/edit">
                <a>
                  <FontAwesomeIcon
                    color="#BFBFBF"
                    size="lg"
                    icon={faEdit}
                  ></FontAwesomeIcon>
                </a>
              </Link>
            </div>
          </div>

          <div className={styles.wrapper}>
            <div className={styles.personal_info}>
              <div className={styles.heading_container}>
                <h4>Personal Information</h4>
              </div>
              <form>
                <div className={styles.twobytwo}>
                  <TextBoxProfile
                    label={"Username"}
                    placeholder={"username"}
                    inputUpdate={setUsername}
                    value={username}
                  />
                  <TextBoxProfile
                    label={"Email"}
                    placeholder={"Email"}
                    inputUpdate={setEmail}
                    value={email}
                  />
                </div>

                <div className={styles.twobytwo}>
                  <TextBoxProfile
                    label={"Date of Birth"}
                    placeholder={"Date of Birth"}
                    inputUpdate={setDob}
                    value={dob}
                  />
                  <TextBoxProfile
                    label={"Country"}
                    placeholder={"Country"}
                    inputUpdate={setCountry}
                    value={country}
                  />
                </div>

                <div className={styles.twobytwo}>
                  <TextBoxProfile
                    label={"Title"}
                    placeholder={"Title"}
                    inputUpdate={setTitle}
                    value={title}
                  />
                  <SelectMenu
                    label={"Occupation"}
                    objectArray={occupations}
                    name={"occupation"}
                    changeHandler={setSelectedOccupation}
                  ></SelectMenu>
                </div>

                <TextArea3
                  label={"Description"}
                  inputUpdate={setDescription}
                  name={"desc"}
                  value={description}
                ></TextArea3>
                <SubmitButton
                  isDisabled={buttondisabled}
                  submitHandler={handleSubmit}
                  label={"Save Changes"}
                ></SubmitButton>
              </form>
            </div>
            <div className={styles.glow}></div>
          </div>
        </div>
      )}
      <section className={styles.account_overview}>
        <h3>Connect Profile</h3>
        <div className={styles.profile_connection_wrapper}>
          <div className={styles.profile_connection_container}>
            <Image
              src={"/assets/ethereum-eth-logo.png"}
              width={120}
              height={120}
            ></Image>
            <h3>
              {isRegistered
                ? "Already connected to Ethereum"
                : "This will register your wallet to Minerva and earn you starter 100 credits"}
            </h3>
            {isRegistered ? (
              <FontAwesomeIcon
                color="limegreen"
                size="lg"
                icon={faCheckCircle}
              />
            ) : (
              <button
                onClick={() => {
                  handleConnectWallet();
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AccountOverview;
