import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import Weather from "./pages/Weather";
import SmartIrrigation from "./pages/SmartIrrigation";
import CropRecommendation from "./pages/CropRecommendation";
import DroneMonitoring from "./pages/DroneMonitoring";
import ProfitEstimation from "./pages/ProfitEstimation";
import AIAssistant from "./pages/AIAssistant";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import CropHealth from "./pages/CropHealth";
import SoilMoisture from "./pages/SoilMoisture";
import Drone from "./pages/Drone";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import FarmManagement from "./pages/FarmManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
      <Route path="/disease-detection" element={<DiseaseDetection />} />
      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        }
      />
      <Route path="/smart-irrigation" element={<SmartIrrigation />} />
      <Route path="/crop-recommendation" element={<CropRecommendation />} />
      <Route path="/drone-monitoring" element={<DroneMonitoring />} />
      <Route path="/profit-estimation" element={<ProfitEstimation />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/crop-health" element={<CropHealth />} />
      <Route path="/soil-moisture" element={<SoilMoisture />} />
      <Route path="/drone" element={<Drone />} />
      <Route path="/register" element={<Register />} />
      <Route path="/farm-management" element={<FarmManagement />} />
    
    </Routes>
  );
}

export default App;