import {React,useState,useEffect} from "react";
import styles from "../styles.module.css";
import FullLayout from "../../../components/Layout/FullLayout";
import MyProfileNavbar from "../../../components/my-profile/navbar/MyProfileNavbar";

import TextBox2 from "../../../components/form/textbox2";
import TextArea2 from "../../../components/form/TextArea2";

import FormError from "../../../components/form/formError";
import SubmitButton from "../../../components/form/SubmitButton";
import axios from "axios";
import ENV from "../../../static_files/hostURL";

const AddProfile = () => {
  const [name_of_institution, setNameOfInstitution] = useState("");
  const [student_email, setStudentEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [course_name, setCourseName] = useState("");
  const [course_duration, setCourseDuration] = useState("");
  const [field_of_study, setFieldOfStudy] = useState("");
  const [join_date, setJoinDate] = useState("");
  const [grade, setGrade] = useState("");

  const [company_name, setCompanyName] = useState("");
  const [job_designation, setJobDesignation] = useState("");
  const [location, setLocation] = useState("");
  const [job_description, setJobDescription] = useState("");
  const [qualifications, setQualifications] = useState("");

  const [studentError, setStudentError] = useState("");
  const [jobError, setJobError] = useState("");

  const [isStudentOpen, setStudentIsOpen] = useState(false); // state for form visibility
  const toggleStudentForm = () => {
    setStudentIsOpen(!isStudentOpen);
  };

  const [isJobOpen, setJobIsOpen] = useState(false); // state for form visibility
  const toggleJobForm = () => {
    setJobIsOpen(!isJobOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("_USID");
    if (token) {
      axios
        .get(ENV.PROTOCOL + ENV.HOST + ENV.PORT + "/user/view_profiles", {
          headers: {
            "x-access-token": token,
          },
        })
        .then((response) => {
          if(response.data.student_profile){
            setNameOfInstitution(response.data.student_profile.name_of_institution);
            setStudentEmail(response.data.student_profile.student_email);
            setDegree(response.data.student_profile.degree);
            setCourseName(response.data.student_profile.course_name);
            setCourseDuration(response.data.student_profile.course_duration);
            setFieldOfStudy(response.data.student_profile.field_of_study);
            setJoinDate(response.data.student_profile.join_date);
            setGrade(response.data.student_profile.grade);
          }
          if(response.data.job_profile){
            setCompanyName(response.data.job_profile.company_name);
            setJobDesignation(response.data.job_profile.job_designation);
            setLocation(response.data.job_profile.location);
            setJobDescription(response.data.job_profile.job_description);
            setQualifications(response.data.job_profile.qualifications);
          }

        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      router.push("/login");
    }
  }, []);


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
              <h3>Student Profile</h3>
              <span className={`${styles.arrow} ${isStudentOpen ? styles.active : ""}`}><h3>&#9662;</h3></span>
            </button>
            <div
              className={`${styles.dropdownForm} ${
                isStudentOpen && styles.show
              }`}
            >
              <form>
                <TextBox2
                  label={"Name of Institution"}
                  placeholder={"NameOfInstitution"}
                  inputUpdate={setNameOfInstitution}
                  value={name_of_institution}
                />
                <TextBox2
                  label={"Student Email"}
                  placeholder={"StudentEmail"}
                  inputUpdate={setStudentEmail}
                  value={student_email}
                />
                <TextBox2
                  label={"Degree"}
                  placeholder={"Degree"}
                  inputUpdate={setDegree}
                  value={degree}
                />
                <div className={styles.twobytwo}>
                  <TextBox2
                    label={"Course Name"}
                    placeholder={"Course"}
                    inputUpdate={setCourseName}
                    value={course_name}
                  />
                  <TextBox2
                    label={"Course Duration"}
                    placeholder={"CourseDuration"}
                    inputUpdate={setCourseDuration}
                    value={course_duration}
                  />
                  <TextBox2
                    label={"Field of Study"}
                    placeholder={"FieldOfStudy"}
                    inputUpdate={setFieldOfStudy}
                    value={field_of_study}
                  />
                  <TextBox2
                    label={"Join Date"}
                    placeholder={"JoinDate"}
                    inputUpdate={setJoinDate}
                    value={join_date}
                  />
                </div>
                <TextBox2
                  label={"Grade"}
                  placeholder={"Grade"}
                  inputUpdate={setGrade}
                  value={grade}
                />
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
              <h3>Job Profile</h3>
              <span className={`${styles.arrow} ${isJobOpen ? styles.active : ""}`}><h3>&#9662;</h3></span>
            </button>
            <div
              className={`${styles.dropdownForm} ${isJobOpen && styles.show}`}
            >
              <form>
                <TextBox2
                  label={"Company Name"}
                  placeholder={"CompanyName"}
                  inputUpdate={setCompanyName}
                  value={company_name}
                />
                <div className={styles.twobytwo}>
                  <TextBox2
                    label={"Job Designation"}
                    placeholder={"JobDesignation"}
                    inputUpdate={setJobDesignation}
                    value={job_designation}
                  />
                  <TextBox2
                    label={"Location"}
                    placeholder={"Location"}
                    inputUpdate={setLocation}
                    value={location}
                  />
                </div>
                <TextArea2
                  label={"Job Description"}
                  placeholder={"JobDescription"}
                  inputUpdate={setJobDescription}
                  value={job_description}
                />
                <TextBox2
                  label={"Qualifications"}
                  placeholder={"Qualifications"}
                  inputUpdate={setQualifications}
                  value={qualifications}
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
