const SelectMenu = ({ objectArray, name, changeHandler }) => {
  return (
    <div className="textOnInput">
      <label htmlFor={name} className="label f-12">
        Select Occupation
      </label>
      <select
        name={name}
        id={name}
        className="options-menu"
        onChange={(e) => {
          changeHandler(parseInt(e.target.value));
        }}
      >
        {objectArray.map((object) => {
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
