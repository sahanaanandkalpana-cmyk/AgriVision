const getAssistantAdvice = async (req, res) => {
  try {
    const { crop, disease, problem, location } = req.body;

    if (!problem || !problem.trim()) {
      return res.status(400).json({
        message: "Please describe the crop problem.",
      });
    }

    const useOllama = (process.env.AI_PROVIDER || "ollama").toLowerCase() === "ollama";
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const useGemini = Boolean(geminiApiKey);
    const apiKey = useGemini ? geminiApiKey : openaiApiKey;

    if (!useOllama && !apiKey) {
      return res.status(503).json({
        message: "AI Assistant is not configured. Add Ollama or an AI provider key to backend/.env.",
      });
    }

    const prompt = [
      `Crop: ${crop?.trim() || "Not provided"}`,
      `Suspected disease or pest: ${disease?.trim() || "Not provided"}`,
      `Farmer's problem: ${problem.trim()}`,
      `Location: ${location?.trim() || "Not provided"}`,
    ].join("\n");

    const systemPrompt =
      "You are AgriVision AI, a careful agricultural assistant. Give practical, concise guidance based only on the farmer's details. Structure every answer with: Likely cause, What to do now, Prevention, and When to contact an agriculture expert. Never claim certainty from text alone. Do not recommend unsafe pesticide mixing or exact chemical doses without a product label and local agricultural guidance. Ask one clarifying question at the end only when important information is missing.";

    const response = await fetch(
      useOllama
        ? `${process.env.OLLAMA_URL || "http://127.0.0.1:11434"}/api/chat`
        : useGemini
        ? `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-2.0-flash"}:streamGenerateContent?alt=sse&key=${apiKey}`
        : "https://api.openai.com/v1/chat/completions",
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(!useOllama && !useGemini ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(
        useOllama
          ? {
              model: process.env.OLLAMA_MODEL || "llama3.2",
              stream: true,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
              ],
            }
          : useGemini
          ? {
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 700 },
            }
          : {
              model: process.env.OPENAI_MODEL || "gpt-4o-mini",
              temperature: 0.2,
              max_tokens: 700,
              stream: true,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
              ],
            },
      ),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("AI provider error:", data.error?.message || data.error?.status || response.statusText);

      if (response.status === 429) {
        return res.status(502).json({
          message: useOllama
            ? "Ollama is not reachable. Start Ollama and make sure the llama3.2 model is installed."
            : useGemini
            ? "The free AI service quota has been reached. Try again later or check the Gemini API quota."
            : "The AI service has no remaining credits. Add billing credits to the OpenAI account or configure GEMINI_API_KEY for the free Gemini tier.",
        });
      }

      return res.status(502).json({
        message: "The AI service could not answer right now. Please try again.",
      });
    }

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const payload = useOllama
          ? trimmedLine
          : trimmedLine.startsWith("data: ")
            ? trimmedLine.slice(6).trim()
            : "";
        if (!payload) continue;
        if (payload === "[DONE]") continue;

        try {
          const chunk = JSON.parse(payload);
          const delta = useOllama
            ? chunk.message?.content
            : useGemini
            ? chunk.candidates?.[0]?.content?.parts?.[0]?.text
            : chunk.choices?.[0]?.delta?.content;
          if (delta) {
            res.write(`data: ${JSON.stringify({ delta })}\n\n`);
          }
        } catch (parseError) {
          console.error("AI stream parse error:", parseError);
        }
      }

      if (done) break;
    }

    res.write("data: [DONE]\n\n");
    return res.end();
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return res.status(500).json({
      message: "Unable to reach the AI Assistant. Please try again.",
    });
  }
};

module.exports = { getAssistantAdvice };
