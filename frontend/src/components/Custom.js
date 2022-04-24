import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import app from "../fire";
import "../rich-editor.css";

import { convertFromRaw, convertToRaw, EditorState } from "draft-js";

import RichEditor from "./RichEditor";
import { formatToIL } from "../Utility";

const Custom = (props) => {
  const { docId, areaId, current } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  const [isInput, setInput] = useState(false);
  const [title, setTitle] = useState("לא צויין שם  פריט");
  const [start, setStart] = useState("2000-01-01");
  const [finish, setFinish] = useState("2000-01-01");
  const [isOpen, setIsOpen] = useState(true);
  const [disabled, setDisabled] = useState(true);
  // const [started, setStarted] = useState(true);
  // const [old, setOld] = useState();
  const [editorState, setEditorState] = useState();

  const updateCustom = async (data) => {
    console.log(
      authUser.uid + " " + docId + " " + areaId + " " + current.customId
    );
    await updateDoc(
      doc(
        db,
        `Users/${authUser.uid}/Documents/${docId}/Customs/${areaId}/customItems/${current.id}`
      ),
      data
    );
  };
  const updateMe = (editor) => {
    updateCustom({ description: convertToRaw(editor.getCurrentContent()) });
  };

  useEffect(() => {
    setTitle(current.title ? current.title : title);
    setTitle(current.disabled ? current.disabled : disabled);
    setStart(current.start);
    setFinish(current.finish);
    setIsOpen(current.open);

    setEditorState(
      current.description
        ? EditorState.createWithContent(convertFromRaw(current.description))
        : EditorState.createEmpty()
    );
  }, []);

  return (
    <div className="collapsible-shell" style={{ backgroundColor: "#ffffffff" }}>
      <div className="collapsible-wrapper">
        <button
          type="button"
          className="opener"
          onClick={() => setIsOpen(!isOpen) + updateCustom({ open: !isOpen })}
        >
          <FontAwesomeIcon
            style={{ margin: "2px" }}
            icon={faChevronDown}
            className={isOpen ? "fliped" : "notfliped"}
          />
          <div className="snippet">
            <div></div>
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
            <div style={{ width: "100%" }}>
              {isInput ? (
                <input
                  style={{
                    fontSize: "2.0rem",
                    color: "#386138",
                    padding: "0 1rem",
                    width: "18rem",
                    outline: "none",
                  }}
                  autoFocus={isInput}
                  type="text"
                  name="name"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={(e) =>
                    setInput(false) +
                    updateCustom({ title: e.target.value }) +
                    console.log(e.target.value)
                  }
                ></input>
              ) : (
                <div className="editable">
                  <h2 onClick={() => setInput(true)}>{title}</h2>
                </div>
              )}
              {editorState ? (
                <RichEditor editorState={editorState} updateParent={updateMe} />
              ) : null}
            </div>
          </div>

          <div style={{ width: "5%", margin: "1rem" }}>
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={!disabled}
              onChange={() =>
                setDisabled(!disabled) + updateCustom({ disabled: !disabled })
              }
            />
          </div>
          {
            <div className="row duration">
              <div>
                <label>התחלה</label>
                <input
                  type="date"
                  value={start || ""}
                  onChange={(e) => setStart(e.target.value)}
                  onBlur={
                    (e) => updateCustom({ start: e.target.value }) //+ changed(old, e.target.value)
                  }
                  disabled={disabled}
                  //onFocus={(e) => setOld(e.target.value)}
                />
              </div>
              <div>
                <label>סיום</label>
                <input
                  type="date"
                  value={finish || ""}
                  onChange={(e) => setFinish(e.target.value)}
                  onBlur={
                    (e) => updateCustom({ finish: e.target.value }) //+ changed(old, e.target.value)
                  }
                  disabled={disabled}
                  //onFocus={(e) => setOld(e.target.value)}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Custom;
