import React from "react";

const GeneratedImage = ({ image }) => {
  return (
    <div>
      <h3>Generated Image</h3>
      {image && <img src={image} alt="Generated" />}
    </div>
  );
};

export default GeneratedImage;
