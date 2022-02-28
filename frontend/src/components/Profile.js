import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import app from "../fire";
import RichEditor from "./RichEditor";

const Profile = (props) => {
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [editorState, setEditorState] = useState();
  const [old, setOld] = useState();
  const [started, setStarted] = useState(true);

  const updateMe = (editor) => {
    updateProfile({ profile: convertToRaw(editor.getCurrentContent()) });
  };

  const updateProfile = async (data) => {
    await updateDoc(doc(db, `Users/${authUser.uid}`), data);
  };
  const changed = (old, updated) => {
    if (old !== updated) {
      props.updateParent();
    }
  };

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, `Users/${authUser.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && started) {
        const info = docSnap.data();
        setEditorState(
          EditorState.createWithContent(convertFromRaw(info.profile))
        );
        setStarted(false);
      }
    }
    fetchData();
  }, [authUser.uid, db, started, editorState]);

  return (
    <div className="profile" style={{ paddng: "0 0 0 25px" }}>
      <h2>על עצמי</h2>
      <div>
        <label style={{ margin: "1rem" }}>ספר על עצמך בקצרה </label>
        {editorState ? (
          <RichEditor
            editorState={editorState}
            plain={true}
            updateParent={updateMe}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
