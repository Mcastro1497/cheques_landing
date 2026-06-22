"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Qué es una SGR?",
    a: "Una Sociedad de Garantía Recíproca es una entidad que respalda operaciones de pymes para facilitarles el acceso al financiamiento con mejores condiciones.",
  },
  {
    q: "¿Qué puedo hacer con esta solución?",
    a: "Podés solicitar un aval de SGR para respaldar operaciones comerciales o descontar echeqs para anticipar liquidez sobre cobros futuros.",
  },
  {
    q: "¿Para qué sirve un aval de SGR?",
    a: "Sirve para fortalecer la posición de tu empresa frente a bancos, proveedores o inversores, y así acceder a mejores tasas, plazos o condiciones.",
  },
  {
    q: "¿Qué es el descuento de echeqs?",
    a: "Es una forma de anticipar el cobro de echeqs con vencimiento futuro para recibir los fondos antes, usando el mercado de capitales como alternativa de financiamiento.",
  },
  {
    q: "¿Cuándo me conviene usar esta alternativa?",
    a: "Suele ser útil cuando necesitás liquidez para operar, querés mejorar condiciones frente a alternativas tradicionales o buscás anticipar cobros sin depender del circuito bancario habitual.",
  },
  {
    q: "¿Es un proceso digital?",
    a: "Sí. La propuesta está pensada para centralizar el inicio del proceso de manera digital y acompañarte sin trámites presenciales ni circuitos innecesarios.",
  },
  {
    q: "¿Cómo sigo si quiero avanzar?",
    a: "Podés hablar con un asesor para evaluar qué alternativa aplica a tu empresa y avanzar con el análisis de tu caso.",
  },
];

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-violeta" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {!open && (
        <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mt-12">
      <h2 className="mb-2 text-xl font-bold tracking-tight text-tinta sm:text-2xl">
        Preguntas frecuentes
      </h2>
      <div>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-slate-200">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-semibold text-tinta sm:text-lg">{f.q}</span>
                <ToggleIcon open={isOpen} />
              </button>
              {isOpen && (
                <p className="-mt-1 pb-5 pr-10 text-sm leading-relaxed text-slate-600">{f.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
