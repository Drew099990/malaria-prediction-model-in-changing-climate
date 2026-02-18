"use client"

import React, { useState } from "react";

export default function ForcastPage() {

  const [temperature, setTemperature] = useState<number | "">("");
  const [minTemp, setMinTemp] = useState<number | "">("");
  const [maxTemp, setMaxTemp] = useState<number | "">("");
  const [humidity, setHumidity] = useState<number | "">("");
  const [rainyDays, setRainyDays] = useState<number | "">("");
  const [previousCases, setPreviousCases] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<{
    probability: number;
    risk_level: string;
    recommendation: string;
    model_confidence: string;
    predicted_cases?: number;
  } | null>(null);
  const [error, setError] = useState<string>("");


  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();

    setIsLoading(true);
    setError("");
    setPrediction(null);

    try {
      const payload = {
        min_temp: minTemp === "" ? null : minTemp,
        temperature: temperature === "" ? null : temperature,
        max_temp: maxTemp === "" ? null : maxTemp,
        humidity: humidity === "" ? null : humidity,
        rainy_days: rainyDays === "" ? null : rainyDays,
        previous_cases: previousCases === "" ? null : previousCases,
      };

      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction from AI model");
      }

      const data = await response.json();
      setPrediction(data);
      console.log("Prediction result:", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // reset form inputs
  function reset() {
    setTemperature("");
    setHumidity("");
    setRainyDays("");
    setPreviousCases("");
    setPrediction(null);
    setError("");
  }

  
  return (
    <main className="min-h-screen py-28 px-6 md:px-20 lg:px-36 bg-[linear-gradient(0deg,#ffffff,rgba(236,246,255,0.6))]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600">Climate data for Malaria Forecast</h1>
          <p className="mt-2 text-black/70 animate-cfade">Enter local climate and environmental data to get a heuristic outbreak probability .</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="bg-white/95 ring-1 animate-movel ring-blue-200/40 p-6 rounded-2xl shadow-sm">
            <h2 className="font-bold text-blue-700 mb-3">Input climate & environmental data</h2>

            <label className="block mb-3">
              <div className="text-sm text-black/80">Average Temperature (°C)</div>
              <input
                type="number"
                className="mt-1 w-full p-2 rounded border"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </label>

            <div className="flex gap-3">
              <label className="block mb-3 w-1/2">
                <div className="text-sm text-black/80">Min Temperature (°C)</div>
                <input
                  type="number"
                  className="mt-1 w-full p-2 rounded border"
                  value={minTemp}
                  onChange={(e) => setMinTemp(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>

              <label className="block mb-3 w-1/2">
                <div className="text-sm text-black/80">Max Temperature (°C)</div>
                <input
                  type="number"
                  className="mt-1 w-full p-2 rounded border"
                  value={maxTemp}
                  onChange={(e) => setMaxTemp(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </label>
            </div>

            <label className="block mb-3">
              <div className="text-sm text-black/80">Number of Rainy Days</div>
              <input
                type="number"
                className="mt-1 w-full p-2 rounded border"
                value={rainyDays}
                onChange={(e) => setRainyDays(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </label>

            <label className="block mb-3">
              <div className="text-sm text-black/80">Relative Humidity (%)</div>
              <input
                type="number"
                className="mt-1 w-full p-2 rounded border"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </label>

            <label className="block mb-3">
              <div className="text-sm text-black/80">Previous Month's Cases</div>
              <input
                type="number"
                className="mt-1 w-full p-2 rounded border"
                value={previousCases}
                onChange={(e) => setPreviousCases(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </label>


            <div className="flex gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => submit(e)}
                disabled={isLoading}
              >
                {isLoading ? "Computing..." : "Compute Probability"}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-50 border hover:bg-blue-100"
                onClick={reset}
                type="button"
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
          </section>

          <aside className="bg-white/95 ring-1 animate-mover ring-blue-200/40 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-blue-700">AI Prediction Result</h3>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                Error: {error}
              </div>
            )}

            {isLoading && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Processing with AI model...
                </div>
              </div>
            )}

            {!isLoading && !error && !prediction && (
              <div className="mt-4">
                <div className="text-sm text-black/70">Estimated outbreak likelihood</div>
                <div className="mt-2 text-3xl font-extrabold text-blue-600">—</div>
                <div className="mt-2 text-black/80 text-sm">Enter climate data and click "Compute Probability" to get AI-powered prediction.</div>
              </div>
            )}

            {!isLoading && prediction && (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-sm text-black/70">Estimated Outbreak Probability</div>
                  <div className="mt-2 text-5xl font-extrabold text-blue-600">
                    {prediction.probability.toFixed(1)}%
                  </div>
                  {typeof prediction.predicted_cases === 'number' && (
                    <div className="mt-2 text-sm text-black/70">Estimated cases: <span className="font-bold text-black/90">{prediction.predicted_cases}</span> patients</div>
                  )}
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-black/80">Risk Level:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        prediction.risk_level === "Low"
                          ? "bg-green-100 text-green-800"
                          : prediction.risk_level === "Moderate"
                          ? "bg-yellow-100 text-yellow-800"
                          : prediction.risk_level === "High"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {prediction.risk_level}
                    </span>
                  </div>
                  
                  <div className="text-xs text-black/60">
                    Model Confidence: {prediction.model_confidence}
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <h4 className="font-semibold text-black/90 mb-2">Public Health Recommendation</h4>
                  <p className="text-sm text-black/80 leading-relaxed">
                    {prediction.recommendation}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !prediction && (
              <div className="mt-6">
                <h4 className="font-semibold text-black/90 mb-3">Risk Level Interpretation</h4>
                <ul className="space-y-2 text-sm text-black/80">
                  <li className="flex gap-2">
                    <span className="text-green-600 font-bold">0-20%:</span>
                    <span>Low risk — maintain prevention measures.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-yellow-600 font-bold">21-50%:</span>
                    <span>Moderate risk — increase surveillance and vector control.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-orange-600 font-bold">51-80%:</span>
                    <span>High risk — prioritize testing, treatment availability and community measures.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-600 font-bold">81-100%:</span>
                    <span>Very high risk — urgent public health response recommended.</span>
                  </li>
                </ul>
              </div>
            )}
          </aside>
        </div>

      </div>
    </main>
  );
}