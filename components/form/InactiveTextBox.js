const InactiveTextBox = ({ value }) => {
  return (
    <div className="textOnInput">
      <input className="form-control inactive" value={value} readOnly />
    </div>
  );
};

export default InactiveTextBox;
