import React, { useState, useEffect } from "react";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Modal = ({ activityOwner, comments, activityId, selectedComment, setMoreOption, setComments, setEditMode, fetchUserInfo }) => {
  console.log(selectedComment);
  const [isCurrentUserComment, setIsCurrentUserComment] = useState(false);
  const [isActivityOwner, setIsActivityOwner] = useState(false);

  const Cancel = () => {
    setMoreOption(false);
  };
  
  const Delete = async () => {
    if(confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/deletecomment",
          {
            activityId: activityId,
            commentId: selectedComment._id,
          }, 
          {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        });
        if (response.data) {
          console.log(response.data.msg);
          const updatedComments = comments.filter((comment) => comment._id !== selectedComment._id);
          setComments(updatedComments);
          setMoreOption(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const Restrict = async () => {
    if(confirm("Are you sure you want to Restrict this comment?")) {
      try {
        const response = await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/restrictcomment",
          {
            activityId: activityId,
            commentId: selectedComment._id,
          }, 
          {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        });
        if (response.data) {
          console.log(response.data.msg);
          const updatedComments = comments.map((comment) => {
            if (comment._id === selectedComment._id) {
              comment.isRestricted = true;
            }
            return comment;
          });
          setComments(updatedComments);
          setMoreOption(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const Unrestrict = async () => {
    if(confirm("Are you sure you want to Unrestrict this comment?")) {
      try {
        const response = await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/unrestrictcomment",
          {
            activityId: activityId,
            commentId: selectedComment._id,
          }, 
          {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        });
        if (response.data) {
          console.log(response.data.msg);
          const updatedComments = comments.map((comment) => {
            if (comment._id === selectedComment._id) {
              comment.isRestricted = false;
            }
            return comment;
          });
          setComments(updatedComments);
          setMoreOption(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const Edit = () => {
    setEditMode(true);
    setMoreOption(false);
  };

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await fetchUserInfo();
        setIsCurrentUserComment(currentUser === selectedComment.user_id);
        setIsActivityOwner(activityOwner === currentUser);
      } catch (error) {
        console.log(error);
      }
    };
    checkCurrentUser();
  }, [selectedComment]);


  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          {isActivityOwner && !isCurrentUserComment && (
            !selectedComment.isRestricted ? (
              <>
                <p className={styles.options} onClick={Restrict}>Restrict</p>
              </>
            ) : (
              <>
                <p className={styles.options} onClick={Unrestrict}>Unrestrict</p>
              </>
            )
          )}
          {isCurrentUserComment && (
            <>
              <p className={styles.options} onClick={Edit}>Edit</p>
              <p className={styles.options} onClick={Delete}>Delete</p>
            </>
          )}
          {!isCurrentUserComment && !selectedComment.isRestricted && (
            <>
              <p className={styles.options} onClick={() => console.log("Report")}>Report</p>
            </>
          )}
          <p className={styles.options} onClick={Cancel}>Cancel</p>
        </div>
      </div>
    </>
  );
};

export default Modal;
