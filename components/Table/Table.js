import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";

const Row = ({ object, isImage, index }) => {
  return (
    <>
      <td>{index + 1}.</td>
      {Object.keys(object).includes(
        "image_logo" || "profile_pic" || "image" || "logo" || "image_url"
      )
        ? Object.keys(object).map((key, index) => {
            return (
              <td key={index}>
                {isImage &&
                key ===
                  ("image_logo" ||
                    "profile_pic" ||
                    "image" ||
                    "logo" ||
                    "image_url") ? (
                  <>
                    <div className={styles.profile}>
                      <Image src={object[key]} height={30} width={30}></Image>
                    </div>
                  </>
                ) : null}
                <p>{object[Object.keys(object)[index + 1]]}</p>
              </td>
            );
          })
        : Object.keys(object).map((key, index) => {
            return (
              <td
                style={index == 0 ? { marginTop: "0.5rem" } : null}
                key={index}
              >
                <p>{object[key]}</p>
              </td>
            );
          })}
    </>
  );
};
const Table = ({ headers, data, isImage }) => {
  return (
    <section className={styles.section}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => {
              return <th key={index}>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((object, index) => {
            return (
              <tr key={index}>
                <Row
                  key={index}
                  object={object}
                  isImage={isImage}
                  index={index}
                ></Row>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default Table;
