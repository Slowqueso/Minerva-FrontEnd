import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Table from "../../../Table/Table";
import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../../constants";
import { ethers } from "ethers";
import { GetUserWithPuid } from "../../../../utils/api/GetUser";
import getOrderedDate from "../../../../utils/dateParser";

const Donations = () => {
  const { Moralis, chainId: chainIdHex } = useMoralis();
  const [signer, setSigner] = useState();
  const chainId = parseInt(chainIdHex);
  const [donations, setDonations] = useState([]);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const data = [
    {
      image_logo: "/profile_image.svg",
      username: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
    {
      aditya: "John Doe",
      date: "19/11/22",
      amount: "$10",
    },
  ];

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
              : "/profile_image.svg",
            username: user.username,
            date: getOrderedDate(_timeStamp * 1000),
            amount: parseInt(_donationAmount),
            // _totalDonationReceived: parseInt(_totalDonationReceived),
          };
          setDonations((donations) => [...donations, donation]);
        };
        logUser();
      }
    );
  };
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
        <h2 className={styles.tab_header}>Donors - 6</h2>
      </section>
      <section className={styles.section_2}>
        <Table
          isImage={true}
          headers={["Sr. No", "Username and Profile", "Date", "Amount"]}
          data={donations}
        ></Table>
        <div className={styles.card_container}></div>
      </section>
    </>
  );
};

export default Donations;
