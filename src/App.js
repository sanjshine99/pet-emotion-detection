import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [petEmotionText, setPetEmotionText] = useState("");
  const [petEmotionImageUrl, setPetEmotionImageUrl] = useState("");

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Create a new FormData object and append the selected file to it
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Send a POST request to the /api/emotion-detection endpoint to process the image
      const response = await axios.post("/api/emotion-detection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the petEmotionText state variable with the generated text
      setPetEmotionText(response.data);

      try {
        // Send a POST request to the /api/image-generation endpoint to generate the pet emotion image
        const imageResponse = await axios.post("/api/image-generation", {
          text: response.data,
        });

        // Update the petEmotionImageUrl state variable with the URL of the generated image
        setPetEmotionImageUrl(imageResponse.data);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Pet Emotion Detection</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileInputChange} />
        <button type="submit" disabled={!selectedFile}>
          Detect Emotion
        </button>
      </form>
      {petEmotionText && (
        <div>
          <h2>Emotion: {petEmotionText}</h2>
          {petEmotionImageUrl && (
            <div>
              <img src={petEmotionImageUrl} alt="Pet emotion" />
              <div>
                <a href={petEmotionImageUrl} download>
                  Download
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${petEmotionImageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Twitter
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
