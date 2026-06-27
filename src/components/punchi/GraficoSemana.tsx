"use client";

interface DiaSemana {
  etiqueta: string;
  monto: number;
}

export function GraficoSemana({ dias }: { dias: DiaSemana[] }) {
  const montoMaximo = Math.max(...dias.map((d) => d.monto), 1);
  const total = dias.reduce((acc, d) => acc + d.monto, 0);
  const mejorDia = dias.reduce((mejor, d) => (d.monto > mejor.monto ? d : mejor), dias[0]);

  return (
    <div
      className="rounded-2xl p-5 mt-4 shadow-sm"
      style={{ backgroundColor: "var(--color-tarjeta)", border: "1px solid var(--color-borde)" }}
    >
      <p className="text-sm mb-1" style={{ opacity: 0.7 }}>Esta semana ganaste</p>
      <p className="text-2xl font-bold mb-4" style={{ color: "var(--color-ingreso)" }}>
        S/ {total.toFixed(0)}
      </p>

      <div className="flex items-end gap-2" style={{ height: 130 }}>
        {dias.map((dia) => {
          const alturaPorcentaje = Math.max((dia.monto / montoMaximo) * 100, 6);
          const esMejorDia = dia.etiqueta === mejorDia.etiqueta;
          return (
            <div key={dia.etiqueta} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
              <span className="text-xs font-semibold">{dia.monto.toFixed(0)}</span>
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${alturaPorcentaje}%`,
                  backgroundColor: esMejorDia ? "var(--color-ingreso)" : "var(--color-ingreso-bg)",
                }}
              />
              <span className="text-xs" style={{ opacity: 0.6 }}>{dia.etiqueta}</span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-center mt-3" style={{ opacity: 0.7 }}>
        Tu mejor día fue el {mejorDia.etiqueta}
      </p>
    </div>
  );
}
