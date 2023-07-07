import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import FullLayout from "../../../components/Layout/FullLayout";
import styles from "./styles.module.css";
import CategoryTag from "../../../components/CategoryTag/CategoryTag";
import SubmitButton from "../../../components/form/SubmitButton";
import ENV from "../../../static_files/hostURL";
import getOrderedDate from "../../../utils/dateParser";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../constants";
import { useNotification } from "web3uikit";
import getNumericDate from "../../../utils/dateConverter";
import { ethers } from "ethers";
import convertUsdToETH from "../../../utils/usdConverter";
import Link from "next/link";
import DonationModal from "../../../components/DonationModal/Modal";
import { UserContext } from "../../../components/Layout/FullLayout";

const ActivityProfile = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const activityId = router.query.activityId;
  const [ethPrice, setEthPrice] = useState();
  const [ethValue, setEthValue] = useState();
  // const [user, setUser] = useState();
  const [activity, setActivity] = useState();
  const [isMember, setIsMember] = useState(false);
  const [DModalActive, setDModalActive] = useState(false);
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [activityStatus, setActivityStatus] = useState();
  const [request_sent, setRequestSent] = useState(false);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const dispatch = useNotification();

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
            _activityID: activityId,
            _username: user ? user.username : "",
            _dateOfJoin: getNumericDate(),
            _tenureInMonths: 2,
          }
        : {},
    msgValue: ethPrice,
  });

  const { runContractFunction: getJoinPrice } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getJoinPrice",
    params: activity
      ? {
          activityID: activityId,
        }
      : null,
  });

  const handleSuccess = async (tx) => {
    // await tx.wait(1);
    const token = localStorage.getItem("_USID");
    if(token){
      axios.post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/joinrequest", {
        activityId: activity.id,
       },{
        headers: {
          "x-access-token": token,
        },
       }).then((response) => {
        console.log(response.data.msg);
        handleNewNotification(response.data.msg);
        setRequestSent(true);
      });

    }
    

    // axios
    //   .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/join-activity", {
    //     activityId: activity.id,
    //     userId: user.id,
    //     registeredAddress: account,
    //   })
    //   .then((response) => {
    //     axios
    //       .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
    //         headers: {
    //           "x-activity-id": activityId,
    //         },
    //       })
    //       .then((response) => {
    //         setActivity(response.data.activity);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    
  };

  const toggleDModal = () => {
    setDModalActive(!DModalActive);
  };

  const handleNewNotification = (message) => {
    dispatch({
      type: "info",
      message: message,
      title: "Tx Notification",
      position: "bottomR",
    });
  };
  const handleSubmit = async () => {
    const response = await joinActivity({
      onSuccess: handleSuccess,
      onError: (error) => {
        handleError(error);
      },
    });
  };

  const handleError = (error) => {
    dispatch({
      type: "error",
      message: "Some Error Occured! Try again later",
      title: "Join Failed!",
      position: "bottomR",
    });
  };
  useEffect(() => {
    if (activity && user) {
      
      setIsMember(activity.members.some((member) => member.id === user.id));
      setRequestSent(activity.join_requests.some((request) => request.user_id === user.id));
      
    }
  }, [activity, user]);

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
            // axios
            //   .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
            //     headers: {
            //       "x-access-token": token,
            //     },
            //   })
            //   .then((response) => {
            //     if (response.data.authenticated) {
                  
            //       setUser(response.data.user);
            //     }
            //   })
            //   .catch((err) => {
            //     console.log(err);
            //   });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      
    }
  }, [activityId]);

  useEffect(() => {
    if (activity) {
      const token = localStorage.getItem("_USID");
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/info/isOpen", {
          headers: {
            "x-activity-id": activity.id,
          },
        })
        .then((response) => {
          setActivityStatus(response.data.isOpen);
        });
        if(token){
        axios
        .post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/viewed",
          {
            activityId: activity.id,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
      }
    }
  }, [activity]);

  return (
    <div>
      {activity ? (
        <section className={styles.activity_profile}>
          {DModalActive ? (
            <DonationModal
              setDModalActive={setDModalActive}
              user={user}
              activityId={activityId}
            ></DonationModal>
          ) : null}
          <img src={activity.logo} alt="" className={styles.activity_logo} />
          <div className={styles.inner_container}>
            <h3 className={styles.activity_title}>{activity.title}</h3>
            <div className={styles.activity_owner}>
              <img
                src={
                  activity.owner.profile_pic
                    ? activity.owner.profile_pic
                    : "/assets/default_profile.svg"
                }
                height={"30px"}
                width={"30px"}
              ></img>
              <Link href={`/user-profile/${activity.owner.id}`}>
                <h3>{activity.owner.username}</h3>
              </Link>
            </div>
            <div className={styles.flex_align}>
              <div className={`${styles.label_text} flex`}>
                <h3>{activity.upVotes.length}</h3>
                <h4>Upvotes</h4>
              </div>
              <div className={`${styles.label_text} flex`}>
                <h3>
                  {activity.members.length}/{activity.member_limit}
                </h3>
                <h4>Members</h4>
              </div>
              <div className={`${styles.label_text} flex`}>
                <h3>${activity.join_price}</h3>
                <h4>Joining Price</h4>
              </div>
              <div className={`${styles.label_text} flex`}>
                <h3>{activity.difficulty_level}</h3>
                <h4>Level</h4>
              </div>
              <div className={`${styles.label_text} flex`}>
                <h3>{getOrderedDate(activity.date_created)}</h3>
                <h4>Date Created</h4>
              </div>
            </div>
            <div className={styles.flex_align}>
              {activity.tags.split(" ").map((tag, index) => {
                return (
                  <div key={index}>
                    <CategoryTag tagText={tag} key_index={index}></CategoryTag>
                  </div>
                );
              })}
            </div>
            {user ? (
              <div className={styles.flex_end}>
                {activity.owner.id === user.id ? null : (
                  <SubmitButton
                    label={"Support"}
                    isTransparent={true}
                    submitHandler={toggleDModal}
                  ></SubmitButton>
                )}
                {isMember || !activityStatus ? null : request_sent ? (
                <>
                <SubmitButton
                  label={"Request Sent"}
                  isTransparent={true}
                  isDisabled={true}
                ></SubmitButton>
                </>):(
                  <>
                    <SubmitButton
                      label={"Join"}
                      // submitHandler={handleSubmit}
                      submitHandler={handleSuccess}
                    ></SubmitButton>
                  </>
                )}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
};

const ActivityProfilePage = ({ children }) => {
  return (
    <FullLayout>
      <ActivityProfile />
      {children}
    </FullLayout>
  );
};

export default ActivityProfilePage;
