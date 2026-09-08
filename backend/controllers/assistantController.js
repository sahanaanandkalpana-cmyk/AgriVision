const getAssistantAdvice = async (req, res) => {
  try {
    const { crop, disease, problem, location } = req.body;

    if (!problem || !problem.trim()) {
      return res.status(400).json({
        message: "Please describe the crop problem.",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message: "AI Assistant is not configured. Add OPENAI_API_KEY to backend/.env.",
      });
    }

    const prompt = [
      `Crop: ${crop?.trim() || "Not provided"}`,
      `Suspected disease or pest: ${disease?.trim() || "Not provided"}`,
      `Farmer's problem: ${problem.trim()}`,
      `Location: ${location?.trim() || "Not provided"}`,
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "You are AgriVision AI, a careful agricultural assistant. Give practical, concise guidance based only on the farmer's details. Structure every answer with: Likely cause, What to do now, Prevention, and When to contact an agriculture expert. Never claim certainty from text alone. Do not recommend unsafe pesticide mixing or exact chemical doses without a product label and local agricultural guidance. Ask one clarifying question at the end only when important information is missing.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("AI provider error:", data.error?.message || response.statusText);
      return res.status(502).json({
        message: "The AI service could not answer right now. Please try again.",
      });
    }

    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return res.status(502).json({
        message: "The AI service returned an empty answer. Please try again.",
      });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return res.status(500).json({
      message: "Unable to reach the AI Assistant. Please try again.",
    });
  }
};

module.exports = { getAssistantAdvice };
