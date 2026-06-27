"use client";
import { useState } from "react";
import { useVozPunchi } from "@/lib/useVozPunchi";

export function TarjetaGanancia({
  totalVentas,
  totalGastos,
}: {
  totalVentas: number;
  totalGastos: number;
}) {
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const { reproducirVoz, reproduciendo } = useVozPunchi();
  const ganancia = totalVentas - totalGastos;

  const explicacion = `Esto se llama margen bruto: es lo que ganaste vendiendo, ${totalVentas.toFixed(
    2
  )} soles, menos lo que gastaste en tu negocio, ${totalGastos.toFixed(2)} soles. Es la plata que realmente es tuya hoy.`;

  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
    >
      <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>
        Hoy te quedó
      </p>
      <p className="text-4xl font-bold mt-1" style={{ color: "var(--color-ingreso)" }}>
        S/ {ganancia.toFixed(2)}
      </p>
      <button
        onClick={() => setMostrarExplicacion(!mostrarExplicacion)}
        className="text-sm underline mt-2"
        style={{ color: "var(--color-marca)" }}
      >
        después de tus costos (¿qué es esto?)
      </button>
      {mostrarExplicacion && (
        <>
          <p className="text-sm mt-2 p-3 rounded-lg" style={{ backgroundColor: "var(--color-marca-suave)" }}>
            {explicacion}
          </p>
          <button
            onClick={() => reproducirVoz(explicacion)}
            disabled={reproduciendo}
            className="mt-2 text-sm underline"
            style={{ color: "var(--color-marca)", minHeight: 44 }}
          >
            {reproduciendo ? "Hablando..." : "🔊 Escuchar"}
          </button>
        </>
      )}
    </div>
  );
}
