"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { guardarGasto } from "@/lib/registros";

export default function RegistrarGasto() {
  const router = useRouter();
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<"personal" | "negocio">("negocio");
  const [confirmando, setConfirmando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const montoNumero = parseFloat(monto.replace(",", "."));
  const esValido = !isNaN(montoNumero) && montoNumero > 0 && descripcion.trim().length > 0;

  async function confirmar() {
    setGuardando(true);
    setError("");
    try {
      await guardarGasto({ monto: montoNumero, descripcion: descripcion.trim(), categoria, origen: "manual" });
      router.push("/");
    } catch {
      setError("No se pudo guardar ahora. Si no tienes internet, no te preocupes, lo intento de nuevo cuando vuelva la señal.");
      setGuardando(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--color-gasto)" }}>
        Registrar gasto
      </h1>
      <p className="mb-6" style={{ opacity: 0.7 }}>¿En qué gastaste y por cuánto?</p>

      {!confirmando ? (
        <>
          <label className="block text-sm font-medium mb-2">¿Cuánto gastaste?</label>
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

          <label className="block text-sm font-medium mb-2">¿En qué lo gastaste?</label>
          <input
            type="text"
            placeholder="Ej: Harina"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-xl px-3 py-3 mb-4 text-lg outline-none"
            style={{ border: "1px solid var(--color-borde)", backgroundColor: "var(--color-tarjeta)" }}
          />

          <label className="block text-sm font-medium mb-2">¿Es de tu negocio o personal?</label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setCategoria("negocio")}
              className="rounded-xl py-3 font-semibold"
              style={{
                backgroundColor: categoria === "negocio" ? "var(--color-marca)" : "var(--color-tarjeta)",
                color: categoria === "negocio" ? "white" : "var(--foreground)",
                border: "1px solid var(--color-borde)",
                minHeight: 48,
              }}
            >
              Del negocio
            </button>
            <button
              onClick={() => setCategoria("personal")}
              className="rounded-xl py-3 font-semibold"
              style={{
                backgroundColor: categoria === "personal" ? "var(--color-marca)" : "var(--color-tarjeta)",
                color: categoria === "personal" ? "white" : "var(--foreground)",
                border: "1px solid var(--color-borde)",
                minHeight: 48,
              }}
            >
              Personal
            </button>
          </div>

          <button
            onClick={() => setConfirmando(true)}
            disabled={!esValido}
            className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--color-gasto)", minHeight: 48 }}
          >
            Continuar
          </button>
        </>
      ) : (
        <>
          <div
            className="rounded-2xl p-5 mb-6 text-center"
            style={{ backgroundColor: "var(--color-gasto-bg)" }}
          >
            <p className="mb-2" style={{ opacity: 0.8 }}>Gastaste</p>
            <p className="text-lg font-medium mb-1">{descripcion}</p>
            <p className="text-3xl font-bold mb-2" style={{ color: "var(--color-gasto)" }}>
              S/ {montoNumero.toFixed(2)}
            </p>
            <p className="text-sm" style={{ opacity: 0.7 }}>
              {categoria === "negocio" ? "Del negocio" : "Personal"}
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
              style={{ backgroundColor: "var(--color-gasto)", minHeight: 48 }}
            >
              {guardando ? "Guardando..." : "Sí, guardar"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
