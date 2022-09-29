const TextArea = ({ label, name, inputUpdate, isPassword, value, index }) => {
  return (
    <div className="textOnInput">
      <label className="label f-12" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="form-control"
        type={isPassword ? "password" : "text"}
        name={name}
        id={name}
        value={value}
        onChange={(e) => {
          inputUpdate(index, e);
        }}
      />
    </div>
  );
};

export default TextArea;
