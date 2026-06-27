"use client";
import { useState } from "react";

export function TarjetaGanancia({
  totalVentas,
  totalGastos,
}: {
  totalVentas: number;
  totalGastos: number;
}) {
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const ganancia = totalVentas - totalGastos;

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
        <p className="text-sm mt-2 p-3 rounded-lg" style={{ backgroundColor: "var(--color-marca-suave)" }}>
          Esto se llama <strong>margen bruto</strong>: es lo que ganaste vendiendo
          (S/ {totalVentas.toFixed(2)}) menos lo que gastaste en tu negocio
          (S/ {totalGastos.toFixed(2)}). Es la plata que realmente es tuya hoy.
        </p>
      )}
    </div>
  );
}
