const RadioConfirmation = ({
  label,
  name,
  href,
  hyperlink,
  changeHandler,
  isChecked,
}) => {
  return (
    <div className="flex-together">
      <input
        type={"checkbox"}
        name={name}
        value="1"
        id={name}
        onChange={(e) => {
          if (isChecked) {
            changeHandler(false);
          } else {
            changeHandler(true);
          }
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
