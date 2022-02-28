import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import app from "../fire";

const Skills = (props) => {
  const { current, docId } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [old, setOld] = useState();

  const [skill, setSkill] = useState("לא צויין");
  const [level, setLevel] = useState({
    level1: "active",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [started, setStarted] = useState(true);

  const moveStep = (level) => {
    if (level === 1) {
      setLevel({
        level1: "active",
        level2: "",
        level3: "",
        level4: "",
        level5: "",
      });
    } else if (level === 2) {
      setLevel({
        level1: "active",
        level2: "active",
        level3: "",
        level4: "",
        level5: "",
      });
    } else if (level === 3) {
      setLevel({
        level1: "active",
        level2: "active",
        level3: "active",
        level4: "",
        level5: "",
      });
    } else if (level === 4) {
      setLevel({
        level1: "active",
        level2: "active",
        level3: "active",
        level4: "active",
        level5: "",
      });
    } else if (level === 5) {
      setLevel({
        level1: "active",
        level2: "active",
        level3: "active",
        level4: "active",
        level5: "active",
      });
    }
  };

  const updateSkill = async (data) => {
    await updateDoc(
      doc(
        db,
        `Users/${authUser.uid}/Documents/${docId}/Skills`,
        current.skillId
      ),
      data
    );
  };
  const changed = (old, updated) => {
    if (old !== updated) {
      console.log("changed " + old + " to " + updated);
      props.updateParent();
    }
  };

  useEffect(() => {
    if (started) {
      setSkill(current.skill);
      moveStep(current.level);
      setIsOpen(current.open);
      setStarted(false);
    }
  }, [current, started, level]);

  return (
    <div className="collapsible-wrapper" id="main">
      <button
        type="button"
        className="opener"
        id="main"
        onClick={() => setIsOpen(!isOpen) + updateSkill({ open: !isOpen })}
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={isOpen ? "fliped" : "notfliped"}
        />
        <div className="snippet">
          <div>{skill}</div>
          <div>רמה - {current.level}</div>
        </div>
      </button>

      <div
        className="collapsible"
        id="hide"
        style={{ maxHeight: isOpen ? "100vh" : "0" }}
      >
        <div className="row">
          <div>
            <label>מיומנות</label>
            <input
              type="text"
              name="skill"
              value={skill || ""}
              onChange={(e) => setSkill(e.target.value)}
              onBlur={(e) =>
                updateSkill({ skill: skill }) + changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
          <div className="skillbar">
            <label>רמה</label>
            <div className="levels">
              <div
                className={level.level1 === "active" ? "active" : ""}
                onClick={() =>
                  moveStep(1) +
                  updateSkill({ level: 1, skill: skill }) +
                  changed(current.level, 1)
                }
              />
              <div
                className={level.level2 ? "active" : ""}
                onClick={() =>
                  moveStep(2) +
                  updateSkill({ level: 2, skill: skill }) +
                  changed(current.level, 2)
                }
              />
              <div
                className={level.level3 ? "active" : ""}
                onClick={() =>
                  moveStep(3) +
                  updateSkill({ level: 3, skill: skill }) +
                  changed(current.level, 3)
                }
              />
              <div
                className={level.level4 ? "active" : ""}
                onClick={() =>
                  moveStep(4) +
                  updateSkill({ level: 4, skill: skill }) +
                  changed(current.level, 4)
                }
              />
              <div
                className={level.level5 ? "active" : ""}
                onClick={() =>
                  moveStep(5) +
                  updateSkill({ level: 5, skill: skill }) +
                  changed(current.level, 5)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
