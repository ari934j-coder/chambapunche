"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { guardarVenta } from "@/lib/registros";

export default function RegistrarVenta() {
  const router = useRouter();
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const montoNumero = parseFloat(monto.replace(",", "."));
  const esValido = !isNaN(montoNumero) && montoNumero > 0 && descripcion.trim().length > 0;

  async function confirmar() {
    setGuardando(true);
    setError("");
    try {
      await guardarVenta({ monto: montoNumero, descripcion: descripcion.trim(), origen: "manual" });
      router.push("/");
    } catch {
      setError("No se pudo guardar ahora. Si no tienes internet, no te preocupes, lo intento de nuevo cuando vuelva la señal.");
      setGuardando(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--color-ingreso)" }}>
        Registrar venta
      </h1>
      <p className="mb-6" style={{ opacity: 0.7 }}>¿Qué vendiste y por cuánto?</p>

      {!confirmando ? (
        <>
          <label className="block text-sm font-medium mb-2">¿Cuánto vendiste?</label>
          <div
            className="flex items-center rounded-xl px-3 py-3 mb-4"
            style={{ border: "1px solid var(--color-borde)", backgroundColor: "var(--color-tarjeta)" }}
          >
            <span className="mr-2 text-lg" style={{ opacity: 0.7 }}>S/</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="flex-1 outline-none bg-transparent text-2xl font-semibold"
            />
          </div>

          <label className="block text-sm font-medium mb-2">¿Qué vendiste?</label>
          <input
            type="text"
            placeholder="Ej: 3 panes"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-xl px-3 py-3 mb-6 text-lg outline-none"
            style={{ border: "1px solid var(--color-borde)", backgroundColor: "var(--color-tarjeta)" }}
          />

          <button
            onClick={() => setConfirmando(true)}
            disabled={!esValido}
            className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--color-ingreso)", minHeight: 48 }}
          >
            Continuar
          </button>
        </>
      ) : (
        <>
          <div
            className="rounded-2xl p-5 mb-6 text-center"
            style={{ backgroundColor: "var(--color-ingreso-bg)" }}
          >
            <p className="mb-2" style={{ opacity: 0.8 }}>Vendiste</p>
            <p className="text-lg font-medium mb-1">{descripcion}</p>
            <p className="text-3xl font-bold" style={{ color: "var(--color-ingreso)" }}>
              S/ {montoNumero.toFixed(2)}
            </p>
          </div>
          <p className="text-center mb-4" style={{ opacity: 0.7 }}>¿Está bien así?</p>
          {error && <p className="text-sm mb-3 text-center" style={{ color: "var(--color-gasto)" }}>{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmando(false)}
              className="flex-1 rounded-xl py-3 font-semibold"
              style={{ border: "1px solid var(--color-borde)", minHeight: 48 }}
            >
              Corregir
            </button>
            <button
              onClick={confirmar}
              disabled={guardando}
              className="flex-1 rounded-xl py-3 font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "var(--color-ingreso)", minHeight: 48 }}
            >
              {guardando ? "Guardando..." : "Sí, guardar"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
