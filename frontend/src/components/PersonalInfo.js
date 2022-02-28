import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import app from "../fire";

const PersonalInfo = (props) => {
  const db = getFirestore(app);
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [city, setCity] = useState("");
  const [license, setLicense] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [old, setOld] = useState();
  const [started, SetStarted] = useState(true);

  const updateInfo = async (data) => {
    await updateDoc(doc(db, `Users/${authUser.uid}`), data);
  };

  const changed = (old, updated) => {
    if (old !== updated) {
      console.log("changed " + old + " to " + updated);
      props.updateParent();
    }
  };

  useEffect(() => {
    if (authUser) {
      async function fetchData() {
        const docRef = doc(db, `Users/${authUser.uid}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && started) {
          const info = docSnap.data();
          setFname(info.first_name);
          setLname(info.last_name);
          setEmail(info.email);
          setPhone(info.phone);
          setCity(info.city);
          setLicense(info.license);
          setJob(info.job);
          setAddress(info.address);
          setBirthDate(info.date_of_birth);
          SetStarted(false);
        }
      }
      fetchData();
    }
  }, [authUser, db, started]);
  return (
    <div className="personal-info">
      <h2 style={{ margrin: "25px" }}>פרטים אישיים</h2>
      <div className="row space">
        <div className="field">
          <label>שם</label>
          <input
            type="text"
            name="name"
            value={fname || ""}
            onChange={(e) => setFname(e.target.value)}
            onBlur={(e) =>
              updateInfo({ first_name: fname }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
        <div className="field">
          <label> שם משפחה</label>
          <input
            type="text"
            name="lastName"
            value={lname || ""}
            onChange={(e) => setLname(e.target.value)}
            onBlur={(e) =>
              updateInfo({ last_name: lname }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
      </div>
      <div className="row space">
        <div className="field">
          <label>אימייל</label>
          <input
            type="email"
            name="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) =>
              updateInfo({ email: email }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
        <div className="field">
          <label> טלפון </label>
          <input
            type="tel"
            name="phone"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={(e) =>
              updateInfo({ phone: phone }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
      </div>
      <div className="row space">
        <div>
          <label>עיר</label>
          <input
            type="text"
            name="city"
            value={city || ""}
            onChange={(e) => setCity(e.target.value)}
            onBlur={(e) => updateInfo({ city: city })}
            onFocus={(e) =>
              setOld(e.target.value) + changed(old, e.target.value)
            }
            required
          ></input>
        </div>
        <div>
          <label> כתובת</label>
          <input
            type="text"
            name="address"
            value={address || ""}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={(e) =>
              updateInfo({ address: address }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
      </div>
      <div className="row space">
        <div>
          <label>תפקיד</label>
          <input
            type="text"
            name="job"
            value={job || ""}
            onChange={(e) => setJob(e.target.value)}
            onBlur={(e) =>
              updateInfo({ job: job }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label> רישיון </label>
          <input
            type="text"
            name="license"
            value={license || ""}
            onChange={(e) => setLicense(e.target.value)}
            onBlur={(e) =>
              updateInfo({ license: license }) + changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
      </div>

      <div className="row space">
        <div>
          <label>תאריך לידה</label>
          <input
            type="text"
            name="birthdate"
            value={birthDate || ""}
            onChange={(e) => setBirthDate(e.target.value)}
            onBlur={(e) =>
              updateInfo({ birth_date: birthDate }) +
              changed(old, e.target.value)
            }
            onFocus={(e) => setOld(e.target.value)}
            required
          ></input>
        </div>
        <div>
          <label> שם משפחה</label>
          <input type="text" name="lastName" required></input>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
