import styles from "./styles.module.css";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className={`${styles.logo_container} unselectable`}>
        <h3 className={`${styles.logo_text} unselectable`}>Minerva</h3>
        <img src="/assets/Logo.png" className={"unselectable"} alt="" />
      </div>
    </Link>
  );
};

export default Logo;
