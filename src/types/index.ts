// Modelo de datos de ChambaPunche.
// Cada tipo refleja una decision de producto del PRD, no solo una estructura tecnica.

export type TipoNegocio =
  | "comida"
  | "ropa"
  | "abarrotes"
  | "servicios"
  | "otro";

export interface Usuario {
  id: string; // uid de Firebase Auth (telefono)
  telefono: string;
  nombre?: string;
  tipoNegocio: TipoNegocio;
  nombreNegocio?: string;
  creadoEn: number; // timestamp
}

// Una "Venta" es siempre dinero que entra. El monto nunca se trunca:
// se guarda exacto, en soles, con decimales si los hay.
export interface Venta {
  id: string;
  usuarioId: string;
  monto: number;
  descripcion: string; // ej. "3 panes"
  costoEstimado?: number; // usado para calcular ganancia, opcional
  origen: "voz" | "manual";
  creadoEn: number;
  sincronizado: boolean; // false mientras esta solo en cache local offline
}

// Un "Gasto" siempre debe declarar si es personal o del negocio.
// Esta etiqueta es obligatoria: es el corazon del problema que resolvemos.
export interface Gasto {
  id: string;
  usuarioId: string;
  monto: number;
  descripcion: string;
  categoria: "personal" | "negocio";
  origen: "voz" | "manual";
  creadoEn: number;
  sincronizado: boolean;
}

// Resultado calculado, nunca almacenado directamente: siempre se deriva
// de Ventas y Gastos de categoria "negocio" para un rango de fechas.
export interface ResumenGanancia {
  totalVentas: number;
  totalGastosNegocio: number;
  ganancia: number;
  rango: "dia" | "semana";
}
