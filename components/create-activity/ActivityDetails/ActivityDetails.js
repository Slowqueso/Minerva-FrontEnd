import React from "react";
import styles from "./styles.module.css";
import TextBox from "../../form/textBox";
import ImageUpload from "../../ImageUpload";
import SelectMenu from "../../form/SelectMenu";
import { useState, useEffect } from "react";
import levels from "../../../static_files/levels";
import FormError from "../../../components/form/formError";
import SubmitButton from "../../../components/form/SubmitButton";
import TextArea from "../../../components/form/TextArea";
import axios from "axios";
import ENV from "../../../static_files/hostURL";
import { Loading } from "web3uikit";
import { useRouter } from "next/router";
import incrementStatus from "../../../utils/api/incrementActivity";

const ActivityDetails = ({ activity, setProgress }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(null);
  const [imageFile, setImageFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [memberLimit, setMemberLimit] = useState(0);
  const [durationPeriod, setDurationPeriod] = useState(0);
  const [joinPrice, setJoinPrice] = useState(0);
  const [categories, setCategories] = useState("");
  const [loader, setLoader] = useState(false);
  const [preImage, setPreImage] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if ((imageFile && fileName) || preImage)  {
      const formData = new FormData();
      if(imageFile && fileName){
        formData.append("activityLogo", imageFile, fileName);
      }
      
      formData.append("title", title);
      formData.append("description", description);
      formData.append("selectedLevel", selectedLevel);
      formData.append("memberLimit", memberLimit);
      formData.append("durationPeriod", durationPeriod);
      formData.append("joinPrice", joinPrice);
      formData.append("categories", categories);
      try {
        // setLoader(true);
        if (!activity) {
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
        } else {
          const res = await axios.post(
            ENV.PROTOCOL +
              ENV.HOST +
              ENV.PORT +
              `/activity/upd-activity/${activity.id}`,
            formData,
            {
              headers: {
                "Content-type": "multipart/form-data",
              },
            }
          );
          if (res.data.draftSaved) {
            setProgress(33);
            router.push(`/create-activity/${res.data._id}`);
          }
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
  useEffect(() => {
    console.log(activity);
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description);
      setDurationPeriod(activity.durationPeriod);
      setCategories(activity.categories);
      setSelectedLevel(activity.difficulty_level);
      setPreImage(activity.logo);
      setMemberLimit(activity.member_limit);
      setJoinPrice(activity.join_price);
     
    }
  }, [activity]);
  return (
    <div className="flex">
      {loader ? (
        <div className="centralise" style={{ height: "40vh" }}>
          <Loading></Loading>
        </div>
      ) : (
        <form className={styles.form_container}>
          <div className={styles.flex_container}>
            <div className={styles.inner_container}>
              <div className={styles.tb_aligner}>
                <TextBox
                  label={"Activity Title"}
                  inputUpdate={setTitle}
                  name={"title"}
                  value={title}
                ></TextBox>
              </div>
              <div className={styles.tb_aligner}>
                <TextArea
                  label={"Activity Description"}
                  inputUpdate={setDescription}
                  name={"desc"}
                  value={description}
                ></TextArea>
              </div>
            </div>
            <div className="flex">
              <ImageUpload
                setFileName={setFileName}
                setImageFile={setImageFile}
                preImage={preImage}
              ></ImageUpload>
            </div>
          </div>
          <div className={styles.input_divider}>
            <SelectMenu
              objectArray={levels}
              label={"Difficulty Level"}
              changeHandler={setSelectedLevel}
              name={"level"}
              value={selectedLevel}
            ></SelectMenu>
            <TextBox
              label={"Member Limit"}
              inputUpdate={setMemberLimit}
              name={"limit"}
              value={memberLimit}
            ></TextBox>
          </div>
          <div className={styles.input_divider}>
            <TextBox
              label={"Duration Period (Months)"}
              inputUpdate={setDurationPeriod}
              name={"duration"}
              value={durationPeriod}
            ></TextBox>
            <TextBox
              label={"Joining Price ($)"}
              inputUpdate={setJoinPrice}
              name={"price"}
              value={joinPrice}
            ></TextBox>
          </div>
          <div className={styles.input_divider}>
            <TextBox
              label={"Category Tags"}
              inputUpdate={setCategories}
              name={"category"}
              value={categories}
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
      )}
      
    </div>
  );
};

export default ActivityDetails;
