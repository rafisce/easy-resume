import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import app from "../fire";
import { getDatabase, ref, update } from "firebase/database";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

const MyLink = (props) => {
  const { current, docId } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [name, setName] = useState("לא צויין");
  const [link, setLink] = useState("לא צויין");
  const [isOpen, setIsOpen] = useState(false);
  const [started, setStarted] = useState(true);
  const [old, setOld] = useState();

  const updateLink = async (data) => {
    await updateDoc(
      doc(db, `Users/${authUser.uid}/Documents/${docId}/Links`, current.linkId),
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
      setName(current.name);
      setLink(current.link);
      setIsOpen(current.open);
      setStarted(false);
    }
  }, [current, started]);

  return (
    <div className="collapsible-wrapper">
      <button
        type="button"
        className="opener"
        onClick={() => setIsOpen(!isOpen) + updateLink({ open: !isOpen })}
      >
        <FontAwesomeIcon
          icon={faChevronDown}
          className={isOpen ? "fliped" : "notfliped"}
        />
        <div className="snippet">
          <div>{name}</div>
          <div>{link}</div>
        </div>
      </button>

      <div
        className="collapsible"
        style={{ maxHeight: isOpen ? "100vh" : "0" }}
      >
        <div className="row">
          <div>
            <label>שם</label>
            <input
              type="text"
              name="LinkName"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              onBlur={(e) =>
                updateLink({ name: name }) + changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
          <div>
            <label> קישור</label>
            <input
              type="text"
              name="link"
              value={link || ""}
              onChange={(e) => setLink(e.target.value)}
              onBlur={(e) =>
                updateLink({ link: link }) + changed(old, e.target.value)
              }
              onFocus={(e) => setOld(e.target.value)}
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLink;
