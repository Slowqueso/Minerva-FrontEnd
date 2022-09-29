const TextBox = ({ label, name, inputUpdate, isPassword, value }) => {
  return (
    <div className="textOnInput">
      <label className="label f-12" htmlFor={name}>
        {label}
      </label>
      <input
        className="form-control"
        type={isPassword ? "password" : "text"}
        name={name}
        id={name}
        // value={value ? value : ""}
        onChange={(e) => {
          inputUpdate(e.target.value);
        }}
      />
    </div>
  );
};

export default TextBox;
