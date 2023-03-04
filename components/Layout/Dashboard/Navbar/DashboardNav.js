import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

const NavItem = ({ labelText, href, key, activityId }) => {
  return (
    <Link href={`../${activityId}/${href}`} key={key}>
      <li className={styles.nav_item}>{labelText}</li>
    </Link>
  );
};

const DashboardNav = ({ NavList }) => {
  const router = useRouter();
  const { activityId, tab } = router.query;
  return (
    <>
      <nav className={styles.dashboard_nav}>
        <ul className={styles.nav_list}>
          <h3 className={styles.nav_item_header}>activity</h3>
          {NavList.Activity.map((item, index) => {
            return (
              <NavItem
                labelText={item.labelText}
                href={item.href}
                key={index}
                activityId={activityId}
              />
            );
          })}
          <h3 className={styles.nav_item_header}>Tasks</h3>
          {NavList.Tasks.map((item, index) => {
            return (
              <NavItem
                labelText={item.labelText}
                href={item.href}
                key={index}
                activityId={activityId}
              />
            );
          })}
          <h3 className={styles.nav_item_header}>apps</h3>
          {NavList.Apps.map((item, index) => {
            return (
              <NavItem
                labelText={item.labelText}
                href={item.href}
                // key={index}
                activityId={activityId}
              />
            );
          })}
          <h3 className={styles.nav_item_header}>user management</h3>
          {NavList.User_management.map((item, index) => {
            return (
              <NavItem
                labelText={item.labelText}
                href={item.href}
                // key={index}
                activityId={activityId}
              />
            );
          })}
          <h3 className={styles.nav_item_header}>Moderations</h3>
          {NavList.Moderation.map((item, index) => {
            return (
              <NavItem
                labelText={item.labelText}
                href={item.href}
                // key={index}
                activityId={activityId}
              />
            );
          })}
          <h3 className={styles.nav_item_header}>Discussions</h3>
          {NavList.Discussions.map((item, index) => {
            return (
              <NavItem
                labelText={item.labelText}
                href={item.href}
                // key={index}
                activityId={activityId}
              />
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default DashboardNav;
