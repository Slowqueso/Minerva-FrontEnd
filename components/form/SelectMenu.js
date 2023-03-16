const SelectMenu = ({
  objectArray,
  name,
  changeHandler,
  label,
  value,
  isString,
}) => {
  return (
    <div className="textOnInput">
      {label ? (
        <label htmlFor={name} className="label f-12">
          {label}
        </label>
      ) : null}
      <select
        value={value}
        name={name}
        id={name}
        className="options-menu"
        onChange={(e) => {
          if (!isString) {
            changeHandler(parseInt(e.target.value));
          } else {
            changeHandler(e.target.value);
          }
        }}
      >
        {objectArray.map((object, index) => {
          return (
            <option value={object.value} key={object.value}>
              {object.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectMenu;
