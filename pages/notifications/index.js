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



const Notification = (props) => {
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
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
    axios
      .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
        headers: {
          "x-activity-id": props.notification.activityId,
        },
      })
      .then(async (response) => {
        if (response) {
          setActivity(response.data.activity);
          getWeiAmount(response.data.activity.join_price).then((value) => {
            setEthPrice(value);
            
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [activity, setActivity] = useState({});
  const [ethPrice, setEthPrice] = useState();
  const dispatch = useNotification();
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const getWeiAmount = async (join_price) => {
    const ethValue = await convertUsdToETH(join_price);
    const weiAmount = ethers.utils.parseEther(ethValue.toString());
    return weiAmount;
  };
  const { runContractFunction: joinActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "joinActivity",
    params:
      activity && user
        ? {
            _activityID: activity.public_ID,
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
  const handleSuccess = async (activity_ID,notification_ID) => {
    // await tx.wait(1);
    
    const token = localStorage.getItem("_USID");
   

    axios
      .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/join-activity", {
        activityId: activity_ID,
        userId: user.id,
        registeredAddress: account,
      })
      .then((response) => {
        axios
          .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
            headers: {
              "x-activity-id": activity_ID,
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
                  id: notification_ID,
                },
                {
                  headers: {
                    "x-access-token": token,
                  },
                }
              )
              .then((response) => {
                props.fetchNotifications();
              })
              .catch((err) => {
                console.log(err);
              });
          });
      })
      .catch((err) => {
        console.log(err);
      });
      dispatch({
        type: "info",
        message: "Activity Joined Successfully!",
        title: "Join Successfully!",
        position: "bottomR",
      });
  };
  const handleSubmit = async () => {
    console.log(ethPrice)
    if(props.notification.activityId){
      
      
    
    console.log(activity,user)
    const response = await joinActivity({
      onSuccess:()=>{handleSuccess(props.notification.activityId,props.notification._id)
        },
      onError: (error) => {
        handleError(error);
        console.log(error)
      },
      
    });
    
    console.log(response);}
    
    
  };
  return (
    <>
      <div className={styles.notification}>
        <div className={styles.notification_content}>
          <div className={styles.notification_header}>
            <h1>{props.notification.notification_title}</h1>
          </div>
          <div className={styles.notification_body}>
            <p>{props.notification.notification_description}</p>
            <h3>
              {getOrderedDate(props.notification.notification_date)}
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




const Notifications = () => {
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const fetchNotifications = async () => {
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
            
            setNotifications(response.data.notifications);
            setLoading(false);
          } else {
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
  }

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  },[]);

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
            {notifications.map((notification, index) => {
              return (
                <span key={index}>
                  <Notification fetchNotifications={fetchNotifications} notification={notification} />
                </span>
              );
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
