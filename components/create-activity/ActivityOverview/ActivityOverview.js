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
import FormError from "../../form/formError";

const FieldImage = ({ inputFields, index, setInputFields }) => {
  const imageHandler = (e) => {
    try {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      const values = [...inputFields];
      values[index][e.target.name] = imageURL;
      setInputFields(values);
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  const onFileUpload = (e) => {
    const { files } = e.target;
    console.log(files);
    if (imageHandler(e)) {
      const values = [...inputFields];
      values[index]["imageFile"] = files[0];
      values[index]["fileName"] = files[0].name;
      setInputFields(values);
    }
  };

  return (
    <>
      <label htmlFor={`pic-inp-${index}`} style={{ borderRadius: "50%" }}>
        <div className="activity-assets">
          <label
            htmlFor={`pic-inp-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <img
              style={{
                width: "200px",
                height: "200px",
                margin: "auto",
              }}
              src={
                inputFields[index].activityAsset
                  ? inputFields[index].activityAsset
                  : "/assets/ImageUpload.svg"
              }
              crossOrigin="anonymous"
              className="unselectable"
            />
          </label>

          <div className="acc-user-profile-lens">
            <h3 className="lens-text unselectable f-16">Choose a Photo</h3>
          </div>
        </div>
      </label>
      <input
        type="file"
        name="activityAsset"
        onChange={(e) => {
          onFileUpload(e);
          // imageHandler(e);
        }}
        id={`pic-inp-${index}`}
        style={{ display: "none" }}
      />
    </>
  );
};

const ActivityOverview = () => {
  const router = useRouter();
  const activityId = router.query.activityId;
  const [progress, setProgress] = useState();
  const [inputFields, setInputFields] = useState([
    {
      fieldHeader: "",
      fieldDescription: "",
      imageFile: "",
      fileName: "",
      activityAsset: "",
    },
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeInput = (index, event) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
  };

  const handleRemoveFields = (index) => {
    console.log(index);
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const handleAddFields = (e) => {
    e.preventDefault();
    setInputFields([
      ...inputFields,
      {
        fieldHeader: "",
        fieldDescription: "",
        activityAsset: "",
        fileName: "",
        imageFile: "",
      },
    ]);
  };
  const sendHeaderWithImage = (entry, index) => {
    const formData = new FormData();
    formData.append("activityAsset", entry.imageFile, entry.fileName);
    formData.append("header", entry.fieldHeader);
    formData.append("description", entry.fieldDescription);
    formData.append("activityId", activityId);
    formData.append("index", index);
    axios
      .post(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/add-fields",
        formData
      )
      .then(async (response) => {
        await new Promise((r) => setTimeout(r, 100));
        // incrementStatus(activityId, setProgress, 100, setErrorMessage);
        // router.push(`/my-activity/${activityId}`);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return true;
  };

  const handleSubmit = () => {
    let flag = false;
    inputFields.forEach((entry, index) => {
      if (entry.fileName === "") {
        axios
          .put(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/add-fields", {
            header: entry.fieldHeader,
            description: entry.fieldDescription,
            id: activityId,
            index: index,
          })
          .then(async (response) => {
            if (response) {
              flag = true;
            }
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      } else {
        flag = sendHeaderWithImage(entry, index);
      }
    });
    if (flag) {
      incrementStatus(activityId, setProgress, 100, setErrorMessage);
      router.push(`/my-activity/${activityId}`);
    }
  };
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.wrapper_title}>
        Activity Overview and Resources (Optional)
      </h1>
      <form className={styles.form_container}>
        {inputFields.map((inputfield, index) => {
          return (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div className={styles.flex_between}>
                <div className={styles.textBox_align}>
                  <div className="flex">
                    <TitleBox
                      label={"Field Header"}
                      name={"fieldHeader"}
                      value={inputfield.fieldHeader}
                      index={index}
                      inputUpdate={handleChangeInput}
                    ></TitleBox>
                  </div>
                  <div className="flex">
                    <TextArea
                      label={"Field Description"}
                      name={"fieldDescription"}
                      value={inputfield.fieldDescription}
                      index={index}
                      inputUpdate={handleChangeInput}
                    ></TextArea>
                  </div>
                </div>
                <div>
                  <FieldImage
                    index={index}
                    inputFields={inputFields}
                    setInputFields={setInputFields}
                  ></FieldImage>
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
            label={"Finish"}
          ></SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ActivityOverview;
