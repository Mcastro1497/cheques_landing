"use client";

import { useMemo, useState } from "react";
import { calcular } from "@/lib/calc";
import { formatARS, formatMilesInput, parseMilesInput } from "@/lib/format";
import { Field, PercentInput, ResultRow, Toggle, inputCls } from "./ui";
import { usePlazo } from "./usePlazo";

/** Comisión LB Finanzas fija. */
const COMISION_LB = 1.5;

export default function Calculator() {
  const { plazoDias, valido: plazoValido, field: plazoField } = usePlazo();
  const [montoStr, setMontoStr] = useState("10.000.000");
  const [tasa, setTasa] = useState("22");
  const [comSGR, setComSGR] = useState("1");
  const [exento, setExento] = useState(true);

  const montoNum = parseMilesInput(montoStr);
  const tasaNum = Number(tasa);
  const sgrNum = Number(comSGR);

  const errors = {
    monto: montoStr !== "" && montoNum <= 0,
    tasa: tasa !== "" && (!Number.isFinite(tasaNum) || tasaNum < 0),
    sgr: comSGR !== "" && (!Number.isFinite(sgrNum) || sgrNum < 0),
  };

  const inputsValidos =
    plazoValido &&
    montoNum > 0 &&
    Number.isFinite(tasaNum) && tasaNum >= 0 &&
    Number.isFinite(sgrNum) && sgrNum >= 0;

  const result = useMemo(() => {
    if (!inputsValidos) return null;
    return calcular({ plazoDias, monto: montoNum, tasaTNA: tasaNum, comisionLBTNA: COMISION_LB, comisionSGRTNA: sgrNum, exento });
  }, [inputsValidos, plazoDias, montoNum, tasaNum, sgrNum, exento]);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
      {/* Formulario */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Datos del Echeq</h2>

        <div className="space-y-5">
          <Field label="Monto del Echeq" error={errors.monto ? "El monto debe ser mayor a 0." : undefined}>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
              <input
                inputMode="numeric"
                value={montoStr}
                onChange={(e) => setMontoStr(formatMilesInput(e.target.value))}
                className={inputCls(errors.monto) + " pl-7"}
                placeholder="10.000.000"
              />
            </div>
          </Field>

          {plazoField}

          <Field label="Tasa descontada (TNA)" error={errors.tasa ? "Inválida." : undefined}>
            <PercentInput value={tasa} onChange={setTasa} error={errors.tasa} placeholder="22" />
          </Field>

          <Field label="Comisión LB Finanzas (TNA)">
            <div className="relative">
              <div className={inputCls(false) + " pr-6 bg-slate-50 text-slate-700"}>
                {COMISION_LB}
              </div>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">%</span>
            </div>
          </Field>

          <Field label="Comisión SGR (TNA)" error={errors.sgr ? "Inválida." : undefined}>
            <PercentInput value={comSGR} onChange={setComSGR} error={errors.sgr} placeholder="1" />
          </Field>

          <Field label="Comprador exento de IVA">
            <Toggle value={exento} onChange={setExento} />
          </Field>
        </div>
      </section>

      {/* Resultados */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Resultado</h2>

        {result ? (
          <div className="space-y-3">
            <ResultRow label="Monto descontado" value={formatARS(result.montoDescontado)} />
            <ResultRow label="Interés" value={formatARS(result.interes)} />
            <ResultRow label="Comisión LB Finanzas" value={formatARS(result.comisionLB)} />
            <ResultRow label="Comisión SGR" value={formatARS(result.comisionSGR)} />
            <ResultRow label="IVA (21% s/ comisión)" value={formatARS(result.ivaComision)} />
            {!exento && <ResultRow label="IVA (21% s/ interés)" value={formatARS(result.iva)} />}
            <ResultRow label="Retención IIBB" value={formatARS(result.iibb)} />
            <ResultRow label="Derechos de mercado" value={formatARS(result.ddmm)} />
            <ResultRow label="IVA (21% s/ derechos)" value={formatARS(result.ivaDdmm)} />

            <div className="mt-5 rounded-xl bg-violeta p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-lavanda">Monto neto que recibe el cliente</p>
              <p className="mt-1 whitespace-nowrap text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {formatARS(result.clienteRecibe)}
              </p>
              {result.cftTNA !== null && (
                <p className="mt-2 text-sm font-medium tabular-nums text-lavanda">
                  CFT (TNA): {(result.cftTNA * 100).toLocaleString("es-AR", { maximumFractionDigits: 2 })}%
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Completá los datos para ver el cálculo.</p>
        )}
      </section>
    </div>
  );
}
