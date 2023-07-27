import FullLayout from "../../components/Layout/FullLayout";
import React, { useState, useEffect, useContext } from "react";
import ActivityDetails from "../../components/create-activity/ActivityDetails/ActivityDetails";
import ProgressBar from "../../components/ProgressBar";
import styles from "./styles.module.css";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import FormError from "../../components/form/formError";
import { useRouter } from "next/router";
import { UserContext } from "../../pages/_app";
import ActivityPreview from "../../components/create-activity/ActivityPreview/ActivityPreview";
import ActivitySuggestions from "../../components/create-activity/ActivitySuggestions/ActivitySuggestions";
import ViewTabs from "../../components/create-activity/ViewTabs/ViewTabs";

const CreateActivity = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [progress, setProgress] = useState(0);
  const [hintsArray, setHintsArray] = useState([]);

  useEffect(() => {
    // if (user) {
    //   console.log(user);
    // }
  }, []);

  return (
    <FullLayout>
      <ViewTabs></ViewTabs>
    </FullLayout>
  );
};

export default CreateActivity;
