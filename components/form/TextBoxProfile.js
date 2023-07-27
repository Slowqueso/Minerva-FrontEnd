import React, { useState } from "react";

const TextBoxProfile = ({ label, name, inputUpdate, isPassword, value }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div className="textOnInputProfile">
      <label className="label f-16" htmlFor={name}>
        {label}
      </label>
      {!value ? (
        <>
          <input
            className="form-control"
            type={isPassword ? "password" : "text"}
            onFocus={() => setIsSelected(true)}
            onBlur={() => setIsSelected(false)}
            name={name}
            id={name}
            onChange={(e) => {
              inputUpdate(e.target.value);
            }}
          />
        </>
      ) : (
        <input
          className="form-control"
          type={isPassword ? "password" : "text"}
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
          name={name}
          id={name}
          value={value}
          onChange={(e) => {
            console.log(value);
            inputUpdate(e.target.value);
          }}
        />
      )}
    </div>
  );
};

export default TextBoxProfile;
