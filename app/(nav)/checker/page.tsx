"use client"
import React, { useMemo, useState } from "react";

const SYMPTOMS: { id: string; label: string; critical?: boolean }[] = [
  { id: "fever", label: "Fever (high temperature)", critical: true },
  { id: "chills", label: "Chills or shivering", critical: true },
  { id: "sweats", label: "Night sweats", critical: false },
  { id: "headache", label: "Severe headache", critical: true },
  { id: "nausea", label: "Nausea or vomiting", critical: true },
  { id: "muscle", label: "Muscle aches", critical: false },
  { id: "fatigue", label: "Fatigue or weakness", critical: false },
  { id: "cough", label: "Cough or difficulty breathing", critical: false },
  { id: "diarrhoea", label: "Diarrhoea", critical: false },
];

export default function Checker() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  const selectedList = useMemo(() => SYMPTOMS.filter((s) => selected[s.id]), [selected]);

  const recommendation = useMemo(() => {
    if (selectedList.length === 0) return {
      level: "none",
      text: "No symptoms selected. If you have concerns, seek local medical advice.",
    };

    const hasCritical = selectedList.some((s) => s.critical);

     if (hasCritical) {
      return {
        level: "urgent",
        text: "High suspicion of malaria — seek medical attention or testing immediately.",
      };
    }

    if (selectedList.length >= 3) {
      return {
        level: "possible",
        text: "Several symptoms present — get tested as soon as possible and avoid self-medicating.",
      };
    }

    return {
      level: "watch",
      text: "Mild symptoms — monitor closely and seek testing if symptoms progress or persist.",
    };
  }, [selectedList]);

  return (
    <main className="min-h-screen py-28 px-6 md:px-20 lg:px-36 bg-[linear-gradient(0deg,#ffffff,rgba(236,246,255,0.6))]">
      <div className="max-w-5xl mx-auto ">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600">Symptom Checker</h1>
          <p className="mt-2 text-black/70 animate-cfade">Select any symptoms you currently have and get immediate guidance.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 ">
          <section className="md:col-span-2 animate-movel bg-white/95 ring-1 ring-blue-200/40 p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Common Malaria Symptoms</h2>
            <form className="space-y-3">
              {SYMPTOMS.map((s) => (
                <label key={s.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!selected[s.id]}
                    onChange={() => toggle(s.id)}
                    className="mt-1 h-4 w-4 accent-blue-600"
                    aria-label={s.label}
                  />
                  <div>
                    <div className="font-medium text-black/90">{s.label}</div>
                    {s.critical && <div className="text-xs text-red-600">(Critical symptom)</div>}
                  </div>
                </label>
              ))}
            </form>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelected({})}
                className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  // small UX: if none selected, select fever to encourage testing
                  if (Object.values(selected).every((v) => !v)) setSelected({ fever: true });
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Quick Test Example
              </button>
            </div>
          </section>

          <aside className="bg-white/95 animate-mover ring-1 ring-blue-200/40 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-blue-700">Assessment</h3>
            <div className="mt-3">
              <div className="text-sm text-black/70">Selected symptoms:</div>
              <ul className="mt-2 list-disc pl-5 text-black/85">
                {selectedList.length === 0 ? (
                  <li>None</li>
                ) : (
                  selectedList.map((s) => <li key={s.id}>{s.label}</li>)
                )}
              </ul>
            </div>

            <div className="mt-4 p-4 rounded-lg border-l-4 shadow-sm"
              style={{ borderColor: recommendation.level === "urgent" ? "#dc2626" : "#3b82f6" }}>
              <div className={`font-semibold ${recommendation.level === "urgent" ? "text-red-600" : "text-blue-700"}`}>
                {recommendation.level === "urgent" ? "Seek urgent care" : recommendation.level === "possible" ? "Get tested" : "Monitor"}
              </div>
              <div className="text-sm text-black/80 mt-2">{recommendation.text}</div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-black/85">If symptoms are severe</h4>
              <p className="text-sm text-black/70">Call emergency services immediately if you experience difficulty breathing, seizures, loss of consciousness, or severe bleeding.</p>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-black/85">Resources</h4>
              <ul className="text-sm list-disc pl-5 mt-2">
                <li><a className="text-blue-600 underline" href="https://www.who.int/health-topics/malaria" target="_blank" rel="noreferrer">WHO: Malaria</a></li>
                <li><a className="text-blue-600 underline" href="https://www.cdc.gov/malaria/index.html" target="_blank" rel="noreferrer">CDC: Malaria</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}