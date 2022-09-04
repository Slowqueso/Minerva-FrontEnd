const SubmitButton = ({ label, iconSrc, submitHandler }) => {
  return (
    <>
      <button
        type="submit"
        className="submit-button"
        onClick={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        {label}
      </button>
    </>
  );
};

export default SubmitButton;
