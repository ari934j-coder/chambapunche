"use client";
import { useState } from "react";
import { BarraNavegacion } from "@/components/punchi/BarraNavegacion";

const CONCEPTOS = [
  {
    titulo: "Margen bruto",
    resumen: "Lo que de verdad te queda",
    explicacion:
      "Es lo que ganaste vendiendo, menos lo que gastaste para poder vender. Por ejemplo: si vendiste pan por S/20 y gastaste S/8 en harina y gas, tu margen bruto es S/12. Esa es la plata que realmente es tuya.",
  },
  {
    titulo: "Gasto personal vs. del negocio",
    resumen: "Por qué no hay que mezclarlos",
    explicacion:
      "Si usas la plata de tu negocio para gastos de tu casa sin anotarlo, después no sabes si tu negocio está ganando o perdiendo de verdad. Por eso cada gasto se anota como \"personal\" o \"del negocio\" — para que tu negocio se vea claro, separado de tu vida personal.",
  },
  {
    titulo: "Costo de fabricación",
    resumen: "Cuánto te cuesta hacer lo que vendes",
    explicacion:
      "Es todo lo que gastas para producir lo que vendes: ingredientes, materiales, gas, transporte. Saber esto te ayuda a poner un precio justo — uno que cubra tu costo y te deje ganancia.",
  },
  {
    titulo: "Flujo de caja",
    resumen: "La plata que entra y sale cada día",
    explicacion:
      "Es simplemente ver cuánta plata entró (tus ventas) y cuánta salió (tus gastos) en un día o una semana. Te ayuda a notar si en general estás ganando más de lo que gastas, o al revés.",
  },
];

export default function PantallaAprender() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto pb-24">
      <header className="mb-5">
        <h1 className="text-xl font-bold">Aprender</h1>
        <p style={{ opacity: 0.7 }}>Ideas cortas para entender mejor tu plata</p>
      </header>

      <div className="flex flex-col gap-2">
        {CONCEPTOS.map((c, i) => {
          const estaAbierto = abierto === i;
          return (
            <button
              key={c.titulo}
              onClick={() => setAbierto(estaAbierto ? null : i)}
              className="text-left rounded-xl p-4"
              style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{c.titulo}</p>
                  <p className="text-sm" style={{ opacity: 0.6 }}>{c.resumen}</p>
                </div>
                <span style={{ opacity: 0.5 }}>{estaAbierto ? "▲" : "▼"}</span>
              </div>
              {estaAbierto && (
                <p className="text-sm mt-3 p-3 rounded-lg" style={{ backgroundColor: "var(--color-marca-suave)" }}>
                  {c.explicacion}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <BarraNavegacion />
    </main>
  );
}
