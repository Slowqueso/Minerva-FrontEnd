import React, { useState } from "react";

const TextArea = ({ label, name, inputUpdate, isPassword, value, index }) => {
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
      {value || value === "" ? (
        <textarea
          className="form-control"
          type={isPassword ? "password" : "text"}
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
          name={name}
          id={name}
          value={value}
          placeholder={isSelected ? "" : label}
          onChange={(e) => {
            
            if(index>=0){
              inputUpdate(index, e);
            }
            else{
              inputUpdate(e.target.value);
            }
          }}
        />
      ) : (
        <textarea
          className="form-control"
          type={isPassword ? "password" : "text"}
          onFocus={() => setIsSelected(true)}
          onBlur={() => setIsSelected(false)}
          name={name}
          id={name}
          placeholder={isSelected ? "" : label}
          onChange={(e) => {
            inputUpdate(e.target.value);
          }}
        />
      )}
    </div>
  );
};

export default TextArea;
