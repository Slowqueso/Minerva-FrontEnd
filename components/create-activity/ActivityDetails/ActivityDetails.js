import React from "react";
import styles from "./styles.module.css";
import TextBox from "../../form/textBox";
import ImageUpload from "../../ImageUpload";
import SelectMenu from "../../form/SelectMenu";
import { useState, useEffect } from "react";
import levels from "../../../static_files/levels";
import FormError from "../../../components/form/formError";
import SubmitButton from "../../../components/form/SubmitButton";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import { Loading } from "web3uikit";
import { useRouter } from "next/router";

const ActivityDetails = ({ setProgress, user, progress }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [memberLimit, setMemberLimit] = useState(0);
  const [durationPeriod, setDurationPeriod] = useState(0);
  const [joinPrice, setJoinPrice] = useState(0);
  const [categories, setCategories] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activity, setActivity] = useState();

  const handleSubmit = async () => {
    if (imageFile && fileName) {
      const formData = new FormData();
      formData.append("activityLogo", imageFile, fileName);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("selectedLevel", selectedLevel);
      formData.append("memberLimit", memberLimit);
      formData.append("durationPeriod", durationPeriod);
      formData.append("joinPrice", joinPrice);
      formData.append("categories", categories);
      try {
        setLoader(true);
        const res = await axios.post(
          ENV.PROTOCOL +
            ENV.HOST +
            ENV.PORT +
            "/activity/create-activity/create-draft",
          formData,
          {
            headers: {
              "Content-type": "multipart/form-data",
              "x-access-token": localStorage.getItem("_USID"),
            },
          }
        );
        if (res.data.draftSaved) {
          // setProgress(33);
          router.push(`/create-activity/${res.data._id}`);
        }
      } catch (err) {
        setLoader(false);
        setErrorMessage(err.response.data.msg);
        console.log(err);
      }
    } else {
      setErrorMessage("Upload an Image");
    }
  };
  return (
    <div className="flex">
      <form className={styles.form_container}>
        {loader ? (
          <div className="centralise" style={{ height: "40vh" }}>
            <Loading></Loading>
          </div>
        ) : null}
        <div className={styles.flex_container}>
          <div className={styles.inner_container}>
            <div className={styles.tb_aligner}>
              <TextBox
                label={"Activity Title"}
                inputUpdate={setTitle}
                value={title ? title : null}
                name={"title"}
              ></TextBox>
            </div>
            <div className={styles.tb_aligner}>
              <TextBox
                label={"Activity Description"}
                inputUpdate={setDescription}
                name={"desc"}
              ></TextBox>
            </div>
          </div>
          <div className="flex">
            <ImageUpload
              setFileName={setFileName}
              setImageFile={setImageFile}
            ></ImageUpload>
          </div>
        </div>
        <div className={styles.input_divider}>
          <SelectMenu
            objectArray={levels}
            label={"Difficulty Level"}
            changeHandler={setSelectedLevel}
            name={"level"}
          ></SelectMenu>
          <TextBox
            label={"Member Limit"}
            inputUpdate={setMemberLimit}
            name={"limit"}
          ></TextBox>
        </div>
        <div className={styles.input_divider}>
          <TextBox
            label={"Duration Period (Months)"}
            inputUpdate={setDurationPeriod}
            name={"duration"}
          ></TextBox>
          <TextBox
            label={"Joining Price ($)"}
            inputUpdate={setJoinPrice}
            name={"price"}
          ></TextBox>
        </div>
        <div className={styles.input_divider}>
          <TextBox
            label={"Category Tags"}
            inputUpdate={setCategories}
            name={"category"}
          ></TextBox>
        </div>
        {errorMessage ? (
          <div className={styles.input_divider}>
            <FormError errorMessage={errorMessage}></FormError>
          </div>
        ) : null}
        <div className={styles.flex_end}>
          <SubmitButton
            submitHandler={handleSubmit}
            label={activity ? "Update Changes" : "Save as Draft"}
          ></SubmitButton>
        </div>
      </form>
    </div>
  );
};

export default ActivityDetails;
