import React, { useContext, useEffect } from "react";
import Table from "../../../Table/Table";
import { ActivityContext } from "../../../../pages/dashboard/[activityId]/[tab]";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { Loading } from "web3uikit";
import getOrderedDate from "../../../../utils/dateParser";
const Members = () => {
  const activity = useContext(ActivityContext);
  const [response, setResponse] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  useEffect(() => {
    axios
      .get(
        ENV.PROTOCOL +
          ENV.HOST +
          ENV.PORT +
          `/activity/get-members/${activity.public_ID}`,
        {}
      )
      .then((response) => {
        if (response) {
          setResponse(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activity]);
  useEffect(() => {
    let temp = [];
    response.map((member, index) => {
      let temp1 = {
        image_logo: member.profile_pic
          ? member.profile_pic
          : "/assets/default_profile.svg",
        username: member.username,
        wallet_ID: member.wallet_ID,
        date_of_join: getOrderedDate(member.date_of_join),
      };
      temp.push(temp1);
    });
    setMembers(temp);
  }, [response]);
  return (
    <>{
        members ? <Table
        isImage={true}
        headers={["S.No.", "Username and Profile", "Wallet ID", "Date of Join"]}
        data={members}
      />:<Loading/>
    }
      
    </>
  );
};

export default Members;
