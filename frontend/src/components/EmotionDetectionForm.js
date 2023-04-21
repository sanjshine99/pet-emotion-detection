import React, { useState } from "react";
import axios from "axios";

const EmotionDetectionForm = () => {
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await axios.post("/api/emotion-detection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEmotion(response.data.emotion);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} className="form-container">
        <div>
          <label htmlFor="image">Choose an image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            required
          />
        </div>
        <button type="submit" disabled={!image || loading}>
          {loading ? "Detecting emotion..." : "Detect emotion"}
        </button>
      </form>
      {emotion && (
        <p>
          Detected emotion: <strong>{emotion}</strong>
        </p>
      )}
    </div>
  );
};

export default EmotionDetectionForm;
