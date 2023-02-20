import React from "react";
import styles from "../styles.module.css";
import FullLayout from "../../../components/Layout/FullLayout";
import MyProfileNavbar from "../../../components/my-profile/navbar/MyProfileNavbar";
import TextBox from "../../../components/form/textBox";
import TextArea from "../../../components/form/TextArea";
import FormError from "../../../components/form/formError";
import SubmitButton from "../../../components/form/SubmitButton";
import axios from "axios";
import ENV from "../../../static_files/hostURL";

const AddProfile = () => {
  const [name_of_institution, setNameOfInstitution] = React.useState("");
  const [student_email, setStudentEmail] = React.useState("");
  const [degree, setDegree] = React.useState("");
  const [course_name, setCourseName] = React.useState("");
  const [course_duration, setCourseDuration] = React.useState("");
  const [field_of_study, setFieldOfStudy] = React.useState("");
  const [join_date, setJoinDate] = React.useState("");
  const [grade, setGrade] = React.useState("");

  const [company_name, setCompanyName] = React.useState("");
  const [job_designation, setJobDesignation] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [job_description, setJobDescription] = React.useState("");
  const [qualifications, setQualifications] = React.useState("");

  const [studentError, setStudentError] = React.useState("");
  const [jobError, setJobError] = React.useState("");

  const [isStudentOpen, setStudentIsOpen] = React.useState(false); // state for form visibility
  const toggleStudentForm = () => {
    setStudentIsOpen(!isStudentOpen);
  };

  const [isJobOpen, setJobIsOpen] = React.useState(false); // state for form visibility
  const toggleJobForm = () => {
    setJobIsOpen(!isJobOpen);
  };

  const handleStudentValidation = () => {
    if (
      name_of_institution === "" ||
      student_email === "" ||
      degree === "" ||
      course_name === "" ||
      course_duration === "" ||
      field_of_study === "" ||
      join_date === "" ||
      grade === ""
    ) {
      return "Please fill all the fields";
    } else if (!student_email.includes("@") || !student_email.includes(".")) {
      return "Please enter a valid email address";
    } else return null;
  };
  const handleJobValidation = () => {
    if (
      company_name === "" ||
      job_designation === "" ||
      location === "" ||
      job_description === "" ||
      qualifications === ""
    ) {
      return "Please fill all the fields";
    } else return null;
  };

  const handleStudentSubmit = () => {
    if (!handleStudentValidation()) {
      const data = {
        name_of_institution,
        student_email,
        degree,
        course_name,
        course_duration,
        field_of_study,
        join_date,
        grade,
      };
      const token = localStorage.getItem("_USID");
      if (!token) {
        router.push("/login");
      } else {
        axios
          .post(
            ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/addstudentprofile",
            data,
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setStudentError(handleStudentValidation());
    } else {
      setStudentError(handleStudentValidation());
    }
  };
  const handleJobSubmit = () => {
    if (!handleJobValidation()) {
      const data = {
        company_name,
        job_designation,
        location,
        job_description,
        qualifications,
      };
      const token = localStorage.getItem("_USID");
      if (!token) {
        router.push("/login");
      } else {
        axios
          .post(
            ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/addjobprofile",
            data,
            {
              headers: {
                "x-access-token": token,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setJobError(handleJobValidation());
    } else {
      setJobError(handleJobValidation());
    }
  };

  return (
    <>
      <FullLayout>
        <div className={styles.my_profile}>
          <MyProfileNavbar />
          <div className={styles.add_profile}>
            <h1>Add Profile</h1>

            <button className={styles.dropdownBtn} onClick={toggleStudentForm}>
              <h3>Student Profile</h3>{" "}
            </button>
            <div
              className={`${styles.dropdownForm} ${
                isStudentOpen && styles.show
              }`}
            >
              <form>
                <div className="flex">
                  <TextBox
                    label={"Name of Institution"}
                    placeholder={"NameOfInstitution"}
                    inputUpdate={setNameOfInstitution}
                  />
                </div>
                <div className="flex">
                  <TextBox
                    label={"Student Email"}
                    placeholder={"StudentEmail"}
                    inputUpdate={setStudentEmail}
                  />
                </div>
                <div className="flex">
                  <TextBox
                    label={"Degree"}
                    placeholder={"Degree"}
                    inputUpdate={setDegree}
                  />
                </div>
                <div className={styles.twobytwo}>
                  <div className="flex">
                    <TextBox
                      label={"Course Name"}
                      placeholder={"Course"}
                      inputUpdate={setCourseName}
                    />
                  </div>
                  <div className="flex">
                    <TextBox
                      label={"Course Duration"}
                      placeholder={"CourseDuration"}
                      inputUpdate={setCourseDuration}
                    />
                  </div>
                  <div className="flex">
                    <TextBox
                      label={"Field of Study"}
                      placeholder={"FieldOfStudy"}
                      inputUpdate={setFieldOfStudy}
                    />
                  </div>
                  <div className="flex">
                    <TextBox
                      label={"Join Date"}
                      placeholder={"JoinDate"}
                      inputUpdate={setJoinDate}
                    />
                  </div>
                </div>
                <div className="flex">
                  <TextBox
                    label={"Grade"}
                    placeholder={"Grade"}
                    inputUpdate={setGrade}
                  />
                </div>
                {studentError ? (
                  <div className={styles.input_divider}>
                    <FormError errorMessage={studentError}></FormError>
                  </div>
                ) : null}
                <SubmitButton
                  label={"Save Student Profile"}
                  submitHandler={handleStudentSubmit}
                />
              </form>
            </div>

            <button className={styles.dropdownBtn} onClick={toggleJobForm}>
              <h3>Job Profile</h3>{" "}
            </button>
            <div
              className={`${styles.dropdownForm} ${isJobOpen && styles.show}`}
            >
              <form>
                <TextBox
                  label={"Company Name"}
                  placeholder={"CompanyName"}
                  inputUpdate={setCompanyName}
                />
                <div className={styles.twobytwo}>
                  <TextBox
                    label={"Job Designation"}
                    placeholder={"JobDesignation"}
                    inputUpdate={setJobDesignation}
                  />
                  <TextBox
                    label={"Location"}
                    placeholder={"Location"}
                    inputUpdate={setLocation}
                  />
                </div>
                <TextArea
                  label={"Job Description"}
                  placeholder={"JobDescription"}
                  inputUpdate={setJobDescription}
                />
                <TextBox
                  label={"Qualifications"}
                  placeholder={"Qualifications"}
                  inputUpdate={setQualifications}
                />
                {jobError ? (
                  <div className={styles.input_divider}>
                    <FormError errorMessage={jobError}></FormError>
                  </div>
                ) : null}
                <SubmitButton
                  label={"Save Job Profile"}
                  submitHandler={handleJobSubmit}
                />
              </form>
            </div>
          </div>
        </div>
      </FullLayout>
    </>
  );
};

export default AddProfile;
