const RadioConfirmation = ({ label, name, href, hyperlink, changeHandler }) => {
  return (
    <div className="flex-together">
      <input
        type="radio"
        name={name}
        value="1"
        id={name}
        onChange={(e) => {
          e.target.value === "1" ? changeHandler(true) : changeHandler(false);
          console.log(e.target.value);
        }}
      />
      <div className="flex-together">
        <label htmlFor={name} className="label">
          {label}
        </label>
        <a href={href}>{hyperlink}</a>
      </div>
    </div>
  );
};

export default RadioConfirmation;
