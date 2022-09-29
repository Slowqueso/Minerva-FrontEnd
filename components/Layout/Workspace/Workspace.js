import styles from "./styles.module.css";
const Workspace = ({ children }) => {
  return <div className={styles.workspace}>{children}</div>;
};

export default Workspace;
