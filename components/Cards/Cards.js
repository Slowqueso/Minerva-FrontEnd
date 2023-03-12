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
      {/* <div className={styles.layer}>
        
      </div> */}
      <img src={activity.logo} className={styles.activity_logo} alt="" />
      <div className={styles.inner_container}>
        <div className={styles.space_between}>
          <h3 className={styles.activity_title}>
            {activity.title.length > 20
              ? `${activity.title.slice(0, 20)}...`
              : activity.title}
          </h3>
          <Tag
            tagText={`$${activity.join_price}`}
            fontSize={"12px"}
            title={"Joining Price"}
          ></Tag>
        </div>
        <div className={styles.space_between} style={{ marginBottom: `0px` }}>
          <h4 title={activity.desc} className={styles.activity_desc}>
            {activity.desc.length > 40
              ? `${activity.desc.slice(0, 160)}...`
              : activity.desc}
          </h4>

          {/* <div className={styles.tags} title={"Activity Tags"}>
            <Tag
              tagText={
                spliceTag(activity.tags)[0].length > 5
                  ? `${spliceTag(activity.tags)[0].slice(0, 6)}..`
                  : spliceTag(activity.tags)[0]
              }
              title={activity.tags}
            ></Tag>
          </div> */}
        </div>
        <Link href={`/explore/${activity.public_ID}/overview`}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faEye} color={"white"}></FontAwesomeIcon>
          </div>
        </Link>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faFlag} color={"white"}></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
};

const Cardv2 = ({ activity }) => {
  return (
    <div className={styles.cardv2}>
      <div
        className={styles.cardv2_inner}
        style={{
          backgroundImage: `url(${activity.logo})`,
        }}
      >
        <div className={styles.content}>
          <h3 className={styles.title}>{activity.title}</h3>
          <p className={styles.desc}>
            {activity.desc.length > 40
              ? `${activity.desc.slice(0, 80)}...`
              : activity.desc}
          </p>
          <Tag
            tagText={`$${activity.join_price}`}
            fontSize={"12px"}
            title={"Joining Price"}
          ></Tag>
          <div className="space-between">
            <Link href={`/explore/${activity.public_ID}/overview`}>
              <button>Learn More</button>
            </Link>
            <button>Flag It</button>
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
                <div style={{ display: "flex" }} key={index}>
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
