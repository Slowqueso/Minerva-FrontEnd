import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SubmitButton = ({
  label,
  iconSrc,
  submitHandler,
  isTransparent,
  isDisabled,
}) => {
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
                marginLeft: "0px",
              }
            : null
        }
        onClick={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        <h3>{label}</h3>
        {iconSrc ? (
          <FontAwesomeIcon
            style={{ marginLeft: "1rem" }}
            icon={iconSrc}
          ></FontAwesomeIcon>
        ) : null}
      </button>
    </>
  );
};

export default SubmitButton;
