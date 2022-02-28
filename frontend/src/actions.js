import { collection, getDocs, getFirestore } from "firebase/firestore";

import {
  LIST_EDUCATION_FAIL,
  LIST_EDUCATION_REQUEST,
  LIST_EDUCATION_SUCCESS,
  LIST_JOBS_FAIL,
  LIST_JOBS_REQUEST,
  LIST_JOBS_SUCCESS,
  LIST_LINKS_FAIL,
  LIST_LINKS_REQUEST,
  LIST_LINKS_SUCCESS,
  LIST_SKILLS_FAIL,
  LIST_SKILLS_REQUEST,
  LIST_SKILLS_SUCCESS,
} from "./constants";
import app from "./fire";

export const listJobs = (data) => async (dispatch) => {
  const db = getFirestore(app);
  const jobs = [];
  dispatch({ type: LIST_JOBS_REQUEST });
  try {
    const querySnapshot = await getDocs(
      collection(db, `Users/${data.userId}/Documents/${data.docId}/Jobs`)
    );
    querySnapshot.forEach((doc) => {
      const job = doc.data();
      job.jobId = doc.id;
      jobs.push(job);
    });
    dispatch({ type: LIST_JOBS_SUCCESS, payload: jobs });
  } catch (err) {
    dispatch({ type: LIST_JOBS_FAIL, payload: err });
  }
};

export const listSkills = (data) => async (dispatch) => {
  const db = getFirestore(app);
  const skills = [];
  dispatch({ type: LIST_SKILLS_REQUEST });
  try {
    const querySnapshot = await getDocs(
      collection(db, `Users/${data.userId}/Documents/${data.docId}/Skills`)
    );
    querySnapshot.forEach((doc) => {
      const skill = doc.data();
      skill.skillId = doc.id;
      skills.push(skill);
    });
    dispatch({ type: LIST_SKILLS_SUCCESS, payload: skills });
  } catch (err) {
    dispatch({ type: LIST_SKILLS_FAIL, payload: err });
  }
};

export const listEducation = (data) => async (dispatch) => {
  const db = getFirestore(app);
  const education = [];
  dispatch({ type: LIST_EDUCATION_REQUEST });
  try {
    const querySnapshot = await getDocs(
      collection(db, `Users/${data.userId}/Documents/${data.docId}/Education`)
    );
    querySnapshot.forEach((doc) => {
      const edu = doc.data();
      edu.educationId = doc.id;
      education.push(edu);
    });
    dispatch({ type: LIST_EDUCATION_SUCCESS, payload: education });
  } catch (err) {
    dispatch({ type: LIST_EDUCATION_FAIL, payload: err });
  }
};

export const listLinks = (data) => async (dispatch) => {
  const db = getFirestore(app);
  const links = [];
  dispatch({ type: LIST_LINKS_REQUEST });
  try {
    const querySnapshot = await getDocs(
      collection(db, `Users/${data.userId}/Documents/${data.docId}/Links`)
    );
    querySnapshot.forEach((doc) => {
      const link = doc.data();
      link.linkId = doc.id;
      links.push(link);
    });
    dispatch({ type: LIST_LINKS_SUCCESS, payload: links });
  } catch (err) {
    dispatch({ type: LIST_LINKS_FAIL, payload: err });
  }
};
