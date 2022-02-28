import React, { useEffect, useState } from "react";
import Education from "./Education";
import JobHistory from "./JobHistory";
import Skills from "./Skills";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import app from "../fire";
import MyLink from "./MyLink";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const Adder = (props) => {
  const { type, docId } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [jobs, setJobs] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [links, setLinks] = useState([]);
  const add = async () => {
    if (type === "עבר תעסוקתי") {
      const tempJob = {
        job: "לא צויין",
        employer: "לא צויין",
        city: "לא צויין",
        start: "2000-01-01",
        finish: "2000-01-01",
        open: true,
        description: null,
      };
      await addDoc(
        collection(db, `Users/${authUser.uid}/Documents/${docId}/Jobs`),
        tempJob
      ).then(async (job) => {
        tempJob.jobId = job.id;
        setJobs(
          jobs.concat(
            <JobHistory
              key={job.id}
              num={jobs.length}
              docId={docId}
              current={tempJob}

              // removeMe={remove}
            />
          )
        );
      });
    } else if (type === "השכלה") {
      const tempEducation = {
        institution: "לא צויין",
        diploma: "לא צויין",
        city: "לא צויין",
        start: "2000-01-01",
        finish: "2000-01-01",
        open: true,
        description: null,
      };
      await addDoc(
        collection(db, `Users/${authUser.uid}/Documents/${docId}/Education`),
        tempEducation
      ).then(async (edu) => {
        tempEducation.educationId = edu.id;
        setEducation(
          education.concat(
            <Education
              key={edu.id}
              num={education.length}
              docId={docId}
              current={tempEducation}

              // removeMe={remove}
            />
          )
        );
      });
    } else if (type === "יכולות") {
      const tempSkill = {
        skill: "לא צויין",
        level: 1,
        open: true,
      };
      await addDoc(
        collection(db, `Users/${authUser.uid}/Documents/${docId}/Skills`),
        tempSkill
      ).then(async (skill) => {
        tempSkill.skillId = skill.id;
        setSkills(
          skills.concat(
            <Skills
              key={skill.id}
              num={skills.length}
              docId={docId}
              current={tempSkill}

              // removeMe={remove}
            />
          )
        );
      });
    } else if (type === "לינקים") {
      const tempLink = {
        name: "לא צויין",
        link: "לא צויין",
        open: true,
      };
      await addDoc(
        collection(db, `Users/${authUser.uid}/Documents/${docId}/Links`),
        tempLink
      ).then(async (link) => {
        tempLink.linkId = link.id;
        setLinks(
          links.concat(
            <MyLink
              key={link.id}
              num={links.length}
              docId={docId}
              current={tempLink}

              // removeMe={remove}
            />
          )
        );
      });
    }
  };

  const updateMe = () => {
    props.updateParent();
  };

  useEffect(() => {
    async function fetchData() {
      if (type === "עבר תעסוקתי") {
        // dispatch(listJobs({ userId: authUser.uid, docId: docId }));
        try {
          const querySnapshot = await getDocs(
            collection(db, `Users/${authUser.uid}/Documents/${docId}/Jobs`)
          );
          setJobs([]);
          Promise.All(
            querySnapshot.forEach(async (doc) => {
              const job = doc.data();
              setJobs((oldArray) => [
                ...oldArray,
                <JobHistory
                  key={doc.id}
                  docId={docId}
                  current={job}
                ></JobHistory>,
              ]);
            })
          );
        } catch (err) {}
      } else if (type === "השכלה") {
        // dispatch(listEducation({ userId: authUser.uid, docId: docId }));
        try {
          const querySnapshot = await getDocs(
            collection(db, `Users/${authUser.uid}/Documents/${docId}/Education`)
          );

          Promise.All(
            querySnapshot.forEach(async (doc) => {
              const edu = doc.data();
              setEducation((oldArray) => [
                ...oldArray,
                <Education
                  key={doc.id}
                  docId={docId}
                  current={edu}
                ></Education>,
              ]);
            })
          );
        } catch (err) {}
      } else if (type === "יכולות") {
        // dispatch(listSkills({ userId: authUser.uid, docId: docId }));
        try {
          const querySnapshot = await getDocs(
            collection(db, `Users/${authUser.uid}/Documents/${docId}/Skills`)
          );

          Promise.All(
            querySnapshot.forEach(async (doc) => {
              const skill = doc.data();
              setSkills((oldArray) => [
                ...oldArray,
                <Skills key={doc.id} docId={docId} current={skill}></Skills>,
              ]);
            })
          );
        } catch (err) {}
      } else if (type === "לינקים") {
        // dispatch(listLinks({ userId: authUser.uid, docId: docId }));
        try {
          const querySnapshot = await getDocs(
            collection(db, `Users/${authUser.uid}/Documents/${docId}/Links`)
          );

          Promise.All(
            querySnapshot.forEach(async (doc) => {
              const link = doc.data();
              setLinks((oldArray) => [
                ...oldArray,
                <MyLink key={doc.id} docId={docId} current={link}></MyLink>,
              ]);
            })
          );
        } catch (err) {}
      }
    }
    fetchData();
  }, [authUser.uid, props, type, docId, db]);

  return (
    <div className="Adder">
      <h2>{type}</h2>
      {type === "עבר תעסוקתי"
        ? jobs
        : type === "השכלה"
        ? education
        : type === "יכולות"
        ? skills
        : links}

      <button type="button" className="add" onClick={add}>
        <FontAwesomeIcon icon={faPlus} /> הוסף {type}
      </button>
    </div>
  );
};

export default Adder;
