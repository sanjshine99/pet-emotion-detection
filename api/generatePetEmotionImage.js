const generatePetEmotionImage = async (text) => {
  // Use the stability.ai Text-to-Image API to generate an image from the text
  const apiUrl = "https://api.stability.ai/v1/models/text-to-image:generate";
  const apiKey = process.env.STABILITY_AI_API_KEY;
  const response = await axios.post(
    apiUrl,
    {
      prompt: text,
      model: "image-alpha-001",
      num_images: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const imageUrl = response.data.generated_images[0].url;

  return imageUrl;
};
