const axios = require("axios");
const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

module.exports = async (req, res) => {
  try {
    const file = req.files.image;
    const imageData = file.data.toString("base64");

    const cacheKey = imageData;
    client.get(cacheKey, async (error, result) => {
      if (error) throw error;

      if (result !== null) {
        console.log("Retrieving from cache");
        return res.status(200).json(JSON.parse(result));
      } else {
        const { data: emotions } = await axios.post(
          process.env.CHATGPT_API_URL,
          {
            prompt: `Detect the emotion of this image: ${req.body.imageUrl}`,
            max_tokens: 1,
            n: 1,
            stop: ["\n"],
            temperature: 0.5,
            frequency_penalty: 0,
            presence_penalty: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.CHATGPT_API_KEY}`,
            },
          }
        );

        client.setex(cacheKey, 3600, JSON.stringify(emotions));
        console.log("Added to cache");

        return res.status(200).json(emotions);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
