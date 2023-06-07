import React, { useState, useEffect } from "react";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Comments = ({ activityId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async (activityId) => {
    try {
      const response = await axios.get(
        ENV.PROTOCOL +
          ENV.HOST +
          ENV.PORT +
          "/activity/allcomments/" +
          activityId
      );
      if (response.data && response.data.comments.length > 0) {
        const updatedComments = await Promise.all(
          response.data.comments.map(async (comment) => {
            const user = await fetchUser(comment.user_id);
            if (user) {
              comment.username = user.user.username;
              comment.profile_pic = user.user.profile_pic;
            }
            return comment;
          })
        );
        setComments(updatedComments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(
        ENV.PROTOCOL +
          ENV.HOST +
          ENV.PORT +
          "/user/get-profile-by-uid/" +
          userId
      );
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments(activityId);
  }, [activityId]);

  const handleCommentChange = (event) => {
    const inputComment = event.target.value;
    if (inputComment.length <= 200) {
      setNewComment(inputComment);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (newComment.trim() !== "") {
      const newCommentObj = {
        activityId: activityId,
        comment: newComment,
      };

      // Post new comment
      try {
        const response = await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/commented",
          newCommentObj,
          {
            headers: {
              "x-access-token": localStorage.getItem("_USID"),
            },
          }
        );
        if (response.data.msg === "Activity commented") {
          newCommentObj._id = response.data.commentId;
          const user = await fetchUser(response.data.uid);
          newCommentObj.username = user.user.username;
          newCommentObj.profile_pic = user.user.profile_pic;
          const updatedComments = [...comments, newCommentObj];
          setComments(updatedComments);
          setNewComment("");
        } else {
          console.log(response.data.msg);
        }
      } catch (error) {
        console.log(error.response.data.msg);
      }
    }
  };

  return (
    <div className={styles.comment_container}>
      <h2 className={styles.comment_title}>Comments</h2>
      <div className={styles.comment_box}>
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => {
              return (
                <div className={styles.user_comment} key={comment._id}>
                  <div className={styles.User}>
                    {comment.profile_pic ? (
                      <img
                        className={styles.profile_pic}
                        src={comment.profile_pic}
                        alt={comment.username}
                      />
                    ) : (
                      <img
                        className={styles.profile_pic}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                        alt="default_profile"
                      />
                    )}
                    <h3 className={styles.username}>{comment.username}</h3>
                    {/* {isCurrentUser(comment.user_id) && (
                    <div className={styles.EditOption} onClick={() => handleEditComment(comment._id)}>
                      Edit
                    </div>
                  )} */}
                  </div>
                  <p className={styles.commentContent}>{comment.comment}</p>
                </div>
              );
            })}
          </>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <form className={styles.form} onSubmit={handleCommentSubmit}>
        <textarea
          className={styles.textarea}
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
          rows="1"
          cols="50"
          maxLength={200}
        ></textarea>
        <br />
        <p className={styles.character_count}>
          {newComment.length}/{200}
        </p>
        <br />
        <button className={styles.button} type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </div>
  );
};

export default Comments;
