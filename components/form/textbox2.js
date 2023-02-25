import React, { useState } from "react";

const TextBox2 = ({ label, name, inputUpdate, isPassword, value }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="textOnInput2">
      <label
        className="label f-16"
        // style={isSelected ? { display: "block" } : { display: "none" }}
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
        //   placeholder={isSelected ? "" : label}
          // value={value ? value : ""}
          onChange={(e) => {
            inputUpdate(e.target.value);
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
        //   placeholder={isSelected ? "" : label}
          value={value}
          onChange={(e) => {
            inputUpdate(e.target.value);
          }}
        />
      )}
    </div>
  );
};

export default TextBox2;
