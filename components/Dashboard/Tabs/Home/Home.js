import React, { useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { isUserLogged } from "../../../../utils/api/validateUser";
import { ActivityContext } from "../../../../pages/dashboard/[activityId]/[tab]";
import Image from "next/image";

const Home = () => {
  const router = useRouter();
  const activity = useContext(ActivityContext);

  const isLogged = async () => {
    const isLogged = await isUserLogged();
    if (!isLogged) {
      router.replace("/login");
    }
  };
  useEffect(() => {
    isLogged();
    console.log(activity);
  }, []);

  return (
    <>
      {activity ? (
        <section className={styles.section_1}>
          <div className={styles.activity_info}>
            <div className={styles.activity_logo}>
              <div className={styles.logo_wrapper}>
                <Image src={activity.logo} height={55} width={55} />
              </div>
            </div>
            <h1 className={styles.activity_title}>{activity.title}</h1>
          </div>
          <div className={styles.activity_info}>
            <div className={styles.activity_details}>
              <h2>{activity.difficulty_level}</h2>
              <h3>level</h3>
            </div>
            <div className={styles.activity_details}>
              <h2>
                {activity.members.length}/{activity.member_limit}
              </h2>
              <h3>Members</h3>
            </div>
          </div>
        </section>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default Home;
