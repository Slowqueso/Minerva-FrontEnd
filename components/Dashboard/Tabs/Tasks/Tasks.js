import { React, useState } from 'react';
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";

const Tasks = () => {
    const [isCurrentTaskOpen, setCurrentTaskIsOpen] = useState(false); // state for form visibility
    const toggleCurrentTasks = () => {
        setCurrentTaskIsOpen(!isCurrentTaskOpen);
    };

    const [isAllTaskOpen, setAllTaskIsOpen] = useState(false); // state for form visibility
    const toggleAllTasks = () =>{
        setAllTaskIsOpen(!isAllTaskOpen)
    };
    return (
        <>
            <section className={styles.taskSection}>
                <button className={styles.dropdownBtn} onClick={toggleCurrentTasks}>
                    <h3>Current Tasks</h3>
                    <span className={`${styles.arrow} ${isCurrentTaskOpen ? styles.active : ""}`}><h3>&#9662;</h3></span>
                </button>
                <div
                    className={`${styles.dropdownContent} ${isCurrentTaskOpen && styles.show
                        }`}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.centerLine}>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>                 
                    </div>
                </div>

                <button className={styles.dropdownBtn} onClick={toggleAllTasks}>
                    <h3>All Tasks</h3>
                    <span className={`${styles.arrow} ${isAllTaskOpen ? styles.active : ""}`}><h3>&#9662;</h3></span>
                </button>
                <div
                    className={`${styles.dropdownContent} ${isAllTaskOpen && styles.show
                        }`}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.centerLine}>
                        </div>
                        <div className={styles.row}>
                            <section>
                                <FontAwesomeIcon icon={faSitemap} color={"#939393"} className={styles.icon}></FontAwesomeIcon>
                                <div className={styles.details}>
                                    <span className={styles.title}>Task Title.....</span>
                                    <div className={styles.user_info}>
                                        <div className={styles.user_img}>
                                            <img src="3.jfif" alt="user_img" />
                                        </div>
                                        <div className={styles.user_name}>
                                            <p>John Doe <span> assigned on 12/03/2002</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.due_date}>
                                    <p>Due Date: 12/03/2002</p>
                                </div>
                                <div className={styles.reward_amount}>
                                    <p>Credits: 1000</p>
                                </div>
                                <div className={styles.amount}><span>
                                &#x0024;20
                                </span></div>
                                <div className={styles.view}>
                                    <a href="#">View</a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

            </section>

        </>
    )
}

export default Tasks