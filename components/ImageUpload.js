import React, { useState, useEffect } from "react";

const ImageUpload = ({ setFileName, setImageFile, preImage }) => {
  const [uploadedImage, setUploadedImage] = useState("");
  
  const imageHandler = (e) => {
    const img = document.createElement("img");
    const imageURL = URL.createObjectURL(e.target.files[0]);
    setUploadedImage(imageURL);
    return true;
  };

  const onFileUpload = async (e) => {
    const { files } = e.target;
    if (imageHandler(e)) {
      setFileName(files[0].name);
      setImageFile(files[0]);
    }
  };
  useEffect(() => {
    if (preImage) {
      console.log(preImage);
      
    }
  }, []);
  return (
    <>
      <label htmlFor="pic-inp" style={{ borderRadius: "50%" }}>
        <div className="acc-user-profile">
          <label
            htmlFor="pic-inp"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {preImage ? (
              <img
                style={{
                  width: "189px",
                  height: "auto",
                  margin: "auto",
                }}
                src={uploadedImage ? uploadedImage : preImage}
                crossOrigin="anonymous"
                className="unselectable"
              />
            ) : (
              <img
                style={{
                  width: "189px",
                  height: "auto",
                  margin: "auto",
                }}
                src={
                  uploadedImage ? uploadedImage : "/assets/default_profile.svg"
                }
                crossOrigin="anonymous"
                className="unselectable"
              />
            )}
          </label>

          <div className="acc-user-profile-lens">
            <h3 className="lens-text unselectable f-16">Choose a Photo</h3>
          </div>
        </div>
      </label>
      <input
        type="file"
        name="profilePic"
        onChange={(e) => {
          onFileUpload(e);
          // imageHandler(e);
        }}
        id="pic-inp"
        style={{ display: "none" }}
      />
    </>
  );
};

export default ImageUpload;
