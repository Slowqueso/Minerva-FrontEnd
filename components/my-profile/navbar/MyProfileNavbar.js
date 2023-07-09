import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";

const MyProfileNavbar = () => {
  return (
    <>
      <div className={styles.account_navbar}>
        <Link href="/my-profile/info">AccountInfo</Link>
        <Link href="/my-profile/privacy">Privacy</Link>
        <Link href="/my-profile/security">Security</Link>
        <Link href="/my-profile/add-profile">Add profile</Link>
        {/* <Link href="/my-profile/edit-profile">Edit profile</Link> */}
      </div>
    </>
  );
};

export default React.memo(MyProfileNavbar);
