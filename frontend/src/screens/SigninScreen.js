import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import app from "../fire";

const SigninScreen = () => {
  const auth = getAuth(app);
  auth.onAuthStateChanged(function (authUser) {
    authUser
      ? localStorage.setItem("authUser", JSON.stringify(authUser))
      : localStorage.removeItem("authUser");
  });
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password);
  };

  useEffect(() => {
    if (authUser) {
      navigate(`/dashboard/${authUser.uid}`);
    }
  }, [authUser, navigate]);

  return (
    <div>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <Form className="log-form" onSubmit={submitHandler}>
        <label htmlFor="email">אימייל</label>
        <input
          required
          type="text"
          placeholder="הכנס אימייל"
          id="username"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">סיסמה</label>
        <input
          required
          type="password"
          placeholder="הכנס סיסמה"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">התחבר</button>
        <div>
          <span>לקוח חדש?</span>
          <Link to={`/register`}>צור חשבון</Link>
        </div>
      </Form>
    </div>
  );
};

export default SigninScreen;
