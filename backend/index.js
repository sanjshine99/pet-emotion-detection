const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const emotionDetection = require("./utils/emotionDetection");
const imageGeneration = require("./utils/imageGeneration");

const app = express();

app.use(cors());
app.use(fileUpload({ createParentPath: true }));
app.use(express.static("public"));

app.post("/api/emotion-detection", emotionDetection);
app.post("/api/image-generation", imageGeneration);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
