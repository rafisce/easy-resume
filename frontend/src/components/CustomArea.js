import React, { useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Custom from "./Custom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import app from "../fire";

const CustomArea = (props) => {
  const { docId, title: areaTitle, areaId } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [isInput, setInput] = useState(false);
  const [title, setTitle] = useState(areaTitle);
  const [customList, setCustomList] = useState([]);

  const remove = (index) => {
    setCustomList(customList.filter((item) => item.num !== index));
  };
  const add = async () => {
    const tempCustom = {
      title: "לא צוין שם פריט",
      start: "2000-01-01",
      finish: "2000-01-01",
      description: null,
      open: true,
      disabled: true,
    };
    await addDoc(
      collection(
        db,
        `Users/${authUser.uid}/Documents/${docId}/Customs/${areaId}/customItems`
      ),
      tempCustom
    ).then(async (custom) => {
      tempCustom.id = custom.id;

      setCustomList(
        customList.concat(
          <Custom
            key={custom.id}
            num={customList.length}
            current={tempCustom}
            areaId={areaId}
            docId={docId}
            removeMe={remove}
          />
        )
      );
    });
  };

  const updateTitle = async (data) => {
    await updateDoc(
      doc(db, `Users/${authUser.uid}/Documents/${docId}/Customs/${areaId}`),
      data
    );
  };

  useEffect(() => {
    async function fetchData() {
      const docRef = doc(
        db,
        `Users/${authUser.uid}/Documents/${docId}/Customs/${areaId}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const custom = docSnap.data();
        setTitle(custom.title);
      }
      try {
        const querySnapshot = await getDocs(
          collection(
            db,
            `Users/${authUser.uid}/Documents/${docId}/Customs/${areaId}/customItems`
          )
        );

        Promise.All(
          querySnapshot.forEach(async (doc) => {
            const custom = doc.data();
            custom.id = doc.id;
            setCustomList((oldArray) => [
              ...oldArray,
              <Custom
                key={custom.id}
                num={customList.length}
                areaId={areaId}
                docId={docId}
                current={custom}
                removeMe={remove}
              />,
            ]);
          })
        );
      } catch (err) {}
    }
    fetchData();
  }, []);

  return (
    <div
      style={{
        padding: "1rem",
        margin: "2rem 0",
        backgroundColor: "#dcebdc",
      }}
    >
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
          name="areaTitle"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={(e) =>
            updateTitle({
              title: e.target.value === "" ? "לא צוינה כותרת" : e.target.value,
            }) +
            setTitle(e.target.value) +
            setInput(false)
          }
        ></input>
      ) : (
        <div className="editable">
          <h2 onClick={() => setInput(true)}>{title}</h2>
        </div>
      )}
      <div>
        {customList}
        <button
          style={{ backgroundColor: "#dcebdc" }}
          type="button"
          className="add"
          onClick={add}
        >
          <FontAwesomeIcon icon={faPlus} /> הוסף {"פריט מותאם"}
        </button>
      </div>
    </div>
  );
};

export default CustomArea;
