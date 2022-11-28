import React, { useState, useEffect } from "react";
import FullLayout from "../../components/Layout/FullLayout";
import SearchBox from "../../components/SearchBox/SearchBox";
import Cards from "../../components/Cards/Cards";
import axios from "axios";
import ENV from "../../static_files/hostURL";

const Index = () => {
  const [activities, setActivities] = useState();

  useEffect(() => {
    axios
      .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-all")
      .then((response) => {
        setActivities(response.data.activities);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <FullLayout>
      <SearchBox
        placeholder={"Search the activities you wish to find, here"}
      ></SearchBox>
      <Cards activities={activities}></Cards>
    </FullLayout>
  );
};

export default Index;
