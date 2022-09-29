import styles from "../styles.module.css";
import ActivityProfilePage from "..";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { Loading } from "web3uikit";
import Link from "next/link";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses } from "../../../../constants";
import getOrderedDate from "../../../../utils/dateParser";

const Discussions = () => {
  const router = useRouter();
  const activityId = router.query.activityId;
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const ActivityAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [activity, setActivity] = useState();
  const { runContractFunction: getTermsForActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getTermsForActivity",
    params: activity
      ? {
          _activityID: activityId,
        }
      : null,
  });
  const { runContractFunction: getActivity } = useWeb3Contract({
    abi,
    contractAddress: ActivityAddress,
    functionName: "getActivity",
    params: activity
      ? {
          activityID: activityId,
        }
      : null,
  });

  useEffect(() => {
    if (activityId) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/get-one", {
          headers: {
            "x-activity-id": activityId,
          },
        })
        .then((response) => {
          if (response) {
            setActivity(response.data.activity);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activityId]);
  return (
    <ActivityProfilePage>
      <div className={styles.view_tab}>
        <Link href={`/explore/${activityId}/overview`}>
          <div className={styles.view_nav}>
            <h3>Overview</h3>
          </div>
        </Link>
        <Link href={`/explore/${activityId}/terms`}>
          <div
            className={styles.view_nav}
            style={{ background: `rgba(103, 103, 103, 0.06)` }}
          >
            <h3>Terms and Conditions</h3>
          </div>
        </Link>
      </div>
      {activity ? (
        <section className={styles.terms_container}>
          <div className={styles.terms_page}>
            <div className={styles.header}>
              <div className={styles.logo}>
                <h3>Minerva</h3>
                <img src="/assets/Logo.png" alt="" />
              </div>
              <h3 className={styles.title}>{activity.title}</h3>
              <div className={styles.date}>
                <h3>{getOrderedDate(activity.date_created)}</h3>
              </div>
            </div>
            <hr />
            <div className={styles.body}>
              <p>{activity.desc}</p>
              <h4>Terms and Conditions</h4>
              {activity.terms.map((term, index) => {
                return (
                  <div className={styles.term} key={index + 1}>
                    <h3>
                      {index + 1}. {term.termTitle}
                    </h3>
                    <p>{term.termDescription}</p>
                  </div>
                );
              })}
            </div>
            <div className={styles.footer}>
              <h3>Signed between the parties:-</h3>
              <div className={styles.addresses}>
                <h3>Owner: </h3>
                <h4>#{account ? account : null}</h4>
              </div>
              <div className={styles.addresses}>
                <h3>Contract Address: </h3>
                <h4>#{contractAddresses[chainId]}</h4>
              </div>
              <div className={styles.addresses}>
                <h3>Mediator: </h3>
                <h4>Minerva</h4>
              </div>
              <div className={styles.addresses}>
                <h3>Activity ID: </h3>
                <h4>#{activity.id}</h4>
              </div>
            </div>
          </div>
          <button
            onClick={async () => {
              const response = await getActivity();
              console.log(response);
            }}
          ></button>
        </section>
      ) : (
        <Loading />
      )}
    </ActivityProfilePage>
  );
};

export default Discussions;
