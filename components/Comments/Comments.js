import React, { useState, useEffect } from "react";
import axios from "axios";
import ENV from "../../static_files/hostURL";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Modal from "../CommentsMoreOptionModal/Modal";

const Comments = ({ activityId, activityOwner }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const isLoggedIn = !!localStorage.getItem("_USID");

  const fetchUserInfo = async () => {
    try {
      if (!isLoggedIn) {
        return;
      } else {
        const response = await axios.get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/info", {
          headers: {
            "x-access-token": localStorage.getItem("_USID"),
          },
        });
        if (response.data) {
          return response.data.user.id;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async (activityId) => {
    try {
      const response = await axios.get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/allcomments/" + activityId, {
        headers: {
          "x-access-token": localStorage.getItem("_USID"),
        },
      });
      if (response.data && response.data.comments.length > 0) {
        const updatedComments = await Promise.all(response.data.comments.map(async (comment) => {
          const user = await fetchUser(comment.user_id);
          if (user) {
            comment.username = user.user.username;
            comment.profile_pic = user.user.profile_pic;
          }
          return comment;
        }));
        setComments(updatedComments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/get-profile-by-uid/" + userId);
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

      try {
        const response = await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/comment",
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
          newCommentObj.user_id = response.data.uid;
          newCommentObj.isDeleted = false;
          newCommentObj.isRestricted = false;
          newCommentObj.username = user.user.username;
          newCommentObj.profile_pic = user.user.profile_pic;
          const updatedComments = [newCommentObj, ...comments];
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
                <span key={comment._id}>
                  <Comment activityOwner={activityOwner} comments={comments} activityId={activityId} comment={comment} isLoggedIn={isLoggedIn} setComments={setComments} fetchUserInfo={fetchUserInfo} />
                </span>
              );
            })}
          </>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {isLoggedIn ? (
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
      ) : (
        <p>Please<Link href="/login">login</Link> to comment.</p>
      )}
    </div>
  );
};


const Comment = ({ activityOwner, comments, activityId, comment, isLoggedIn, setComments, fetchUserInfo }) => {
  const [moreOption, setMoreOption] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [newEditComment, setNewEditComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await fetchUserInfo();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, [fetchUserInfo]);

  const handleOptionsClick = (comment) => {
    if(comment.isRestricted) {
      if(currentUser !== activityOwner){
        return;
      } else {
        setMoreOption(!moreOption);
        setSelectedComment(comment);
      }
    } else {
      setMoreOption(!moreOption);
      setSelectedComment(comment);
    }  
  };

  const handleEditCommentChange = (event) => {
    const inputComment = event.target.value;
    if (inputComment.length <= 200) {
      setNewEditComment(inputComment);
    }
  };

  const handleEditCommentSubmit = async (event) => {
    event.preventDefault();

    if (newEditComment.trim() !== "") {
      const editCommentObj = {
        activityId: activityId,
        commentId: selectedComment._id,
        comment: newEditComment,
      };

      try {
        const response = await axios.post(
          ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/editcomment",
          editCommentObj,
          {
            headers: {
              "x-access-token": localStorage.getItem("_USID"),
            },
          }
        );
        if (response.data.msg === "Comment updated") {
          const updatedComments = comments.map((comment) => {
            if (comment._id === selectedComment._id) {
              comment.comment = newEditComment;
            }
            return comment;
          });
          setComments(updatedComments);
          setEditMode(false);
          console.log(response.data.msg);
        } else {
          console.log(response.data.msg);
        }
      } catch (error) {
        console.log(error.response.data.msg);
      }
    }
  }

  useEffect(() => {
    setNewEditComment(comment.comment);
  }, [editMode]);

  return(
      <div className={styles.user_comment}>
        {moreOption && (
          <Modal activityOwner={activityOwner} comments={comments} activityId={activityId} selectedComment={selectedComment} setComments={setComments} setMoreOption={setMoreOption} setEditMode={setEditMode} fetchUserInfo={fetchUserInfo} />
        )}
        {isLoggedIn && (
          <button 
          className={styles.more_option}
          onClick = {() => handleOptionsClick(comment)}
        > ...
        </button>
        )}

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
          {comment.isRestricted && (
            <p className={styles.restricted}>Restricted</p>
          )}  
        </div>

        {editMode ? (
          <>
            <form className={styles.form} onSubmit={handleEditCommentSubmit}>
              <textarea
                className={styles.textarea}
                value={newEditComment}
                onChange={handleEditCommentChange}
                placeholder="Add a comment..."
                rows="1"
                cols="50"
                maxLength={200}
              ></textarea>
              <br />
              <p className={styles.character_count}>
                {newEditComment.length}/{200}
              </p>
              <br />
              <button className={styles.button} type="submit">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
            <p className={styles.button} onClick={() => setEditMode(false)}>Cancel</p>
          </>
        ) : (
          <p className={styles.commentContent}>{comment.comment}</p>
        )
      }
      
      </div>
  );
}


export default Comments;
