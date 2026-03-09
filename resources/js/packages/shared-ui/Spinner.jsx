import React from "react";

const Spinner = ({ size = "md" }) => {
  const sizeClass = size === "sm" ? "spinner-border-sm" : "";
  return (
    <div className={`spinner-border text-primary ${sizeClass}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
