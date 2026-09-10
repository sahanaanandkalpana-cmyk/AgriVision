import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/ProfitEstimation.css";
import { costFields, cropNames, cropProfiles, defaultProfitInputs, getCurrency } from "../data/profitEstimationData";

const STORAGE_KEY = "agrivision-profit-inputs";
const numberValue = (value) => Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0);

function calculate(inputs, profile = cropProfiles[inputs.crop]) {
  const areaMultiplier = inputs.unit === "hectare" ? 2.471 : 1;
  const area = numberValue(inputs.area) * areaMultiplier;
  const yieldPerArea = numberValue(inputs.yieldPerArea);
  const production = area * yieldPerArea;
  const revenue = production * numberValue(inputs.price);
  const costs = Object.fromEntries(costFields.map(([key]) => [key, numberValue(inputs[key]) * area]));
  const totalCost = Object.values(costs).reduce((total, cost) => total + cost, 0);
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const breakEvenPrice = production > 0 ? totalCost / production : 0;
  const costPerArea = area > 0 ? totalCost / area : 0;
  const costPerUnit = production > 0 ? totalCost / production : 0;
  const score = Math.round(Math.max(0, Math.min(100, margin * 1.3 + (revenue > 0 ? 15 : 0) - (breakEvenPrice > numberValue(inputs.price) ? 15 : 0))));
  return { area, yieldPerArea, production, revenue, costs, totalCost, profit, margin, breakEvenPrice, costPerArea, costPerUnit, score, profile };
}

function AppBar({ value, max, tone = "green" }) {
  return <div className="profit-bar"><i className={tone} style={{ width: `${max > 0 ? Math.min(100, Math.max(0, value / max * 100)) : 0}%` }} /></div>;
}

function ProfitEstimation() {
  const [inputs, setInputs] = useState(() => {
    try { return { ...defaultProfitInputs, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { return defaultProfitInputs; }
  });
  const [scenario, setScenario] = useState({ price: 10, yield: 10, fertilizer: 0, labour: 0, area: 0 });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); }, [inputs]);

  const profile = cropProfiles[inputs.crop] || cropProfiles.Rice;
  const result = useMemo(() => calculate(inputs, profile), [inputs, profile]);
  const scenarioInputs = useMemo(() => ({ ...inputs, price: numberValue(inputs.price) * (1 + scenario.price / 100), yieldPerArea: numberValue(inputs.yieldPerArea) * (1 + scenario.yield / 100), area: numberValue(inputs.area) * (1 + scenario.area / 100), fertilizer: numberValue(inputs.fertilizer) * (1 + scenario.fertilizer / 100), labour: numberValue(inputs.labour) * (1 + scenario.labour / 100) }), [inputs, scenario]);
  const scenarioResult = useMemo(() => calculate(scenarioInputs), [scenarioInputs]);
  const comparison = useMemo(() => cropNames.map((crop) => {
    const cropProfile = cropProfiles[crop];
    const cropInputs = { ...inputs, crop, price: cropProfile.price, yieldPerArea: cropProfile.yieldPerArea, ...Object.fromEntries(costFields.map(([key], index) => [key, cropProfile.costs[index].toString()])) };
    return { crop, ...calculate(cropInputs, cropProfile) };
  }), [inputs]);
  const bestComparisonProfit = Math.max(...comparison.map((item) => item.profit));
  const maxVisual = Math.max(result.revenue, result.totalCost, Math.max(0, result.profit), 1);
  const largestCost = costFields.reduce((largest, [key, label, icon]) => result.costs[key] > largest.value ? { key, label, icon, value: result.costs[key] } : largest, { value: 0 });
  const priceCoversCosts = result.production > 0 && numberValue(inputs.price) >= result.breakEvenPrice;
  const scoreLabel = result.score >= 75 ? "Highly Profitable" : result.score >= 45 ? "Moderately Profitable" : "Low Profitability";
  const scoreTone = result.score >= 75 ? "good" : result.score >= 45 ? "warn" : "bad";
  const forecast = [
    ["Conservative", calculate({ ...inputs, price: numberValue(inputs.price) * .9, yieldPerArea: numberValue(inputs.yieldPerArea) * .9 }).profit, "-10% price and yield"],
    ["Expected", result.profit, "Current inputs"],
    ["Optimistic", calculate({ ...inputs, price: numberValue(inputs.price) * 1.1, yieldPerArea: numberValue(inputs.yieldPerArea) * 1.1 }).profit, "+10% price and yield"],
  ];
  const insights = [
    `${largestCost.label || "No cost category"} is your largest cost component at ${getCurrency(largestCost.value)}.`,
    result.margin > 25 ? "Your current margin provides a healthy buffer against price changes." : "A 10% increase in market price could significantly improve profitability.",
    numberValue(inputs.price) < result.breakEvenPrice ? "Current price is below estimated break-even price." : "Current selling price is above estimated break-even price.",
    "Reducing fertilizer costs by 5% could increase estimated profit.",
  ];

  const updateInput = (event) => { setInputs((current) => ({ ...current, [event.target.name]: event.target.value })); setLastUpdated(new Date()); };
  const updateScenario = (event) => setScenario((current) => ({ ...current, [event.target.name]: Number(event.target.value) }));
  const loadCropDefaults = (event) => { const crop = event.target.value; const cropProfile = cropProfiles[crop]; setInputs((current) => ({ ...current, crop, price: cropProfile.price.toString(), yieldPerArea: cropProfile.yieldPerAcre.toString(), ...Object.fromEntries(costFields.map(([key], index) => [key, cropProfile.costs[index].toString()])) })); setLastUpdated(new Date()); };
  const reset = () => { setInputs(defaultProfitInputs); setScenario({ price: 10, yield: 10, fertilizer: 0, labour: 0, area: 0 }); setLastUpdated(new Date()); };

  return <>
    <Navbar />
    <main className="profit-page">
      <header className="profit-header"><div><span className="profit-eyebrow">FARM ECONOMICS / DEMO INTELLIGENCE</span><h1>📈 Profit Estimation</h1><p>Understand what you spend, what you can earn, and how resilient your crop plan is.</p></div><span className="demo-pill">PROTOTYPE MODE</span></header>
      <section className="kpi-grid">
        {[['💰 Expected Revenue', result.revenue, 'Based on expected production'], ['💸 Total Cost', result.totalCost, 'All entered expenses'], ['📈 Estimated Profit', result.profit, 'Revenue minus total cost'], ['📊 Profit Margin', result.margin, 'Estimated profit / revenue']].map(([label, value, detail]) => <article className="profit-kpi" key={label}><span>{label}</span><strong>{label.includes('Margin') ? `${value.toFixed(1)}%` : getCurrency(value)}</strong><small>{detail}</small></article>)}
      </section>

      <section className="profit-layout">
        <article className="profit-card input-card"><div className="section-heading"><div><span className="section-kicker">FARM & CROP INPUTS</span><h2>Build a farm scenario</h2></div><button className="text-button" type="button" onClick={reset}>Reset</button></div><div className="input-grid"><label>Crop<select name="crop" value={inputs.crop} onChange={loadCropDefaults}>{cropNames.map((crop) => <option key={crop}>{crop}</option>)}</select></label><label>Farm area<input name="area" type="number" min="0" step="0.1" value={inputs.area} onChange={updateInput} /></label><label>Area unit<select name="unit" value={inputs.unit} onChange={updateInput}><option value="acre">Acre</option><option value="hectare">Hectare</option></select></label><label>Expected yield / {inputs.unit}<input name="yieldPerArea" type="number" min="0" value={inputs.yieldPerArea} onChange={updateInput} /></label><label>Market price / kg<input name="price" type="number" min="0" step="0.1" value={inputs.price} onChange={updateInput} /></label><label>Farming duration<select name="duration" value={inputs.duration} onChange={updateInput}><option>Kharif · 120 days</option><option>Rabi · 110 days</option><option>Zaid · 90 days</option></select></label></div><div className="price-row"><div><strong>Market Price</strong><span>{getCurrency(numberValue(inputs.price))} / kg</span></div><div><strong>Last Updated</strong><span>{lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div><button type="button" onClick={() => setLastUpdated(new Date())}>↻ Refresh Price</button></div></article>
        <article className="profit-card production-card"><span className="section-kicker">PRODUCTION SNAPSHOT</span><h2>{profile.icon} {inputs.crop} on your farm</h2><div className="production-number"><strong>{result.production.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong><span>kg expected production</span></div><div className="production-meta"><span>Cost / {inputs.unit}<b>{getCurrency(result.costPerArea)}</b></span><span>Cost / kg<b>{getCurrency(result.costPerUnit)}</b></span></div><p>Every value updates instantly when you change an input.</p></article>
      </section>

      <section className="profit-card costs-section"><div className="section-heading"><div><span className="section-kicker">DETAILED COST BREAKDOWN</span><h2>Where your money goes</h2></div><strong className="section-total">{getCurrency(result.totalCost)}</strong></div><div className="cost-grid">{costFields.map(([key, label, icon]) => <label className="cost-input" key={key}><span>{icon} {label} / acre</span><div><span>₹</span><input name={key} type="number" min="0" value={inputs[key]} onChange={updateInput} /></div></label>)}</div><div className="cost-bars">{costFields.map(([key, label, icon]) => <div className="cost-bar-row" key={key}><span>{icon} {label}</span><strong>{result.totalCost ? `${(result.costs[key] / result.totalCost * 100).toFixed(1)}%` : '0%'}</strong><AppBar value={result.costs[key]} max={result.totalCost} /></div>)}</div></section>

      <section className="analytics-grid"><article className="profit-card chart-card"><div className="section-heading"><div><span className="section-kicker">REVENUE VS COST</span><h2>Financial outlook</h2></div><span className={`score-tag ${scoreTone}`}>{scoreLabel}</span></div><div className="finance-bars"><div><span>Expected revenue</span><strong>{getCurrency(result.revenue)}</strong><AppBar value={result.revenue} max={maxVisual} tone="revenue" /></div><div><span>Total cost</span><strong>{getCurrency(result.totalCost)}</strong><AppBar value={result.totalCost} max={maxVisual} tone="cost" /></div><div><span>Estimated profit</span><strong>{getCurrency(Math.max(0, result.profit))}</strong><AppBar value={Math.max(0, result.profit)} max={maxVisual} tone="profit" /></div></div><p className="formula-note">Revenue = production × market price · Profit = revenue − total cost</p></article><article className="profit-card score-card"><span className="section-kicker">PROFITABILITY SCORE</span><div className="score-number"><strong>{result.score}</strong><span>/100</span></div><h2>{scoreLabel}</h2><p>Based on your margin, production cost, expected revenue, and break-even price. This is a suitability indicator, not an AI confidence score.</p></article></section>

      <section className="profit-card break-even-section"><div className="section-heading"><div><span className="section-kicker">BREAK-EVEN ANALYSIS</span><h2>Know your minimum viable price</h2></div><span className={priceCoversCosts ? 'break-even-good' : 'break-even-warning'}>{priceCoversCosts ? '✅ Above break-even' : '⚠️ Below break-even / incomplete'}</span></div><div className="break-even-grid"><div><span>Break-even price</span><strong>{getCurrency(result.breakEvenPrice)}<small>/ kg</small></strong></div><div><span>Break-even production</span><strong>{result.production.toLocaleString('en-IN', { maximumFractionDigits: 0 })}<small> kg</small></strong></div><p>{priceCoversCosts ? 'At this price, your expected revenue covers the estimated farming cost.' : 'Enter a positive area, yield, and market price to evaluate break-even safely.'}</p></div></section>

      <section className="analytics-grid"><article className="profit-card scenario-card"><div className="section-heading"><div><span className="section-kicker">WHAT-IF ANALYSIS</span><h2>Test a different scenario</h2></div><span className="engine-note">Current vs what-if</span></div><div className="scenario-inputs"><label>Market price change (%)<input name="price" type="number" value={scenario.price} onChange={updateScenario} /></label><label>Yield change (%)<input name="yield" type="number" value={scenario.yield} onChange={updateScenario} /></label><label>Fertilizer cost change (%)<input name="fertilizer" type="number" value={scenario.fertilizer} onChange={updateScenario} /></label><label>Labour cost change (%)<input name="labour" type="number" value={scenario.labour} onChange={updateScenario} /></label><label>Farm area change (%)<input name="area" type="number" value={scenario.area} onChange={updateScenario} /></label></div><div className="scenario-compare"><div><span>Current scenario</span><strong>{getCurrency(result.profit)}</strong><small>Profit · {getCurrency(result.revenue)} revenue</small></div><div><span>What-if scenario</span><strong>{getCurrency(scenarioResult.profit)}</strong><small>Profit · {getCurrency(scenarioResult.revenue)} revenue</small></div><b className={scenarioResult.profit >= result.profit ? 'positive-change' : 'negative-change'}>{scenarioResult.profit >= result.profit ? '+' : ''}{getCurrency(scenarioResult.profit - result.profit)} profit change</b></div></article><article className="profit-card sensitivity-card"><span className="section-kicker">PRICE / YIELD SENSITIVITY</span><h2>Profit at a glance</h2>{[-10, 0, 10].map((change) => { const sensitivity = calculate({ ...inputs, price: numberValue(inputs.price) * (1 + change / 100), yieldPerArea: numberValue(inputs.yieldPerArea) * (1 + change / 100) }); return <div className="sensitivity-row" key={change}><span>{change === 0 ? 'Current' : `${change > 0 ? '+' : ''}${change}% price & yield`}</span><strong>{getCurrency(sensitivity.profit)}</strong></div>; })}</article></section>

      <section className="profit-card comparison-section"><div className="section-heading"><div><span className="section-kicker">CROP PROFIT COMPARISON</span><h2>Which crop earns best on the same area?</h2></div><span className="engine-note">Same {inputs.area} {inputs.unit}{inputs.area === '1' ? '' : 's'}</span></div><div className="comparison-table"><div className="comparison-head"><span>Crop</span><span>Revenue</span><span>Cost</span><span>Profit</span><span>Margin</span></div>{comparison.map((item) => <div className={`comparison-row ${item.profit === bestComparisonProfit ? 'best-crop' : ''}`} key={item.crop}><strong>{item.profile.icon} {item.crop}{item.profit === bestComparisonProfit && <em>Best</em>}</strong><span>{getCurrency(item.revenue)}</span><span>{getCurrency(item.totalCost)}</span><span>{getCurrency(item.profit)}</span><span>{item.margin.toFixed(1)}%</span></div>)}</div></section>

      <section className="analytics-grid"><article className="profit-card forecast-card"><div className="section-heading"><div><span className="section-kicker">PROFIT FORECAST</span><h2>Possible outcomes</h2></div><span className="engine-note">Estimates, not guarantees</span></div>{forecast.map(([label, value, assumption]) => <div className="forecast-row" key={label}><div><strong>{label}</strong><small>{assumption}</small></div><strong>{getCurrency(value)}</strong></div>)}</article><article className="profit-card insights-card"><span className="section-kicker">AGRIVISION INSIGHTS</span><h2>Signals to consider</h2><ul>{insights.map((insight) => <li key={insight}>💡 {insight}</li>)}</ul></article></section>
      <p className="profit-footer">Prototype mode · Market prices are configurable demo values. Connect a verified agricultural market service later through the isolated crop profile configuration.</p>
    </main>
  </>;
}

export default ProfitEstimation;
