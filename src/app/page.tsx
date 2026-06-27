import Link from "next/link";
import { TarjetaGanancia } from "@/components/punchi/TarjetaGanancia";
import { GraficoSemana } from "@/components/punchi/GraficoSemana";
import { AsistenteVoz } from "@/components/punchi/AsistenteVoz";

// Datos de prueba mientras conectamos Firestore de verdad.
const ventasDePrueba = [
  { id: "1", descripcion: "3 panes", monto: 6, hora: "9:40 am" },
  { id: "2", descripcion: "1 gaseosa", monto: 3.5, hora: "11:10 am" },
];

const gastosDePrueba = [
  { id: "1", descripcion: "Harina", monto: 4, categoria: "negocio" as const, hora: "8:00 am" },
];

// Datos de prueba del resumen semanal, hasta que calculemos esto de verdad
// a partir del historial real guardado en Firestore.
const semanaDePrueba = [
  { etiqueta: "Lun", monto: 22 },
  { etiqueta: "Mar", monto: 18 },
  { etiqueta: "Mié", monto: 35 },
  { etiqueta: "Jue", monto: 15 },
  { etiqueta: "Vie", monto: 28 },
  { etiqueta: "Sáb", monto: 40 },
  { etiqueta: "Dom", monto: 29 },
];

export default function PantallaPrincipal() {
  const totalVentas = ventasDePrueba.reduce((acc, v) => acc + v.monto, 0);
  const totalGastos = gastosDePrueba
    .filter((g) => g.categoria === "negocio")
    .reduce((acc, g) => acc + g.monto, 0);

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <header className="mb-5">
        <p className="text-lg" style={{ opacity: 0.7 }}>Hola, Ariana</p>
      </header>

      <TarjetaGanancia totalVentas={totalVentas} totalGastos={totalGastos} />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Link
          href="/registrar-venta"
          className="rounded-2xl p-4 text-left shadow-sm"
          style={{ backgroundColor: "var(--color-ingreso-bg)" }}
        >
          <span className="text-2xl">＋</span>
          <p className="font-semibold mt-1" style={{ color: "var(--color-ingreso)" }}>
            Registrar venta
          </p>
        </Link>
        <button
          className="rounded-2xl p-4 text-left shadow-sm"
          style={{ backgroundColor: "var(--color-gasto-bg)" }}
        >
          <span className="text-2xl">－</span>
          <p className="font-semibold mt-1" style={{ color: "var(--color-gasto)" }}>
            Registrar gasto
          </p>
        </button>
      </div>

      <GraficoSemana dias={semanaDePrueba} />

      <section className="mt-6">
        <h2 className="text-base font-semibold mb-2" style={{ opacity: 0.8 }}>
          Hoy
        </h2>
        <div className="flex flex-col gap-2">
          {ventasDePrueba.map((v) => (
            <div
              key={v.id}
              className="rounded-xl p-3 flex justify-between items-center"
              style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
            >
              <div>
                <p className="font-medium">{v.descripcion}</p>
                <p className="text-xs" style={{ opacity: 0.6 }}>{v.hora}</p>
              </div>
              <p className="font-semibold" style={{ color: "var(--color-ingreso)" }}>
                +S/ {v.monto.toFixed(2)}
              </p>
            </div>
          ))}
          {gastosDePrueba.map((g) => (
            <div
              key={g.id}
              className="rounded-xl p-3 flex justify-between items-center"
              style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
            >
              <div>
                <p className="font-medium">{g.descripcion}</p>
                <p className="text-xs" style={{ opacity: 0.6 }}>
                  {g.hora} · {g.categoria === "negocio" ? "Del negocio" : "Personal"}
                </p>
              </div>
              <p className="font-semibold" style={{ color: "var(--color-gasto)" }}>
                -S/ {g.monto.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <AsistenteVoz />
    </main>
  );
}
