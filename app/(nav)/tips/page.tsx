"use client"

import React, { useState } from "react";

const TipCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="bg-white/90 ring-1 ring-blue-200/40 rounded-2xl p-6 shadow-sm">
    <h2 className="text-xl font-extrabold text-blue-700 mb-3">{title}</h2>
    <div className="text-black/80 leading-7">{children}</div>
  </section>
);

export default function Tips() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen py-28 px-6 md:px-20 lg:px-36 bg-[linear-gradient(0deg,#ffffff,rgba(236,246,255,0.6))]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold animate-none text-blue-600">Malaria: Tips & Prevention</h1>
          <p className="mt-2 text-lg text-black/70 animate-fade">Practical advice to reduce risk, recognise symptoms and seek care early.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-8 animate-f2">
          <TipCard title="What is Malaria?">
            Malaria is a life-threatening disease caused by parasites transmitted to people through the bites of infected female Anopheles mosquitoes.
            It causes fever, chills and flu-like illness and, if not treated promptly, can lead to severe complications and death.
          </TipCard>

          <TipCard title="How it Spreads">
            The disease is spread when an infected mosquito bites a human. It is not spread directly from person to person in everyday contact.
          </TipCard>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8 animate-f3">
          <TipCard title="Prevention">
            <ul className="list-disc pl-5">
              <li>Sleep under insecticide-treated nets (ITNs) every night.</li>
              <li>Use indoor residual spraying (IRS) where available.</li>
              <li>Wear long sleeves and trousers at dusk and dawn when mosquitoes are most active.</li>
              <li>Apply EPA-approved insect repellents to exposed skin.</li>
              <li>Remove standing water around homes to reduce mosquito breeding sites.</li>
            </ul>
          </TipCard>

          <TipCard title="Recognising Symptoms">
            Symptoms usually appear 7–30 days after the bite and include fever, headache, chills, sweats, muscle aches, nausea and vomiting. Young children and pregnant people may deteriorate quickly.
          </TipCard>

          <TipCard title="What To Do If You Are Sick">
            If you suspect malaria: seek medical care immediately, inform the clinician about recent travel, and avoid self-medicating with incomplete courses of antimalarials.
          </TipCard>
        </div>

        <section className="mb-8 bg-white/90 ring-1 ring-blue-200/40 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-4">Treatment & When to Seek Care</h2>
          <p className="text-black/80 leading-7">
            Malaria is treatable with antimalarial medicines. Prompt diagnosis and correct treatment within 24 hours of fever onset greatly reduces the risk of severe disease and death.
          </p>
          <ul className="list-disc pl-5 mt-3 text-black/80">
            <li>Go to the nearest health facility if you have fever after visiting a malaria area.</li>
            <li>Pregnant people, infants, and those with weakened immunity should seek care urgently.</li>
            <li>Complete the full prescribed medication course even if you feel better.</li>
          </ul>
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-2">
          <div className="bg-white/90 ring-1 ring-blue-200/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Mosquito Control at Home</h3>
            <ol className="list-decimal pl-5 text-black/80">
              <li>Empty, clean or cover containers that can hold water (buckets, tires, flower pots).</li>
              <li>Ensure gutters drain properly and don’t hold water.</li>
              <li>Use window and door screens where possible.</li>
              <li>Consider community vector control programmes and report large breeding sites to local authorities.</li>
            </ol>
          </div>

          <div className="bg-white/90 ring-1 ring-blue-200/40 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Protecting High-risk Groups</h3>
            <p className="text-black/80">Children under five, pregnant people and immunocompromised individuals are at higher risk. Prioritise bed-net use and rapid access to diagnosis and treatment for them.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-4">Resources</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <a className="p-4 rounded-lg bg-white/90 ring-1 ring-blue-200/40 shadow-sm hover:scale-105 transition" href="https://www.who.int/health-topics/malaria" target="_blank" rel="noreferrer">WHO: Malaria</a>
            <a className="p-4 rounded-lg bg-white/90 ring-1 ring-blue-200/40 shadow-sm hover:scale-105 transition" href="https://www.cdc.gov/malaria/" target="_blank" rel="noreferrer">CDC: Malaria</a>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-extrabold text-blue-700 mb-4">FAQ</h2>
          <div className="space-y-3">
            {[
              {
                q: "Can malaria be prevented completely?",
                a: "No single measure eliminates the risk, but using several prevention methods together (nets, repellents, environmental control, and prophylaxis when recommended) greatly reduces it.",
              },
              {
                q: "How long after treatment am I safe?",
                a: "Follow-up depends on the parasite species and treatment given — complete the full course and follow your provider’s instructions.",
              },
              {
                q: "Is malaria seasonal?",
                a: "In many regions, malaria transmission rises during and after rainy seasons when mosquitoes breed more.",
              },
            ].map((item, i) => (
              <div key={i} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left p-4 bg-white/95 flex justify-between items-center"
                >
                  <span className="font-semibold text-black/85">{item.q}</span>
                  <span className="text-blue-600">{open === i ? "−" : "+"}</span>
                </button>
                {open === i && <div className="p-4 bg-white/90 text-black/80">{item.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}