import PersonalInfo from "../components/PersonalInfo";

import Profile from "../components/Profile";
import { pdfjs } from "react-pdf";
import PdfView from "../components/PdfView";
import Adder from "../components/Adder";
import { useParams } from "react-router-dom";

import { useState } from "react";
import CustomAdder from "../components/CustomAdder";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const EditResumeScreen = (props) => {
  const { id: docId } = useParams();
  const [change, setChange] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const updateMe = () => {
    setChange(!change);
  };

  return (
    <div className="main-container">
      <div id="editor">
        <form className="form">
          <PersonalInfo doc={docId} updateParent={updateMe} />
          <Profile doc={docId} updateParent={updateMe} />
          <Adder type={"עבר תעסוקתי"} docId={docId} updateParent={updateMe} />
          <Adder type={"השכלה"} docId={docId} updateParent={updateMe} />
          <Adder type={"לינקים"} docId={docId} updateParent={updateMe} />
          <Adder type={"יכולות"} docId={docId} updateParent={updateMe} />
          <CustomAdder docId={docId} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={() => {}}>
              צור רזומה
            </button>
          </div>
        </form>
      </div>
      <div id="preview">
        <PdfView key={change} userId={authUser.uid} docId={docId} />
      </div>
    </div>
  );
};
