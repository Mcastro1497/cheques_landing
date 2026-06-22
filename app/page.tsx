import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violeta text-lg font-extrabold tracking-tight text-white">
          LB
        </div>
        <div>
          <p className="text-sm font-semibold text-violeta">LB Finanzas</p>
          <h1 className="text-2xl font-bold tracking-tight text-tinta sm:text-3xl">
            Descuento de Echeq
          </h1>
        </div>
      </header>

      <Calculator />
    </main>
  );
}
