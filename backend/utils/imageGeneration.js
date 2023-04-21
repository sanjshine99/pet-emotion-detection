const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const STABILITY_AI_API_KEY = process.env.STABILITY_AI_API_KEY;

/**
 * Generates an image using the stability.ai Text-to-Image API and returns the URL of the generated image.
 * @param {string} text The text to be used to generate the image.
 * @returns {Promise<string>} The URL of the generated image.
 */
async function generateImage(text) {
  // Set up the request parameters
  const formData = new FormData();
  formData.append("text", text);
  formData.append("model", "image-alpha-001");

  const config = {
    headers: {
      ...formData.getHeaders(),
      "Api-Key": STABILITY_AI_API_KEY,
    },
  };

  // Send the request to the stability.ai Text-to-Image API
  const response = await axios.post(
    "https://api.stability.ai/image/generate",
    formData,
    config
  );

  // Save the generated image to a file
  const imageBuffer = Buffer.from(response.data, "binary");
  const filePath = `${__dirname}/../../public/images/${text}.png`;
  fs.writeFileSync(filePath, imageBuffer);

  // Return the URL of the generated image
  return `/images/${text}.png`;
}

module.exports = generateImage;
