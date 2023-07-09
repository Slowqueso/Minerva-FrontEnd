import styles from "./styles.module.css";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className={`${styles.logo_container} unselectable`}>
        <img src="/assets/Minerva-new.png" className={"unselectable"} alt="" />
        <h3 className={`${styles.logo_text} unselectable`}>Minerva</h3>
      </div>
    </Link>
  );
};

export const LogoInLine = () => {
  return (
    <Link href={"/"}>
      <div
        className={`${styles.logo_container} ${styles.logo_container_inline} unselectable`}
      >
        <img src="/assets/Minerva-new.png" className={"unselectable"} alt="" />
        <h3 className={`${styles.logo_text} unselectable`}>Minerva</h3>
      </div>
    </Link>
  );
};

export default Logo;
