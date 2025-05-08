import React from "react";
import styles from "./index.module.css";

const RestrictedAccess = () => {
  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.lock}></div>
        <div className={styles.message}>
          <div className={styles.heading}>
            Access to this page is restricted
          </div>
          <p>
            Please check with the site admin if you believe this is a mistake.
          </p>
        </div>
      </div>
    </>
  );
};

export default RestrictedAccess;
