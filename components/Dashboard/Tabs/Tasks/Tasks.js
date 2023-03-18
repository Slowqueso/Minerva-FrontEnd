import { React, useState, useEffect } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "../../../form/SubmitButton";
import { Tag } from "web3uikit";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../../constants";
import { ethers } from "ethers";
import DataCard from "../../DataCard/DataCard";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import getOrderedDate from "../../../../utils/dateParser";

const Task = ({
  title,
  profile_pic,
  description,
  credit_reward,
  usd_reward,
  assign_date,
  username,
  due_date,
}) => {
  return (
    <div className={styles.row}>
      <section>
        <FontAwesomeIcon
          icon={faSitemap}
          color={"#939393"}
          className={styles.icon}
        ></FontAwesomeIcon>
        <div className={styles.details}>
          <span className={styles.title}>{title}</span>
          <div className={styles.user_info}>
            <div className={styles.user_img}>
              <Image
                height={50}
                width={50}
                src={profile_pic ? profile_pic : "/assets/default_profile.svg"}
              ></Image>
            </div>
            <div className={styles.user_name}>
              <p>
                {username}
                <br />
                <span>
                  {" "}
                  Assigned on {assign_date} &#9679; Due {due_date} &#9679;
                  Credits: {credit_reward}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.amount}>
          <span>&#x0024;{usd_reward ? usd_reward : 0}</span>
        </div>
        <SubmitButton label={"View"}></SubmitButton>
      </section>
    </div>
  );
};

const Tasks = () => {
  const router = useRouter();
  const { activityId } = router.query;
  const [taskArray, setTaskArray] = useState([]);
  const [isTasksViewed, setIsTasksViewed] = useState(true); // state for form visibility
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const [wallets, setWallets] = useState([]); // state for form visibility
  const [profile_pic, setProfilePic] = useState([]); // state for form visibility
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const { runContractFunction: getActivityTasks } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getActivityTasks",
    params: {
      _activityID: activityId,
    },
  });

  const toggleCurrentTasks = () => {
    setIsTasksViewed(!isTasksViewed);
  };

  //   const [isAllTaskOpen, setAllTaskIsOpen] = useState(false); // state for form visibility
  //   const toggleAllTasks = () => {
  //     setAllTaskIsOpen(!isAllTaskOpen);
  //   };
  useEffect(() => {
    if (activityId) {
      const fetchTasks = async () => {
        const response = await getActivityTasks();
        console.log(response);
        setTaskArray(response);
        console.log(taskArray);
      };
      fetchTasks();
    }
  }, [activityId]);

  useEffect(() => {
    const fetchWallets = async () => {
      var walletAddress = [];
      taskArray.map((task) => {
        walletAddress.push(task.assignee.toString().toLowerCase());
      });
      const response = await axios.post(
        `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/user/get-profile-by-wallet`,
        {
          walletAddress: walletAddress,
        }
      );
      console.log(response.data);
      setWallets(response.data.user);
    };
    fetchWallets();
  }, [taskArray]);

  const fetch =  (task) => {
    var assignedDate = new Date(parseInt(task.assignedDate.toString()) * 1000);
    var dueDate = new Date(parseInt(task.dueDate.toString()) * 1000);
    var walletAddress = task.assignee.toString();
    const username = "";
    const profile_pic = {};
    var wallet =  wallets.findIndex(
      (wallet) =>
        wallet.wallet_ID._address.toLowerCase() === walletAddress.toLowerCase()
    );
    console.log(wallets[wallet]);
    return (
      <Task
        title={task.title}
        username={wallets[wallet]?wallets[wallet].username:""}
        due_date={dueDate.toUTCString()}
        credit_reward={task.creditScoreReward.toString()}
        assign_date={assignedDate.toUTCString()}
        usd_reward={task.rewardInD.toString()}
        profile_pic={wallets[wallet]?wallets[wallet].profile_pic:""}
      ></Task>
    );
  };
  return (
    <>
      <section className={styles.main_container}>
        <section className={styles.taskSection}>
          <button className={styles.dropdownBtn} onClick={toggleCurrentTasks}>
            <h3>All Tasks</h3>
            <span
              className={`${styles.arrow} ${
                isTasksViewed ? styles.active : ""
              }`}
            >
              <h3>&#9662;</h3>
            </span>
          </button>
          <div
            className={`${styles.dropdownContent} ${
              isTasksViewed && styles.show
            }`}
          >
            {taskArray && wallets && taskArray.length > 0 ? (
              <div className={styles.wrapper}>
                {taskArray.map((task) => {
                  var assignedDate = new Date(parseInt(task.assignedDate.toString()) * 1000);
                  var dueDate = new Date(parseInt(task.dueDate.toString()) * 1000);
                  var walletAddress = task.assignee.toString();
                  
                  var wallet =  wallets.findIndex(
                    (wallet) =>
                      wallet.walletAddress === walletAddress.toLowerCase()
                  );
                  console.log(wallets[wallet]);
                  return (
                    <Task
                      title={task.title}
                      username={wallets[wallet]?wallets[wallet].username:""}
                      due_date={getOrderedDate(dueDate)}
                      credit_reward={task.creditScoreReward.toString()}
                      assign_date={getOrderedDate(assignedDate)}
                      usd_reward={task.rewardInD.toString()}
                      profile_pic={wallets[wallet]?wallets[wallet].profile_pic:null}
                    ></Task>
                  );
                })}
              </div>
            ) : (
              <h3 className={styles.no_tasks}>No tasks to display :( </h3>
              
            )}
          </div>

          {/* <button className={styles.dropdownBtn} onClick={toggleAllTasks}>
            <h3>All Tasks</h3>
            <span
              className={`${styles.arrow} ${
                isAllTaskOpen ? styles.active : ""
              }`}
            >
              <h3>&#9662;</h3>
            </span>
          </button>
          <div
            className={`${styles.dropdownContent} ${
              isAllTaskOpen && styles.show
            }`}
          >
            <div className={styles.wrapper}>
              <div className={styles.centerLine}></div>
              <div className={styles.row}>
                <section>
                  <FontAwesomeIcon
                    icon={faSitemap}
                    color={"#939393"}
                    className={styles.icon}
                  ></FontAwesomeIcon>
                  <div className={styles.details}>
                    <span className={styles.title}>Task Title.....</span>
                    <div className={styles.user_info}>
                      <div className={styles.user_img}>
                        <img src="3.jfif" alt="user_img" />
                      </div>
                      <div className={styles.user_name}>
                        <p>
                          John Doe <span> assigned on 12/03/2002</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.due_date}>
                    <p>Due Date: 12/03/2002</p>
                  </div>
                  <div className={styles.reward_amount}>
                    <p>Credits: 1000</p>
                  </div>
                  <div className={styles.amount}>
                    <span>&#x0024;20</span>
                  </div>
                  <div className={styles.view}>
                    <a href="#">View</a>
                  </div>
                </section>
              </div>
            </div>
          </div> */}
        </section>{taskArray ? 
        (<div className={styles.data_cards}>
          <DataCard isSubTextNotVisible={true} label="Task Assigned" 
          data={taskArray.length}
          icon={faSitemap}> </DataCard>
          <DataCard isSubTextNotVisible={true} label="Task Completed"
          data={taskArray.filter(
            (task) => task.completed === true
          ).length}
          icon={faSitemap}> </DataCard>
        </div>):null
}
      </section>
    </>
  );
};

export default Tasks;
