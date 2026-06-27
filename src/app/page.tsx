"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { USUARIO_PRUEBA_ID } from "@/lib/registros";
import { aFecha, esMismoDia, ultimosSieteDias } from "@/lib/calculos";
import { TarjetaGanancia } from "@/components/punchi/TarjetaGanancia";
import { GraficoSemana } from "@/components/punchi/GraficoSemana";
import { AsistenteVoz } from "@/components/punchi/AsistenteVoz";
import { BarraNavegacion } from "@/components/punchi/BarraNavegacion";
import { IconoPunchi } from "@/components/punchi/IconoPunchi";
import type { Venta, Gasto } from "@/types";

export default function PantallaPrincipal() {
  const [ventas, setVentas] = useState<(Venta & { id: string })[]>([]);
  const [gastos, setGastos] = useState<(Gasto & { id: string })[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const qVentas = query(collection(db, "ventas"), where("usuarioId", "==", USUARIO_PRUEBA_ID));
    const qGastos = query(collection(db, "gastos"), where("usuarioId", "==", USUARIO_PRUEBA_ID));

    const unsubVentas = onSnapshot(qVentas, (snap) => {
      setVentas(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Venta, "id">) })));
      setCargando(false);
    });
    const unsubGastos = onSnapshot(qGastos, (snap) => {
      setGastos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Gasto, "id">) })));
    });

    return () => {
      unsubVentas();
      unsubGastos();
    };
  }, []);

  const hoy = new Date();
  const ventasHoy = ventas.filter((v) => esMismoDia(aFecha(v.creadoEn as any), hoy));
  const gastosHoy = gastos.filter((g) => esMismoDia(aFecha(g.creadoEn as any), hoy));

  const totalVentasHoy = ventasHoy.reduce((acc, v) => acc + v.monto, 0);
  const totalGastosNegocioHoy = gastosHoy
    .filter((g) => g.categoria === "negocio")
    .reduce((acc, g) => acc + g.monto, 0);

  const semana = ultimosSieteDias().map(({ etiqueta, fecha }) => {
    const ventasDia = ventas.filter((v) => esMismoDia(aFecha(v.creadoEn as any), fecha));
    const gastosDia = gastos.filter(
      (g) => g.categoria === "negocio" && esMismoDia(aFecha(g.creadoEn as any), fecha)
    );
    const totalVentasDia = ventasDia.reduce((acc, v) => acc + v.monto, 0);
    const totalGastosDia = gastosDia.reduce((acc, g) => acc + g.monto, 0);
    return { etiqueta, monto: Math.max(totalVentasDia - totalGastosDia, 0) };
  });

  const movimientosHoy = [...ventasHoy, ...gastosHoy].sort(
    (a, b) => aFecha(b.creadoEn as any).getTime() - aFecha(a.creadoEn as any).getTime()
  );

  const hayAlgunaVez = ventas.length > 0 || gastos.length > 0;

  return (
    <main className="min-h-screen px-4 py-6 max-w-md mx-auto pb-24">
      <header className="mb-5 flex items-center gap-3">
        <IconoPunchi size={44} />
        <p className="text-lg" style={{ opacity: 0.7 }}>Hola, Ariana</p>
      </header>

      <TarjetaGanancia totalVentas={totalVentasHoy} totalGastos={totalGastosNegocioHoy} />

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
        <Link
          href="/registrar-gasto"
          className="rounded-2xl p-4 text-left shadow-sm"
          style={{ backgroundColor: "var(--color-gasto-bg)" }}
        >
          <span className="text-2xl">－</span>
          <p className="font-semibold mt-1" style={{ color: "var(--color-gasto)" }}>
            Registrar gasto
          </p>
        </Link>
      </div>

      {hayAlgunaVez && <GraficoSemana dias={semana} />}

      <section className="mt-6">
        <h2 className="text-base font-semibold mb-2" style={{ opacity: 0.8 }}>
          Hoy
        </h2>
        {cargando && <p style={{ opacity: 0.6 }}>Cargando...</p>}
        {!cargando && movimientosHoy.length === 0 && (
          <p style={{ opacity: 0.6 }}>Todavía no registraste nada hoy.</p>
        )}
        <div className="flex flex-col gap-2">
          {movimientosHoy.map((m) => {
            const esVenta = "origen" in m && !("categoria" in m);
            const fecha = aFecha(m.creadoEn as any);
            const hora = fecha.toLocaleTimeString("es-PE", { hour: "numeric", minute: "2-digit" });
            return (
              <div
                key={m.id}
                className="rounded-xl p-3 flex justify-between items-center"
                style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
              >
                <div>
                  <p className="font-medium">{m.descripcion}</p>
                  <p className="text-xs" style={{ opacity: 0.6 }}>
                    {hora}
                    {!esVenta && ` · ${(m as Gasto).categoria === "negocio" ? "Del negocio" : "Personal"}`}
                  </p>
                </div>
                <p
                  className="font-semibold"
                  style={{ color: esVenta ? "var(--color-ingreso)" : "var(--color-gasto)" }}
                >
                  {esVenta ? "+" : "-"}S/ {m.monto.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <AsistenteVoz />
      <BarraNavegacion />
    </main>
  );
}
