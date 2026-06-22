// Descuento de eCheq / Pagaré — base 365, modo "por días".
// Comisión dividida en dos: LB Finanzas + SGR.

const IVA_ALICUOTA = 0.21;
const BASE_DIAS = 365;
const BASE_DDMM = 90; // los derechos de mercado se prorratean sobre 90 días
const IIBB_ALICUOTA = 0.005 / 100; // 0,005% sobre el monto nominal
const DDMM_ALICUOTA = 0.06 / 100; // 0,06% sobre el monto descontado

/** Comisión cobrada (descontada del nominal) para una TNA y plazo dados. */
function comisionCobrada(monto: number, tna: number, plazoDias: number): number {
  const prorr = (tna / 100) * (plazoDias / BASE_DIAS);
  return monto - monto / (1 + prorr);
}

export interface CalcInputs {
  plazoDias: number;
  monto: number;
  /** Tasa de descuento, TNA en %. */
  tasaTNA: number;
  /** Comisión LB Finanzas, TNA en %. */
  comisionLBTNA: number;
  /** Comisión SGR, TNA en %. */
  comisionSGRTNA: number;
  /** El comprador es exento de IVA. */
  exento: boolean;
}

export interface CalcResult {
  montoDescontado: number;
  interes: number;
  comisionLB: number;
  comisionSGR: number;
  comisionTotal: number;
  /** IVA (21%) sobre la comisión total. */
  ivaComision: number;
  /** IVA sobre el interés (0 si el comprador es exento). */
  iva: number;
  iibb: number;
  ddmm: number;
  ivaDdmm: number;
  ddmmConIva: number;
  clienteRecibe: number;
}

export function calcular({
  plazoDias,
  monto,
  tasaTNA,
  comisionLBTNA,
  comisionSGRTNA,
  exento,
}: CalcInputs): CalcResult {
  const tasaProrrateada = (tasaTNA / 100) * (plazoDias / BASE_DIAS);
  const montoDescontado = monto / (1 + tasaProrrateada);
  const interes = monto - montoDescontado;

  const comisionLB = comisionCobrada(monto, comisionLBTNA, plazoDias);
  const comisionSGR = comisionCobrada(monto, comisionSGRTNA, plazoDias);
  const comisionTotal = comisionLB + comisionSGR;
  const ivaComision = comisionTotal * IVA_ALICUOTA;

  const iva = exento ? 0 : IVA_ALICUOTA * interes;
  const iibb = monto * IIBB_ALICUOTA;
  const ddmm = montoDescontado * DDMM_ALICUOTA * (plazoDias / BASE_DDMM);
  const ivaDdmm = ddmm * IVA_ALICUOTA;
  const ddmmConIva = ddmm + ivaDdmm;

  const clienteRecibe =
    montoDescontado - comisionTotal - ivaComision - iibb - ddmmConIva - iva;

  return { montoDescontado, interes, comisionLB, comisionSGR, comisionTotal, ivaComision, iva, iibb, ddmm, ivaDdmm, ddmmConIva, clienteRecibe };
}

export interface PagareInputs {
  plazoDias: number;
  monto: number;
  tasaTNA: number;
  comisionLBTNA: number;
  comisionSGRTNA: number;
}

export interface PagareResult {
  montoDescontado: number;
  interes: number;
  comisionLB: number;
  comisionSGR: number;
  comisionTotal: number;
  ivaComision: number;
  iibb: number;
  ddmm: number;
  ivaDdmm: number;
  neto: number;
}

/** Pagaré: el interés NUNCA lleva IVA; la comisión SÍ; sin condición de exento. */
export function calcularPagare({
  plazoDias,
  monto,
  tasaTNA,
  comisionLBTNA,
  comisionSGRTNA,
}: PagareInputs): PagareResult {
  const tasaProrrateada = (tasaTNA / 100) * (plazoDias / BASE_DIAS);
  const montoDescontado = monto / (1 + tasaProrrateada);
  const interes = monto - montoDescontado;

  const comisionLB = comisionCobrada(monto, comisionLBTNA, plazoDias);
  const comisionSGR = comisionCobrada(monto, comisionSGRTNA, plazoDias);
  const comisionTotal = comisionLB + comisionSGR;
  const ivaComision = comisionTotal * IVA_ALICUOTA;

  const iibb = monto * IIBB_ALICUOTA;
  const ddmm = montoDescontado * DDMM_ALICUOTA * (plazoDias / BASE_DDMM);
  const ivaDdmm = ddmm * IVA_ALICUOTA;

  const neto = montoDescontado - comisionTotal - ivaComision - iibb - ddmm - ivaDdmm;

  return { montoDescontado, interes, comisionLB, comisionSGR, comisionTotal, ivaComision, iibb, ddmm, ivaDdmm, neto };
}
