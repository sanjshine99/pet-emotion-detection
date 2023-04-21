import React from "react";

const GeneratedImage = ({ imageUrl }) => {
  return (
    <div>
      <h3>Generated Image</h3>
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
};

export default GeneratedImage;
