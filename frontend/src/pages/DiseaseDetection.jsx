import { useEffect, useState } from "react";
import "../styles/DiseaseDetection.css";
import Navbar from "../components/Navbar";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => image && URL.revokeObjectURL(image), [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setResult(null);
    setError("");

    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDetectDisease = async () => {
    if (!imageData) {
      setError("Please upload a crop image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to analyze image.");
      setResult(data);
    } catch (requestError) {
      setError(requestError.message || "Unable to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="disease-page">
        <h1>AI Disease Detection</h1>
        <p>Upload a clear crop image for local Ollama vision analysis.</p>

        <section className="upload-box">
          <label className="file-label" htmlFor="crop-image">Choose crop image</label>
          <input id="crop-image" type="file" accept="image/*" onChange={handleImageChange} />
          <button type="button" onClick={handleDetectDisease} disabled={loading || !imageData}>
            {loading ? "Analyzing image..." : "Detect disease"}
          </button>
          {error && <p className="disease-error">{error}</p>}
        </section>

        {image && (
          <section className="preview-box">
            <h2>Image Preview</h2>
            <img src={image} alt="Uploaded crop" className="preview-image" />
          </section>
        )}

        {result && (
          <section className="result-box">
            <h2>Detection Result</h2>
            <div className="result-item"><span>Disease</span><strong>{result.disease}</strong></div>
            <div className="result-item"><span>Confidence</span><strong>{result.confidence}</strong></div>
            <div className="result-item"><span>Suggested treatment</span><strong>{result.medicine}</strong></div>
            <div className="result-item"><span>Recommendation</span><strong>{result.recommendation}</strong></div>
            <p className="disease-note">
              {result.isCropImage
                ? "AI results are informational. Confirm diagnosis and treatment with a local agriculture expert."
                : "This image was rejected because it does not clearly show a crop or plant leaf."}
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export default DiseaseDetection;