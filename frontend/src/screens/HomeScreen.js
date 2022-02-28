import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  useEffect(() => {
    if (authUser) {
      navigate(`/dashboard/${authUser.uid}`);
    }
  }, [authUser, navigate]);

  return <div>Home Screen</div>;
};

export default HomeScreen;
