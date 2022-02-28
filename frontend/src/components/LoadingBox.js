import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const LoadingBox = (props) => {
  return (
    <div className="loading" style={{ marginTop: props.view ? "150%" : "" }}>
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        style={{ fontSize: props.view ? "130px" : "50px", color: "white" }}
      />
    </div>
  );
};

export default LoadingBox;
