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
import { useNotification } from "web3uikit";

const Task = ({
  title,
  profile_pic,
  description,
  credit_reward,
  usd_reward,
  assign_date,
  username,
  due_date,
  taskId,
  setModalView,
  modalView,
  completed,
}) => {
  const router = useRouter();
  const { activityId } = router.query;
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
        {!completed ? (
          <SubmitButton
            label={"View"}
            submitHandler={() => {
              setModalView({
                bool: !modalView.bool,
                task: taskId,
              });
            }}
          ></SubmitButton>
        ) : (
          <h3 className={styles.task_completed}>Task completed</h3>
        )}
      </section>
    </div>
  );
};

const TaskModal = ({
  task,
  setModalView,
  taskArray,
  ActivityAddress,
  abi,
  activityId,
}) => {
  const { account } = useMoralis();
  const TaskToView = taskArray[task];
  const dispatch = useNotification();
  const { runContractFunction: completeTask } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "completeTask",
    params: {
      _activityID: activityId,
      _taskID: task + 1,
    },
  });

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "The Assignee will be rewarded shortly!",
      title: "Task Completed!",
      position: "bottomR",
    });
    setModalView({ bool: false, task: null });
  };

  const handleError = (error) => {
    console.log(error);
    dispatch({
      type: "error",
      message: "We're sorry for the inconvenience. Please try again later.",
      title: "Some Error Occured!",
      position: "bottomR",
    });
  };

  const handleSubmit = async () => {
    const response = await completeTask({
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };
  return (
    <>
      <section className={styles.modal_container}>
        <div className={styles.modal}>
          <span
            className={`${styles.close_button} unselectable`}
            onClick={() => {
              setModalView({ bool: false, task: null });
            }}
          >
            &#10006;
          </span>
          <div className={styles.modal_body}>
            <div className={`flex ${styles.info_wrapper}`}>
              <div className={styles.task_info}>
                <h4>#task title</h4>
                <h2>{TaskToView.title}</h2>
              </div>
              <div className={styles.task_info}>
                <h4>#assignee</h4>
                <h2>
                  {TaskToView.assignee.slice(0, 6)}...
                  {TaskToView.assignee.slice(-6)}
                </h2>
              </div>
            </div>
            <div className={`flex ${styles.info_wrapper}`}>
              <div className={styles.task_info}>
                <h4>#assigned date</h4>
                <h3>
                  {getOrderedDate(
                    new Date(
                      parseInt(TaskToView.assignedDate.toString()) * 1000
                    )
                  )}
                </h3>
              </div>
              <div className={styles.task_info}>
                <h4>#due date</h4>
                <h3>
                  {getOrderedDate(
                    new Date(parseInt(TaskToView.dueDate.toString()) * 1000)
                  )}
                </h3>
              </div>
              <div className={styles.task_info}>
                <h4>#credits</h4>
                <h3>{TaskToView.creditScoreReward.toString()}</h3>
              </div>
              <div className={styles.task_info}>
                <h4>#usd reward</h4>
                <h3>${TaskToView.rewardInD.toString()}</h3>
              </div>
            </div>
            <div className={`flex ${styles.info_wrapper}`}>
              <div className={styles.task_info}>
                <h4>#task title</h4>
                <p>{TaskToView.description}</p>
              </div>
            </div>
            {parseInt(account) === parseInt(TaskToView.creator) &&
            !TaskToView.completed ? (
              <div className="flex-end">
                <SubmitButton
                  label={"Complete"}
                  submitHandler={handleSubmit}
                ></SubmitButton>
              </div>
            ) : null}
            <div className="flex-end">
              {TaskToView.completed ? (
                <h3 className={styles.task_completed}>Task is completed!</h3>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Tasks = () => {
  const router = useRouter();
  const { activityId } = router.query;
  const [modalView, setModalView] = useState({
    bool: false,
    task: null,
  });
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
        // console.log(response);
        setTaskArray(response);
        // console.log(taskArray);
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
      // console.log(response.data);
      setWallets(response.data.user);
    };
    fetchWallets();
  }, [taskArray]);

  return (
    <>
      <section className={styles.main_container}>
        {/* <TaskModal /> */}
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
                {modalView.bool ? (
                  <TaskModal
                    task={modalView.task}
                    taskArray={taskArray}
                    setModalView={setModalView}
                    ActivityAddress={ActivityAddress}
                    abi={abi}
                    activityId={activityId}
                  />
                ) : null}
                {taskArray.map((task, index) => {
                  var assignedDate = new Date(
                    parseInt(task.assignedDate.toString()) * 1000
                  );
                  var dueDate = new Date(
                    parseInt(task.dueDate.toString()) * 1000
                  );
                  var walletAddress = task.assignee.toString();

                  var wallet = wallets.findIndex(
                    (wallet) =>
                      wallet.walletAddress === walletAddress.toLowerCase()
                  );
                  // console.log(wallets[wallet]);
                  return (
                    <>
                      <Task
                        title={task.title}
                        username={
                          wallets[wallet] ? wallets[wallet].username : ""
                        }
                        due_date={getOrderedDate(dueDate)}
                        credit_reward={task.creditScoreReward.toString()}
                        assign_date={getOrderedDate(assignedDate)}
                        usd_reward={task.rewardInD.toString()}
                        profile_pic={
                          wallets[wallet] ? wallets[wallet].profile_pic : null
                        }
                        setModalView={setModalView}
                        taskId={index}
                        modalView={modalView}
                        completed={task.completed}
                      ></Task>
                    </>
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
        </section>
        {taskArray ? (
          <div className={styles.data_cards}>
            <DataCard
              isSubTextNotVisible={true}
              label="Task Assigned"
              data={taskArray.length}
              icon={faSitemap}
            >
              {" "}
            </DataCard>
            <DataCard
              isSubTextNotVisible={true}
              label="Task Completed"
              data={taskArray.filter((task) => task.completed === true).length}
              icon={faSitemap}
            >
              {" "}
            </DataCard>
          </div>
        ) : null}
      </section>
    </>
  );
};

export default Tasks;
