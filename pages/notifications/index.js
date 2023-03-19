import FullLayout from "../../components/Layout/FullLayout";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import FormError from "../../components/form/formError";
import { useRouter } from "next/router";
import getOrderedDate from "../../utils/dateParser";
import SubmitButton from "../../components/form/SubmitButton";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../constants";
import { useNotification } from "web3uikit";
import getNumericDate from "../../utils/dateConverter";
import convertUsdToETH from "../../utils/usdConverter";
import { ethers } from "ethers";

const Notifications = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState();
  const [activity, setActivity] = useState();
  const [activityId, setActivityId] = useState();
  const [notificationId, setNotificationId] = useState();
  const [handleSubmited, setHandleSubmited] = useState(false);


  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [ethPrice, setEthPrice] = useState();
  const dispatch = useNotification();
  const getWeiAmount = async (join_price) => {
    const ethValue = await convertUsdToETH(join_price);
    const weiAmount = ethers.utils.parseEther(ethValue.toString());
    return weiAmount;
  };
  useEffect(() => {
    if (activity) {
      getWeiAmount(activity.join_price).then((value) => {
        setEthPrice(value);
      });
    }
  }, [activity]);
  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (activityId) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
          headers: {
            "x-activity-id": activityId,
          },
        })
        .then(async (response) => {
          if (response) {
            setActivity(response.data.activity);
            axios
              .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
                headers: {
                  "x-access-token": token,
                },
              })
              .then((response) => {
                if (response.data.authenticated) {
                  setUser(response.data.user);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activityId]);

  const Notification = (notification) => {
    setActivityId(notification.notification.activityId);
    setNotificationId(notification.notification._id);
    const handleSubmit = async () => {
      setHandleSubmited(true);
      // const response = await joinActivity({
      //   onSuccess: handleSuccess,
      //   onError: (error) => {
      //     handleError(error);
      //   },
      // });
      // console.log(response);
      handleSuccess();
    };
    return (
      <>
        <div className={styles.notification}>
          <div className={styles.notification_content}>
            <div className={styles.notification_header}>
              <h1>{notification.notification.notification_title}</h1>
            </div>
            <div className={styles.notification_body}>
              <p>{notification.notification.notification_description}</p>
              <h3>
                {getOrderedDate(notification.notification.notification_date)}
              </h3>
            </div>
          </div>
          <div className={styles.notification_button}>
            <SubmitButton label={"Accept"} submitHandler={handleSubmit} />
          </div>
        </div>
      </>
    );
  };

  const { runContractFunction: joinActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "joinActivity",
    params:
      activity && user
        ? {
            _activityID: activityId,
            _username: user ? user.username : "",
            _dateOfJoin: getNumericDate(),
            _tenureInMonths: 2,
          }
        : {},
    // msgValue: ethers.utils.parseEther("3"),
    msgValue: ethPrice,
  });

  const handleError = (error) => {
    dispatch({
      type: "error",
      message: "Some Error Occured! Try again later",
      title: "Join Failed!",
      position: "bottomR",
    });
  };
  const handleSuccess = async () => {
    // await tx.wait(1);
    const token = localStorage.getItem("_USID");
    // if(token){
    //   axios.post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/joinrequest", {
    //     activityId: activity.id,
    //    },{
    //     headers: {
    //       "x-access-token": token,
    //     },
    //    }).then((response) => {
    //     console.log(response);
    //   });

    // }

    axios
      .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/join-activity", {
        activityId: activity.id,
        userId: user.id,
        registeredAddress: account,
      })
      .then((response) => {
        axios
          .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
            headers: {
              "x-activity-id": activityId,
            },
          })
          .then((response) => {
            setActivity(response.data.activity);
            axios
              .post(
                ENV.PROTOCOL +
                  ENV.HOST +
                  ENV.PORT +
                  "/user/remove-notification",
                {
                  id: notificationId,
                },
                {
                  headers: {
                    "x-access-token": token,
                  },
                }
              )
              .then((response) => {
                router.push("/notifications");
              })
              .catch((err) => {
                console.log(err);
              });
          });
      })
      .catch((err) => {
        console.log(err);
      });
    // handleNewNotification("Activity Joined Successfully!");
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("_USID");

    if (token) {
      axios
        .post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/get-all-notifications",
          {},
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((response) => {
          if (response && response.data.notifications.length > 0) {
            setActivityId(response.data.notifications[0].activityId);
            setNotificationId(response.data.notifications[0]._id);
            setNotifications(response.data.notifications);
            setLoading(false);
      
          }
          else{
            setLoading(false);
            setError("No Notifications");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setError("Something went wrong");
        });
    }
  }, [handleSubmited]);

  return (
    <FullLayout>
      <div className={styles.notifications_container}>
        <div className={styles.notifications_header}>
          <h2>Notifications</h2>
        </div>
        {loading ? (
          <div className={styles.loading_container}>
            <h3>Loading...</h3>
          </div>
        ) : error ? (
          <div className={styles.error_container}>
            <h3>{error}</h3>
          </div>
        ) : notifications.length > 0 ? (
          <div className={styles.notifications_list}>
            {notifications.map((notification) => {
              return <Notification notification={notification} />;
            })}
          </div>
        ) : (
          <div className={styles.no_notifications}>
            <h3>No notifications</h3>
          </div>
        )}
      </div>
    </FullLayout>
  );
};

export default Notifications;
