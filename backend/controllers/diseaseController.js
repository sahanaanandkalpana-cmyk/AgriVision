const detectDisease = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ message: "Please upload a crop image." });
    }

    const imageBase64 = image.includes(",") ? image.split(",")[1] : image;
    const response = await fetch(
      `${process.env.PLANT_DISEASE_URL || "http://127.0.0.1:8000"}/predict`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const providerMessage = errorData.message || response.statusText;
      console.error("Plant disease model error:", providerMessage);
      return res.status(502).json({
        message: `Disease classifier unavailable: ${providerMessage}`,
      });
    }

    return res.status(200).json(await response.json());
  } catch (error) {
    console.error("Disease Detection Error:", error);
    return res.status(500).json({ message: "Unable to analyze the crop image." });
  }
};

module.exports = { detectDisease };