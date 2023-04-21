const { createApi } = require("unsplash-js");
const Redis = require("ioredis");
const { v4: uuidv4 } = require("uuid");
const { upload } = require("stablelib").textToImage;
const { promisify } = require("util");
const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();
app.use(fileUpload());

// Set up a Redis client
const redis = redis.createClient({
  url: "redis://localhost:6379",
});

// Set up an Unsplash client
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

// Define a function to generate the pet emotion text
const generatePetEmotionText = async (imageUrl) => {
  // Check if the pet emotion text is already in the Redis cache
  const cacheKey = `pet-emotion-text:${imageUrl}`;
  const cachedText = await redis.get(cacheKey);
  if (cachedText !== null) {
    return cachedText;
  }

  // Call the ChatGPT API to generate the pet emotion text
  const response = await fetch(process.env.CHATGPT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `I am feeling ${uuidv4()}`,
      image_url: imageUrl,
    }),
  });
  const data = await response.json();
  const petEmotionText = data.choices[0].text.trim();

  // Cache the pet emotion text in Redis for 1 hour
  const setAsync = promisify(redis.set).bind(redis);
  await setAsync(cacheKey, petEmotionText, "EX", 3600);

  return petEmotionText;
};

// Define a function to generate the pet emotion image
const generatePetEmotionImage = async (text) => {
  // Check if the pet emotion image URL is already in the Redis cache
  const cacheKey = `pet-emotion-image:${text}`;
  const cachedImageUrl = await redis.get(cacheKey);
  if (cachedImageUrl !== null) {
    return cachedImageUrl;
  }

  // Call the stablelib API to generate the pet emotion image
  const image = await upload(text, { width: 400, height: 400 });
  const imageBuffer = await image.toBuffer();
  const imageData = imageBuffer.toString("base64");

  // Call the Unsplash API to upload the image
  const response = await unsplash.uploads.uploadPhoto(imageData);
  const imageUrl = response.response.urls.full;

  // Cache the pet emotion image URL in Redis for 1 hour
  const setAsync = promisify(redis.set).bind(redis);
  await setAsync(cacheKey, imageUrl, "EX", 3600);

  return imageUrl;
};

// Define the API endpoints
module.exports = async (req, res) => {
  // Handle the /api/emotion-detection endpoint
  if (req.method === "POST" && req.path === "/api/emotion-detection") {
    const file = req.files.image;
    const imageData = file.data.toString("base64");
    const imageUrl = await unsplash.uploads.uploadPhoto(imageData);

    const petEmotionText = await generatePetEmotionText(imageUrl);
    res.status(200).json({ text: petEmotionText });
  }

  // Handle the /api/image-generation endpoint
  if (req.method === "POST" && req.path === "/api/image-generation")
    if (req.method === "POST" && req.path === "/api/image-generation") {
      // Handle the /api/image-generation endpoint
      const { text } = req.body;

      const petEmotionImageUrl = await generatePetEmotionImage(text);
      res.status(200).json({ imageUrl: petEmotionImageUrl });
    }
};
