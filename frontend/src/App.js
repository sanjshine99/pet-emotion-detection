import { useState } from "react";
import axios from "axios";
import "./App.css";
import EmotionDetectionForm from "./components/EmotionDetectionForm";
import GeneratedImage from "./components/GeneratedImage";

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmotionDetection = async (image) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post("/api/emotion-detection", formData);
      setImageUrl(response.data.imageUrl);
      setEmotion(response.data.emotion);
    } catch (err) {
      setError(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/image-generation", {
        emotion: emotion,
      });
      setGeneratedImageUrl(response.data.imageUrl);
    } catch (err) {
      setError(err.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Pet Emotion Detection</h1>
      <EmotionDetectionForm
        onEmotionDetection={handleEmotionDetection}
        imageUrl={imageUrl}
        emotion={emotion}
        loading={loading}
        error={error}
      />
      {generatedImageUrl && <GeneratedImage imageUrl={generatedImageUrl} />}
      <button
        onClick={handleImageGeneration}
        disabled={!generatedImageUrl || loading}
      >
        Generate Image
      </button>
    </div>
  );
}

export default App;
