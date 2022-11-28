import React, { useState } from "react";
const TitleBox = ({ label, name, inputUpdate, isPassword, value, index }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="textOnInput">
      <label
        className="label f-12"
        htmlFor={name}
        style={isSelected ? { display: "block" } : { display: "none" }}
      >
        {label}
      </label>
      <input
        className="form-control"
        type={isPassword ? "password" : "text"}
        name={name}
        onFocus={() => setIsSelected(true)}
        onBlur={() => setIsSelected(false)}
        id={name}
        placeholder={isSelected ? "" : label}
        value={value}
        onChange={(e) => {
          inputUpdate(index, e);
        }}
      />
    </div>
  );
};

export default TitleBox;
