import React from "react";
import styles from "./styles.module.css";
import spliceTag from "../../utils/spliceTags";
import { Loading } from "web3uikit";
import Link from "next/link";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryTag from "../CategoryTag/CategoryTag";
const Tag = CategoryTag;

const Card = ({ activity }) => {
  return (
    <div className={styles.card}>
      <div className={styles.layer}>
        <Link href={`/explore/${activity.id}/overview`}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faEye} color={"white"}></FontAwesomeIcon>
          </div>
        </Link>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faFlag} color={"white"}></FontAwesomeIcon>
        </div>
      </div>
      <img src={activity.logo} alt="" />
      <div className={styles.inner_container}>
        <div className={styles.space_between}>
          <h3 className={styles.activity_title}>
            {activity.title.length > 20
              ? `${activity.title.slice(0, 20)}...`
              : activity.title}
          </h3>
          <Tag
            tagText={`$${activity.join_price}`}
            fontSize={"16px"}
            title={"Joining Price"}
          ></Tag>
        </div>
        <div className={styles.space_between} style={{ marginBottom: `0px` }}>
          <h4 title={activity.desc} className={styles.activity_desc}>
            {activity.desc.length > 40
              ? `${activity.desc.slice(0, 40)}...`
              : activity.desc}
          </h4>
          <div className={styles.tags} title={"Activity Tags"}>
            <Tag
              tagText={
                spliceTag(activity.tags)[0].length > 5
                  ? `${spliceTag(activity.tags)[0].slice(0, 6)}..`
                  : spliceTag(activity.tags)[0]
              }
              title={activity.tags}
            ></Tag>
            {/* <Tag
              tagText={
                spliceTag(activity.tags)[1].length > 5
                  ? `${spliceTag(activity.tags)[1].slice(0, 6)}..`
                  : spliceTag(activity.tags)[1]
              }
            ></Tag> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Cards = ({ activities }) => {
  return (
    <section>
      {activities ? (
        <div className={styles.card_container}>
          <div className={styles.card_container}>
            {activities.map((activity, index) => {
              return (
                <div key={index}>
                  <Card activity={activity} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.loader}>
          <Loading />
        </div>
      )}
    </section>
  );
};

export default Cards;
