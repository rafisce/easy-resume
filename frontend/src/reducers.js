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

export const listJobsReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_JOBS_REQUEST:
      return { loading: true };
    case LIST_JOBS_SUCCESS:
      return { loading: false, jobs: action.payload };
    case LIST_JOBS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const listSkillsReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_SKILLS_REQUEST:
      return { loading: true };
    case LIST_SKILLS_SUCCESS:
      return { loading: false, skills: action.payload };
    case LIST_SKILLS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const listEducationReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_EDUCATION_REQUEST:
      return { loading: true };
    case LIST_EDUCATION_SUCCESS:
      return { loading: false, education: action.payload };
    case LIST_EDUCATION_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const listLinksReducer = (state = {}, action) => {
  switch (action.type) {
    case LIST_LINKS_REQUEST:
      return { loading: true };
    case LIST_LINKS_SUCCESS:
      return { loading: false, links: action.payload };
    case LIST_LINKS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
