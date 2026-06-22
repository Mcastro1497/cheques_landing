"use client";

import { useState } from "react";
import Calculator from "./Calculator";
import PagareCalculator from "./PagareCalculator";

type Inst = "echeq" | "pagare";

const INSTRUMENTOS: { label: string; value: Inst }[] = [
  { label: "eCheq", value: "echeq" },
  { label: "Pagaré", value: "pagare" },
];

export default function CalculatorTabs() {
  const [inst, setInst] = useState<Inst>("echeq");

  return (
    <div>
      {/* Instrumento */}
      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-lg bg-lavanda p-1">
        {INSTRUMENTOS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setInst(t.value)}
            className={[
              "rounded-md px-4 py-1.5 text-sm font-medium transition",
              inst === t.value ? "bg-white text-violeta shadow-sm" : "text-tinta/60 hover:text-tinta",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {inst === "echeq" && <Calculator />}
      {inst === "pagare" && <PagareCalculator />}
    </div>
  );
}
