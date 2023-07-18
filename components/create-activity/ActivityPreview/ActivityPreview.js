import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ENV from "../../../static_files/hostURL";
import styles from "./styles.module.css";
import { Loading } from "web3uikit";
import getOrderedDate from "../../../utils/dateParser";
import SubmitButton from "../../../components/form/SubmitButton";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../constants/index";
import getNumericDate from "../../../utils/dateConverter.js";
import { useNotification } from "web3uikit";
import incrementStatus from "../../../utils/api/incrementActivity";
import FormError from "../../form/formError";
import updateOwnerAddress from "../../../utils/api/updateOwnerAddress";
import { AddPublicId } from "../../../utils/api/AddPublicId";
import Link from "next/link";
import Error from "../Error/Error";

const LabelText = ({ label, text }) => {
  return (
    <div className={styles.labelText_wrapper}>
      <h4 className={styles.title}>{label}</h4>
      <h3 className={styles.content_text}>{text}</h3>
    </div>
  );
};

const CategoryTag = ({ categories, user }) => {
  const array = categories.split(" ");
  return (
    <div className={styles.labelText_wrapper}>
      <h4 className={styles.title}># CATEGORIES</h4>
      {
        <div className="flex">
          {array.map((category, index) => {
            return (
              <div key={index} className={styles.tag_container}>
                <h3 className={styles.content_text}>{category.toString()}</h3>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
};

const ActivityPreview = ({ activity, user, errorType }) => {
  const router = useRouter();
  // const [activity, setActivity] = useState();
  const activityId = router.query.activityId;
  const [errorMessage, setErrorMessage] = useState();
  const [button, setButton] = useState(false);
  const editActivity = () => {
    router.push(`/create-activity/${activityId}/draft`);
  };

  // Deployment of Activity

  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  // const ID = window.location.href.split("/").pop();
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const dispatch = useNotification();
  const { runContractFunction: createActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "createActivity",
    params: activity
      ? {
          _id: activity.public_ID,
          _username: user ? user.username : "",
          _title: activity ? activity.title : null,
          _desc: activity ? activity.description : null,
          _totalTimeInMonths: activity ? activity.durationPeriod : null,
          _price: activity.join_price,
          _level: activity.difficulty_level,
          _maxMembers: activity.member_limit,
          _waitingPeriodInMonths: 1,
        }
      : {},
  });

  const { runContractFunction: getPublicId } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getActivityCount",
  });

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    const response = await getPublicId();
    console.log("Public ID: " + response);
    await AddPublicId(activityId, parseInt(response), setErrorMessage);
    updateOwnerAddress(activityId, account);
    incrementStatus(activityId);
    router.push(`/create-activity/${activityId}/terms-and-conditions`);
    handleNewNotification();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Activity Deployed Successfully!",
      title: "Congratulations!",
      position: "bottomR",
    });
  };
  const handleSubmit = async () => {
    // console.log("first");
    setButton(true);
    const response = await createActivity({
      onSuccess: handleSuccess,
      onError: (error) => {
        setButton(false);
      },
    });
    console.log(response);
  };

  useEffect(() => {
    if (activity) {
      if (activity._status !== 1) {
        router.push(`/create-activity/${activityId}`);
      }
    }
  }, []);
  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingLeft: "2rem",
      }}
    >
      {!errorType ? <div className={styles.glow}></div> : null}
      {!errorType ? (
        <div className={styles.wrapper}>
          <div className={styles.heading_container}>
            <h4>Activity Preview</h4>
          </div>
          {activity ? (
            <div style={{ padding: "2rem" }}>
              <div className={`${styles.flex_wrapper} ${styles.margin_bottom}`}>
                <div className={styles.activity_logo}>
                  <img src={activity.logo} title={`${activity.title}'s logo`} />
                </div>
                <div className={`${styles.inner_wrapper} `}>
                  <div className={styles.flex_wrapper}>
                    <LabelText
                      label={"# TITLE"}
                      text={activity.title}
                    ></LabelText>
                    <LabelText
                      label={"# MEMBER LIMIT"}
                      text={activity.member_limit}
                    ></LabelText>
                    <LabelText
                      label={"# JOINING PRICE"}
                      text={`$${activity.join_price}`}
                    ></LabelText>
                  </div>
                  <div className={styles.flex_wrapper}>
                    <LabelText
                      label={"# DIFFICULTY LEVEL"}
                      text={activity.difficulty_level}
                    ></LabelText>
                    <LabelText
                      label={"# DATE CREATED"}
                      text={getOrderedDate(activity.date_created)}
                    ></LabelText>
                    <LabelText
                      label={"# DURATION PERIOD"}
                      text={activity.durationPeriod + " months"}
                    ></LabelText>
                  </div>
                </div>
              </div>
              <div
                className={`${styles.inner_wrapper} ${styles.margin_bottom}`}
              >
                <LabelText
                  label={"# DESCRIPTION"}
                  text={activity.description}
                ></LabelText>
              </div>
              <div
                className={`${styles.inner_wrapper} ${styles.margin_bottom}`}
              >
                <CategoryTag categories={activity.categories}></CategoryTag>
              </div>
              <div
                className={`${styles.inner_wrapper} ${styles.margin_bottom}`}
              >
                <div className="space-between">
                  <Link href={`/create-activity/${activityId}/draft`}>
                    <SubmitButton
                      label={"Edit Activity"}
                      isTransparent={true}
                      submitHandler={editActivity}
                    ></SubmitButton>
                    {/* <button>Edit</button> */}
                  </Link>
                  <SubmitButton
                    isDisabled={button}
                    label={"Deploy Activity"}
                    submitHandler={handleSubmit}
                  ></SubmitButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="centralised">
              <div className={styles.error_loader}>
                <Loading></Loading>
              </div>
              {errorMessage ? <FormError errorMessage={errorMessage} /> : null}
            </div>
          )}
        </div>
      ) : (
        <Error
          title={errorType.response.data.msg}
          statusCode={errorType.response.status}
        ></Error>
      )}
    </section>
  );
};

export default ActivityPreview;
