"use client";

import { useState } from "react";
import { Field, inputCls } from "./ui";

export type Modo = "dias";

/** Ingreso del plazo en días (la landing solo opera descuento por días). */
export function usePlazo(_mode?: Modo, _tNHabiles?: number) {
  const [dias, setDias] = useState("90");

  const plazoDias = Math.floor(Number(dias));
  const valido = plazoDias > 0;
  const error = dias !== "" && !valido;

  const field = (
    <Field label="Plazo (días)" error={error ? "Ingresá un plazo mayor a 0." : undefined}>
      <input
        inputMode="numeric"
        value={dias}
        onChange={(e) => setDias(e.target.value.replace(/\D/g, ""))}
        className={inputCls(error)}
        placeholder="90"
      />
    </Field>
  );

  return { plazoDias, valido, field };
}
