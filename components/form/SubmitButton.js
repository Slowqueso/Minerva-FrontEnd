const SubmitButton = ({ label, iconSrc, submitHandler, isTransparent ,isDisabled}) => {
  return (
    <>
      <button
        type="submit"
        disabled={isDisabled ? true : false}
        className="submit-button"
        style={
          isTransparent
            ? {
                background: "transparent",
                border: `1px solid #3A3A3A`,
                color: `white`,
                margin: "1rem 1rem",
              }
            : null
        }
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
