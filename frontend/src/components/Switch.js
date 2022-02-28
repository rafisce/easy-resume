import React from "react";

const Switch = () => {
  return (
    <>
      <input
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        style={{ marginTop: "2rem" }}
      />
      <label className="react-switch-label" htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;