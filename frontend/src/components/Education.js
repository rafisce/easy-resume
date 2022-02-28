import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import app from "../fire";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import RichEditor from "./RichEditor";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { formatToIL } from "../Utility";

const Education = (props) => {
  const { current, docId } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [institution, setInstitution] = useState("");
  const [diploma, setDiploma] = useState("");
  const [city, setCity] = useState("");
  const [start, setStart] = useState("");
  const [finish, setFinish] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editorState, setEditorState] = useState();
  const [old, setOld] = useState();

  const updateEducation = async (data) => {
    await updateDoc(
      doc(
        db,
        `Users/${authUser.uid}/Documents/${docId}/Education`,
        current.educationId
      ),
      data
    );
  };
  const updateMe = (editor) => {
    updateEducation({ description: convertToRaw(editor.getCurrentContent()) });
  };

  const changed = (old, updated) => {
    if (old !== updated) {
      console.log("changed " + old + " to " + updated);
      props.updateParent();
    }
  };

  useEffect(() => {
    setInstitution(current.institution);
    setDiploma(current.diploma);
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
        onClick={() => setIsOpen(!isOpen) + updateEducation({ open: !isOpen })}
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={isOpen ? "fliped" : "notfliped"}
        />
        <div className="snippet">
          <div>{institution}</div>
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
            <label>מוסד</label>
            <input
              type="text"
              name="institution"
              value={institution || ""}
              onChange={(e) => setInstitution(e.target.value)}
              onBlur={(e) =>
                updateEducation({ institution: institution }) +
                changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>

          <div>
            <label> תואר/תעודה</label>
            <input
              type="text"
              name="diploma"
              value={diploma || ""}
              onChange={(e) => setDiploma(e.target.value)}
              onBlur={(e) =>
                updateEducation({ diploma: diploma }) +
                changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <div className="row duration">
            <div>
              <label>התחלה</label>
              <input
                type="date"
                value={start || ""}
                onChange={(e) => setStart(e.target.value)}
                onBlur={(e) =>
                  updateEducation({ start: e.target.value }) +
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
                  updateEducation({ finish: e.target.value }) +
                  changed(old, e.target.value)
                }
                onFocus={(e) => setOld(e.target.value)}
              />
            </div>
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
                updateEducation({ city: city }) + changed(old, e.target.value)
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

export default Education;
