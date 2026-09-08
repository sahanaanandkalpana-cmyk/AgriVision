import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/AIAssistant.css";

function AIAssistant() {
  const [form, setForm] = useState({
    crop: "",
    disease: "",
    problem: "",
    location: "",
  });
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const askAI = async (event) => {
    event.preventDefault();

    if (!form.problem.trim()) {
      setError("Describe the crop problem so the assistant can help.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get AI advice");
      }

      setAnswer(data.answer);
    } catch (requestError) {
      setAnswer("");
      setError(requestError.message || "Unable to reach the AI Assistant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="ai-page">

        <h1>🤖 AgriVision AI Assistant</h1>

        <p>Tell the assistant what is happening in your crop for practical guidance.</p>

        <form className="chat-box" onSubmit={askAI}>
          <div className="assistant-fields">
            <label>
              Crop
              <input
                name="crop"
                value={form.crop}
                onChange={handleChange}
                placeholder="e.g. tomato, rice, maize"
              />
            </label>

            <label>
              Suspected disease or pest
              <input
                name="disease"
                value={form.disease}
                onChange={handleChange}
                placeholder="e.g. leaf spot, aphids, unknown"
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Vellore"
              />
            </label>
          </div>

          <label>
            What problem are you seeing? <span className="required-mark">*</span>
            <textarea
              name="problem"
              placeholder="Describe the symptoms, when they started, and how the crop is affected..."
              value={form.problem}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Get farming advice"}
          </button>
          {error && <p className="assistant-error">{error}</p>}
        </form>

        {answer && (
          <div className="response-box">
            <h2>🤖 AgriVision AI Advice</h2>
            <p className="assistant-answer">{answer}</p>
            <p className="assistant-note">
              AI guidance is informational. Confirm disease identification and treatment with a local agriculture expert.
            </p>
          </div>
        )}

      </div>
    </>
  );
}

export default AIAssistant;