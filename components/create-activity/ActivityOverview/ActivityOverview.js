import React, { useState } from "react";
import styles from "./styles.module.css";
import TitleBox from "../../form/TitleBox";
import TextArea from "../../form/TextArea";
import DeleteButton from "../ActivityTerms/DeleteButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SubmitButton from "../../form/SubmitButton";
import { useRouter } from "next/router";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import incrementStatus from "../../../utils/api/incrementActivity";

const ActivityOverview = () => {
  const router = useRouter();
  const activityId = router.query.activityId;
  const [inputFields, setInputFields] = useState([
    { fieldHeader: "", fieldDescription: "" },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const setProgress = () => {};

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(values[index], 1);
    setInputFields(values);
  };

  const handleAddFields = (e) => {
    e.preventDefault();
    setInputFields([...inputFields, { firstName: "", lastName: "" }]);
  };

  const handleSubmit = () => {
    axios
      .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/add-fields", {
        id: activityId,
        fields: inputFields,
      })
      .then((response) => {
        incrementStatus(activityId, setProgress, 100, setErrorMessage);
        router.push(`/my-activity/${activityId}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.wrapper_title}>
        Project Overview and Resources (Optional)
      </h1>
      <form className={styles.form_container}>
        {inputFields.map((inputfield, index) => {
          return (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div className={styles.flex_between}>
                <TitleBox
                  label={"Field Header"}
                  name={"fieldHeader"}
                  value={inputfield.fieldHeader}
                  index={index}
                  inputUpdate={handleChangeInput}
                ></TitleBox>
                <TextArea
                  label={"Field Description"}
                  name={"fieldDescription"}
                  value={inputfield.fieldDescription}
                  index={index}
                  inputUpdate={handleChangeInput}
                ></TextArea>
              </div>
              <DeleteButton clickHandler={handleRemoveFields}></DeleteButton>
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
            label={"Finish"}
          ></SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ActivityOverview;
