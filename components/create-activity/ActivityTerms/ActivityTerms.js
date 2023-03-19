import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import TextArea from "../../form/TextArea";
import TextBox from "../../form/TitleBox";
import DeleteButton from "./DeleteButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import SubmitButton from "../../form/SubmitButton";
import ENV from "../../../static_files/hostURL";
import FormError from "../../form/formError";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "web3uikit";
import axios from "axios";
import { abi, contractAddresses } from "../../../constants/index";
import incrementStatus from "../../../utils/api/incrementActivity";
import {
  getActivityById,
  getActivityPublicId,
} from "../../../utils/api/GetActivity";

const ActivityTerms = ({ setProgress }) => {
  const router = useRouter();
  const dispatch = useNotification();
  const activityId = router.query.activityId;
  const [inputFields, setInputFields] = useState([
    { termTitle: "", termDescription: "" },
  ]);
  const [publicId, setPublicId] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  //Deploying Terms
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const getTitleArray = () => {
    const Titles = [];
    inputFields.forEach((inputField) => {
      Titles.push(inputField.termTitle);
    });
    return Titles;
  };

  const getDescriptionArray = () => {
    const descs = [];
    inputFields.forEach((inputField) => {
      descs.push(inputField.termDescription);
    });
    return descs;
  };

  const { runContractFunction: addTermForActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "addTermForActivity",
    params: {
      _activityID: publicId ? publicId : 0,
      _title: getTitleArray(),
      _desc: getDescriptionArray(),
    },
  });

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleAddFields = (e) => {
    e.preventDefault();
    setInputFields([...inputFields, { termTitle: "", termDescription: "" }]);
  };

  const successHandler = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Terms Added Successfully!",
      title: "Tx Notification",
      position: "bottomR",
    });
    axios
      .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/add-terms", {
        id: activityId,
        terms: inputFields,
      })
      .then((response) => {
        if (response) {
          incrementStatus(activityId, setProgress, 100, setErrorMessage);
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.msg);
      });
  };

  const handleSubmit = async () => {
    await addTermForActivity({
      onSuccess: successHandler,
      onError: (error) => console.log(error),
    });
  };

  const loadPublicID = async () => {
    const response = await getActivityPublicId(activityId);
    setPublicId(response.data.public_ID);
  };

  useEffect(() => {
    if (activityId) {
      loadPublicID();
    }
  }, [activityId]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.wrapper_title}>Add Terms and Conditions</h1>
      <form className={styles.form_container}>
        {inputFields.map((inputfield, index) => {
          return (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div className={styles.flex_between}>
                <div style={{ width: "100%" }}>
                  <div className="flex">
                    <TextBox
                      label={"Term Title"}
                      name={"termTitle"}
                      value={inputfield.termTitle}
                      index={index}
                      inputUpdate={handleChangeInput}
                    ></TextBox>
                  </div>
                  <div className="flex">
                    <TextArea
                      label={"Term Description"}
                      name={"termDescription"}
                      value={inputfield.termDescription}
                      index={index}
                      inputUpdate={handleChangeInput}
                    ></TextArea>
                  </div>
                </div>
              </div>
              <DeleteButton
                clickHandler={() => handleRemoveFields(index)}
              ></DeleteButton>
            </div>
          );
        })}

        <button onClick={handleAddFields} className={styles.add_field}>
          <FontAwesomeIcon
            icon={faPlus}
            size="lg"
            color="white"
          ></FontAwesomeIcon>
          <span>Add Term</span>
        </button>
        {errorMessage ? (
          <div className="space-between">
            <FormError errorMessage={errorMessage}></FormError>
          </div>
        ) : null}
        <div className="flex-end">
          <SubmitButton
            submitHandler={handleSubmit}
            label={"Save and Deploy"}
          ></SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ActivityTerms;
