import React from 'react';
import styles from './styles.module.css';

const ActivitySuggestions = (getHint) => {
  console.log(getHint)
  
  return (
    <div className={styles.suggestions_container}>
        <h2>Activity Hints</h2>

        <div className={styles.suggestion}>
            <div className={styles.suggestion_image}>
                <img src="/assets/default_profile.svg" alt="Activity Suggestions 1" />
            </div>
            <div className={styles.inner_div}>
                <h3>Activity Name</h3>
                <p>Make sure your activity description is concise and easy to understand.</p>
            </div>
        </div>
    </div>
  )
}

export default ActivitySuggestions;