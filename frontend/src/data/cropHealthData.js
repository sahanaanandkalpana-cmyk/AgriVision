export const cropHealthCrops = [
  { name: "Rice", icon: "🌾", score: 89, issue: "No major issues", tone: "good" },
  { name: "Tomato", icon: "🍅", score: 72, issue: "Leaf spot watch", tone: "warn" },
  { name: "Cotton", icon: "🌿", score: 91, issue: "Healthy", tone: "good" },
  { name: "Maize", icon: "🌽", score: 54, issue: "Stress detected", tone: "bad" },
];

export const prototypeZones = [
  { name: "Field A", score: 92, issue: "No major issues detected", affected: 8, action: "Continue routine monitoring", tone: "good", lastScan: "Today · 11:45 AM" },
  { name: "Field B", score: 71, issue: "Possible leaf blight", affected: 29, action: "Inspect affected plants", tone: "warn", lastScan: "Today · 11:40 AM" },
  { name: "Field C", score: 48, issue: "Crop stress hotspot", affected: 52, action: "Schedule a follow-up scan", tone: "bad", lastScan: "Yesterday · 04:20 PM" },
];

export const prototypeHistory = [
  { id: "scan-1", time: "Today · 11:45 AM", crop: "Rice", disease: "Leaf Blight", confidence: "91%", score: 82, risk: 18, status: "Needs Attention", image: "", tone: "warn" },
  { id: "scan-2", time: "Yesterday · 04:20 PM", crop: "Rice", disease: "Possible fungal condition", confidence: "86%", score: 76, risk: 26, status: "Needs Attention", image: "", tone: "warn" },
  { id: "scan-3", time: "2 days ago · 10:15 AM", crop: "Rice", disease: "Healthy crop", confidence: "94%", score: 84, risk: 14, status: "Healthy", image: "", tone: "good" },
];

export const trendData = {
  "7 days": [78, 81, 76, 79, 80, 78, 82],
  "30 days": [74, 77, 75, 79, 78, 80, 82],
  Season: [68, 72, 76, 74, 79, 78, 82],
};