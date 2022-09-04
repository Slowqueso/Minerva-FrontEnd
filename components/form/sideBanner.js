const SideBanner = ({ title, fileName }) => {
  return (
    <div className="divider side-banner-container">
      <h1 className="banner-title unselectable">{title}</h1>
      <img
        src={"/assets/" + fileName}
        alt=""
        className="side-image unselectable"
      />
    </div>
  );
};

export default SideBanner;
