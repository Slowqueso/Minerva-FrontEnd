import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TextBox from "../form/textBox";
import SelectMenu from "../form/SelectMenu";
import SubmitButton from "../form/SubmitButton";
import { donationValues } from "../../static_files/donationValue";
import FormError from "../form/formError";
import RadioConfirmation from "../form/radioConfirmation";
import getOrderedDate from "../../utils/dateParser";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../constants/index";
import { useNotification } from "web3uikit";
import { ethers } from "ethers";
import convertUsdToETH from "../../utils/usdConverter";
import ENV from "../../static_files/hostURL";
import axios from "axios";

const DollarCards = ({ selected, setSelected, setAmount }) => {
  const select = (e) => {
    setSelected(e.target.getAttribute("id"));
    document.querySelectorAll(`.${styles.dollar_card}`).forEach((card) => {
      card.classList.remove(`${styles.selected}`);
    });
    e.target.classList.add(`${styles.selected}`);
  };

  useEffect(() => {
    if (selected) {
      document
        .querySelectorAll(`.${styles.dollar_card}`)
        [parseInt(selected)].classList.add(`${styles.selected}`);
      setAmount(donationValues[parseInt(selected)].value);
    }
  }, [selected]);

  return (
    <div className={styles.dollar_cards}>
      {donationValues.map((value, index) => {
        return (
          <div
            className={`${styles.dollar_card}`}
            key={value.value}
            id={index}
            onClick={(e) => {
              select(e);
            }}
          >
            {value.label}
          </div>
        );
      })}
      <button
        type="reset"
        className={`${styles.dollar_card}`}
        onClick={(e) => {
          document
            .querySelectorAll(`.${styles.dollar_card}`)
            .forEach((card) => {
              card.classList.remove(`${styles.selected}`);
            });
          setAmount("0");
        }}
      >
        <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
      </button>
    </div>
  );
};

const Modal = ({ setDModalActive, activityId, user }) => {
  const dispatch = useNotification();
  const amountText = useRef();
  const [amount, setAmount] = useState();
  const [selected, setSelected] = useState();
  const [comment, setComment] = useState("");
  const [selectedCause, setSelectedCause] = useState();
  const [currentTab, setCurrentTab] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [causes, setCauses] = useState([
    {
      label: "Choose Your Cause",
      value: 0,
    },
    {
      label: "Cause 1",
      value: 1,
    },
  ]);

  const handleNext = () => {
    setErrorMessage("");
    if (
      amount === "" ||
      amount === "0" ||
      selectedCause === 0 ||
      selectedCause === undefined
    ) {
      setErrorMessage("Please fill out all fields");
    } else {
      setCurrentTab(1);
    }
  };
  const [weiAmount, setWeiAmount] = useState();
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const getWeiAmount = async (amount) => {
    const ethValue = await convertUsdToETH(amount);
    const weiAmount = ethers.utils.parseEther(ethValue.toString());
    setWeiAmount(weiAmount);
  };

  const { runContractFunction: donateToActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "donateToActivity",
    params: {
      _activityID: activityId,
      _userPublicID: user.public_ID,
    },
    msgValue: weiAmount,
  });

  const { runContractFunction: getConversionRate } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getConversionRate",
    params: {
      ethAmount: 35155000000000000n,
    },
  });

  const handleBack = () => {
    setErrorMessage("");
    setCurrentTab(0);
  };

  const handleSuccess = async () => {
    axios
      .put(
        `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/donate/${activityId}`,
        {
          amountInUSD: parseInt(amount),
          userToken: localStorage.getItem("_USID"),
        }
      )
      .then((res) => {
        dispatch({
          title: "Donation Successful",
          message: "Thank you for your donation",
          type: "success",
          position: "bottomR",
        });
        setDModalActive(false);
      })
      .catch((err) => {
        console.log(err);
        handleError();
      });
  };

  const handleError = () => {
    dispatch({
      title: "Donation Failed",
      message: "Please try again later",
      type: "error",
      position: "bottomR",
    });
  };

  const handleSubmit = async () => {
    if (isTermsChecked) {
      setErrorMessage("");
      const response = await donateToActivity({
        onSuccess: handleSuccess,
        onError: (err) => {
          console.log(err);
          handleError();
          // setErrorMessage(err.message);
        },
      });
    } else {
      setErrorMessage("Please accept the terms and conditions");
    }
  };

  useEffect(() => {
    if (amount > 0 && amount) {
      getWeiAmount(parseInt(amount));
    }
  }, [amount]);

  return (
    <section className={styles.modal_container}>
      <div className={styles.modal}>
        <span
          className={styles.close_button}
          onClick={() => {
            setDModalActive(false);
          }}
        >
          <FontAwesomeIcon
            icon={faXmark}
            size={"lg"}
            color="lightgrey"
          ></FontAwesomeIcon>
        </span>
        <h1 className={styles.modal_header}>Activity Donation</h1>
        <div className={styles.modal_body}>
          <section className={styles.modal_tabs}>
            <div className={styles.tab_header}>
              {currentTab === 0 ? (
                <h3>Donation Details</h3>
              ) : (
                <h3>Payment Details</h3>
              )}
              <div className={styles.tab_timeline}>
                {currentTab === 0 ? (
                  <>
                    <span className={`timeline ${styles.selected}`}></span>
                    <span className="timeline"></span>
                  </>
                ) : (
                  <>
                    <span className="timeline"></span>
                    <span className={`timeline ${styles.selected}`}></span>
                  </>
                )}
              </div>
              {currentTab === 0 ? (
                <span
                  className={styles.next_arrow}
                  onClick={() => {
                    handleNext();
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    color={"#B6B6B6"}
                  ></FontAwesomeIcon>
                </span>
              ) : (
                <span
                  className={styles.back_arrow}
                  onClick={() => handleBack()}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    color={"#B6B6B6"}
                  ></FontAwesomeIcon>
                </span>
              )}
            </div>
            <div className={styles.tab_body}>
              {currentTab === 0 ? (
                <form className={styles.tab_form}>
                  <DollarCards
                    selected={selected}
                    setSelected={setSelected}
                    setAmount={setAmount}
                    amountText={amountText}
                  ></DollarCards>
                  <div className="flex">
                    <TextBox
                      inputUpdate={setAmount}
                      value={amount}
                      label={"Custom Amount ($)"}
                      name={"custom_amount"}
                    ></TextBox>
                  </div>
                  <div className="flex">
                    <SelectMenu
                      changeHandler={setSelectedCause}
                      value={selectedCause}
                      // label={"Donation Cause"}
                      objectArray={causes}
                    ></SelectMenu>
                  </div>
                  <div className="flex">
                    <TextBox
                      label={"Comment"}
                      name={"comment"}
                      inputUpdate={setComment}
                      value={comment}
                    ></TextBox>
                  </div>
                  {errorMessage ? (
                    <div className="flex">
                      <FormError errorMessage={errorMessage}></FormError>
                    </div>
                  ) : null}
                  <div className="flex-end">
                    <SubmitButton
                      label={"Next"}
                      iconSrc={faArrowRight}
                      submitHandler={handleNext}
                    ></SubmitButton>
                  </div>
                </form>
              ) : (
                <div className={styles.tab_bill}>
                  <div
                    className="space-between"
                    style={{
                      marginBottom: "2rem",
                      height: "4rem",
                    }}
                  >
                    <div className={styles.field_header}>
                      <h3>Donation Amount</h3>
                      <p>$ {amount}</p>
                    </div>
                    <div className={styles.field_header}>
                      <h3>date</h3>
                      <p>{getOrderedDate()}</p>
                    </div>
                  </div>
                  <div className={styles.field_header}>
                    <h3>Donation Cause</h3>
                    <p>{causes[selectedCause].label}</p>
                  </div>
                  {comment ? (
                    <div className={styles.field_header}>
                      <h3>Comment</h3>
                      <p>{comment}</p>
                    </div>
                  ) : null}
                  <div className={styles.GUIS}>
                    {errorMessage ? (
                      <FormError errorMessage={errorMessage}></FormError>
                    ) : null}
                    <RadioConfirmation
                      label={"I accept the Donation "}
                      href={"#"}
                      hyperlink={"Terms and Conditions"}
                      changeHandler={setIsTermsChecked}
                      isChecked={isTermsChecked}
                      name={"donation_terms"}
                    ></RadioConfirmation>
                    <div className="flex-end">
                      <SubmitButton
                        label={"Back"}
                        isTransparent={true}
                        submitHandler={() => {
                          handleBack();
                        }}
                      ></SubmitButton>
                      <SubmitButton
                        label={"Donate"}
                        submitHandler={handleSubmit}
                      ></SubmitButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className={styles.modal_content}>
            <h1>Terms and Conditions</h1>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est
              alias dicta, quo totam ullam pariatur adipisci facere repellendus
              quibusdam veritatis voluptatibus, reiciendis temporibus dolor, ab
              inventore! Delectus totam autem ea sequi corporis asperiores
              doloribus cupiditate rerum reprehenderit accusantium molestias,
              provident molestiae beatae consequuntur natus soluta impedit
              maxime expedita? Nam, quas eaque. Sit quasi iusto quos quis qui
              ipsa aperiam eaque vel, voluptatem culpa quia illum non dolorem
              maxime. Vero fuga aspernatur laboriosam ipsam in libero, at culpa
              consequuntur dicta, excepturi natus non dolorum esse eum corporis
              alias magni?
              <br />
              <br />
              Porro non ea tenetur odio possimus! Aut, ducimus nesciunt
              perspiciatis quod molestias eius necessitatibus cupiditate saepe
              facere esse atque maiores nisi! Voluptatibus optio quos dolores
              eligendi voluptates soluta amet molestiae aliquid aliquam,
              repudiandae cum laboriosam error sint praesentium maxime ipsa
              nisi. Minus corrupti dolore et facere atque alias, dolor quasi
              impedit aperiam iure enim, magni sunt quibusdam consectetur.
              <br />
              <br />
              Facilis possimus harum molestiae dicta cum. Ipsa, odit eaque rem
              nobis consectetur expedita asperiores commodi illum accusantium
              nesciunt, assumenda totam adipisci voluptatum deserunt vitae
              dolore libero? Velit id et assumenda amet alias odit quos suscipit
              soluta voluptatum cum repudiandae quis fugiat quia veritatis,
              mollitia, laborum, nisi est doloribus beatae hic fuga possimus sit
              accusantium inventore! Porro, vero sed eligendi quae distinctio
              in, sint alias voluptas, corrupti earum culpa recusandae
              reprehenderit. Sint dignissimos vel libero, obcaecati perspiciatis
              dolorem, facere dolorum, necessitatibus ab consequatur architecto
              consequuntur? Fuga perspiciatis est placeat, rerum neque,
              quibusdam esse amet eius rem distinctio maiores, veritatis
              delectus reprehenderit tempora sed architecto? Accusantium.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Modal;
