import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import Table from "../../../Table/Table";
import { useRouter } from "next/router";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../../constants";

const Donations = () => {
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
  return (
    <>
      <section className={styles.section_1}>
        <h2 className={styles.tab_header}>Donors - 6</h2>
      </section>
      <section className={styles.section_2}>
        <Table
          isImage={true}
          headers={["Sr. No", "Username and Profile", "Date", "Amount"]}
          data={data}
        ></Table>
        <div className={styles.card_container}></div>
      </section>
    </>
  );
};

export default Donations;
