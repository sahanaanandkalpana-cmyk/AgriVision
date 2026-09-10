export const defaultProfitInputs = {
  crop: "Rice",
  area: "5",
  unit: "acre",
  yieldPerArea: "2400",
  price: "32",
  duration: "Kharif · 120 days",
  seeds: "6500",
  fertilizer: "12500",
  pesticides: "5500",
  labour: "22000",
  irrigation: "7000",
  machinery: "9000",
  electricity: "4500",
  transportation: "6000",
  other: "3500",
};

export const costFields = [
  ["seeds", "Seeds", "🌱"],
  ["fertilizer", "Fertilizer", "🧪"],
  ["pesticides", "Pesticides / medicine", "🛡️"],
  ["labour", "Labour", "👩‍🌾"],
  ["irrigation", "Irrigation", "💧"],
  ["machinery", "Machinery", "🚜"],
  ["electricity", "Electricity / fuel", "⚡"],
  ["transportation", "Transportation", "🚚"],
  ["other", "Other expenses", "📦"],
];

export const cropProfiles = {
  Rice: { icon: "🌾", price: 32, yieldPerAcre: 2400, costs: [6500, 12500, 5500, 22000, 7000, 9000, 4500, 6000, 3500] },
  Tomato: { icon: "🍅", price: 38, yieldPerAcre: 5200, costs: [9000, 14500, 8500, 26000, 8500, 7500, 5000, 8500, 4500] },
  Maize: { icon: "🌽", price: 24, yieldPerAcre: 2800, costs: [5500, 10000, 4500, 18000, 6000, 8500, 4000, 5500, 3000] },
  Cotton: { icon: "🌿", price: 68, yieldPerAcre: 850, costs: [8000, 11500, 9000, 21000, 6500, 8500, 4500, 6500, 3500] },
  Sugarcane: { icon: "🎋", price: 3.6, yieldPerAcre: 32000, costs: [11000, 15500, 5000, 28000, 11000, 10000, 5500, 9000, 4500] },
};

export const cropNames = Object.keys(cropProfiles);

export const getCurrency = (value) => `₹${Math.round(Number.isFinite(value) ? value : 0).toLocaleString("en-IN")}`;