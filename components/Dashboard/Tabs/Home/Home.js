import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { isUserLogged } from "../../../../utils/api/validateUser";
import { ActivityContext } from "../../../../pages/dashboard/[activityId]/[tab]";
import DataCard from "../../DataCard/DataCard";
import {
  faEye,
  faDollarSign,
  faCommentAlt,
  faThumbsUp,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import axios from "axios";
import ENV from "../../../../static_files/hostURL";
import { Loading } from "web3uikit";
import SelectMenu from "../../../form/SelectMenu";

const Home = () => {
  const router = useRouter();
  const activity = useContext(ActivityContext);
  const [lastviews, setLastViews] = useState(0);
  const [lastdonations, setLastDonations] = useState(0);
  const [lastcomments, setLastComments] = useState(0);
  const [lastupvotes, setLastUpvotes] = useState(0);
  const [join_requests, setJoinRequests] = useState([]);

  const [viewlabels, setviewLabels] = useState([]);
  const [viewdata, setviewData] = useState([]);
  const [donationlabels, setdonationLabels] = useState([]);
  const [donationdata, setdonationData] = useState([]);
  const [commentlabels, setcommentLabels] = useState([]);
  const [commentdata, setcommentData] = useState([]);
  const [upvotelabels, setupvoteLabels] = useState([]);
  const [upvotedata, setupvoteData] = useState([]);

  const [activityStatus, setActivityStatus] = useState(0);

  const isLogged = async () => {
    const isLogged = await isUserLogged();
    if (!isLogged) {
      router.replace("/login");
    }
  };

  const handleActivityStatus = async () => {
    await axios
      .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/toggle-status`, {
        headers: {
          "x-activity-id": activity.id,
          "x-access-token": localStorage.getItem("_USID"),
        },
      })
      .then((res) => {
        setActivityStatus(!activityStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const hudload = async () => {
    var ts = Math.round(new Date().getTime() / 1000);
    var tsYesterday = ts - 24 * 3600;
    var past = new Date(tsYesterday * 1000);

    await axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/lastviews`, {
        activityId: activity.id,
        start: past,
      })
      .then((res) => {
        setLastViews(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/lastupvotes`, {
        activityId: activity.id,
        start: past,
      })
      .then((res) => {
        setLastUpvotes(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/lastdonations`, {
        activityId: activity.id,
        start: past,
      })
      .then((res) => {
        setLastDonations(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/lastcomments`, {
        activityId: activity.id,
        start: past,
      })
      .then((res) => {
        setLastComments(res.data.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const timestampcounter = (temp) => {
    const timestamps = temp;
    // Create a new Date object for the current date
    const now = new Date().getTime();

    // Create an object to hold the counts for each day
    const counts = {};
    for (let i = 7; i > 0; i--) {
      // Get the date for this day
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Format the date as YYYY-MM-DD
      const formattedDate = date.toISOString().split("T")[0];

      // Set the value for this date to zero in the data object
      counts[formattedDate] = 0;
    }
    timestamps.sort();
    // Loop through the timestamps and filter out any that are more than 7 days old
    timestamps
      .filter((timestamp) => (now - timestamp) / (1000 * 60 * 60 * 24) <= 7)
      .forEach((timestamp) => {
        // Create a new Date object for the current timestamp
        const date = new Date(timestamp);

        // Get the date portion of the timestamp (YYYY-MM-DD format)
        const dateStr = date.toISOString().split("T")[0];

        // Increment the count for this date in the counts object
        if (counts[dateStr]) {
          counts[dateStr]++;
        } else {
          counts[dateStr] = 1;
        }
      });
    return counts;
  };

  const loadchart = async () => {
    var ts = Math.round(new Date().getTime() / 1000);
    var tsYesterday = ts - 7 * 24 * 3600;
    var past = new Date(tsYesterday * 1000);

    const timestamps = [];
    await axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/lastviews`, {
        activityId: activity.id,
        start: past,
      })
      .then((res) => {
        res.data.forEach((element) => {
          timestamps.push(new Date(element).getTime());
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setviewLabels(Object.keys(timestampcounter(timestamps)));
    setviewData(Object.values(timestampcounter(timestamps)));

    timestamps = [];
    await axios
      .post(ENV.PROTOCOL + ENV.HOST + ENV.PORT + `/activity/lastupvotes`, {
        activityId: activity.id,
        start: past,
      })
      .then((res) => {
        res.data.forEach((element) => {
          timestamps.push(new Date(element).getTime());
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setupvoteLabels(Object.keys(timestampcounter(timestamps)));
    setupvoteData(Object.values(timestampcounter(timestamps)));
  };

  const join_request = async (token) => {
    await axios
      .post(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/displayjoinrequests",
        {
          activityId: activity.id,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        setJoinRequests(res.data.join_requests);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const accept_request = async (request) => {
    const token = localStorage.getItem("_USID");
    await axios
      .post(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/joinaccepted",
        {
          activityId: activity.id,
          userId: request.user_id,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        join_request(token); //refresh
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const reject_request = async (request) => {
    const token = localStorage.getItem("_USID");

    await axios
      .post(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/joinrejected",
        {
          activityId: activity.id,
          userId: request.user_id,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        join_request(token); //refresh
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    isLogged();
    hudload();
    loadchart();
    join_request(token);

    axios
      .get(
        ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/info/isOpen",
        {
          headers: {
            "x-activity-id": activity.id,
          },
        }
      )
      .then((res) => {
        setActivityStatus(res.data.isOpen);
      })
      .catch((err) => {
        console.log(err);
      });

    // axios
    //   .post(
    //     ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/activity/viewed",
    //     {
    //       activityId: activity.id,
    //     },
    //     {
    //       headers: {
    //         "x-access-token": token,
    //       },
    //     }
    //   )
    //   .then((res) => {})
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  useEffect(() => {
    setChartData({
      labels: viewlabels,
      datasets: [
        {
          label: "Views",
          data: viewdata,

          borderColor: "#7900FF",
          borderWidth: 2,
          cubicInterpolationMode: "monotone",
        },
        {
          label: "Upvotes",
          data: upvotedata,

          borderColor: "#FF0006",
          borderWidth: 2,
          cubicInterpolationMode: "monotone",
        },
      ],
    });
  }, [viewlabels, viewdata, upvotedata]);

  const [chartData, setChartData] = useState({
    labels: viewlabels,
    datasets: [
      {
        label: "Views ",
        data: viewdata,

        borderColor: "#7900FF",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
      },
      {
        label: "Upvotes",
        data: upvotedata,

        borderColor: "#FF0006",
        borderWidth: 2,
        cubicInterpolationMode: "monotone",
      },
    ],
  });

  const Requestcard = (request) => {
    return (
      <>
        <div className={styles.join_request}>
          <div className={styles.join_request_user}>
            <div className={styles.join_request_user_logo}>
              <Image
                src={
                  request.request.profile_pic
                    ? request.request.profile_pic
                    : "/assets/default_profile.svg"
                }
                height={41}
                width={41}
              />
            </div>
            <div className={styles.join_request_user_info}>
              <h1>{request.request.name}</h1>
              <h2>REP: {request.request.rep}</h2>
            </div>
          </div>
          <div className={styles.join_request_buttons}>
            <button
              className={styles.join_request_button_accept}
              onClick={() => accept_request(request.request)}
            >
              <FontAwesomeIcon icon={faCheck} size="sm" color="#EFEFEF" />
            </button>
            <button
              className={styles.join_request_button_decline}
              onClick={() => reject_request(request.request)}
            >
              <FontAwesomeIcon icon={faXmark} size="sm" color="#EFEFEF" />
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {activity ? (
        <>
          <section className={styles.section_1}>
            <div className={styles.activity_info}>
              <div className={styles.activity_logo}>
                <div className={styles.logo_wrapper}>
                  <Image src={activity.logo} height={55} width={55} />
                </div>
              </div>
              <h1 className={styles.activity_title}>{activity.title}</h1>
            </div>
            <div className={styles.activity_info}>
              <div className={styles.activity_details}>
                <h2>{activity.difficulty_level}</h2>
                <h3>level</h3>
              </div>
              <div className={styles.activity_details}>
                <h2>
                  {activity.members.length}/{activity.member_limit}
                </h2>
                <h3>Members</h3>
              </div>
            </div>
          </section>
          <section className={styles.section_2}>
            <div className={styles.card_container}>
              <DataCard
                label={"Views"}
                icon={faEye}
                data={lastviews}
              ></DataCard>
              <DataCard
                icon={faDollarSign}
                data={lastdonations}
                label={"Donations"}
              ></DataCard>
              <DataCard
                icon={faCommentAlt}
                label={"Comments"}
                data={lastcomments}
              ></DataCard>
              <DataCard
                icon={faThumbsUp}
                label={"Upvotes"}
                data={lastupvotes}
              ></DataCard>
            </div>
          </section>
          <section className={styles.section_3}>
            <div className={styles.chart_container}>
              <h1>Weekly Chart</h1>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  interaction: {
                    intersect: false,
                  },
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                  scales: {
                    x: {
                      display: true,
                      grid: {
                        color: "#ffffff",
                      },
                    },
                    y: {
                      display: true,
                      grid: {
                        color: "#ffffff",
                      },
                      // beginAtZero: true,
                    },
                  },
                }}
              />
              <div className={styles.settings}>
                <h1>Settings</h1>
                <div className="space-between">
                  <h2>Activity Status</h2>
                  <div className={styles.select_menu}>
                    <SelectMenu
                      objectArray={[
                        { label: "Open", value: true },
                        { label: "Closed", value: false },
                      ]}
                      name="activity_status"
                      value={activityStatus}
                      changeHandler={handleActivityStatus}
                    />
                  </div>
                </div>
                <p>
                  Update the visibility and accessbility of your Activity in
                  Minerva
                </p>
              </div>
            </div>
            <div className={styles.join_request_container}>
              <h1>Join Requests - {join_requests.length}</h1>
              <div id={styles.style_1}>
                {join_requests.map((request) => {
                  return (
                    <Requestcard key={request.user_id} request={request} />
                  );
                })}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};

export default Home;
