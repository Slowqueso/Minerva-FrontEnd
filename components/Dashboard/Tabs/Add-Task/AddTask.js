import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import TextBox from "../../../form/textbox";
import TextArea from "../../../form/TextArea";
import SelectMenu from "../../../form/SelectMenu";
import SubmitButton from "../../../form/SubmitButton";
import { ActivityContext } from "../../../../pages/dashboard/[activityId]/[tab]";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../../constants";
import DataCard from "../../DataCard/DataCard";
import FormError from "../../../form/formError";
import { useNotification } from "web3uikit";
import convertUsdToETH from "../../../../utils/usdConverter";
import { ethers } from "ethers";

const AddTask = () => {
  const dispatch = useNotification();
  const activity = useContext(ActivityContext);
  const router = useRouter();
  const { activityId } = router.query;
  const [selectedUser, setSelectedUser] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescripton, setTaskDescription] = useState("");
  const [taskCredit, setTaskCredit] = useState("");
  const [taskAmountInD, setAmountInD] = useState("");
  const [weiAmount, setWeiAmount] = useState(0);
  const [taskDueDate, setTaskDueDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [memberOption, setMemberOptions] = useState([
    {
      label: "Select User",
      value: null,
    },
  ]);
  const [members, setMembers] = useState([]);

  const { Moralis, chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const getWeiAmount = async (amount) => {
    const ethValue = await convertUsdToETH(amount);
    const weiAmount = ethers.utils.parseEther(ethValue.toString());
    setWeiAmount(weiAmount);
  };

  useEffect(() => {
    if (parseInt(taskAmountInD) > 0 && Moralis) {
      getWeiAmount(parseInt(taskAmountInD));
    }
  }, [taskAmountInD]);

  const { runContractFunction: createTask } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "createTask",
    params: {
      _activityID: parseInt(activityId),
      _assignee: selectedUser,
      _title: taskTitle,
      _description: taskDescripton,
      _rewardInD: parseInt(taskAmountInD),
      _dueInDays: parseInt(taskDueDate),
      _creditScoreReward: parseInt(taskCredit),
    },
    msgValue: weiAmount,
  });

  const handleAddTask = async () => {
    const response = await createTask({
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };

  const handleError = (error) => {
    console.log(error);
    dispatch({
      title: "Task Creation Failed",
      message: "Task creation failed",
      type: "error",
      position: "bottomR",
    });
  };

  const handleSuccess = () => {
    dispatch({
      title: "Task Created",
      message: "Task created successfully",
      type: "success",
      position: "bottomR",
    });
  };

  useEffect(() => {
    if (activityId) {
      axios
        .get(
          `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/get-members/${activityId}`
        )
        .then((response) => {
          setMembers(response.data);
        });
    }
  }, []);

  useEffect(() => {
    members.map((member) => {
      if (!memberOption.some((user) => user.value === member.wallet_ID)) {
        setMemberOptions((memberOption) => [
          ...memberOption,
          {
            label: `${member.username} - [${member.wallet_ID}]`,
            value: member.wallet_ID,
          },
        ]);
      }
    });
  }, [members]);

  return (
    <div className={styles.add_task}>
      <div className={`form-container ${styles.add_task_container}`}>
        <form className="register-form">
          <div className="flex">
            <SelectMenu
              objectArray={memberOption}
              name={"assignee"}
              changeHandler={setSelectedUser}
              isString={true}
            ></SelectMenu>
          </div>
          <div className="flex">
            <TextBox
              label={"Task Title"}
              name={"taskTitle"}
              inputUpdate={setTaskTitle}
              // value={taskTitle}
            ></TextBox>
          </div>
          <div className="flex">
            <TextArea
              label={"Task Description"}
              name={"taskDescription"}
              inputUpdate={setTaskDescription}
              // value={taskDescripton}
            ></TextArea>
          </div>
          <div className="space-between">
            <TextBox
              label={"Task Credit"}
              name={"taskCredit"}
              inputUpdate={setTaskCredit}
              // value={taskCredit}
            ></TextBox>
            <TextBox
              label={"Reward Amount"}
              name={"amount"}
              inputUpdate={setAmountInD}
              // value={taskAmountInD}
            ></TextBox>
          </div>
          <div className="flex">
            <TextBox
              label={"Due In Number of days"}
              name={"dueDate"}
              inputUpdate={setTaskDueDate}
              // value={taskDueDate}
            ></TextBox>
          </div>
          {errorMessage ? (
            <FormError errorMessage={errorMessage}></FormError>
          ) : null}
          <div className={styles.btnTask}>
            <SubmitButton
              label={"Add Task"}
              submitHandler={handleAddTask}
            ></SubmitButton>
          </div>
        </form>
      </div>
      {/* <DataCard data={"yes"}></DataCard> */}
    </div>
  );
};

export default AddTask;
