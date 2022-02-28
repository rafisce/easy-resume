import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomArea from "./CustomArea";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../fire";
const CustomAdder = (props) => {
  const { docId } = props;
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [customList, setCustomList] = useState([]);

  const remove = (index) => {
    setCustomList(customList.filter((item) => item.num !== index));
  };

  const add = async () => {
    const tempArea = {
      title: "לא צוינה כותרת",
    };
    await addDoc(
      collection(db, `Users/${authUser.uid}/Documents/${docId}/Customs`),
      tempArea
    ).then(async (area) => {
      setCustomList(
        customList.concat(
          <CustomArea
            key={area.id}
            num={customList.length}
            docId={docId}
            areaId={area.id}
            title={"לא צוינה כותרת"}
            removeMe={remove}
          />
        )
      );
    });
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(
          collection(db, `Users/${authUser.uid}/Documents/${docId}/Customs`)
        );

        Promise.All(
          querySnapshot.forEach(async (doc) => {
            const custom = doc.data();
            custom.id = doc.id;
            setCustomList((oldArray) => [
              ...oldArray,
              <CustomArea
                key={custom.id}
                num={customList.length}
                docId={docId}
                title={custom.title}
                areaId={custom.id}
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
    <div className="customAdder">
      <h2>מותאם אישית</h2>
      <div>
        {customList}
        <button type="button" className="add" onClick={add}>
          <FontAwesomeIcon icon={faPlus} /> הוסף {"איזור מותאם "}
        </button>
      </div>
    </div>
  );
};

export default CustomAdder;
