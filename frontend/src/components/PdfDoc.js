import React, { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import app from "../fire";
import Pdf from "./Pdf";

import { doc, getFirestore, updateDoc } from "firebase/firestore";

const PdfDoc = (props) => {
  const { docId, user: userId, file, document } = props;
  const db = getFirestore(app);
  const [docName, setDocName] = useState(document.name);
  const [isInput, setInput] = useState(false);

  const updateName = async (data) => {
    await updateDoc(doc(db, `Users/${userId}/Documents/${docId}`), data);
  };

  return (
    <div className="card_">
      <Link to={`/editdoc/${docId}`}>
        <Pdf file={file} fresh={props.fresh} />
      </Link>
      <div className="card-body">
        {isInput ? (
          <input
            style={{
              fontSize: "2.0rem",
              color: "blue",
              padding: "0 1rem",
              width: "18rem",
              outline: "none",
            }}
            autoFocus={isInput}
            type="text"
            name="docName"
            value={docName || ""}
            onChange={(e) => setDocName(e.target.value)}
            onBlur={() => setInput(false) + updateName({ name: docName })}
          ></input>
        ) : (
          <div
            style={{ fontSize: "2.0rem", color: "blue", padding: "0 1rem" }}
            onClick={() => setInput(true)}
          >
            {docName}
          </div>
        )}

        <div style={{ fontSize: "1.5rem", color: "blue", padding: "0 0.5rem" }}>
          {moment(new Date(document.createdAt), "LLLL", "he").format(
            "hh:mm DD/MM/YYYY"
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfDoc;
