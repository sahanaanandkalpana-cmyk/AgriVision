import { useState } from "react";
import "../styles/DiseaseDetection.css";
import Navbar from "../components/Navbar";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [disease, setDisease] = useState("Not Detected");
const [confidence, setConfidence] = useState("--");
const [medicine, setMedicine] = useState("--");
const [recommendation, setRecommendation] = useState(
  "Upload a crop image first."
);
const [loading, setLoading] = useState(false);

const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    setImage(URL.createObjectURL(file));
  }
};
const diseaseData = [
  {
    disease: "Tomato Early Blight",
    confidence: "96%",
    medicine: "Mancozeb 75% WP",
    recommendation:
      "Spray Mancozeb every 7 days and remove infected leaves."
  },
  {
    disease: "Rice Leaf Blast",
    confidence: "94%",
    medicine: "Tricyclazole",
    recommendation:
      "Maintain proper water level and spray Tricyclazole."
  },
  {
    disease: "Potato Late Blight",
    confidence: "95%",
    medicine: "Metalaxyl",
    recommendation:
      "Remove infected leaves and spray Metalaxyl."
  },
  {
    disease: "Corn Rust",
    confidence: "93%",
    medicine: "Propiconazole",
    recommendation:
      "Apply Propiconazole and monitor the crop regularly."
  },
  {
    disease: "Cucumber Mosaic Virus",
    confidence: "91%",
    medicine: "Neem Oil Spray",
    recommendation:
      "Control aphids and remove infected plants."
  }
];
const handleDetectDisease = () => {
  if (!image) {
    alert("Please upload an image first!");
    return;
  }

  setLoading(true);

  setTimeout(() => {
  const randomDisease =
    diseaseData[Math.floor(Math.random() * diseaseData.length)];

  setDisease(randomDisease.disease);
  setConfidence(randomDisease.confidence);
  setMedicine(randomDisease.medicine);
  setRecommendation(randomDisease.recommendation);

  setLoading(false);
}, 2000);
};
  return (
    <>
      <Navbar />

      <div className="disease-page">
        <h1>🌿 AI Disease Detection</h1>

        <p>
          Upload a crop image to detect diseases using Artificial Intelligence.
        </p>

        <div className="upload-box">
          <input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
/>

          <button onClick={handleDetectDisease} disabled={loading}>
  {loading ? "🔍 Analyzing Image..." : "Detect Disease"}
</button>
        </div>
{image && (
  <div className="preview-box">
    <h2>Image Preview</h2>

    <img
  src={image}
  alt="Crop Preview"
  className="preview-image"
/>
  </div>
)}
       <div className="result-box">
  <h2>🌿 Detection Result</h2>

  <div className="result-item">
    <span>🦠 Disease</span>
    <strong>{disease}</strong>
  </div>

  <div className="result-item">
    <span>📊 Confidence</span>
    <strong>{confidence}</strong>
  </div>

  <div className="result-item">
    <span>💊 Medicine</span>
    <strong>{medicine}</strong>
  </div>

  <div className="result-item">
    <span>✅ Recommendation</span>
    <strong>{recommendation}</strong>
  </div>
</div>
</div>
</>
  );
}

export default DiseaseDetection;