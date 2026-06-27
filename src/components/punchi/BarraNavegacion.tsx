"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PESTANAS = [
  {
    href: "/",
    etiqueta: "Inicio",
    icono: (activo: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo ? "var(--color-marca)" : "currentColor"} strokeWidth="2">
        <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/aprender",
    etiqueta: "Aprender",
    icono: (activo: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo ? "var(--color-marca)" : "currentColor"} strokeWidth="2">
        <path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2V5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2V5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function BarraNavegacion() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-center gap-10 py-2 z-40"
      style={{ backgroundColor: "var(--color-tarjeta)", borderTop: "1px solid var(--color-borde)" }}
    >
      {PESTANAS.map((p) => {
        const activo = pathname === p.href;
        return (
          <Link
            key={p.href}
            href={p.href}
            className="flex flex-col items-center gap-0.5 py-1"
            style={{ minWidth: 64, minHeight: 48, color: activo ? "var(--color-marca)" : "var(--foreground)", opacity: activo ? 1 : 0.6 }}
          >
            {p.icono(activo)}
            <span className="text-xs font-medium">{p.etiqueta}</span>
          </Link>
        );
      })}
    </nav>
  );
}
