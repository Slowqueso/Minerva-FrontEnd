import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Table from "../../../Table/Table";
import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../../constants";
import { ethers } from "ethers";
import { GetUserWithPuid } from "../../../../utils/api/GetUser";
import getOrderedDate from "../../../../utils/dateParser";
import DataCard from "../../DataCard/DataCard";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { ActivityContext } from "../../../../pages/dashboard/[activityId]/[tab]";

const Donations = () => {
  const { Moralis, chainId: chainIdHex } = useMoralis();
  const [signer, setSigner] = useState();
  const { public_ID } = useContext(ActivityContext);
  const chainId = parseInt(chainIdHex);
  const [activity, setActivity] = useState(null);
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [donationBalance, setDonationBalance] = useState(0);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const data = [
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      image_logo: "/assets/default_profile.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
  ];

  const { runContractFunction: getActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getActivity",
    params: {
      activityID: public_ID,
    },
  });

  const listenToEvents = async () => {
    const contract = new ethers.Contract(ActivityAddress, abi, signer);
    contract.on(
      "DonationMade",
      (
        _sender,
        _activityID,
        _userPublicID,
        _donationAmount,
        _timeStamp,
        _totalDonationReceived
      ) => {
        let user;
        const logUser = async () => {
          const response = await GetUserWithPuid(_userPublicID);
          user = response.user;
          let donation = {
            // _activityID: parseInt(_activityID),
            image_logo: user.profile_pic
              ? user.profile_pic
              : "/assets/default_profile.svg",
            username: user.username,
            date: getOrderedDate(_timeStamp * 1000),
            amount: parseInt(_donationAmount) / 1e18,
            // _totalDonationReceived: parseInt(_totalDonationReceived),
          };
          setDonations((donations) => [...donations, donation]);
        };
        setTotalDonations(parseInt(_totalDonationReceived));
        logUser();
      }
    );
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const response = await getActivity();
      setTotalDonations(parseInt(response.donationReceived));
      setDonationBalance(parseInt(response.donationBalance));
    };
    if (public_ID) {
      fetchActivity();
    }
  }, [public_ID]);
  useEffect(() => {
    if (signer) {
      listenToEvents();
    }
  }, [signer]);

  useEffect(() => {
    if (Moralis && ActivityAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
    }
  }, []);

  return (
    <>
      <section className={styles.section_1}>
        <h2 className={styles.tab_header}>Donors - {donations.length}</h2>
      </section>
      <section className={styles.section_2}>
        {donations.length > 0 ? (
          <Table
            isImage={true}
            headers={["Sr. No", "Username and Profile", "Date", "Amount"]}
            data={donations}
          ></Table>
        ) : (
          <div className={styles.no_donations}>No Donations Yet</div>
        )}
        <div className={styles.card_container}>
          <DataCard
            label={"Donation Received"}
            icon={faEthereum}
            data={totalDonations / 1e18}
            isSubTextNotVisible={true}
          ></DataCard>
          <DataCard
            label={"Donation Balance"}
            icon={faEthereum}
            data={donationBalance / 1e18}
            isSubTextNotVisible={true}
          ></DataCard>
        </div>
      </section>
      <section className={styles.section_3}>
        <h2 className={styles.tab_header}>Settings</h2>
      </section>
    </>
  );
};

export default Donations;
