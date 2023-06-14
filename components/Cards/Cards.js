import React from "react";
import styles from "./styles.module.css";
import spliceTag from "../../utils/spliceTags";
import { Loading } from "web3uikit";
import Link from "next/link";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryTag from "../CategoryTag/CategoryTag";
const Tag = CategoryTag;

const Card = ({ activity }) => {
  return (
    <div className={styles.card}>
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

const Cardv3 = ({ activity }) => {
  return (
    <div className={styles.grid}>
      <div className={styles.cardv3}>
        <img src={activity.logo} className={styles.activity_logo} alt="" />
        <div className={styles.inner_container}>
          <div className={styles.title_container}>
            <p>Verified <span><FontAwesomeIcon icon={faCircleCheck} style={{ color: "#64cf8f", }} /></span></p>
            <h4>Activity Title</h4>
          </div>

          <div className={styles.space_between}>
            <div className={styles.inner__container}>
              <span>80</span>
              <p>upvotes</p>
            </div>
            <div className={styles.inner__container}>
              <span>3/8</span>
              <p>members</p>
            </div>
            <div className={styles.inner__container}>
              <span>01</span>
              <p>level</p>
            </div>
          </div>

          <div className={styles.desc_container}>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, quibusdam, quia, quod voluptates voluptatem
              consequuntur quos voluptate quas quibusdam, quia, quod voluptates
              voluptatem consequuntur quos voluptate quas
            </p>

          </div>

          <div className={styles.price_container}>
            <Link href={`/explore/${activity.public_ID}/overview`}>

              <div className={styles.view_btn}>
                <button>View</button>
              </div>
            </Link>
            <div className={styles.flag_btn}>
              <button>Flag</button>
            </div>
            <div className={styles.flag_btn}>
              <button>Join Price <span>${activity.join_price}</span></button>

            </div>
          </div>

          <div className={styles.background}>
            <div className={styles.tiles}>
              <div className={`${styles.tile} ${styles.tile_1}`}></div>
              <div className={`${styles.tile} ${styles.tile_2}`}></div>
              <div className={`${styles.tile} ${styles.tile_3}`}></div>
              <div className={`${styles.tile} ${styles.tile_4}`}></div>

              <div className={`${styles.tile} ${styles.tile_5}`}></div>
              <div className={`${styles.tile} ${styles.tile_6}`}></div>
              <div className={`${styles.tile} ${styles.tile_7}`}></div>
              <div className={`${styles.tile} ${styles.tile_8}`}></div>

              <div className={`${styles.tile} ${styles.tile_9}`}></div>
              <div className={`${styles.tile} ${styles.tile_10}`}></div>
            </div>

            <div className={`${styles.line} ${styles.line_1}`}></div>
            <div className={`${styles.line} ${styles.line_2}`}></div>
            <div className={`${styles.line} ${styles.line_3}`}></div>

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
                  <Cardv3 activity={activity} />
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
