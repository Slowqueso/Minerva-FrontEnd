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

const ActivityDetails = ({ activity, setProgress, setHint }) => {
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

  const fetchHints = (value) => {
    //  axios
    //   .post(
    //     ENV.PROTOCOL +
    //     ENV.HOST +
    //     ENV.PORT +
    //     `/activity/activity-suggestions`,
    //     {
    //       keyword: value.toString(),
    //     }
    //   )
    //   .then((res) => {
    //     setHint(res.data.activities);
    //   });
  };

  const handleChange = (value) => {
    setTitle(value);
    fetchHints(value);
  };

  const [buttondisabled, setButtondisabled] = useState(false);

  
  const handleValidation = () => {

    if (!title || !description || !selectedLevel || !memberLimit || !durationPeriod || !joinPrice || !categories) {

      return "Please fill all the fields";
    }

    let error = {
      title: "",
      description: "",
      categories: "",
      durationPeriod: "",
      selectedLevel: "",
      memberLimit: "",
      joinPrice: "",
      ifImage: "",

    }
    //title validation
    if (!title.trim()) {
      error.title = "Title is required";
    } else {
      error.title = null;
    }

    //description validation
    if (!description.trim()) {
      error.description = "Description is required";
    } else {
      error.description = null;
    }

    if (!categories.trim()) {
      error.categories = "Categories is required";
    } else {
      error.categories = null;
    }

    //wheter member limit is a number
    if (isNaN(memberLimit)) {
      error.memberLimit = "Member limit must be a number";
    } else {
      error.memberLimit = null;
    }

    //wheter duration period is a number
    if (isNaN(durationPeriod)) {
      error.durationPeriod = "Duration period must be a number";
    } else {
      error.durationPeriod = null;
    }

    //wheter join price is a number
    if (isNaN(joinPrice)) {
      error.joinPrice = "Join price must be a number";
    } else {
      error.joinPrice = null;
    }

    //wheter image is uploaded

    if (preImage) {
      error.ifImage = null;
    }
    else if (!imageFile || !fileName) {
      error.ifImage = "Image is required";
    }

    else {
      error.ifImage = null;
    }

    return error.title || error.description || error.categories || error.durationPeriod || error.memberLimit || error.joinPrice || error.ifImage;
  };

  const handleSubmit = async () => {
    setButtondisabled(true);
    if (((imageFile && fileName) || preImage) && !handleValidation())  {
      const formData = {}
      if(imageFile && fileName){
        // formData.append("activityLogo", imageFile, fileName);
        await axios.get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/aws/image-upload/activityLogo").then((res) => {
          if(res){
            const {URL,imagename} = res.data;
            formData = Object.assign(formData, {  activityLogo: imagename });
            
             axios
              .put(URL, imageFile, {
                headers: {
                  "Content-type": imageFile.type,
                },
                
              })
              .then((res) => {
                if (res.status === 200) {
                  console.log(res.config.url.split("?")[0],imagename);
                  setFileName(imagename);
                  
                }
              })
              .catch((err) => {
                console.log(err);
              });  
          }
        })
      }
      formData = Object.assign(formData, { title, description, selectedLevel, memberLimit, durationPeriod, joinPrice, categories });

      
      console.log(formData)
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
                // "Content-type": "multipart/form-data",
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
                // "Content-type": "multipart/form-data",
                "x-access-token": localStorage.getItem("_USID"),
              },
            }
          );
          if (res.data.draftSaved) {
            setProgress(33);
            router.push(`/create-activity/${res.data._id}`);
          }
        }
      } catch (err) {
        setButtondisabled(false);
        setLoader(false);
        setErrorMessage(err.response.data.msg);
        console.log(err);
      }
    } else {
      setButtondisabled(false);
      setErrorMessage(handleValidation());
    }
  };
  useEffect(() => {

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
                  onChange={handleChange}
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
            isDisabled={buttondisabled}
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
