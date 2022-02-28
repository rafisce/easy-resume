import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import app from "../fire";
import { formatToIL } from "../Utility";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import RichEditor from "./RichEditor";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";

const JobHistory = (props) => {
  const { current, docId } = props;
  const db = getFirestore(app);

  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const [job, setJob] = useState("");
  const [employer, setEmployer] = useState("");
  const [city, setCity] = useState("");
  const [start, setStart] = useState("2000");
  const [finish, setFinish] = useState("2000");
  const [isOpen, setIsOpen] = useState(false);
  const [editorState, setEditorState] = useState();
  const [old, setOld] = useState();

  const updateJob = async (data) => {
    await updateDoc(
      doc(db, `Users/${authUser.uid}/Documents/${docId}/Jobs`, current.jobId),
      data
    );
  };
  const changed = (old, updated) => {
    if (old !== updated) {
      console.log("changed " + old + " to " + updated);
      props.updateParent();
    }
  };

  const updateMe = (editor) => {
    updateJob({ description: convertToRaw(editor.getCurrentContent()) });
  };

  useEffect(() => {
    setJob(current.job);
    setEmployer(current.employer);
    setCity(current.city);
    setStart(current.start);
    setFinish(current.finish);
    setIsOpen(current.open);
    setEditorState(
      current.description
        ? EditorState.createWithContent(convertFromRaw(current.description))
        : EditorState.createEmpty()
    );
  }, [current]);

  return (
    <div className="collapsible-wrapper">
      <button
        type="button"
        className="opener"
        onClick={() =>
          console.log(current) +
          console.log(docId) +
          setIsOpen(!isOpen) +
          updateJob({ open: !isOpen })
        }
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={isOpen ? "fliped" : "notfliped"}
        />
        <div className="snippet">
          <div>{employer}</div>
          <div>
            {formatToIL(start)} - {formatToIL(finish)}
          </div>
        </div>
      </button>

      <div
        className="collapsible"
        style={{ maxHeight: isOpen ? "100vh" : "0" }}
      >
        <div className="row">
          <div>
            <label>תפקיד</label>
            <input
              type="text"
              name="job"
              value={job || ""}
              onChange={(e) => setJob(e.target.value)}
              onBlur={(e) =>
                updateJob({ job: job } + changed(old, e.target.value))
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
          <div>
            <label> מעסיק</label>
            <input
              type="text"
              name="employer"
              value={employer || ""}
              onChange={(e) => setEmployer(e.target.value)}
              onBlur={(e) =>
                updateJob({ employer: employer }) + changed(e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="row duration">
          <div>
            <label>התחלה</label>
            <input
              type="date"
              value={start || ""}
              onChange={(e) => setStart(e.target.value)}
              onBlur={(e) =>
                updateJob({ start: e.target.value }) +
                changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            />
          </div>
          <div>
            <label>סיום</label>
            <input
              type="date"
              value={finish || ""}
              onChange={(e) => setFinish(e.target.value)}
              onBlur={(e) =>
                updateJob({ finish: e.target.value }) +
                changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div>
            <label>עיר</label>
            <input
              type="text"
              name="city"
              value={city || ""}
              onChange={(e) => setCity(e.target.value)}
              onBlur={(e) =>
                updateJob({ city: city }) + changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
          <div></div>
        </div>
        {editorState ? (
          <RichEditor editorState={editorState} updateParent={updateMe} />
        ) : null}
      </div>
    </div>
  );
};

export default JobHistory;
