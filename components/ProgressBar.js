import React from "react";

const Progress_bar = ({ bgcolor, progress, height }) => {
  const Parentdiv = {
    height: height,
    width: "40%",
    margin: "2rem auto",
    backgroundColor: "transparent",
    // borderRadius: 40,
    // margin: 50,
    // position: "absolute",
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    borderRadius: 10,
    textAlign: "right",
    background: `linear-gradient(90deg, #67C2A1 0%, #656BFF 18.75%, #9F8CD7 44.27%, #D663FF 66.67%, #F0D1FF 89.06%, #FFFFFF 100%)`,
  };

  const progresstext = {
    padding: 10,
    color: "black",
    fontWeight: 900,
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        {/* <span style={progresstext}>{`${progress}%`}</span> */}
      </div>
    </div>
  );
};

export default Progress_bar;
