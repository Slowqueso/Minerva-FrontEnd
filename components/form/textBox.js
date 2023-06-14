import React, { useState } from "react";

const TextBox = ({ label, name, inputUpdate, isPassword, value, onChange }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="textOnInput">
      <label
        className="label f-12"
        style={isSelected ? { display: "block" } : { display: "none" }}
        htmlFor={name}
      >
        {label}
      </label>
      {!value ? (
        <input
          className="form-control"
          type={isPassword ? "password" : "text"}
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
          name={name}
          id={name}
          placeholder={isSelected ? "" : label}
          // value={value ? value : ""}
          onChange={(e) => {
            inputUpdate(e.target.value);
            // onChange(e.target.value);
          }}
        />
      ) : (
        <input
          className="form-control"
          type={isPassword ? "password" : "text"}
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
          name={name}
          id={name}
          placeholder={isSelected ? "" : label}
          value={value}
          onChange={(e) => {
            inputUpdate(e.target.value);
            // onChange(e.target.value);
          }}
        />
      )}
    </div>
  );
};

export default TextBox;
