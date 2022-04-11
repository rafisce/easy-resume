import PdfDoc from "../components/PdfDoc";
import { useNavigate } from "react-router-dom";
import app from "../fire";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { cleanRes } from "../resFormats/Clean";

const Dashboard = () => {
  const [docs, setDocs] = useState([]);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const db = getFirestore(app);
  const navigate = useNavigate();

  const addDocHandler = async () => {
    await addDoc(collection(db, `Users/${authUser.uid}/Documents`), {
      name: "לא צוין",
      createdAt: Date.now(),
    }).then(async (data) => {
      setDocs(
        docs.concat(
          <PdfDoc
            key={data.id}
            document={{ name: "לא צוין", createdAt: Date.now() }}
            user={authUser.uid}
            docId={data.id}
            fresh={true}
          ></PdfDoc>
        )
      );
    });
  };

  useEffect(() => {
    if(authUser!=null){
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(
          collection(db, `Users/${authUser.uid}/Documents`)
        );

        Promise.All(
          querySnapshot.forEach(async (doc) => {
            const resDoc = doc.data();
            resDoc.file = await cleanRes(authUser.uid, doc.id);
            resDoc.id = doc.id;
            setDocs((oldArray) => [
              ...oldArray,
              <PdfDoc
                key={resDoc.id}
                document={resDoc}
                docId={doc.id}
                user={authUser.uid}
                file={resDoc.file}
              ></PdfDoc>,
            ]);
          })
        );
      } catch (err) {}
    }
    fetchData();
  }
  else{
    navigate('/')
  }
  }, []);

  return (
    <div className="dash">
      
        <div className="rowdoc">
          <button
            className="card_ add-doc"
            style={{
              width: "13rem",
              height: "20rem",
              margin: "8rem 5.1rem",
              textAlign: "center",
            }}
            onClick={addDocHandler}
          >
            <h1
              style={{ fontSize: "2rem", fontWeight: "450", margin: "50% 0" }}
            >
              הוסף מסמך<pre style={{ fontSize: "3rem" }}>+</pre>
            </h1>
          </button>
          {docs.sort(
            (a, b) =>
              new Date(b.props.document.createdAt) -
              new Date(a.props.document.createdAt)
          )}
        </div>
      
    </div>
  );
};

export default Dashboard;
