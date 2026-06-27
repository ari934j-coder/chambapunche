import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Por ahora usamos un usuario de prueba fijo, hasta que el login este
// 100% activo en produccion (requiere plan Blaze de Firebase para SMS real).
export const USUARIO_PRUEBA_ID = "usuario-prueba-ariana";

export async function guardarVenta(datos: {
  monto: number;
  descripcion: string;
  costoEstimado?: number;
  origen: "voz" | "manual";
}) {
  return addDoc(collection(db, "ventas"), {
    usuarioId: USUARIO_PRUEBA_ID,
    monto: datos.monto,
    descripcion: datos.descripcion,
    costoEstimado: datos.costoEstimado ?? null,
    origen: datos.origen,
    creadoEn: serverTimestamp(),
  });
}

export async function guardarGasto(datos: {
  monto: number;
  descripcion: string;
  categoria: "personal" | "negocio";
  origen: "voz" | "manual";
}) {
  return addDoc(collection(db, "gastos"), {
    usuarioId: USUARIO_PRUEBA_ID,
    monto: datos.monto,
    descripcion: datos.descripcion,
    categoria: datos.categoria,
    origen: datos.origen,
    creadoEn: serverTimestamp(),
  });
}
