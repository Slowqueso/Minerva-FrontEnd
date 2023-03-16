import Link from "next/link";
import { React, useState, useEffect } from "react";
import FullLayout from "../../components/Layout/FullLayout";
import styles from "./styles.module.css";
import MyProfileNavbar from "../../components/my-profile/navbar/MyProfileNavbar";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import occupations from "../../static_files/occupations";
import { Loading } from "web3uikit";
import {Router,useRouter} from "next/router";

const AccountOverview = () => {
  
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    
    router.replace(`/my-profile/info`);
  }, []);

  return (
    <>
      <FullLayout>
        <div className={styles.my_profile}>
          <div className="centralise">
          <Loading />
          </div>
          
        </div>
      </FullLayout>
    </>
  );
};

export default AccountOverview;
