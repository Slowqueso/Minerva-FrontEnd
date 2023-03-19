import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import TextBox from "../../../form/textBox";
import SubmitButton from "../../../form/SubmitButton";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { useRouter } from "next/router";

const Integrations = () => {
  const router = useRouter();
  const { activityId } = router.query;
  const [appSelected, setSelectedApp] = useState(false);
  const [url, setUrl] = useState();

  const handleSubmit = async (e) => {
    axios
      .post(
        `${ENV.PROTOCOL}${ENV.HOST}${ENV.PORT}/activity/add-connections`,
        {
          link: url,
          app_name: "Discord",
        },
        {
          headers: {
            "x-activity-id": activityId,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <section className={styles.container}>
        <div className={styles.supported_apps}>
          <h3>Integrate applications for your Activity</h3>
          <h4>
            This information will not be used outside of Minerva without your
            permission.
          </h4>
          <div className={`flex ${styles.apps}`}>
            <div
              className={styles.app}
              onClick={() => {
                setSelectedApp(!appSelected);
              }}
            >
              <img
                src={
                  "https://www.freepnglogos.com/uploads/discord-logo-png/discord-logo-logodownload-download-logotipos-1.png"
                }
                height={40}
                width={40}
              ></img>
            </div>
          </div>
        </div>
        {appSelected ? (
          <div className={`form-container ${styles.integration_body}`}>
            <h3 className={styles.body_header}>Discord</h3>
            <form className="register-form">
              <div className={`flex ${styles.body}`}>
                <TextBox
                  label={"Enter Widget URL"}
                  name={"url"}
                  inputUpdate={setUrl}
                ></TextBox>
              </div>
              <SubmitButton
                label={"Save"}
                submitHandler={handleSubmit}
              ></SubmitButton>
            </form>
          </div>
        ) : null}
      </section>
    </>
  );
};

export default Integrations;
