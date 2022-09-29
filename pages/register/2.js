import TextBox from "../../components/form/textBox";
import SubmitButton from "../../components/form/SubmitButton";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBanner from "../../components/form/sideBanner";
import { useRouter } from "next/router";
import InactiveTextBox from "../../components/form/inActiveTextBox";
import ImageUpload from "../../components/ImageUpload";
import SelectMenu from "../../components/form/SelectMenu";
import occupations from "../../static_files/occupations.js";
import ENV from "../../static_files/hostURL";

const DetailsForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [fileName, setFileName] = useState();
  const [imageFile, setImageFile] = useState();
  const [houseAddress, setHouseAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState(0);
  const [selectedOccupation, setSelectedOccupation] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    setSelectedOccupation(1);
    if (token) {
      axios
        .get(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/information/register",
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then(async (res) => {
          console.log(res);
          if (res.data.completed) {
            router.push("/explore");
          } else {
            setUsername(res.data.user.username);
            setEmail(res.data.user.email);
          }
        })
        .catch((err) => {
          router.push("/register");
          localStorage.removeItem("_USID");
        });
    } else {
      router.push("/register");
    }
  }, []);

  const handleSubmit = async () => {
    if (imageFile && fileName) {
      const formData = new FormData();
      formData.append("profileImage", imageFile, fileName);
      formData.append("houseAddress", houseAddress);
      formData.append("district", district);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("postalCode", postalCode);
      formData.append("occupation", selectedOccupation);
      try {
        const res = await axios.put(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/information/register",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-access-token": localStorage.getItem("_USID"),
            },
          }
        );
        router.push("/explore");
      } catch (err) {
        setErrorMessage(err.response.data.msg);
      }
    } else {
      try {
        await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/information/register",
          {
            houseAddress,
            district,
            state,
            country,
            postalCode,
            occupation: selectedOccupation,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("_USID"),
            },
          }
        );
        router.push("/explore");
      } catch (err) {
        setErrorMessage(err.response.data.msg);
      }
    }
  };

  return (
    <section className="centralise form-only">
      <SideBanner
        title={"Where are you from?"}
        fileName={"pattern-dummy.svg"}
      ></SideBanner>
      <div className="divider flex-column">
        <div className="form-container">
          <form className="register-form">
            <div className="space-between">
              <div className="flex-column">
                <InactiveTextBox value={username}></InactiveTextBox>
                <InactiveTextBox value={email}></InactiveTextBox>
              </div>
              <ImageUpload
                setFileName={setFileName}
                setImageFile={setImageFile}
              ></ImageUpload>
            </div>
            <br className="unselectable" />
            <div className="space-between">
              <TextBox
                label={"House Address"}
                name={"houseAddress"}
                inputUpdate={setHouseAddress}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label={"District/City"}
                name={"district"}
                inputUpdate={setDistrict}
              ></TextBox>
              <TextBox
                label={"State"}
                name={"state"}
                inputUpdate={setState}
              ></TextBox>
            </div>
            <div className="space-between">
              <TextBox
                label={"Country"}
                name={"country"}
                inputUpdate={setCountry}
              ></TextBox>
              <TextBox
                label={"Postal Code"}
                name={"postalCode"}
                inputUpdate={setPostalCode}
              ></TextBox>
            </div>
            <div className="space-between">
              <SelectMenu
                objectArray={occupations}
                name={"occupation"}
                changeHandler={setSelectedOccupation}
              ></SelectMenu>
            </div>
            {errorMessage ? (
              <FormError errorMessage={errorMessage}></FormError>
            ) : null}
            <div className="flex-end">
              <SubmitButton
                label="Next"
                submitHandler={handleSubmit}
              ></SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DetailsForm;
