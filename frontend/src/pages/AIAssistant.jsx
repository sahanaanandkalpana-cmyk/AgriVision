import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/AIAssistant.css";

function AIAssistant() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Hello! 👋 I'm AgriVision AI. Ask me anything about farming."
  );

  const responses = [
    "🌾 Rice grows best in fertile clay soil with proper irrigation.",
    "💧 Irrigate your crops early in the morning to reduce water loss.",
    "🌱 Use organic compost to improve soil fertility.",
    "🦠 Remove infected leaves immediately to prevent disease spread.",
    "☀️ Ensure crops receive enough sunlight for healthy growth.",
    "🐛 Neem oil is an effective natural pesticide for many crop pests."
  ];

  const askAI = () => {

    if (question.trim() === "") {
      alert("Please enter a question!");
      return;
    }

    const random =
      responses[Math.floor(Math.random() * responses.length)];

    setAnswer(random);
    setQuestion("");
  };

  return (
    <>
      <Navbar />

      <div className="ai-page">

        <h1>🤖 AgriVision AI Assistant</h1>

        <p>
          Ask any farming-related question and receive AI guidance.
        </p>

        <div className="chat-box">

          <textarea
            placeholder="Ask your farming question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button onClick={askAI}>
            Send
          </button>

        </div>

        <div className="response-box">

          <h2>🤖 AI Response</h2>

          <p>{answer}</p>

        </div>

      </div>
    </>
  );
}

export default AIAssistant;